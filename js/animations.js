/* ============================================================
   YASH RAJ MOTION PICTURE — Scroll & Parallax Animations JS
   ============================================================ */

(function () {
  'use strict';

  // ---- PARALLAX on Hero ----
  const heroSlides = document.querySelectorAll('.hero-slide');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroSlides.forEach(slide => {
      slide.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
  });

  // ---- ADD REVEAL CLASSES dynamically on scroll ----
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle custom card animations
        entry.target.querySelectorAll('.service-card, .portfolio-item, .team-card, .package-card, .gallery-item').forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(sec => sectionObserver.observe(sec));

  // ---- Handle generic reveal animations (.reveal-left, .reveal-right, .reveal-up, .reveal-scale) ----
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Optional: stop observing once revealed
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animate cards on page load ----
  const animatableCards = document.querySelectorAll('.service-card, .portfolio-item, .team-card, .package-card, .gallery-item');
  animatableCards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // ---- NAVBAR link active state on scroll ----
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionsWithId = document.querySelectorAll('section[id]');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sectionsWithId.forEach(sec => scrollObserver.observe(sec));

  // ---- Image lazy loading ----
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    lazyImages.forEach(img => { img.src = img.dataset.src; });
  }

  // ---- 3D Tilt and Spotlight Glow for ALL Cards ----
  const tiltCards = document.querySelectorAll('.service-card, .team-card, .portfolio-item, .gallery-item, .vibe-card, .location-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Calculate 3D tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
      const tiltY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset tilt and spotlight
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease'; // Remove transition for smooth tracking
    });
  });

})();
