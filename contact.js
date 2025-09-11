// Contact page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formData);
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // Show success message function
    function showSuccessMessage() {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h2 style="font-family: 'Shadows Into Light', cursive; color: var(--text-dark); margin-bottom: 1rem;">Message Sent!</h2>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;">Thank you for contacting us. We'll get back to you within 24 hours.</p>
            <button onclick="this.parentElement.remove()" style="padding: 10px 30px; background: var(--primary-color); color: white; border: none; border-radius: 20px; cursor: pointer; font-family: 'Kalam', cursive; font-weight: 600;">OK</button>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Animate form elements on scroll
    const formGroups = document.querySelectorAll('.form-group');
    const infoCards = document.querySelectorAll('.info-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                }, 100);
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    formGroups.forEach(group => {
        fadeInObserver.observe(group);
    });

    infoCards.forEach(card => {
        fadeInObserver.observe(card);
    });

    // FAQ link handler
    const faqLink = document.querySelector('.faq-link');
    if (faqLink) {
        faqLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('FAQ page would open here in a real application.');
        });
    }

    // Add mobile menu toggle styles
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Form field animations
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('label').style.color = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('label').style.color = 'var(--text-dark)';
        });
    });
});