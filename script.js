const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// The globe becomes a normal grid when motion is reduced or JS is unavailable.
const stage = document.querySelector('#project-globe');
const scene = document.querySelector('#globe-scene');
if (stage && scene && !reducedMotion.matches) {
  stage.classList.add('enhanced');
  const cards = [...scene.querySelectorAll('.globe-card')];
  const announcement = document.querySelector('#globe-announcement');
  let rotationX = -7;
  let rotationY = 0;
  let pointer = null;
  let started = false;
  let spinTimer;
  let frame = 0;

  function frontCard() {
    const normal = (rotationY % 360 + 360) % 360;
    const index = ((Math.round(-normal / 72) % cards.length) + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const angle = Number(card.dataset.angle);
      const relative = (((angle + rotationY + 540) % 360 + 360) % 360) - 180;
      card.style.setProperty('--face-angle', `${-(angle + rotationY)}deg`);
      card.style.opacity = Math.abs(relative) > 112 ? '0' : '1';
      card.style.zIndex = String(Math.round(100 + 100 * Math.cos(relative * Math.PI / 180)));
      card.classList.toggle('is-front', i === index);
    });
    if (announcement) announcement.textContent = `Showing ${cards[index].querySelector('h3').innerText.replace(/\s+/g, ' ').trim()}`;
  }

  function draw(smooth = false) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      scene.style.transition = smooth ? 'transform 420ms ease-out' : 'none';
      scene.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      frontCard();
    });
  }

  function stopSpin() {
    clearTimeout(spinTimer);
    scene.classList.remove('is-spinning');
    draw();
  }

  function startSpin() {
    if (started) return;
    started = true;
    scene.classList.add('is-spinning');
    spinTimer = window.setTimeout(stopSpin, 2020);
  }

  frontCard();
  if ('IntersectionObserver' in window) {
    const spinObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) { startSpin(); observer.disconnect(); }
    }, { threshold: .25 });
    spinObserver.observe(stage);
  } else { startSpin(); }

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (scene.classList.contains('is-spinning')) stopSpin();
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  });
  stage.addEventListener('pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.moved && Math.hypot(dx, dy) < 5) return;
    if (!pointer.moved) { pointer.moved = true; stage.setPointerCapture(event.pointerId); }
    rotationY += dx * .32;
    rotationX = Math.max(-24, Math.min(24, rotationX - dy * .18));
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    draw();
  });
  function release(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.moved) {
      const snapped = Math.round(rotationY / 72) * 72;
      rotationY = snapped;
      draw(true);
      stage.dataset.justDragged = 'true';
      setTimeout(() => { delete stage.dataset.justDragged; }, 100);
    }
    pointer = null;
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('click', (event) => {
    if (stage.dataset.justDragged) { event.preventDefault(); event.stopPropagation(); }
  }, true);

  stage.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (scene.classList.contains('is-spinning')) stopSpin();
    if (event.key === 'ArrowLeft') rotationY += 72;
    if (event.key === 'ArrowRight') rotationY -= 72;
    if (event.key === 'ArrowUp') rotationX = Math.min(24, rotationX + 8);
    if (event.key === 'ArrowDown') rotationX = Math.max(-24, rotationX - 8);
    draw(true);
  });
  stage.addEventListener('focusin', (event) => {
    const card = event.target.closest('.globe-card');
    if (card) { rotationY = -Number(card.dataset.angle); draw(true); }
  });
}

// Other sections appear as they enter the viewport.
const revealItems = document.querySelectorAll('[data-reveal]');
if (revealItems.length && !reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver((entries, io) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
}
