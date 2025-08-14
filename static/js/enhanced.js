// Enhanced JavaScript for Behzad Clinic - Advanced Features

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

// Advanced Scroll Effects - DISABLED to prevent unwanted movement
function initAdvancedScrollEffects() {
    // Disabled automatic scroll animations to prevent unwanted movement
    // Elements will remain static during scrolling
    return;
    
    /* Original code commented out:
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
    */
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
    // Disabled scroll event listener to prevent unwanted movement
    // let scrollTimeout;
    // window.addEventListener('scroll', () => {
    //     if (scrollTimeout) {
    //         clearTimeout(scrollTimeout);
    //     }
    //     
    //     scrollTimeout = setTimeout(() => {
    //         // Update scroll-based animations
    //         updateScrollAnimations();
    //     }, 16); // ~60fps
    // });
    
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

// function updateScrollAnimations() {
//     const scrolled = window.pageYOffset;
//     const parallaxElements = document.querySelectorAll('.hero-visual');
    
//     parallaxElements.forEach(element => {
//         const speed = 0.5;
//         const yPos = -(scrolled * speed);
//         element.style.transform = `translateY(${yPos}px)`;
//     });
// }

// Advanced Typing Effect
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #1fd8d8';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                element.style.borderRight = 'none';
            }
        };
        
        // Start typing when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Advanced Cursor Effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(31, 216, 216, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: rgba(31, 216, 216, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(cursorTrail);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        setTimeout(() => {
            cursorTrail.style.left = e.clientX - 5 + 'px';
            cursorTrail.style.top = e.clientY - 5 + 'px';
        }, 100);
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .stat-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(31, 216, 216, 1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(31, 216, 216, 0.8)';
        });
    });
}

// Advanced Audio Effects
function initAudioEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playHoverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Add hover sound to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
    });
}

// Smooth Scrolling Implementation
function initSmoothScrolling() {
    // Add smooth scrolling for all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add smooth scrolling for mouse wheel
    let isScrolling = false;
    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 50);
        }
    }, { passive: true });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for new animations
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
        
        .typing-effect {
            overflow: hidden;
            white-space: nowrap;
        }
        
        .custom-cursor {
            will-change: transform;
        }
        
        .cursor-trail {
            will-change: transform;
        }
        
        @media (max-width: 768px) {
            .custom-cursor, .cursor-trail {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize all enhanced features
    initSmoothScrolling();
    init3DMouseTracking();
    initAdvancedScrollEffects();
    initLoadingStates();
    initAdvancedFormInteractions();
    initParticleSystem();
    initAdvancedCardInteractions();
    initPerformanceOptimizations();
    initTypingEffect();
    initCursorEffects();
    
    // Initialize audio effects only if user has interacted
    document.addEventListener('click', function initAudio() {
        initAudioEffects();
        document.removeEventListener('click', initAudio);
    }, { once: true });
});

