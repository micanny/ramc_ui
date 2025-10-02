#!/usr/bin/env python3
"""Transform legacy Purchase Order CSV into ERPNext Data Import format (parent + items).

Usage (from bench root or this folder):
    python imports/transform_purchase_orders.py \
        --input imports/final_purchase_orders.csv \
        --output imports/purchase_order_import.csv

Optional checks (if run inside bench env so frappe is importable):
    python imports/transform_purchase_orders.py --check-items

Strategy (Production Option A):
    - Preserve existing PO numbers as the primary key (name column)
    - Do NOT rely on naming_series
    - Repeat parent fields on every row (simpler for Data Import)
    - Map columns:
        ID -> name
        Supplier -> supplier
        Date -> transaction_date
        (derived) schedule_date (parent) -> earliest Required By among its items
        Company -> company
        Currency -> currency
        Exchange Rate -> conversion_rate
        PN (Items) -> items:item_code
        Quantity (Items) -> items:qty
        Rate (Company Currency) (Items) -> items:rate
        Required By (Items) -> items:schedule_date
        Description (Items) -> items:description
        UOM (Items) -> items:uom
        Stock UOM (Items) -> items:stock_uom
        UOM Conversion Factor (Items) -> items:conversion_factor

    - Dropped columns: Title, Series, Status, Amount, Condition, Due Date (Payment Schedule)

Output Header (order):
    name,supplier,transaction_date,schedule_date,company,currency,conversion_rate,items:idx,items:item_code,items:description,items:qty,items:rate,items:schedule_date,items:uom,items:stock_uom,items:conversion_factor

Notes:
    * Parent schedule_date is set to earliest items:schedule_date (consistent with required-by dates).
    * Numeric parsing kept simple; values are written as-is except trimming whitespace.
    * Ensure all Item Codes exist in the system before import (use --check-items to list missing).
"""

from __future__ import annotations

import argparse
import csv
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any


PARENT_FIELDS_ORDER = [
    "name",
    "supplier",
    "transaction_date",
    "schedule_date",  # derived earliest item date
    "company",
    "currency",
    "conversion_rate",
]

ITEM_FIELDS_ORDER = [
    "items:idx",
    "items:item_code",
    "items:description",
    "items:qty",
    "items:rate",
    "items:schedule_date",
    "items:uom",
    "items:stock_uom",
    "items:conversion_factor",
]

OUTPUT_HEADER = PARENT_FIELDS_ORDER + ITEM_FIELDS_ORDER


LEGACY_COLS = {
    "ID": "name",
    "Supplier": "supplier",
    "Date": "transaction_date",
    "Company": "company",
    "Currency": "currency",
    "Exchange Rate": "conversion_rate",
    # Item scoped (will be attached per row):
    "PN (Items)": "items:item_code",
    "Quantity (Items)": "items:qty",
    "Rate (Company Currency) (Items)": "items:rate",
    "Required By (Items)": "items:schedule_date",
    "Description (Items)": "items:description",
    "UOM (Items)": "items:uom",
    "Stock UOM (Items)": "items:stock_uom",
    "UOM Conversion Factor (Items)": "items:conversion_factor",
}

DATE_INPUT_FORMATS = ["%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M"]


