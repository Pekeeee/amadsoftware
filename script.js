(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  // Menú móvil
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      toggle.setAttribute('aria-expanded', String(!open));
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        if (window.innerWidth <= 720) links.style.display = 'none';
      })
    );
  }

  // Año en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animaciones on-load
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Video pausa/play según visibilidad
  const video = document.querySelector('.bg-video');
  if (video && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) video.play().catch(()=>{});
      else video.pause();
    }, { threshold: 0.05 });
    io.observe(video);
  }

  // Conteo animado de KPIs
  function animateKPIs(){
    const items = document.querySelectorAll('.kpi-num');
    items.forEach(el=>{
      if (el.dataset.done) return;
      const target = parseFloat(el.dataset.target || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1000;
      const start = performance.now();
      const format = v => `${prefix}${Math.round(v)}${suffix}`;
      function frame(t){
        const p = Math.min(1, (t - start) / dur);
        el.textContent = format(p * target);
        if (p < 1) requestAnimationFrame(frame);
        else el.dataset.done = '1';
      }
      requestAnimationFrame(frame);
    });
  }
  const kpisEl = document.getElementById('kpis');
  if (kpisEl && 'IntersectionObserver' in window){
    const ioK = new IntersectionObserver(([e])=>{
      if (e && e.isIntersecting){ animateKPIs(); ioK.disconnect(); }
    }, {threshold:.2});
    ioK.observe(kpisEl);
  } else {
    animateKPIs();
  }
})();

// Tilt 3D leve en tarjetas "why"
(() => {
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return;
  const cards = document.querySelectorAll('.why-card[data-tilt]');
  const max = 6;
  cards.forEach(card => {
    const rect = () => card.getBoundingClientRect();
    function move(e){
      const r = rect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2);
      const dy = (e.clientY - cy) / (r.height/2);
      const ry =  (dx * max).toFixed(2);
      const rx =  (-dy * max).toFixed(2);
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
    }
    function leave(){ card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg'); }
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
    card.addEventListener('touchmove', e => { if (!e.touches[0]) return; move(e.touches[0]); }, {passive:true});
    card.addEventListener('touchend', leave);
  });
})();

// ===== Tech Stack — Pirámide de círculos (ruedas) =====
(() => {
  const icons = [
    // Infra / OS / frameworks extra
    'logos:linux-tux',
    'mdi:microsoft-windows',
    'logos:tailwindcss-icon',
    'mdi:dns',
    'logos:lua',
    'mdi:firewall',
    'logos:dotnet',

    // Frontend
    'logos:react','logos:nextjs-icon','logos:vue','logos:angular-icon','logos:svelte-icon',
    'logos:typescript-icon','logos:javascript','logos:html-5','logos:css-3',

    // Backend (evitamos fastapi con texto)
    'logos:nodejs-icon','simple-icons:express','logos:nestjs','logos:python','devicon:fastapi-original',

    'logos:php','logos:laravel',

    // Data / DevOps / Cloud & Tools
    'logos:postgresql','devicon:mysql-original','logos:mongodb-icon','logos:redis',
    'logos:docker-icon','logos:kubernetes','logos:aws','logos:google-cloud','logos:microsoft-azure','logos:nginx',
    'logos:stripe','logos:paypal','logos:github-icon','logos:gitlab','logos:figma','logos:postman-icon',
    'logos:vercel-icon','logos:supabase-icon','logos:firebase'
  ];

  // Pirámide (1, 3, 5, 7, 9) de arriba hacia abajo
  const rows = [
    { sel: '.pyr-row.r1', count: 1 },
    { sel: '.pyr-row.r3', count: 3 },
    { sel: '.pyr-row.r5', count: 5 },
    { sel: '.pyr-row.r7', count: 7 },
    { sel: '.pyr-row.r9', count: 9 }
  ];

  // Construcción con wrapper para centrado óptico
  let idx = 0;
  rows.forEach(({ sel, count }) => {
    const row = document.querySelector(sel);
    if (!row) return;
    row.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const iconName = icons[idx % icons.length];
      idx++;
      const badge = document.createElement('div');
      badge.className = 'badge';

      const wrap = document.createElement('div');
      wrap.className = 'icon-wrap';

      const ic = document.createElement('iconify-icon');
      ic.setAttribute('icon', iconName);

      wrap.appendChild(ic);
      badge.appendChild(wrap);
      row.appendChild(badge);
    }
  });

  // Secuencia: base → cima
  const sequence = [
    { sel: '.pyr-row.r9', delay: 0.00 },
    { sel: '.pyr-row.r7', delay: 1.20 },
    { sel: '.pyr-row.r5', delay: 2.30 },
    { sel: '.pyr-row.r3', delay: 3.20 },
    { sel: '.pyr-row.r1', delay: 3.90 }
  ];

  const stage = document.querySelector('.pyr-stage');
  const startSequence = () => {
    sequence.forEach(({ sel }) => {
      const row = document.querySelector(sel);
      if (row) row.classList.add('in');
    });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { startSequence(); io.disconnect(); }
    }, { threshold: 0.2 });
    if (stage) io.observe(stage);
  } else {
    startSequence();
  }
})();

