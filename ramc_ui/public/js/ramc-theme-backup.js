/*!
 * RAMC Aviation Theme - JavaScript Enhancements
 * Mobile Sidebar Toggle & Enhanced Interactions
 * Version: 2.0
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeRAMCTheme();
    });
    
    function initializeRAMCTheme() {
        setupMobileSidebar();
        setupSearchEnhancements();
        setupTooltips();
        setupAnimations();
        setupAccessibility();
    }
    
    // ================================================
    // MOBILE SIDEBAR FUNCTIONALITY
    // ================================================
    
    function setupMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const body = document.body;
        
        // Create mobile toggle button if it doesn't exist
        if (!document.querySelector('.sidebar-toggle') && window.innerWidth <= 768) {
            createMobileToggle();
        }
        
        // Create overlay for mobile sidebar
        if (!document.querySelector('.sidebar-overlay') && window.innerWidth <= 768) {
            createSidebarOverlay();
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (!document.querySelector('.sidebar-toggle')) {
                    createMobileToggle();
                }
                if (!document.querySelector('.sidebar-overlay')) {
                    createSidebarOverlay();
                }
            } else {
                const toggle = document.querySelector('.sidebar-toggle');
                const overlay = document.querySelector('.sidebar-overlay');
                if (toggle) toggle.remove();
                if (overlay) overlay.remove();
                if (sidebar) sidebar.classList.remove('mobile-open');
                body.classList.remove('sidebar-open');
            }
        });
    }
    
    function createMobileToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'sidebar-toggle';
        toggle.innerHTML = '<i class="fa fa-bars"></i>';
        toggle.setAttribute('aria-label', 'Toggle Sidebar');
        toggle.setAttribute('type', 'button');
        
        toggle.addEventListener('click', function() {
            toggleMobileSidebar();
        });
        
        document.body.appendChild(toggle);
    }
    
    function createSidebarOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        
        overlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
        
        document.body.appendChild(overlay);
    }
    
    function toggleMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const body = document.body;
        
        if (sidebar && overlay) {
            const isOpen = sidebar.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        }
    }
    
    function openMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const body = document.body;
        
        if (sidebar && overlay) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            body.classList.add('sidebar-open');
            
            // Prevent body scroll when sidebar is open
            body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileSidebar() {
        const sidebar = document.querySelector('.desk-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const body = document.body;
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-open');
            
            // Restore body scroll
            body.style.overflow = '';
        }
    }
    
    // ================================================
    // SEARCH ENHANCEMENTS
    // ================================================
    
    function setupSearchEnhancements() {
        const searchInputs = document.querySelectorAll('.search-bar input, .search-input, .search-container input');
        
        searchInputs.forEach(function(input) {
            // Add enhanced focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('search-focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('search-focused');
            });
            
            // Add search icon animation
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    this.parentElement.classList.add('has-content');
                } else {
                    this.parentElement.classList.remove('has-content');
                }
            });
        });
    }
    
    // ================================================
    // TOOLTIP ENHANCEMENTS
    // ================================================
    
    function setupTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Add custom tooltips for sidebar items
        const sidebarItems = document.querySelectorAll('.sidebar-item a, .sidebar-item .sidebar-link');
        sidebarItems.forEach(function(item) {
            if (!item.getAttribute('title')) {
                const text = item.textContent.trim();
                if (text) {
                    item.setAttribute('title', text);
                }
            }
        });
    }
    
    // ================================================
    // ANIMATION ENHANCEMENTS
    // ================================================
    
    function setupAnimations() {
        // Add entrance animations for cards and list items
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe cards and list rows
        const animatedElements = document.querySelectorAll('.card, .frappe-card, .list-row, .module-card');
        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
        
        // Add loading animations
        setupLoadingAnimations();
    }
    
    function setupLoadingAnimations() {
        // Enhanced loading states
        const loadingElements = document.querySelectorAll('.loading, .loading-state');
        loadingElements.forEach(function(el) {
            if (!el.querySelector('.loading-spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                el.appendChild(spinner);
            }
        });
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    function setupAccessibility() {
        // Add proper ARIA labels and roles
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
        
        // Add keyboard navigation
        setupKeyboardNavigation();
        
        // Add focus management
        setupFocusManagement();
    }
    
    function setupKeyboardNavigation() {
        // ESC key closes mobile sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.desk-sidebar');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    closeMobileSidebar();
                }
            }
        });
        
        // Arrow key navigation for sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-item a, .sidebar-item .sidebar-link');
        sidebarLinks.forEach(function(link, index) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = sidebarLinks[index + 1];
                    if (next) next.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = sidebarLinks[index - 1];
                    if (prev) prev.focus();
                }
            });
        });
    }
    
    function setupFocusManagement() {
        // Trap focus in mobile sidebar when open
        document.addEventListener('focusin', function(e) {
            const sidebar = document.querySelector('.desk-sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                if (!sidebar.contains(e.target) && !e.target.classList.contains('sidebar-toggle')) {
                    const firstLink = sidebar.querySelector('a, .sidebar-link');
                    if (firstLink) firstLink.focus();
                }
            }
        });
    }
    
    // ================================================
    // UTILITY FUNCTIONS
    // ================================================
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    }
    
    // ================================================
    // PUBLIC API
    // ================================================
    
    // Expose public methods for external use
    window.RAMCTheme = {
        toggleSidebar: toggleMobileSidebar,
        openSidebar: openMobileSidebar,
        closeSidebar: closeMobileSidebar,
        init: initializeRAMCTheme
    };
    
})();

// ================================================
// CSS INJECTION FOR DYNAMIC STYLES
// ================================================

(function() {
    const additionalStyles = `
        /* Enhanced search focus state */
        [data-theme="ramc"] .search-focused {
            transform: scale(1.02) !important;
            z-index: 1000 !important;
        }
        
        [data-theme="ramc"] .search-focused input {
            box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.4), 0 8px 25px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Content indicator for search */
        [data-theme="ramc"] .has-content::after {
            content: "×";
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.8);
            font-size: 18px;
            cursor: pointer;
            opacity: 0;
            animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        [data-theme="ramc"] .has-content::after:hover {
            color: var(--accent);
        }
        
        /* Body lock when sidebar is open */
        body.sidebar-open {
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
        }
        
        /* Loading animation improvements */
        [data-theme="ramc"] .loading-spinner {
            margin: 0 auto;
            border-color: rgba(14, 165, 233, 0.3);
            border-top-color: var(--primary);
        }
        
        /* Improved focus indicators */
        [data-theme="ramc"] *:focus-visible {
            outline: 3px solid var(--accent) !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 1px white, 0 0 0 4px var(--accent) !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
})();
