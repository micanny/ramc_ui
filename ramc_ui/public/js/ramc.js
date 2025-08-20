/*!
 * RAMC UI Theme - Modern JavaScript Integration
 * Regional Aircraft Maintenance Centre - World-Class Theme Engine
 * Author: RAMC Development Team
 * Version: 2.0.0
 * Description: Advanced theme switching with glassmorphism effects and logo management
 */

frappe.provide("ramc_ui");

/**
 * Modern RAMC Theme Switcher - Extends Frappe's ThemeSwitcher with aviation excellence
 */
frappe.ui.ThemeSwitcher = class RAMCModernThemeSwitcher extends frappe.ui.ThemeSwitcher {
	fetch_themes() {
		return new Promise((resolve) => {
			this.themes = [
				{
					name: "light",
					label: __("Frappe Light"),
					info: __("Clean and minimal light theme"),
				},
				{
					name: "dark", 
					label: __("Timeless Night"),
					info: __("Professional dark theme"),
				},
				{
					name: "automatic",
					label: __("Automatic"),
					info: __("Follows your system preference"),
				},
				{
					name: "ramc",
					label: __("RAMC Aviation"),
					info: __("World-class aviation theme with glassmorphism effects"),
				},
			];

			resolve(this.themes);
		});
	}

	toggle_theme(theme) {
		this.current_theme = theme.toLowerCase();
		document.documentElement.setAttribute("data-theme-mode", this.current_theme);
		document.documentElement.setAttribute("data-theme", this.current_theme);
		
		// Add visual feedback with modern animation
		this.show_theme_change_animation();
		
		// Handle branding for RAMC theme
		this.handle_aviation_branding(this.current_theme);
		
		frappe.show_alert({
			message: __("Theme switched to {0}", [toTitle(theme)]),
			indicator: 'green'
		}, 3);

		// Persist theme choice
		frappe.xcall("frappe.core.doctype.user.user.switch_theme", {
			theme: toTitle(theme),
		});
	}

	/**
	 * Advanced logo and branding management for aviation theme
	 */
	handle_aviation_branding(theme) {
		const navbar_logo = document.querySelector('.navbar-brand img');
		const login_logo = document.querySelector('.login-logo img, .for-login .login-logo img');
		const favicon = document.querySelector('link[rel="shortcut icon"]');
		
		// Enhanced logo switching with better visibility
		if (theme === 'ramc') {
			// RAMC Aviation Branding
			if (navbar_logo) {
				navbar_logo.src = '/assets/ramc_ui/images/logos/ramc_main_light.png';
				navbar_logo.style.height = '40px'; // Increased size for better visibility
				navbar_logo.style.width = 'auto';
				navbar_logo.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))';
				navbar_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
				
				// Add smooth transition animation
				navbar_logo.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
				navbar_logo.style.transform = 'scale(1.05)';
				
				setTimeout(() => {
					navbar_logo.style.transform = 'scale(1)';
				}, 300);
			}
			
			if (login_logo) {
				login_logo.src = '/assets/ramc_ui/images/logos/ramc_main_dark.png';
				login_logo.style.maxHeight = '90px'; // Better login logo size
				login_logo.style.width = 'auto';
				login_logo.style.filter = 'drop-shadow(4px 4px 8px rgba(0,0,0,0.15))';
				login_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
			}

			// Update page title
			document.title = 'RAMC Aviation ERP - ' + (frappe.get_route_str() || 'Home');
			
		} else {
			// Fallback for other themes - use appropriate logo variants
			const logo_variant = (theme === 'dark') ? 'dark' : 'light';
			
			if (navbar_logo) {
				navbar_logo.src = `/assets/ramc_ui/images/logos/ramc_main_${logo_variant}.png`;
				navbar_logo.style.height = '36px';
				navbar_logo.style.filter = 'none';
			}
			
			if (login_logo) {
				login_logo.src = `/assets/ramc_ui/images/logos/ramc_main_${logo_variant}.png`;
				login_logo.style.maxHeight = '80px';
				login_logo.style.filter = 'none';
			}
		}

		// Apply theme-specific body classes for enhanced styling
		document.body.className = document.body.className.replace(/ramc-theme-\w+/g, '');
		if (theme === 'ramc') {
			document.body.classList.add('ramc-theme-aviation');
		}
	}

	/**
	 * Modern theme change animation with glassmorphism effect
	 */
	show_theme_change_animation() {
		// Create modern ripple effect
		const ripple = document.createElement('div');
		ripple.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			width: 100px;
			height: 100px;
			background: linear-gradient(135deg, #0066FF, #FFB800);
			border-radius: 50%;
			transform: translate(-50%, -50%) scale(0);
			opacity: 0.8;
			z-index: 9999;
			pointer-events: none;
			backdrop-filter: blur(10px);
		`;
		
		document.body.appendChild(ripple);
		
		// Animate the ripple
		ripple.animate([
			{ transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
			{ transform: 'translate(-50%, -50%) scale(20)', opacity: 0 }
		], {
			duration: 800,
			easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
		}).onfinish = () => {
			ripple.remove();
		};
	}
};

/**
 * RAMC Aviation Theme Initialization
 */
ramc_ui.init = function() {
	console.log('%c🛩️ RAMC Aviation Theme Initialized', 'color: #0066FF; font-size: 16px; font-weight: bold;');
	
	$(document).ready(function() {
		// Initialize theme-aware branding
		ramc_ui.setup_dynamic_branding();
		
		// Setup aviation module enhancements
		ramc_ui.enhance_aviation_modules();
		
		// Initialize modern animations
		ramc_ui.setup_modern_animations();
		
		// Setup responsive navbar behavior
		ramc_ui.setup_responsive_navbar();
		
		// Initialize glassmorphism effects
		ramc_ui.init_glassmorphism();
	});
};

/**
 * Setup dynamic branding system
 */
ramc_ui.setup_dynamic_branding = function() {
	const current_theme = document.documentElement.getAttribute('data-theme') || 
	                     document.documentElement.getAttribute('data-theme-mode') || 
	                     'light';
	
	// Initialize with current theme
	const theme_switcher = new frappe.ui.ThemeSwitcher();
	theme_switcher.handle_aviation_branding(current_theme);
	
	// Watch for theme changes
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && 
			    (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
				const new_theme = document.documentElement.getAttribute('data-theme') || 
				                 document.documentElement.getAttribute('data-theme-mode') || 
				                 'light';
				theme_switcher.handle_aviation_branding(new_theme);
			}
		});
	});
	
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme', 'data-theme-mode']
	});
};

/**
 * Enhanced aviation module styling
 */
ramc_ui.enhance_aviation_modules = function() {
	// Target aviation-related modules
	const aviation_modules = ['Maintenance', 'Projects', 'Assets', 'Quality', 'Manufacturing'];
	
	aviation_modules.forEach(module => {
		$(`.module-card:contains("${module}")`).each(function() {
			$(this).addClass('aviation-module');
			
			// Add hover effect with aviation icon
			$(this).hover(
				function() {
					$(this).find('.module-icon').html(`
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
						</svg>
					`);
				},
				function() {
					// Restore original icon on hover out
				}
			);
		});
	});
};

/**
 * Setup modern animations and micro-interactions
 */
ramc_ui.setup_modern_animations = function() {
	// Add entrance animations for cards
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animation = 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
			}
		});
	}, { threshold: 0.1 });
	
	// Observe all cards for entrance animations
	document.querySelectorAll('.card, .frappe-card, .module-card').forEach(card => {
		observer.observe(card);
	});
	
	// Add CSS for fade in animation
	if (!document.getElementById('ramc-animations')) {
		const style = document.createElement('style');
		style.id = 'ramc-animations';
		style.textContent = `
			@keyframes fadeInUp {
				from {
					opacity: 0;
					transform: translateY(30px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
			
			.card, .frappe-card, .module-card {
				opacity: 0;
				transform: translateY(30px);
			}
		`;
		document.head.appendChild(style);
	}
};

/**
 * Setup responsive navbar behavior
 */
ramc_ui.setup_responsive_navbar = function() {
	let last_scroll = 0;
	const navbar = document.querySelector('.navbar');
	
	if (navbar) {
		window.addEventListener('scroll', () => {
			const current_scroll = window.pageYOffset;
			
			if (current_scroll > last_scroll && current_scroll > 100) {
				// Scrolling down - hide navbar
				navbar.style.transform = 'translateY(-100%)';
			} else {
				// Scrolling up - show navbar
				navbar.style.transform = 'translateY(0)';
			}
			
			last_scroll = current_scroll;
		});
	}
};

/**
 * Initialize glassmorphism effects
 */
ramc_ui.init_glassmorphism = function() {
	// Add glassmorphism to relevant elements when RAMC theme is active
	const check_theme = () => {
		const current_theme = document.documentElement.getAttribute('data-theme');
		
		if (current_theme === 'ramc') {
			// Add glassmorphism classes
			document.querySelectorAll('.card, .frappe-card, .modal-content, .navbar, .desk-sidebar').forEach(el => {
				el.classList.add('ramc-glass');
			});
		} else {
			// Remove glassmorphism classes
			document.querySelectorAll('.ramc-glass').forEach(el => {
				el.classList.remove('ramc-glass');
			});
		}
	};
	
	// Initial check
	check_theme();
	
	// Watch for theme changes
	const observer = new MutationObserver(check_theme);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});
};

/**
 * RAMC Utilities - Aviation-specific functionality
 */
ramc_ui.utils = {
	/**
	 * Set RAMC as default theme
	 */
	set_default_theme: function() {
		if (frappe.user.has_role('System Manager')) {
			frappe.call({
				method: 'ramc_ui.overrides.switch_theme.set_default_theme',
				args: { theme: 'RAMC' },
				callback: function(r) {
					if (r.message) {
						frappe.show_alert({
							message: __('RAMC Aviation theme set as default'),
							indicator: 'green'
						}, 5);
					}
				}
			});
		}
	},

	/**
	 * Get aviation status color with modern palette
	 */
	get_aviation_status_color: function(status) {
		const status_colors = {
			'operational': '#10B981',    // Modern green
			'maintenance': '#F59E0B',    // Amber warning  
			'grounded': '#EF4444',      // Clean red
			'scheduled': '#06B6D4',     // Cyan info
			'priority': '#FFB800',      // Aviation gold
			'inspection': '#8B5CF6',    // Purple
			'repair': '#F97316'         // Orange
		};
		
		return status_colors[status.toLowerCase()] || '#64748B';
	},

	/**
	 * Add modern cockpit panel styling
	 */
	add_cockpit_panel: function(element) {
		$(element).addClass('cockpit-panel');
		
		// Add scanning line effect
		const scanner = $('<div class="scanner-line"></div>');
		$(element).append(scanner);
		
		setInterval(() => {
			scanner.css('animation', 'none');
			setTimeout(() => {
				scanner.css('animation', 'scan 2s linear');
			}, 10);
		}, 3000);
	},

	/**
	 * Enhanced status indicator with animation
	 */
	create_status_indicator: function(status, text) {
		const color = this.get_aviation_status_color(status);
		
		return $(`
			<span class="ramc-status-indicator" style="
				background: ${color}15;
				color: ${color};
				border: 1px solid ${color}40;
				padding: 0.25rem 0.75rem;
				border-radius: 9999px;
				font-size: 0.75rem;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				display: inline-flex;
				align-items: center;
				position: relative;
				overflow: hidden;
			">
				<span class="status-dot" style="
					width: 6px;
					height: 6px;
					background: ${color};
					border-radius: 50%;
					margin-right: 0.5rem;
					animation: pulse 2s infinite;
				"></span>
				${text || status}
			</span>
		`);
	}
};

/**
 * Initialize modern theme keyboard shortcuts
 */
ramc_ui.setup_keyboard_shortcuts = function() {
	frappe.ui.keys.add_shortcut({
		shortcut: 'shift+ctrl+t',
		description: __('Switch to RAMC Aviation Theme'),
		action: () => {
			const theme_switcher = new frappe.ui.ThemeSwitcher();
			theme_switcher.toggle_theme('ramc');
		}
	});
};

/**
 * Performance monitoring for theme
 */
ramc_ui.monitor_performance = function() {
	if (performance.mark) {
		performance.mark('ramc-theme-start');
		
		setTimeout(() => {
			performance.mark('ramc-theme-end');
			performance.measure('ramc-theme-load', 'ramc-theme-start', 'ramc-theme-end');
			
			const measure = performance.getEntriesByName('ramc-theme-load')[0];
			console.log(`🚀 RAMC Theme loaded in ${measure.duration.toFixed(2)}ms`);
		}, 1000);
	}
};

// Initialize everything
ramc_ui.init();
ramc_ui.setup_keyboard_shortcuts(); 
ramc_ui.monitor_performance();

// Export for global access
window.ramc_ui = ramc_ui;

// Add modern pulse animation CSS
const pulse_style = document.createElement('style');
pulse_style.textContent = `
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	.ramc-glass {
		backdrop-filter: blur(12px) saturate(180%);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.125);
	}
	
	.scanner-line {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.1), transparent);
		animation: scan 2s linear infinite;
	}
	
	@keyframes scan {
		0% { left: -100%; }
		100% { left: 100%; }
	}
`;
document.head.appendChild(pulse_style);

console.log('%c✈️ RAMC Aviation Theme Engine Ready - World-Class ERP Experience Activated!', 
			'background: linear-gradient(135deg, #0066FF, #FFB800); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
