/*!
 * RAMC Aviation Theme - Clean JavaScript
 * Working with Frappe's existing classes and structure
 * Version: 6.0.0 - CONSOLIDATED & REFACTORED
 */

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🛩️ RAMC Consolidated Theme: Initializing...');
        initializeConsolidatedTheme();
    });
    
    function initializeConsolidatedTheme() {
        enhanceExistingElements();
        setupCleanInteractions();
        setupAnimations();
        setupTooltips();
        setupProperAccessibility();
        setupResizableTables();
        console.log('✅ RAMC Consolidated Theme: Ready');
    }
    
    // ================================================
    // RESIZABLE TABLES INITIALIZATION (FRAPPE NATIVE)
    // ================================================

    function setupResizableTables() {
        // Monkey-patch the refresh method of ListView
        const original_refresh = frappe.views.ListView.prototype.refresh;
        
        frappe.views.ListView.prototype.refresh = function() {
            original_refresh.apply(this, arguments);
            
            // Use a more reliable way to wait for the table to be ready
            const check_for_table = setInterval(() => {
                const list_view_table = this.wrapper.find('.frappe-list .table-bordered');
                if (list_view_table.length) {
                    clearInterval(check_for_table);
                    if (typeof makeTableResizable === 'function') {
                        makeTableResizable(list_view_table[0]);
                    }
                }
            }, 100); // Check every 100ms

            // Fallback to clear the interval after a few seconds
            setTimeout(() => clearInterval(check_for_table), 3000);
        };
    }
    
    // ================================================
    // ENHANCE EXISTING FRAPPE ELEMENTS
    // ================================================
    
    function enhanceExistingElements() {
        // Work with existing sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                document.body.classList.toggle('sidebar-open');
            });
        }
        
        // Enhance existing search functionality
        const searchInputs = document.querySelectorAll('.navbar input[type="search"], .global-search input');
        searchInputs.forEach(input => {
            const parent = input.parentElement;
            input.addEventListener('focus', () => parent.classList.add('search-focused'));
            input.addEventListener('blur', () => parent.classList.remove('search-focused'));
            input.addEventListener('input', () => {
                if (input.value.length > 0) {
                    parent.classList.add('has-content');
                } else {
                    parent.classList.remove('has-content');
                }
            });
        });
        
        // Enhance existing dropdown menus
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', () => item.classList.add('dropdown-item-hover-effect'));
            item.addEventListener('mouseleave', () => item.classList.remove('dropdown-item-hover-effect'));
        });
    }
    
    // ================================================
    // CLEAN INTERACTIONS
    // ================================================
    
    function setupCleanInteractions() {
        // Card hover effects using existing classes
        const cards = document.querySelectorAll('.frappe-card, .card, .widget');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('card-hover-effect'));
            card.addEventListener('mouseleave', () => card.classList.remove('card-hover-effect'));
        });
        
        // Button interactions using existing classes
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) button.classList.add('button-hover-effect');
            });
            button.addEventListener('mouseleave', () => button.classList.remove('button-hover-effect'));
        });
        
        // List row interactions using existing classes
        const listRows = document.querySelectorAll('.list-row');
        listRows.forEach(row => {
            row.addEventListener('mouseenter', () => row.classList.add('list-row-hover-effect'));
            row.addEventListener('mouseleave', () => row.classList.remove('list-row-hover-effect'));
        });
    }

    // ================================================
    // ANIMATION ENHANCEMENTS
    // ================================================
    
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll('.card, .frappe-card, .list-row, .module-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ================================================
    // TOOLTIP ENHANCEMENTS
    // ================================================
    
    function setupTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Add custom tooltips for sidebar items
        const sidebarItems = document.querySelectorAll('.standard-sidebar .list-link, .desk-sidebar .sidebar-item');
        sidebarItems.forEach(function(item) {
            const link = item.querySelector('a');
            const text = (link || item).textContent.trim();
            if (text && !item.getAttribute('title')) {
                item.setAttribute('title', text);
            }
        });
    }
    
    // ================================================
    // PROPER ACCESSIBILITY
    // ================================================
    
    function setupProperAccessibility() {
        // ESC key handling
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close mobile sidebar
                if (document.body.classList.contains('sidebar-open')) {
                    document.body.classList.remove('sidebar-open');
                }
                
                // Close dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
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
        const setAriaRole = (selector, role, label) => {
            const elem = document.querySelector(selector);
            if (elem && !elem.getAttribute('role')) {
                elem.setAttribute('role', role);
                if (label) elem.setAttribute('aria-label', label);
            }
        };
        setAriaRole('.navbar', 'navigation', 'Main navigation');
        setAriaRole('.layout-side-section, .desk-sidebar', 'navigation', 'Sidebar navigation');
    }
    
    // ================================================
    // PUBLIC API
    // ================================================
    
    window.RAMCTheme = {
        init: initializeConsolidatedTheme,
        version: '6.0.0',
        type: 'consolidated'
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
        console.log('🛩️ RAMC Consolidated Theme: Frappe Integration Ready');
        
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

console.log('%c✈️ RAMC Consolidated Aviation Theme - Professional & Working!', 
            'background: linear-gradient(135deg, #3b82f6, #f59e0b); color: white; padding: 8px 12px; border-radius: 6px; font-weight: 500;');
