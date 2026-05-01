// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.nav-bar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
            navbar.style.padding = '12px 60px';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '18px 60px';
        }

        lastScroll = currentScroll;
    });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offsetTop = targetEl.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ACTIVE NAV LINK TRACKING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-bar ul li a');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll(
        '.card, .work-item, .testimonial-card, .contact-content, .contact-form, ' +
        '.feature-content, .ourwork-header, .social-header, .footer-grid'
    );

    // Set initial hidden state
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for sibling elements
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add stagger delays for grouped elements
    document.querySelectorAll('.card').forEach((card, i) => {
        card.dataset.delay = i * 100;
    });
    document.querySelectorAll('.work-item').forEach((item, i) => {
        item.dataset.delay = i * 80;
    });
    document.querySelectorAll('.testimonial-card').forEach((card, i) => {
        card.dataset.delay = i * 120;
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== STAT COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-num');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;

        statNumbers.forEach(stat => {
            const textContent = stat.textContent;
            const suffix = stat.querySelector('span')?.textContent || '';
            const target = parseInt(textContent);

            if (isNaN(target)) return;

            let current = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.innerHTML = `${Math.floor(current)}<span>${suffix}</span>`;
            }, stepTime);
        });

        statsCounted = true;
    }

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service-select').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                shakeButton(submitBtn);
                return;
            }

            // Simulate sending
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.textContent = '✓ Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
                submitBtn.style.opacity = '1';

                // Reset after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2500);
            }, 1500);
        });
    }

    function shakeButton(btn) {
        btn.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
    }

    // ===== MOBILE MENU TOGGLE =====
    // Create hamburger button dynamically for mobile
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = `
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    `;
    navbar.appendChild(hamburger);

    const navMenu = document.querySelector('.nav-bar ul');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('mobile-open');

        // Animate bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bars[0].style.transform = '';
            bars[1].style.opacity = '1';
            bars[2].style.transform = '';
        }
    });

    // Close menu on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('mobile-open');
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.opacity = '1';
            bars[2].style.transform = '';
        });
    });

    // ===== PARALLAX HERO IMAGE =====
    const heroImage = document.querySelector('.hero .image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < 800) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 - scrolled * 0.0003})`;
            }
        });
    }

    // ===== TILT EFFECT ON WORK ITEMS =====
    document.querySelectorAll('.work-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ===== TYPING EFFECT ON HERO (optional subtle cursor) =====
    const heroH1 = document.querySelector('.hero .text h1');
    if (heroH1) {
        heroH1.style.borderRight = '3px solid #e63946';
        heroH1.style.animation = 'blink-caret 0.8s step-end infinite';

        setTimeout(() => {
            heroH1.style.borderRight = 'none';
            heroH1.style.animation = '';
        }, 3000);
    }

});

// ===== INJECT KEYFRAME ANIMATIONS =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
    }

    @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: #e63946; }
    }

    .nav-bar ul li a.active {
        color: #e63946;
    }

    .nav-bar ul li a.active::after {
        transform: scaleX(1);
    }

    /* Hamburger */
    .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        z-index: 1001;
    }

    .hamburger .bar {
        display: block;
        width: 24px;
        height: 2.5px;
        background: #1a1a2e;
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        .nav-bar ul {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(20px);
            padding: 20px;
            gap: 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .nav-bar ul.mobile-open {
            display: flex;
        }

        .nav-bar ul li a {
            padding: 14px 20px;
            display: block;
        }
    }
`;
document.head.appendChild(styleSheet);
