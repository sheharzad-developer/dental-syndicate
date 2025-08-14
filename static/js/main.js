// Main JavaScript file for Dental Syndicate website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        // Toggle mobile menu
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submissions
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAppointmentSubmission(this);
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }
    
    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    });
    
    // Scroll animations
    observeElements();
});

function handleAppointmentSubmission(form) {
    const formData = new FormData(form);
    
    // Show loading message
    showNotification('Booking your appointment...', 'info');
    
    // Disable submit button to prevent multiple submissions
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';
    
    // Send data to Flask backend
    fetch('/appointment', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            form.reset();
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred while booking your appointment. Please try again.', 'error');
    })
    .finally(() => {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

function handleContactSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Contact form data:', data);
    
    // Show success message
    showNotification('Message sent successfully! We will get back to you as soon as possible.', 'success');
    
    // Reset form
    form.reset();
}

function handleNewsletterSubmission(form) {
    const formData = new FormData(form);
    const email = formData.get('email') || formData.get('newsletter-email');
    
    // Simulate newsletter subscription
    console.log('Newsletter subscription:', email);
    
    // Show success message
    showNotification('Successfully subscribed to our newsletter!', 'success');
    
    // Reset form
    form.reset();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function observeElements() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.stat-card, .service-card, .featured-doctor-card, .secondary-doctor-card, .quick-actions-card, .testimonial-card, .hero-stats, .floating-card, .achievement-card, .facility-card, .mission-card, .vision-card, .value-card, .service-overview-card, .about-cta-content, .doctor-profile-card, .team-card, .excellence-card, .consultation-content, .hero-stat-item, .review-card, .google-rating-summary, .reviews-cta-content, .google-rating-compact, .featured-review-compact, .about-reviews-cta');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add special observer for statistics with counter animation
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    const progressBar = entry.target.querySelector('.progress-bar');
                    
                    if (statNumber && statNumber.dataset.target) {
                        animateCounter(statNumber, parseInt(statNumber.dataset.target));
                    }
                    
                    if (progressBar && progressBar.dataset.width) {
                        animateProgressBar(progressBar, progressBar.dataset.width);
                    }
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statCards.forEach(card => statsObserver.observe(card));
    }
}

// Date input minimum date (today)
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Add real-time validation to forms
document.addEventListener('DOMContentLoaded', function() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('error');
                showFieldError(this, 'Please enter a valid email address');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
    
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.classList.add('error');
                showFieldError(this, 'Please enter a valid phone number');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
});

// ===== ADVANCED ENHANCEMENTS =====

// Advanced 3D Mouse Tracking
function init3DMouseTracking() {
    const cards = document.querySelectorAll('.service-card, .stat-card, .review-card, .featured-doctor-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Advanced Scroll Effects
function initAdvancedScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add entrance animation based on element type
                if (element.classList.contains('service-card')) {
                    element.style.animation = 'slideInFromBottom 0.8s ease-out forwards';
                } else if (element.classList.contains('stat-card')) {
                    element.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
                } else if (element.classList.contains('review-card')) {
                    element.style.animation = 'slideInFromRight 0.8s ease-out forwards';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.service-card, .stat-card, .review-card, .featured-doctor-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Enhanced Loading States
function initLoadingStates() {
    // Add loading shimmer to cards during page load
    const cards = document.querySelectorAll('.service-card, .stat-card, .review-card');
    
    cards.forEach((card, index) => {
        card.classList.add('loading-shimmer');
        
        setTimeout(() => {
            card.classList.remove('loading-shimmer');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 500);
    });
}

// Advanced Form Interactions
function initAdvancedFormInteractions() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add floating label effect
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-20px) scale(0.8)';
                label.style.color = '#1fd8d8';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = '#b8d4d6';
                }
            });
        }
        
        // Add character counter for textareas
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'font-size: 0.8rem; color: #b8d4d6; text-align: right; margin-top: 0.5rem;';
            input.parentNode.appendChild(counter);
            
            input.addEventListener('input', () => {
                const remaining = input.maxLength - input.value.length;
                counter.textContent = `${remaining} characters remaining`;
                
                if (remaining < 50) {
                    counter.style.color = '#ff6b6b';
                } else {
                    counter.style.color = '#b8d4d6';
                }
            });
        }
    });
}

// Particle System Enhancement
function initParticleSystem() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create dynamic particles
    for (let i = 0; i < 20; i++) {
        createParticle(heroSection);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(31, 216, 216, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 15s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 15}s;
    `;
    
    container.appendChild(particle);
}

// Advanced Card Interactions
function initAdvancedCardInteractions() {
    const cards = document.querySelectorAll('.service-card, .stat-card, .review-card');
    
    cards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(31, 216, 216, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${e.clientX - card.offsetLeft}px;
                top: ${e.clientY - card.offsetTop}px;
                width: 20px;
                height: 20px;
            `;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Update scroll-based animations
            updateScrollAnimations();
        }, 16); // ~60fps
    });
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
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
}

function updateScrollAnimations() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .hero-visual');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Add CSS for new animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .dynamic-particle {
            z-index: 1;
        }
        
        .ripple-effect {
            z-index: 10;
        }
        
        .char-counter {
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    
    field.parentNode.appendChild(error);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Animated Counter Function
function animateCounter(element, target) {
    let current = 0;
    
    // Faster animation for smaller numbers (like years experience)
    const duration = target <= 50 ? 800 : 2000; // 0.8s for small numbers, 2s for large
    const increment = target / (duration / 20); // Smooth 20ms intervals
    
    // Check if original content has special symbols
    const originalText = element.dataset.originalText || element.textContent;
    const hasPlus = originalText.includes('+');
    const hasPercent = originalText.includes('%');
    const hasStar = originalText.includes('★');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(current).toString();
        if (hasPlus) displayText += '+';
        if (hasPercent) displayText += '%';
        if (hasStar) displayText += '★';
        
        element.textContent = displayText;
    }, 20);
}

