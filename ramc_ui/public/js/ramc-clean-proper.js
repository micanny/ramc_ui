/*!
 * RAMC Aviation Theme - Clean JavaScript
 * Working with Frappe's existing classes and structure
 * Version: 5.0.0 - CLEAN & PROPER
 */

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🛩️ RAMC Clean Theme: Initializing...');
        initializeCleanTheme();
    });
    
    function initializeCleanTheme() {
        enhanceExistingElements();
        setupCleanInteractions();
        setupProperAccessibility();
        console.log('✅ RAMC Clean Theme: Ready');
    }
    
    // ================================================
    // ENHANCE EXISTING FRAPPE ELEMENTS
    // ================================================
    
    function enhanceExistingElements() {
        // Work with existing sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                const sidebar = document.querySelector('.layout-side-section, .desk-sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('mobile-open');
                    document.body.classList.toggle('sidebar-open');
                }
            });
        }
        
        // Enhance existing search functionality
        const searchInputs = document.querySelectorAll('.navbar input[type="search"], .global-search input');
        searchInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('search-focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('search-focused');
            });
        });
        
        // Enhance existing dropdown menus
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(4px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // ================================================
    // CLEAN INTERACTIONS
    // ================================================
    
    function setupCleanInteractions() {
        // Card hover effects using existing classes
        const cards = document.querySelectorAll('.frappe-card, .card, .widget');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
        
        // Button interactions using existing classes
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-1px)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
        
        // List row interactions using existing classes
        const listRows = document.querySelectorAll('.list-row');
        listRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(4px)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // ================================================
    // PROPER ACCESSIBILITY
    // ================================================
    
    function setupProperAccessibility() {
        // ESC key handling
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close mobile sidebar using existing classes
                const sidebar = document.querySelector('.layout-side-section, .desk-sidebar');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    sidebar.classList.remove('mobile-open');
                    document.body.classList.remove('sidebar-open');
                }
                
                // Close dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
        
        // Focus management for dropdowns
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            if (!item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Proper ARIA labels for existing elements
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.getAttribute('role')) {
            navbar.setAttribute('role', 'navigation');
            navbar.setAttribute('aria-label', 'Main navigation');
        }
        
        const sidebar = document.querySelector('.layout-side-section, .desk-sidebar');
        if (sidebar && !sidebar.getAttribute('role')) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Sidebar navigation');
        }
    }
    
    // ================================================
    // RESPONSIVE HANDLING
    // ================================================
    
    function handleResponsive() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        function handleMobile(e) {
            const sidebar = document.querySelector('.layout-side-section, .desk-sidebar');
            const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
            
            if (e.matches) {
                // Mobile view
                if (sidebarToggle) {
                    sidebarToggle.style.display = 'flex';
                }
                if (sidebar) {
                    sidebar.style.position = 'fixed';
                    sidebar.style.left = '-100%';
                    sidebar.style.top = '0';
                    sidebar.style.height = '100vh';
                    sidebar.style.zIndex = '1000';
                    sidebar.style.transition = 'left 0.3s ease';
                }
            } else {
                // Desktop view
                if (sidebarToggle) {
                    sidebarToggle.style.display = 'none';
                }
                if (sidebar) {
                    sidebar.style.position = '';
                    sidebar.style.left = '';
                    sidebar.style.top = '';
                    sidebar.style.height = '';
                    sidebar.style.zIndex = '';
                    sidebar.style.transition = '';
                    sidebar.classList.remove('mobile-open');
                }
                document.body.classList.remove('sidebar-open');
            }
        }
        
        handleMobile(mediaQuery);
        mediaQuery.addEventListener('change', handleMobile);
    }
    
    // Initialize responsive handling
    setTimeout(handleResponsive, 100);
    
    // ================================================
    // PUBLIC API
    // ================================================
    
    window.RAMCTheme = {
        init: initializeCleanTheme,
        version: '5.0.0',
        type: 'clean'
    };
    
})();

// ================================================
// FRAPPE INTEGRATION
// ================================================

if (typeof frappe !== 'undefined') {
    frappe.provide("ramc_ui");
    
    // Clean theme switcher integration
    if (frappe.ui.ThemeSwitcher) {
        const originalFetch = frappe.ui.ThemeSwitcher.prototype.fetch_themes;
        
        frappe.ui.ThemeSwitcher.prototype.fetch_themes = function() {
            return originalFetch.call(this).then((themes) => {
                // Add RAMC theme to existing themes
                const ramcTheme = {
                    name: "ramc",
                    label: __("RAMC Aviation"),
                    info: __("Professional aviation management theme"),
                };
                
                if (!themes.find(theme => theme.name === 'ramc')) {
                    themes.push(ramcTheme);
                }
                
                return themes;
            });
        };
    }
    
    // Clean initialization
    ramc_ui.init = function() {
        console.log('🛩️ RAMC Clean Theme: Frappe Integration Ready');
        
        $(document).ready(function() {
            // Handle theme switching
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
                        const theme = document.documentElement.getAttribute('data-theme') || 'light';
                        
                        if (theme === 'ramc') {
                            // RAMC theme is active
                            document.title = 'RAMC Aviation ERP - ' + (frappe.get_route_str() || 'Home');
                        }
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
    window.ramc_ui = ramc_ui;
}

console.log('%c✈️ RAMC Clean Aviation Theme - Professional & Working!', 
            'background: linear-gradient(135deg, #3b82f6, #f59e0b); color: white; padding: 8px 12px; border-radius: 6px; font-weight: 500;');
