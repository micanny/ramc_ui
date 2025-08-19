/*!
 * RAMC UI Theme - JavaScript Integration
 * Regional Aircraft Maintenance Centre - Theme Switcher & Logo Management
 * Author: RAMC Development Team
 * Version: 1.0.0
 */

frappe.provide("ramc_ui");

/**
 * Extend Frappe's ThemeSwitcher to include our RAMC theme
 */
frappe.ui.ThemeSwitcher = class RAMCThemeSwitcher extends frappe.ui.ThemeSwitcher {
	fetch_themes() {
		return new Promise((resolve) => {
			this.themes = [
				{
					name: "light",
					label: __("Frappe Light"),
					info: __("Light Theme"),
				},
				{
					name: "dark",
					label: __("Timeless Night"),
					info: __("Dark Theme"),
				},
				{
					name: "automatic",
					label: __("Automatic"),
					info: __("Uses system's theme to switch between light and dark mode"),
				},
				{
					name: "ramc",
					label: __("RAMC Aviation"),
					info: __("Professional aviation-grade theme for aircraft maintenance"),
				},
			];

			resolve(this.themes);
		});
	}

	toggle_theme(theme) {
		this.current_theme = theme.toLowerCase();
		document.documentElement.setAttribute("data-theme-mode", this.current_theme);
		
		// Handle logo switching for RAMC theme
		this.handle_logo_switching(this.current_theme);
		
		frappe.show_alert(__("Theme Changed"), 3);

		// Call the server to persist theme choice
		frappe.xcall("frappe.core.doctype.user.user.switch_theme", {
			theme: toTitle(theme),
		});
	}

	/**
	 * Handle logo switching based on active theme
	 * This follows Frappe's pattern of dynamic DOM manipulation rather than CSS content rules
	 */
	handle_logo_switching(theme) {
		const navbar_logo = document.querySelector('.navbar-brand img');
		const login_logo = document.querySelector('.login-logo img, .for-login .login-logo img');
		
		if (theme === 'ramc') {
			// RAMC theme uses aviation logos
			if (navbar_logo) {
				navbar_logo.src = '/assets/ramc_ui/images/logos/ramc_main_light.png';
				navbar_logo.style.maxHeight = '32px';
				navbar_logo.style.width = 'auto';
				navbar_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
			}
			
			if (login_logo) {
				login_logo.src = '/assets/ramc_ui/images/logos/ramc_main_dark.png';
				login_logo.style.maxHeight = '80px';
				login_logo.style.width = 'auto';
				login_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
			}
		} else if (theme === 'dark') {
			// Dark theme - use appropriate logo variant
			if (navbar_logo) {
				navbar_logo.src = '/assets/ramc_ui/images/logos/ramc_main_dark.png';
			}
			if (login_logo) {
				login_logo.src = '/assets/ramc_ui/images/logos/ramc_main_dark.png';
			}
		} else {
			// Light theme or default - use light background logo
			if (navbar_logo) {
				navbar_logo.src = '/assets/ramc_ui/images/logos/ramc_main_light.png';
			}
			if (login_logo) {
				login_logo.src = '/assets/ramc_ui/images/logos/ramc_main_light.png';
			}
		}
	}
};

/**
 * Initialize RAMC theme-specific functionality
 */
ramc_ui.init = function() {
	// Set up theme-aware logo switching on page load
	$(document).ready(function() {
		// Get current theme
		const current_theme = document.documentElement.getAttribute('data-theme') || 
		                     document.documentElement.getAttribute('data-theme-mode') || 
		                     'light';
		
		// Initialize logo based on current theme
		const theme_switcher = new frappe.ui.ThemeSwitcher();
		theme_switcher.handle_logo_switching(current_theme);
		
		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && 
				    (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
					const new_theme = document.documentElement.getAttribute('data-theme') || 
					                 document.documentElement.getAttribute('data-theme-mode') || 
					                 'light';
					theme_switcher.handle_logo_switching(new_theme);
				}
			});
		});
		
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'data-theme-mode']
		});
	});
	
	// Add aviation-specific module enhancements
	ramc_ui.enhance_aviation_modules();
};

/**
 * Enhance aviation-specific modules with special theming
 */
ramc_ui.enhance_aviation_modules = function() {
	$(document).ready(function() {
		// Add special styling to Maintenance and Projects modules
		const maintenance_card = $('.module-card').filter(function() {
			return $(this).find('.module-name').text().includes('Maintenance') ||
			       $(this).find('.module-name').text().includes('Project');
		});
		
		maintenance_card.addClass('aviation-module');
		
		// Add special aviation status indicators if they exist
		$('.aircraft-status').each(function() {
			const status = $(this).text().toLowerCase();
			if (status.includes('operational')) {
				$(this).addClass('aircraft-status-operational');
			} else if (status.includes('maintenance')) {
				$(this).addClass('aircraft-status-maintenance');  
			} else if (status.includes('grounded')) {
				$(this).addClass('aircraft-status-grounded');
			}
		});
	});
};

/**
 * RAMC Utilities - Aviation-specific helper functions
 */
ramc_ui.utils = {
	/**
	 * Set RAMC as default theme for new users
	 */
	set_default_theme: function() {
		if (frappe.user.has_role('System Manager')) {
			frappe.call({
				method: 'ramc_ui.api.set_default_theme',
				args: {
					theme: 'RAMC'
				},
				callback: function(r) {
					if (r.message) {
						frappe.show_alert(__('RAMC theme set as default'), 5);
					}
				}
			});
		}
	},

	/**
	 * Get aviation color for status
	 */
	get_aviation_status_color: function(status) {
		const status_colors = {
			'operational': 'var(--success)',
			'maintenance': 'var(--warning)', 
			'grounded': 'var(--danger)',
			'scheduled': 'var(--info)',
			'priority': 'var(--accent)'
		};
		
		return status_colors[status.toLowerCase()] || 'var(--text-color)';
	},

	/**
	 * Add cockpit-style panel styling
	 */
	add_cockpit_panel: function(element) {
		$(element).addClass('cockpit-panel');
	}
};

// Initialize RAMC theme functionality
ramc_ui.init();

// Export for global access
window.ramc_ui = ramc_ui;

console.log('RAMC UI Theme loaded successfully - Aviation-grade ERP interface active');
