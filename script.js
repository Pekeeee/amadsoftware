// script.js (fix)
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  // Toggle menú móvil (sin optional chaining en asignaciones)
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

  // Año en footer (sin optional chaining en asignación)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Dispara animaciones de entrada cuando todo cargue
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
})();
