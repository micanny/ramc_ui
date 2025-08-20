import frappe

@frappe.whitelist()
def has_app_permission():
	"""
	Check if user has permission to access RAMC UI theme app
	For now, allow all authenticated users
	"""
	return True
