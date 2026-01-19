// Modern Portfolio JavaScript - Advanced Features
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initAdvancedAnimations();
    initParallaxEffects();
});

// Advanced Navigation with Intersection Observer
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Advanced navbar scroll effect with throttling
    let ticking = false;
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Enhanced mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Smooth scroll with offset calculation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting with Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Advanced Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Different animation types for different elements
    const fadeElements = document.querySelectorAll('.about-text, .contact-form, .contact-description');
    const slideLeftElements = document.querySelectorAll('.skill-card:nth-child(odd)');
    const slideRightElements = document.querySelectorAll('.skill-card:nth-child(even)');
    const scaleElements = document.querySelectorAll('.project-card');
    
    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
    
    slideLeftElements.forEach((element, index) => {
        element.classList.add('slide-in-left');
        element.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(element);
    });
    
    slideRightElements.forEach((element, index) => {
        element.classList.add('slide-in-right');
        element.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(element);
    });
    
    scaleElements.forEach((element, index) => {
        element.classList.add('scale-in');
        element.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(element);
    });
}

// Enhanced Skill Bars with Staggered Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                
                // Staggered animation
                setTimeout(() => {
                    bar.style.width = progress + '%';
                    
                    // Add percentage counter animation
                    const skillCard = bar.closest('.skill-card');
                    const counter = document.createElement('span');
                    counter.className = 'skill-counter';
                    counter.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--gray-600);
                    `;
                    
                    let currentProgress = 0;
                    const targetProgress = parseInt(progress);
                    const increment = targetProgress / 60; // 1 second animation
                    
                    const countAnimation = setInterval(() => {
                        currentProgress += increment;
                        if (currentProgress >= targetProgress) {
                            currentProgress = targetProgress;
                            clearInterval(countAnimation);
                        }
                        counter.textContent = Math.round(currentProgress) + '%';
                    }, 16);
                    
                    skillCard.style.position = 'relative';
                    skillCard.appendChild(counter);
                }, 300);
                
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Advanced Contact Form with Validation
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', validateField);
        input.addEventListener('blur', validateField);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing validation styles
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        if (!value && field.hasAttribute('required')) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return false;
        }
        
        // Valid state
        field.style.borderColor = '#10b981';
        field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        return true;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        
        // Enhanced loading state
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 8px;">
                <span style="width: 16px; height: 16px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                Sending...
            </span>
        `;
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission with realistic delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state with animation
            submitBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span style="color: #10b981;">✓</span>
                    Message Sent!
                </span>
            `;
            submitBtn.style.background = '#10b981';
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form with animation
            form.reset();
            inputs.forEach(input => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            submitBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span style="color: #ef4444;">✗</span>
                    Failed to Send
                </span>
            `;
            submitBtn.style.background = '#ef4444';
            
            showNotification('Failed to send message. Please try again.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// Advanced Animations
function initAdvancedAnimations() {
    // Parallax scroll effect for hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        heroElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
    
    // Magnetic effect for buttons
    const buttons = document.querySelectorAll('.btn, .project-link, .contact-item');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.section-title, .project-image');
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', () => updateParallax(entry.target));
            }
        });
    });
    
    function updateParallax(element) {
        const rect = element.getBoundingClientRect();
        const speed = 0.5;
        const yPos = -(rect.top * speed);
        element.style.transform = `translateY(${yPos}px)`;
    }
    
    parallaxElements.forEach(element => parallaxObserver.observe(element));
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        transform: translateX(400px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">${type === 'success' ? '✓' : '✗'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Auto remove with animation
    setTimeout(() => {
        notification.style.transform = 'translateX(400px) scale(0.8)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Console Message with ASCII Art
console.log(`
%c
██████╗ ██╗██╗   ██╗ █████╗ 
██╔══██╗██║╚██╗ ██╔╝██╔══██╗
██████╔╝██║ ╚████╔╝ ███████║
██╔══██╗██║  ╚██╔╝  ██╔══██║
██║  ██║██║   ██║   ██║  ██║
╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝

%cAdvanced Portfolio Loaded Successfully!
%cBCA Student | Developer | Tech Enthusiast
%criyakushwaha245@gmail.com
`, 
'color: #000; font-family: monospace; font-size: 12px;',
'color: #000; font-size: 16px; font-weight: bold;',
'color: #666; font-size: 14px;',
'color: #666; font-size: 14px;'
);
