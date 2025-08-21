/*!
 * RAMC Aviation Theme - Clean JavaScript
 * Mobile Sidebar & Enhanced Interactions
 * Version: 3.0 - No Conflicts, Bootstrap Compatible
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🛩️ RAMC Theme: Initializing...');
        initializeRAMCTheme();
    });
    
    function initializeRAMCTheme() {
        setupMobileSidebar();
        setupSearchEnhancements();
        setupAccessibility();
        console.log('✅ RAMC Theme: Ready');
    }
    
    // ================================================
    // MOBILE SIDEBAR FUNCTIONALITY
    // ================================================
    
    function setupMobileSidebar() {
        // Only create mobile elements on small screens
        if (window.innerWidth <= 768) {
            createMobileElements();
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (!document.querySelector('.sidebar-toggle')) {
                    createMobileElements();
                }
            } else {
                removeMobileElements();
            }
        });
    }
    
    function createMobileElements() {
        // Create toggle button
        if (!document.querySelector('.sidebar-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'sidebar-toggle';
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-label', 'Toggle Sidebar');
            toggle.addEventListener('click', toggleMobileSidebar);
            document.body.appendChild(toggle);
        }
        
        // Create overlay
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', closeMobileSidebar);
            document.body.appendChild(overlay);
        }
    }
    
    function removeMobileElements() {
        const toggle = document.querySelector('.sidebar-toggle');
        const overlay = document.querySelector('.sidebar-overlay');
        if (toggle) toggle.remove();
        if (overlay) overlay.remove();
        
        const sidebar = document.querySelector('.desk-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-open');
    }
    
    function toggleMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        if (sidebar) {
            if (sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        }
    }
    
    function openMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            document.body.style.overflow = '';
        }
    }
    
    // ================================================
    // SEARCH ENHANCEMENTS
    // ================================================
    
    function setupSearchEnhancements() {
        // Find all search inputs using different possible selectors
        const searchSelectors = [
            '.navbar .search-bar input',
            '.global-search input',
            'input[placeholder*="Search"]',
            'input[placeholder*="search"]'
        ];
        
        searchSelectors.forEach(selector => {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach(function(input) {
                // Add enhanced focus effects
                input.addEventListener('focus', function() {
                    const parent = this.closest('.search-bar, .global-search') || this.parentElement;
                    parent.classList.add('search-focused');
                });
                
                input.addEventListener('blur', function() {
                    const parent = this.closest('.search-bar, .global-search') || this.parentElement;
                    parent.classList.remove('search-focused');
                });
            });
        });
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    function setupAccessibility() {
        // ESC key closes mobile sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.desk-sidebar');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    closeMobileSidebar();
                }
            }
        });
        
        // Add proper ARIA labels
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.getAttribute('role')) {
            navbar.setAttribute('role', 'navigation');
            navbar.setAttribute('aria-label', 'Main navigation');
        }
        
        const sidebar = document.querySelector('.desk-sidebar');
        if (sidebar && !sidebar.getAttribute('role')) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Sidebar navigation');
        }
    }
    
    // ================================================
    // PUBLIC API
    // ================================================
    
    // Expose methods for external use
    window.RAMCTheme = {
        toggleSidebar: toggleMobileSidebar,
        openSidebar: openMobileSidebar,
        closeSidebar: closeMobileSidebar,
        init: initializeRAMCTheme
    };
    
})();

// ================================================
// FRAPPE THEME INTEGRATION
// ================================================

// Extend Frappe's theme switcher if available
if (typeof frappe !== 'undefined') {
    frappe.provide("ramc_ui");
    
    // Enhanced theme switcher
    frappe.ui.ThemeSwitcher = class RAMCThemeSwitcher extends frappe.ui.ThemeSwitcher {
        fetch_themes() {
            return new Promise((resolve) => {
                this.themes = [
                    {
                        name: "light",
                        label: __("Frappe Light"),
                        info: __("Clean light theme"),
                    },
                    {
                        name: "dark", 
                        label: __("Timeless Night"),
                        info: __("Professional dark theme"),
                    },
                    {
                        name: "automatic",
                        label: __("Automatic"),
                        info: __("Follows system preference"),
                    },
                    {
                        name: "ramc",
                        label: __("RAMC Aviation"),
                        info: __("World-class aviation theme"),
                    },
                ];
                resolve(this.themes);
            });
        }
        
        toggle_theme(theme) {
            this.current_theme = theme.toLowerCase();
            document.documentElement.setAttribute("data-theme-mode", this.current_theme);
            document.documentElement.setAttribute("data-theme", this.current_theme);
            
            // Handle branding
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
        
        handle_aviation_branding(theme) {
            const navbar_logo = document.querySelector('.navbar-brand img');
            
            if (theme === 'ramc' && navbar_logo) {
                // RAMC branding - make logo bigger and visible
                navbar_logo.src = '/assets/ramc_ui/images/logos/ramc_main_light.png';
                navbar_logo.style.maxHeight = '55px';
                navbar_logo.style.width = 'auto';
                navbar_logo.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))';
                navbar_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
                
                // Update page title
                document.title = 'RAMC Aviation ERP - ' + (frappe.get_route_str() || 'Home');
            } else if (navbar_logo) {
                // Other themes - normal size
                const logo_variant = (theme === 'dark') ? 'dark' : 'light';
                navbar_logo.src = `/assets/ramc_ui/images/logos/ramc_main_${logo_variant}.png`;
                navbar_logo.style.maxHeight = '40px';
                navbar_logo.style.filter = 'none';
            }
        }
    };
    
    // Initialize theme on load
    ramc_ui.init = function() {
        console.log('🛩️ RAMC UI Theme Initialized');
        
        $(document).ready(function() {
            // Setup dynamic branding
            const current_theme = document.documentElement.getAttribute('data-theme') || 
                                 document.documentElement.getAttribute('data-theme-mode') || 
                                 'light';
            
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
        });
    };
    
    // Initialize
    ramc_ui.init();
    
    // Export for global access
    window.ramc_ui = ramc_ui;
}

console.log('%c✈️ RAMC Aviation Theme - Ready for Takeoff!', 
            'background: linear-gradient(135deg, #0ea5e9, #22c55e); color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
