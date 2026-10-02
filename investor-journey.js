(() => {
  const dialog = document.getElementById('research-dialog');
  const close = document.getElementById('research-close');
  let trigger = null;
  document.querySelectorAll('[data-open-research]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      dialog.showModal();
      document.body.classList.add('research-modal-open');
      dialog.querySelector('.research-modal-scroll').scrollTop = 0;
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('research-modal-open');
    if (trigger) trigger.focus();
  });
  const strip = document.querySelector('.research-strip');
  const group = strip.querySelector('.strip-group');
  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  strip.querySelector('.strip-track').appendChild(clone);
  const toggle = document.getElementById('carousel-toggle');
  toggle.addEventListener('click', () => {
    const paused = strip.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume movement' : 'Pause movement';
  });
})();

(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll('.case-section .case-copy, .journey-figure, .outcome-cards article, .skills-compact');
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motion.matches) entry.target.classList.add('reveal-enter');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
  elements.forEach(element => { if (element.getBoundingClientRect().top > window.innerHeight) reveal.observe(element); });
  const links = [...document.querySelectorAll('.editorial-case-nav a')];
  const stages = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scheduled = false;
  const update = () => {
    let current = null;
    stages.forEach(stage => { if (stage.getBoundingClientRect().top <= 190) current = stage.id; });
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current','step');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; window.requestAnimationFrame(update); } }, { passive:true });
  update();
})();
