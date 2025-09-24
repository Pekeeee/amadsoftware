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

// ===== Tech Stack — Marquee continuo (íconos solos, loop suave) =====
(() => {
  const icons = [
    // Infra / OS / extras
    'logos:linux-tux','mdi:microsoft-windows','logos:tailwindcss-icon','mdi:dns','logos:lua','mdi:firewall','logos:dotnet',
    // Frontend
    'logos:react','logos:nextjs-icon','logos:vue','logos:angular-icon','logos:svelte-icon',
    'logos:typescript-icon','logos:javascript','logos:html-5','logos:css-3',
    // Backend
    'logos:nodejs-icon','simple-icons:express','logos:nestjs','logos:python','devicon:fastapi',
    'logos:php','logos:laravel',
    // Data / DevOps / Cloud & Tools
    'logos:postgresql','devicon:mysql','logos:mongodb-icon','logos:redis',
    'logos:docker-icon','logos:kubernetes','logos:aws','logos:google-cloud','logos:microsoft-azure','logos:nginx',
    'logos:stripe','logos:paypal','logos:github-icon','logos:gitlab','logos:figma','logos:postman-icon',
    'logos:vercel-icon','logos:supabase-icon','logos:firebase'
  ];

  const strip = document.getElementById('tsStrip');
  if (!strip) return;

  function buildPass(){
    const frag = document.createDocumentFragment();
    icons.forEach(name=>{
      const item = document.createElement('span');
      item.className = 'ts-icon';
      const ic = document.createElement('iconify-icon');
      ic.setAttribute('icon', name);
      item.appendChild(ic);
      frag.appendChild(item);
    });
    return frag;
  }

  function build(){
    strip.innerHTML = '';
    // 3 copias para animar hasta 1/3 del total sin “brinco”
    strip.appendChild(buildPass());
    strip.appendChild(buildPass());
    strip.appendChild(buildPass());

    // Velocidad constante (px/seg) basada en UNA pasada
    requestAnimationFrame(()=> {
      const totalWidth = strip.scrollWidth;   // ancho de 3 pasadas
      const passWidth  = totalWidth / 3;      // una pasada real
      const pxPerSec   = 130;                 // ajusta la velocidad global
      const dur        = Math.max(18, Math.round(passWidth / pxPerSec));
      strip.style.setProperty('--ts-dur', `${dur}s`);
    });
  }

  // Rebuild al redimensionar para mantener velocidad constante
  let rAF;
  window.addEventListener('resize', ()=>{
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(build);
  });

  build();
})();

// Tilt 3D leve en tarjetas "why" y proyectos
(() => {
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return;
  // AHORA incluye .proj-card
  const cards = document.querySelectorAll('.why-card[data-tilt], .proj-card[data-tilt]');
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

// Tilt 3D leve en tarjetas why + proyectos
(() => {
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return;
  const cards = document.querySelectorAll('.why-card[data-tilt], .proj-card[data-tilt]');
  const max = 6;
  cards.forEach(card => {
    const rect = () => card.getBoundingClientRect();
    function move(e){
      const r = rect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2);
      const dy = (e.clientY - cy) / (r.height/2);
      card.style.setProperty('--ry', ( dx * max).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-dy * max).toFixed(2) + 'deg');
    }
    function leave(){ card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg'); }
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
    card.addEventListener('touchmove', e => { if (!e.touches[0]) return; move(e.touches[0]); }, {passive:true});
    card.addEventListener('touchend', leave);
  });
})();

// FAQ: abre una pregunta si viene hash (#faq-proceso, etc.)
(() => {
  const id = window.location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el && el.tagName.toLowerCase() === 'details') el.setAttribute('open', '');
})();

// ===== Contacto Pro v2 + EmailJS =====
(() => {
  const form  = document.getElementById('contactFormPro');
  const toast = document.getElementById('cToast');
  if (!form || !toast) return;

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const setInvalid = (el, on=true) => {
    const field = el.closest('.c-field');
    if (field) field.classList.toggle('is-invalid', on);
  };

  // País -> LADA
  const country = form.querySelector('select[name="country"]');
  const dial    = form.querySelector('input[name="dial"]');
  if (country && dial) {
    const map = { MX:'+52', US:'+1', AR:'+54', CO:'+57', ES:'+34', CL:'+56', PE:'+51' };
    country.addEventListener('change', () => { dial.value = map[country.value] || '+'; });
  }

  // limpiar errores al teclear
  form.addEventListener('input', e => setInvalid(e.target, false));

  // autosize del textarea
  const ta = form.querySelector('textarea[name="mensaje"]');
  if (ta){
    const autoresize = () => { ta.style.height='auto'; ta.style.height = ta.scrollHeight + 'px'; };
    ['input','change'].forEach(ev => ta.addEventListener(ev, autoresize));
    autoresize();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación simple
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const valid = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (el.type === 'email' && valid){
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(el.value.trim())) { setInvalid(el, true); ok = false; return; }
      }
      if (!valid) { setInvalid(el, true); ok = false; }
    });
    if (!ok){ showToast('Revisa los campos resaltados.'); return; }

    showToast('Enviando…');

    try {
      // EmailJS: usa sendForm para leer todos los fields del form
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

      showToast('¡Gracias! Te contactamos pronto.');
      form.reset();
      ta && (ta.style.height = 'auto');
    } catch (err) {
      console.error(err);
      showToast('Hubo un error al enviar. Intenta de nuevo.');
    }
  });
})();
