// JS robusto y eficiente
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  // Toggle menú móvil
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

  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Disparar animaciones de entrada
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Pausar video cuando el hero no está visible (ahorra batería)
  const video = document.querySelector('.bg-video');
  if (video && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    }, { threshold: 0.05 });
    io.observe(video);
  }

  // ==== Conteo animado de KPIs (ligero) ====
  function animateKPIs(){
    const items = document.querySelectorAll('.kpi .num');
    items.forEach(el=>{
      if (el.dataset.done) return;
      const target = parseFloat(el.dataset.target || '0');
      const suffix = el.dataset.suffix || '';  // "M", etc.
      const prefix = el.dataset.prefix || '+'; // muestra + por defecto
      const dur = 900; // ms
      const start = performance.now();

      const format = (v) => {
        if (suffix === 'M') return `${prefix}${Math.round(v)}M`;
        return `${prefix}${Math.round(v)}`;
      };

      function frame(t){
        const p = Math.min(1, (t - start) / dur);
        const value = p * target;
        el.textContent = format(value);
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
