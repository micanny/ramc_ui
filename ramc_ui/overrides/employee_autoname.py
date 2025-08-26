import frappe

def employee_autoname(doc, method=None):
    """
    Force Employee ID = Employee Number (Staff Number)
    """
    if not doc.employee_number:
        frappe.throw("Employee Number is required")

    # use staff number as the primary key
    doc.name = str(doc.employee_number).strip()

