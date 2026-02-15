/* ============================================================
   LE TERRIER — Shared JavaScript
   Lightweight, vanilla, performant
   ============================================================ */

(function () {
  'use strict';

  /* --- ANNOUNCEMENT BANNER --- */
  const announce = document.querySelector('.announce');
  if (announce) {
    if (sessionStorage.getItem('lt-announce-closed')) {
      announce.classList.add('hidden');
      document.body.classList.remove('has-announce');
    } else {
      document.body.classList.add('has-announce');
      const closeBtn = announce.querySelector('.announce__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          announce.classList.add('hidden');
          document.body.classList.remove('has-announce');
          sessionStorage.setItem('lt-announce-closed', '1');
        });
      }
    }
  }

  /* --- STICKY HEADER --- */
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    const onScroll = function () {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- BURGER MENU --- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- FLOATING CTA --- */
  const floatCta = document.querySelector('.float-cta');
  if (floatCta) {
    window.addEventListener('scroll', function () {
      floatCta.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* --- SCROLL REVEAL --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show all
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- MENU NAV SCROLL HIGHLIGHT (carte page) --- */
  const menuNav = document.querySelector('.menu-nav');
  if (menuNav) {
    const links = menuNav.querySelectorAll('.menu-nav__link');
    const sections = [];
    links.forEach(function (link) {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        const section = document.querySelector(id);
        if (section) sections.push({ link: link, section: section });
      }
    });
    if (sections.length) {
      const headerOffset = 120;
      window.addEventListener('scroll', function () {
        const y = window.scrollY + headerOffset;
        let current = sections[0];
        sections.forEach(function (s) {
          if (s.section.offsetTop <= y) current = s;
        });
        links.forEach(function (l) { l.classList.remove('active'); });
        if (current) current.link.classList.add('active');
      }, { passive: true });
    }
  }

  /* --- FAQ ACCORDION --- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq__item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq__item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- LIGHTBOX (gallery) --- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCap = lightbox.querySelector('.lightbox__cap');
    const lbClose = lightbox.querySelector('.lightbox__close');

    document.querySelectorAll('.gallery-item[data-src]').forEach(function (item) {
      item.addEventListener('click', function () {
        const src = item.getAttribute('data-src');
        const cap = item.getAttribute('data-caption') || '';
        if (lbImg) lbImg.src = src;
        if (lbCap) lbCap.textContent = cap;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lbImg) lbImg.src = '';
    }
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* --- CONTACT FORM (demo) --- */
  const form = document.querySelector('.form[data-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // In production: replace with Formspree/Netlify endpoint
      form.style.display = 'none';
      var success = document.querySelector('.form__success');
      if (success) success.classList.add('visible');
    });
  }

  /* --- SMOOTH ANCHOR SCROLL --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.menu-nav') ? 120 : 70;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- ATMOSPHERE CANVAS (subtle golden particles) --- */
  const canvas = document.getElementById('atmosphere');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 25;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.1,
        a: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }

    var raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var t = Date.now() * 0.001;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(t + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,164,92,' + alpha + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    // Pause when not visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        draw();
      }
    });
  }

})();
