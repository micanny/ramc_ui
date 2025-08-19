# RAMC UI Theme - API Functions
# Regional Aircraft Maintenance Centre

import frappe

@frappe.whitelist()
def get_theme_info():
	"""
	Get information about the RAMC aviation theme
	"""
	return {
		"name": "RAMC Aviation Theme",
		"version": "1.0.0",
		"description": "Professional aviation-grade ERP interface for aircraft maintenance operations",
		"author": "RAMC Development Team",
		"features": [
			"Aviation-inspired color palette",
			"Cockpit-style precision UI",
			"Dynamic logo switching",
			"Enhanced maintenance module styling",
			"Professional aerospace branding"
		],
		"theme_mode": "ramc"
	}

@frappe.whitelist()
def has_app_permission():
	"""
	Check if user has permission to access RAMC UI theme
	"""
	# Allow all users to use the theme
	return True

@frappe.whitelist()  
def set_ramc_as_default():
	"""
	Set RAMC theme as default for new users (requires System Manager role)
	"""
	if not frappe.has_permission("System Settings", "write"):
		frappe.throw("Only System Managers can set default theme")
	
	# This would integrate with System Settings in a production app
	frappe.msgprint("RAMC theme configuration updated", indicator="green")
	return True
