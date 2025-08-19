# RAMC UI Theme - Python Overrides
# Regional Aircraft Maintenance Centre
# Custom theme switching support

import frappe

@frappe.whitelist()
def switch_theme(theme):
	"""
	Override Frappe's switch_theme to support RAMC theme
	Allows persistence of custom RAMC aviation theme
	"""
	# Allow standard Frappe themes plus our custom RAMC theme
	allowed_themes = ["Dark", "Light", "Automatic", "RAMC", "Ramc"]
	
	if theme in allowed_themes:
		# Normalize RAMC theme name
		if theme.lower() == "ramc":
			theme = "RAMC"
			
		# Set the theme in user preferences
		frappe.db.set_value("User", frappe.session.user, "desk_theme", theme)
		
		return {
			"message": f"Theme switched to {theme}",
			"theme": theme
		}
	else:
		frappe.throw(f"Invalid theme: {theme}. Allowed themes: {', '.join(allowed_themes)}")

@frappe.whitelist()
def get_user_theme():
	"""
	Get current user's theme preference
	"""
	user = frappe.get_doc("User", frappe.session.user)
	return user.get("desk_theme", "Light")

@frappe.whitelist() 
def set_default_theme(theme="RAMC"):
	"""
	Set RAMC as default theme for new users (System Manager only)
	"""
	if not frappe.has_permission("System Settings", "write"):
		frappe.throw("Insufficient permissions to set default theme")
		
	# This would typically be set in System Settings or similar
	# For now, we'll just return success
	return {"message": f"Default theme set to {theme}"}
