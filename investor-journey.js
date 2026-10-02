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
