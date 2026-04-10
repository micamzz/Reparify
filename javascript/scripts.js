/* ============================================================
   REPARIFY – scripts.js
   Funcionalidades exclusivas del index.html.
   NO manejes aquí el navbar ni el hamburger (están en header.js).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------
       1. SCROLL REVEAL
       Anima las cards cuando entran al viewport.
    -------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.step-card, .testimonial-card, .cta-card, .stat, .trust-item'
    );

    if (revealTargets.length > 0) {
        revealTargets.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach(el => revealObserver.observe(el));
    }


    /* --------------------------------------------------
       2. SLIDER DE TESTIMONIOS
       Solo se inicializa si el slider existe en la página.
    -------------------------------------------------- */
    const track = document.getElementById('testimonialsTrack');
    const dots  = document.querySelectorAll('.dot');

    if (track && dots.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 900) return 2;
            return 4;
        }

        function goToSlide(index) {
            const cards = track.querySelectorAll('.testimonial-card');
            if (cards.length === 0) return;

            const cardWidth = cards[0].offsetWidth + 20;
            const maxOffset = Math.max(0, cards.length - cardsPerView);
            index = Math.max(0, Math.min(index, maxOffset));
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        function startAutoSlide() {
            slideInterval = setInterval(() => {
                const cards     = track.querySelectorAll('.testimonial-card');
                const maxOffset = Math.max(0, cards.length - cardsPerView);
                const next = currentSlide >= maxOffset ? 0 : currentSlide + 1;
                goToSlide(next);
            }, 4000);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(parseInt(dot.dataset.index));
                startAutoSlide();
            });
        });

        /* Swipe táctil */
        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            clearInterval(slideInterval);
        }, { passive: true });

        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                const cards     = track.querySelectorAll('.testimonial-card');
                const maxOffset = Math.max(0, cards.length - cardsPerView);
                if (diff > 0) goToSlide(Math.min(currentSlide + 1, maxOffset));
                else          goToSlide(Math.max(currentSlide - 1, 0));
            }
            startAutoSlide();
        }, { passive: true });

        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            goToSlide(0);
        });

        startAutoSlide();
    }


    /* --------------------------------------------------
       3. NAVBAR HIDE/SHOW EN SCROLL
       Oculta el navbar al bajar, lo muestra al subir.
       Cierra el menú móvil antes de ocultar el navbar.
    -------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease';

        window.addEventListener('scroll', () => {
            const navLinks = document.querySelector('.nav-links');
            /* No ocultar el navbar si el menú móvil está abierto */
            if (navLinks && navLinks.classList.contains('mobile-open')) return;

            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }


    /* --------------------------------------------------
       4. SMOOTH SCROLL
       Scroll suave para links internos tipo href="#seccion".
    -------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* --------------------------------------------------
       5. RIPPLE EFFECT EN BOTONES
       Efecto de onda al hacer click en los botones principales.
    -------------------------------------------------- */
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(rippleStyle);

    document.querySelectorAll('.btn-primary, .btn-pink, .btn-outline').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255,255,255,0.35);
                top: ${e.clientY - rect.top - size / 2}px;
                left: ${e.clientX - rect.left - size / 2}px;
                transform: scale(0);
                animation: ripple 0.55s ease-out forwards;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

});