// Progress Bar Animation Function
function animateProgressBar(element, targetWidth) {
    element.style.width = '0%';
    element.style.transition = 'width 2s ease-out';
    
    // Small delay to ensure the transition works
    setTimeout(() => {
        element.style.width = targetWidth;
    }, 100);
}

// Animate rating number (for Google Reviews)
function animateRating(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1);
    }, 20);
}

// Enhanced Hero Stats Animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const heroStats = document.querySelectorAll('.hero-stat .stat-number');
        heroStats.forEach((stat, index) => {
            const originalText = stat.textContent;
            // Extract numeric value from text (handles cases like "5★", "100+", etc.)
            const numericMatch = originalText.match(/\d+/);
            const target = numericMatch ? parseInt(numericMatch[0]) : null;
            
            if (target !== null && !isNaN(target)) {
                stat.textContent = '0';
                setTimeout(() => {
                    // Store original text for symbol preservation
                    stat.dataset.originalText = originalText;
                    animateCounter(stat, target);
                }, index * 200);
            }
        });
    }, 2500); // Start after hero animations
    
    // Advanced 3D Mouse Tracking
    init3DMouseTracking();
    
    // Advanced Scroll Effects
    initAdvancedScrollEffects();
    
    // Enhanced Loading States
    initLoadingStates();
    
    // Advanced Form Interactions
    initAdvancedFormInteractions();
    
    // Particle System Enhancement
    initParticleSystem();
    
    // Advanced Card Interactions
    initAdvancedCardInteractions();
    
    // Performance Optimizations
    initPerformanceOptimizations();
});
    
    // About Page Hero Title Animation
    const aboutTitleLines = document.querySelectorAll('.about-hero-title .title-line');
    if (aboutTitleLines.length > 0) {
        aboutTitleLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(50px)';
            setTimeout(() => {
                line.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 500 + (index * 300));
        });
    }
    
    // About Page Achievement Cards Animation
    const achievementCards = document.querySelectorAll('.about-hero-achievements .achievement-card');
    if (achievementCards.length > 0) {
        achievementCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1500 + (index * 200));
        });
    }
    
    // Value Cards Entrance Animation
    const valueCards = document.querySelectorAll('.value-card');
    if (valueCards.length > 0) {
        const valueObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    valueObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        valueCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            valueObserver.observe(card);
        });
    }
    
    // Doctors Page Hero Title Animation
    const doctorsTitleLines = document.querySelectorAll('.doctors-hero-title .title-line');
    if (doctorsTitleLines.length > 0) {
        doctorsTitleLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(50px)';
            setTimeout(() => {
                line.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 500 + (index * 300));
        });
    }
    
    // Doctors Hero Stats Animation
    const doctorsHeroStats = document.querySelectorAll('.doctors-hero-stats .stat-number');
    if (doctorsHeroStats.length > 0) {
        setTimeout(() => {
            doctorsHeroStats.forEach((stat, index) => {
                const originalText = stat.textContent;
                const target = parseInt(originalText);
                if (!isNaN(target)) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        // Store original text for symbol preservation
                        stat.dataset.originalText = originalText;
                        animateCounter(stat, target);
                    }, index * 300);
                }
            });
        }, 2000);
    }
    
    // Doctor Profile Cards Entrance Animation
    const doctorProfileCards = document.querySelectorAll('.doctor-profile-card');
    if (doctorProfileCards.length > 0) {
        const doctorObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 300);
                    doctorObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        doctorProfileCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.95)';
            card.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            doctorObserver.observe(card);
        });
    }
    
    // Specialty Tags Interactive Effects
    const specialtyTags = document.querySelectorAll('.specialty-tag');
    specialtyTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
            tag.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
            tag.style.boxShadow = 'none';
        });
    });
    
    // Excellence Cards Entrance Animation
    const excellenceCards = document.querySelectorAll('.excellence-card');
    if (excellenceCards.length > 0) {
        const excellenceObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    excellenceObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        excellenceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            excellenceObserver.observe(card);
        });
    }
    
    // Google Reviews Rating Animation
    const ratingNumber = document.querySelector('.rating-number');
    if (ratingNumber) {
        const ratingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.textContent);
                    entry.target.textContent = '0.0';
                    setTimeout(() => {
                        animateRating(entry.target, target);
                    }, 500);
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        ratingObserver.observe(ratingNumber);
    }
    
    // Review Cards Entrance Animation
    const reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length > 0) {
        const reviewObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                    reviewObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        reviewCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            reviewObserver.observe(card);
        });
    }
    
    // Google Icon Hover Effects
    const googleIcon = document.querySelector('.google-icon');
    if (googleIcon) {
        googleIcon.addEventListener('mouseenter', () => {
            googleIcon.style.transform = 'scale(1.1) rotateY(360deg)';
            googleIcon.style.boxShadow = '0 15px 40px rgba(66, 133, 244, 0.5)';
        });
        
        googleIcon.addEventListener('mouseleave', () => {
            googleIcon.style.transform = 'scale(1) rotateY(0deg)';
            googleIcon.style.boxShadow = '0 10px 30px rgba(66, 133, 244, 0.3)';
        });
    }
    
    // Review Cards Interactive Effects
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const avatar = card.querySelector('.reviewer-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotateY(360deg)';
                avatar.style.boxShadow = '0 15px 40px rgba(31, 216, 216, 0.5)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const avatar = card.querySelector('.reviewer-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotateY(0deg)';
                avatar.style.boxShadow = '0 10px 30px rgba(31, 216, 216, 0.3)';
            }
        });
    });
