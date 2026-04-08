/* ===================================
   REPARIFY – scripts.js
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. HAMBURGER MENU (mobile)
     ============================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navActions.classList.toggle('open');

    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on nav-link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navActions.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });


  /* =============================================
     2. SCROLL REVEAL (Intersection Observer)
     ============================================= */
  const revealTargets = document.querySelectorAll(
    '.step-card, .testimonial-card, .cta-card, .stat, .trust-item'
  );

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


  /* =============================================
     3. TESTIMONIALS SLIDER
     ============================================= */
  const track  = document.getElementById('testimonialsTrack');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 4; // show all on desktop — pagination is decorative
  }

  function goToSlide(index) {
    const cards = track.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0].offsetWidth + 20; // gap = 20px
    const maxOffset = Math.max(0, cards.length - cardsPerView);
    index = Math.max(0, Math.min(index, maxOffset));
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(dot.dataset.index));
      startAutoSlide();
    });
  });

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      const cards     = track.querySelectorAll('.testimonial-card');
      const maxOffset = Math.max(0, cards.length - cardsPerView);
      const next = currentSlide >= maxOffset ? 0 : currentSlide + 1;
      goToSlide(next);
    }, 4000);
  }

  // Touch / swipe support
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

  // Re-calculate on resize
  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    goToSlide(0);
  });

  startAutoSlide();


  /* =============================================
     4. NAVBAR: hide/show on scroll
     ============================================= */
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = currentScrollY;
    navbar.style.transition = 'transform 0.3s ease';
  });


  /* =============================================
     5. ACTIVE NAV LINK on scroll
     ============================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if (sections.length && navLinkEls.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinkEls.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(s => sectionObserver.observe(s));
  }


  /* =============================================
     6. PARALLAX: hero decorations on scroll
     ============================================= */
  const heroDeco = document.querySelector('.hero-deco');
  const decoSquare = document.querySelector('.deco-square-yellow');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroDeco)   heroDeco.style.transform   = `translateY(${sy * 0.25}px) rotate(${sy * 0.05}deg)`;
    if (decoSquare) decoSquare.style.transform = `translateY(${sy * -0.15}px) rotate(${sy * 0.03}deg)`;
  }, { passive: true });


  /* =============================================
     7. SMOOTH SCROLL for anchor buttons
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* =============================================
     8. BUTTON click feedback (ripple effect)
     ============================================= */
  document.querySelectorAll('.btn-primary, .btn-pink, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
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

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

});