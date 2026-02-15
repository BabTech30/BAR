/* ════════════════════════════════════════════════════════════
   LE TERRIER — SHARED SCRIPTS
   ════════════════════════════════════════════════════════════ */

/* ── Atmosphere Canvas ── */
(function(){
  const c = document.getElementById('atmosphere');
  if (!c) return;
  const x = c.getContext('2d');
  let w, h, particles = [];
  const N = 35;

  function resize() { w = c.width = innerWidth; h = c.height = innerHeight; }
  function init() {
    particles = [];
    for (let i = 0; i < N; i++) particles.push({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + .3,
      vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .1,
      a: Math.random() * .15 + .02,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * .005 + .002
    });
  }
  function draw() {
    x.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += p.speed;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      const alpha = p.a * (0.5 + 0.5 * Math.sin(p.pulse));
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fillStyle = `rgba(200,164,92,${alpha})`; x.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  addEventListener('resize', () => { resize(); init(); });
  setTimeout(() => c.classList.add('loaded'), 200);
})();

/* ── Navigation ── */
(function(){
  const nav = document.getElementById('nav');
  const fl = document.getElementById('floatCta');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (!nav) return;

  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = scrollY;
        nav.classList.toggle('stuck', y > 80);
        if (fl) fl.classList.toggle('show', y > 400);
        ticking = false;
      });
      ticking = true;
    }
  });

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('open');
    });
  }
})();

/* ── Reveal on Scroll ── */
(function(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('[data-r]').forEach(el => io.observe(el));
})();

/* ── Smooth Scroll (anchor links) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    if (burger) burger.classList.remove('active');
    if (menu) menu.classList.remove('open');
  });
});

/* ── Announcement Banner ── */
(function(){
  const ann = document.getElementById('announcement');
  const close = document.getElementById('annClose');
  if (!ann || !close) return;

  // Check if previously dismissed (session only)
  if (sessionStorage.getItem('ann-closed')) {
    ann.classList.add('hidden');
    document.body.classList.remove('has-announcement');
    return;
  }

  document.body.classList.add('has-announcement');
  close.addEventListener('click', () => {
    ann.classList.add('hidden');
    document.body.classList.remove('has-announcement');
    sessionStorage.setItem('ann-closed', '1');
  });
})();
