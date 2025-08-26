/*!
 * RAMC Ultra-Modern Aviation Theme - JavaScript
 * Enhanced Interactions & Mobile Support
 * Version: 4.0.0 - ULTRA MODERN
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🛩️ RAMC Ultra-Modern Theme: Initializing...');
        initializeRAMCTheme();
    });
    
    function initializeRAMCTheme() {
        setupMobileSidebar();
        setupEnhancedDropdowns();
        setupSearchEnhancements();
        setupModernInteractions();
        setupAccessibility();
        console.log('✅ RAMC Ultra-Modern Theme: Ready');
    }
    
    // ================================================
    // ENHANCED DROPDOWN FUNCTIONALITY
    // ================================================
    
    function setupEnhancedDropdowns() {
        // Apply modern effects to all dropdowns
        const dropdownTriggers = document.querySelectorAll('[data-bs-toggle="dropdown"], .dropdown-toggle');
        
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                const dropdown = this.nextElementSibling || document.querySelector(this.getAttribute('data-bs-target'));
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    // Add modern animation class
                    dropdown.classList.add('dropdown-modern');
                    
                    // Position dropdown properly
                    setTimeout(() => {
                        positionDropdown(dropdown, this);
                    }, 10);
                }
            });
        });
        
        // Close dropdowns on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show', 'dropdown-modern');
                });
            }
        });
    }
    
    function positionDropdown(dropdown, trigger) {
        const triggerRect = trigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = dropdown.offsetHeight;
        
        // Check if dropdown should appear above or below
        if (triggerRect.bottom + dropdownHeight > viewportHeight && triggerRect.top > dropdownHeight) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = '100%';
            dropdown.style.marginBottom = '8px';
        } else {
            dropdown.style.top = '100%';
            dropdown.style.bottom = 'auto';
            dropdown.style.marginTop = '8px';
        }
    }
    
    // ================================================
    // MODERN INTERACTIONS
    // ================================================
    
    function setupModernInteractions() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll(
            '.btn, .card, .sidebar-item, .list-row, .datatable-row, .navbar-nav .nav-link'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
        
        // Enhanced table interactions
        const tableRows = document.querySelectorAll('.datatable-row, tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 4px 12px rgba(11, 20, 38, 0.15)';
                this.style.transform = 'translateY(-1px)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
                this.style.transform = '';
            });
        });
        
        // Enhanced card interactions
        const cards = document.querySelectorAll('.frappe-card, .card, .widget');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 10px 25px rgba(11, 20, 38, 0.15)';
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
                this.style.transform = '';
            });
        });
    }
    
    // ================================================
    // MOBILE SIDEBAR FUNCTIONALITY
    // ================================================
    
    function setupMobileSidebar() {
        if (window.innerWidth <= 768) {
            createMobileElements();
        }
        
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
        if (!document.querySelector('.sidebar-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'sidebar-toggle';
            toggle.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
            toggle.setAttribute('aria-label', 'Toggle Sidebar');
            toggle.addEventListener('click', toggleMobileSidebar);
            
            // Style the toggle button
            Object.assign(toggle.style, {
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: '1001',
                background: 'var(--gradient-primary)',
                border: 'none',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(11, 20, 38, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
            });
            
            document.body.appendChild(toggle);
        }
        
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', closeMobileSidebar);
            
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'rgba(11, 20, 38, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: '999',
                opacity: '0',
                visibility: 'hidden',
                transition: 'all 0.3s ease'
            });
            
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
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.classList.add('sidebar-open');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.classList.remove('sidebar-open');
            document.body.style.overflow = '';
        }
    }
    
    // ================================================
    // SEARCH ENHANCEMENTS
    // ================================================
    
    function setupSearchEnhancements() {
        const searchSelectors = [
            '.navbar .search-bar input',
            '.global-search input',
            'input[placeholder*="Search"]',
            'input[placeholder*="search"]'
        ];
        
        searchSelectors.forEach(selector => {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach(function(input) {
                input.addEventListener('focus', function() {
                    const parent = this.closest('.search-bar, .global-search') || this.parentElement;
                    parent.classList.add('search-focused');
                    
                    // Add modern focus ring
                    this.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.2)';
                });
                
                input.addEventListener('blur', function() {
                    const parent = this.closest('.search-bar, .global-search') || this.parentElement;
                    parent.classList.remove('search-focused');
                    
                    // Remove focus ring
                    this.style.boxShadow = '';
                });
                
                // Add typing animation
                input.addEventListener('input', function() {
                    const parent = this.closest('.search-bar, .global-search') || this.parentElement;
                    parent.classList.add('search-active');
                    
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        parent.classList.remove('search-active');
                    }, 1000);
                });
            });
        });
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    function setupAccessibility() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.desk-sidebar');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    closeMobileSidebar();
                }
                
                // Close open dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show', 'dropdown-modern');
                });
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
        
        // Focus management for dropdowns
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // ================================================
    // THEME PERFORMANCE OPTIMIZATION
    // ================================================
    
    function optimizePerformance() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(function() {
                // Navbar scroll effect
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    if (window.scrollY > 50) {
                        navbar.style.backdropFilter = 'blur(30px)';
                        navbar.style.background = 'rgba(11, 20, 38, 0.95)';
                    } else {
                        navbar.style.backdropFilter = 'blur(20px)';
                        navbar.style.background = 'var(--gradient-primary)';
                    }
                }
            });
        });
        
        // Optimize animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition', 'none');
            document.documentElement.style.setProperty('--transition-smooth', 'none');
        }
    }
    
    // Initialize performance optimizations
    setTimeout(optimizePerformance, 100);
    
    // ================================================
    // PUBLIC API
    // ================================================
    
    window.RAMCTheme = {
        toggleSidebar: toggleMobileSidebar,
        openSidebar: openMobileSidebar,
        closeSidebar: closeMobileSidebar,
        init: initializeRAMCTheme,
        version: '4.0.0'
    };
    
})();

// ================================================
// FRAPPE THEME INTEGRATION
// ================================================

if (typeof frappe !== 'undefined') {
    frappe.provide("ramc_ui");
    
    frappe.ui.ThemeSwitcher = class RAMCUltraModernThemeSwitcher extends frappe.ui.ThemeSwitcher {
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
                        label: __("RAMC Ultra-Modern"),
                        info: __("Ultra-modern aviation management theme"),
                    },
                ];
                resolve(this.themes);
            });
        }
        
        toggle_theme(theme) {
            this.current_theme = theme.toLowerCase();
            document.documentElement.setAttribute("data-theme-mode", this.current_theme);
            document.documentElement.setAttribute("data-theme", this.current_theme);
            
            this.handle_aviation_branding(this.current_theme);
            
            frappe.show_alert({
                message: __("Theme switched to {0}", [toTitle(theme)]),
                indicator: 'green'
            }, 3);
            
            frappe.xcall("frappe.core.doctype.user.user.switch_theme", {
                theme: toTitle(theme),
            });
        }
        
        handle_aviation_branding(theme) {
            const navbar_logo = document.querySelector('.navbar-brand img');
            
            if (theme === 'ramc' && navbar_logo) {
                navbar_logo.style.maxHeight = '40px';
                navbar_logo.style.width = 'auto';
                navbar_logo.style.filter = 'brightness(0) invert(1)';
                navbar_logo.setAttribute('alt', 'RAMC - Regional Aircraft Maintenance Centre');
                
                document.title = 'RAMC Aviation ERP - Ultra Modern Interface';
            }
        }
    };
    
    ramc_ui.init = function() {
        console.log('🛩️ RAMC Ultra-Modern UI Theme Initialized');
        
        $(document).ready(function() {
            const current_theme = document.documentElement.getAttribute('data-theme') || 'light';
            const theme_switcher = new frappe.ui.ThemeSwitcher();
            theme_switcher.handle_aviation_branding(current_theme);
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
                        const new_theme = document.documentElement.getAttribute('data-theme') || 'light';
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
    
    ramc_ui.init();
    window.ramc_ui = ramc_ui;
}

console.log('%c✈️ RAMC Ultra-Modern Aviation Theme 4.0 - Ready for Takeoff!', 
            'background: linear-gradient(135deg, #0B1426, #F59E0B); color: white; padding: 12px 16px; border-radius: 12px; font-weight: bold; font-size: 14px;');
