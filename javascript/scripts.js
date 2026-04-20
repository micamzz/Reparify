
document.addEventListener('DOMContentLoaded', () => {

    /* 
       1. SCROLL REVEAL
       Anima las cards cuando entran al viewport.*/
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

    /*
       2. SLIDER DE TESTIMONIOS
       Solo se inicializa si el slider existe en la página.*/
    const track = document.getElementById('testimonialsTrack');
    const sliderEl = document.getElementById('testimonialsSlider');
    const sliderDotsContainer = document.getElementById('sliderDots');

    if (track) {
        let currentSlide = 0;
        let slideInterval;
        let cardsPerView = getCardsPerView();

        // Generar dots automáticamente según cantidad de cards
        const allCards = track.querySelectorAll('.testimonial-card');
        sliderDotsContainer.innerHTML = '';
        allCards.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'dot' + (i === 0 ? ' active' : '');
            btn.dataset.index = i;
            sliderDotsContainer.appendChild(btn);
        });

        function getCardsPerView() {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 900) return 2;
            return 2; // Desktop: mostrar 2 cards → slider funcional
        }

        function goToSlide(index) {
            const cards = track.querySelectorAll('.testimonial-card');
            if (cards.length === 0) return;

            const sliderWidth = sliderEl.offsetWidth;
            const gap = 20;
            const cardWidth = (sliderWidth - gap * (cardsPerView - 1)) / cardsPerView + gap;
            const maxOffset = Math.max(0, cards.length - cardsPerView);
            index = Math.max(0, Math.min(index, maxOffset));
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
            document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        function startAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                const cards = track.querySelectorAll('.testimonial-card');
                const maxOffset = Math.max(0, cards.length - cardsPerView);
                const next = currentSlide >= maxOffset ? 0 : currentSlide + 1;
                goToSlide(next);
            }, 3000);
        }

        sliderDotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.dot');
            if (!dot) return;
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.index));
            startAutoSlide();
        });

        /* Pausar al hacer hover */
        if (sliderEl) {
            sliderEl.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderEl.addEventListener('mouseleave', () => startAutoSlide());
        }

        /* Swipe táctil */
        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            clearInterval(slideInterval);
        }, { passive: true });

        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                const cards = track.querySelectorAll('.testimonial-card');
                const maxOffset = Math.max(0, cards.length - cardsPerView);
                if (diff > 0) goToSlide(Math.min(currentSlide + 1, maxOffset));
                else goToSlide(Math.max(currentSlide - 1, 0));
            }
            startAutoSlide();
        }, { passive: true });

        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            goToSlide(0);
        });

        goToSlide(0);
        startAutoSlide();
    }



    /* 
     RIPPLE EFFECT EN BOTONES
       Efecto de onda al hacer click en los botones principales.
     */
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(rippleStyle);

    document.querySelectorAll('.btn-primary, .btn-pink, .btn-outline').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

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