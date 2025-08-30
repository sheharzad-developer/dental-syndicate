/**
 * SEO and Performance Optimization Script
 * Behzad Dental Clinic
 */

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            // Log Core Web Vitals
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            console.log('DOM Content Loaded:', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
        }
    }
});

performanceObserver.observe({ entryTypes: ['navigation'] });

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// SEO-friendly URL handling
function updateURL(title, url) {
    if (history.pushState) {
        history.pushState({}, title, url);
        document.title = title;
    }
}

// Track user engagement
let startTime = Date.now();
let maxScrollDepth = 0;

document.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
    }
});

window.addEventListener('beforeunload', function() {
    const timeOnPage = Date.now() - startTime;
    
    // Send analytics data
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_engagement', {
            'time_on_page': timeOnPage,
            'scroll_depth': maxScrollDepth,
            'page_title': document.title
        });
    }
});

// Schema.org data enhancement
function enhanceSchemaData() {
    // Add dynamic schema data based on page content
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": document.title,
        "description": document.querySelector('meta[name="description"]')?.content,
        "url": window.location.href,
        "dateModified": new Date().toISOString(),
        "publisher": {
            "@type": "Organization",
            "name": "Behzad Dental Clinic",
            "url": "https://behzaddentalclinic.com"
        }
    };
    
    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

// Call schema enhancement
enhanceSchemaData();

// Social media tracking
function trackSocialShares() {
    // Facebook share tracking
    if (typeof FB !== 'undefined') {
        FB.Event.subscribe('share', function(response) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'facebook',
                    'content_type': 'page',
                    'item_id': window.location.pathname
                });
            }
        });
    }
    
    // Twitter share tracking
    if (typeof twttr !== 'undefined') {
        twttr.events.bind('tweet', function(event) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'twitter',
                    'content_type': 'page',
                    'item_id': window.location.pathname
                });
            }
        });
    }
}

// Initialize social tracking
trackSocialShares();

// Form tracking for appointments
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': form.getAttribute('id') || 'appointment_form',
                    'page_location': window.location.pathname
                });
            }
        });
    });
});

// Phone number tracking
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'phone_number': this.href.replace('tel:', ''),
                    'page_location': window.location.pathname
                });
            }
        });
    });
});

// Email tracking
document.addEventListener('DOMContentLoaded', function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'email_address': this.href.replace('mailto:', ''),
                    'page_location': window.location.pathname
                });
            }
        });
    });
});

// Location tracking
document.addEventListener('DOMContentLoaded', function() {
    const locationLinks = document.querySelectorAll('a[href*="maps.google.com"], a[href*="google.com/maps"]');
    
    locationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'get_directions', {
                    'page_location': window.location.pathname
                });
            }
        });
    });
});

// Service page tracking
function trackServicePageViews() {
    const serviceKeywords = ['dental-implants', 'orthodontics', 'cosmetic-dentistry', 'general-dentistry'];
    const currentPath = window.location.pathname;
    
    serviceKeywords.forEach(keyword => {
        if (currentPath.includes(keyword)) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_service', {
                    'service_name': keyword.replace('-', ' '),
                    'page_location': currentPath
                });
            }
        }
    });
}

// Call service tracking
trackServicePageViews();

// Error tracking
window.addEventListener('error', function(e) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.message,
            'fatal': false,
            'page_location': window.location.pathname
        });
    }
});

// 404 page tracking
if (document.title.includes('404') || document.title.includes('Not Found')) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': '404 Error Page',
            'page_location': window.location.pathname
        });
    }
}

// Export functions for global use
window.SEOOptimization = {
    updateURL: updateURL,
    enhanceSchemaData: enhanceSchemaData,
    trackSocialShares: trackSocialShares
};