def normalize_date(val: str) -> str:
    val = (val or "").strip()
    if not val:
        return ""
    for fmt in DATE_INPUT_FORMATS:
        try:
            return datetime.strptime(val, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    # If no format matched, return raw (Data Import might still parse YYYY-MM-DD)
    return val


@dataclass
class ItemRow:
    idx: int
    item_code: str
    description: str
    qty: str
    rate: str
    schedule_date: str
    uom: str
    stock_uom: str
    conversion_factor: str


@dataclass
class PurchaseOrder:
    name: str
    supplier: str
    transaction_date: str
    company: str
    currency: str
    conversion_rate: str
    items: List[ItemRow] = field(default_factory=list)

    @property
    def schedule_date(self) -> str:
        # Earliest item schedule date but never earlier than transaction_date
        dates = [i.schedule_date for i in self.items if i.schedule_date]
        if not dates:
            return self.transaction_date  # fallback
        earliest = min(dates)
        # Ensure parent schedule_date is not before the PO transaction_date to avoid validation errors
        if earliest < self.transaction_date:
            return self.transaction_date
        return earliest


def parse_legacy_csv(path: Path) -> Dict[str, PurchaseOrder]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        missing = [c for c in LEGACY_COLS if c not in reader.fieldnames]
        if missing:
            raise SystemExit(f"Missing expected columns: {missing}")

        pos: Dict[str, PurchaseOrder] = {}
        for raw in reader:
            name = raw.get("ID", "").strip()
            if not name:
                # skip malformed row
                continue
            if name not in pos:
                po = PurchaseOrder(
                    name=name,
                    supplier=raw.get("Supplier", "").strip(),
                    transaction_date=normalize_date(raw.get("Date", "")),
                    company=raw.get("Company", "").strip(),
                    currency=raw.get("Currency", "").strip() or "USD",
                    conversion_rate=raw.get("Exchange Rate", "").strip() or "1",
                )
                pos[name] = po
            else:
                po = pos[name]

            item = ItemRow(
                idx=len(po.items) + 1,
                item_code=raw.get("PN (Items)", "").strip(),
                description=raw.get("Description (Items)", "").strip(),
                qty=raw.get("Quantity (Items)", "").strip(),
                rate=raw.get("Rate (Company Currency) (Items)", "").strip(),
                schedule_date=normalize_date(raw.get("Required By (Items)", "")),
                uom=raw.get("UOM (Items)", "").strip(),
                stock_uom=raw.get("Stock UOM (Items)", "").strip(),
                conversion_factor=raw.get("UOM Conversion Factor (Items)", "").strip() or "1",
            )
            po.items.append(item)

    return pos


def write_import_csv(pos: Dict[str, PurchaseOrder], out_path: Path) -> None:
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(OUTPUT_HEADER)
        for po in pos.values():
            for item in po.items:
                row = [
                    po.name,
                    po.supplier,
                    po.transaction_date,
                    po.schedule_date,
                    po.company,
                    po.currency,
                    po.conversion_rate,
                    item.idx,
                    item.item_code,
                    item.description,
                    item.qty,
                    item.rate,
                    item.schedule_date,
                    item.uom,
                    item.stock_uom,
                    item.conversion_factor,
                ]
                writer.writerow(row)


def check_items_exist(pos: Dict[str, PurchaseOrder]) -> None:
    try:
        import frappe  # type: ignore
    except Exception as e:  # noqa: BLE001
        print("Frappe not importable; skip item existence check (run inside bench env).", file=sys.stderr)
        return

    all_codes = {it.item_code for po in pos.values() for it in po.items if it.item_code}
    existing = {r[0] for r in frappe.db.sql("select name from `tabItem` where name in %(codes)s", {"codes": tuple(all_codes) or ("",)})}
    missing = sorted(all_codes - existing)
    if missing:
        print(f"Missing {len(missing)} Item(s):")
        for m in missing[:50]:
            print("  ", m)
        if len(missing) > 50:
            print("  ... (truncated)")
    else:
        print("All item codes exist.")


def main():
    ap = argparse.ArgumentParser(description="Transform legacy PO CSV to ERPNext import format (preserve names)")
    ap.add_argument("--input", default="imports/final_purchase_orders.csv", help="Input legacy CSV path")
    ap.add_argument("--output", default="imports/purchase_order_import.csv", help="Output CSV path")
    ap.add_argument("--check-items", action="store_true", help="Check Item existence in ERPNext (bench env)")
    args = ap.parse_args()

    in_path = Path(args.input).resolve()
    out_path = Path(args.output).resolve()

    if not in_path.exists():
        raise SystemExit(f"Input file not found: {in_path}")

    pos = parse_legacy_csv(in_path)
    if not pos:
        raise SystemExit("No purchase orders parsed.")

    write_import_csv(pos, out_path)
    print(f"Wrote {sum(len(p.items) for p in pos.values())} item rows across {len(pos)} POs -> {out_path}")

    if args.check_items:
        check_items_exist(pos)


if __name__ == "__main__":  # pragma: no cover
    main()
