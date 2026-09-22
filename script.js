const carousel = document.querySelector("#carousel");
const cards = [...document.querySelectorAll(".project")];
const counter = document.querySelector("#counter");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (carousel && cards.length && counter && previousButton && nextButton) {
  let active = 0;
  let paused = false;

  // Duplicate the originals so the continuous track can wrap without a gap.
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((element) => {
      element.tabIndex = -1;
    });
    carousel.appendChild(clone);
  });

  function updateCounter() {
    const currentNumber = String(active + 1).padStart(2, "0");
    const totalNumber = String(cards.length).padStart(2, "0");
    counter.textContent = `${currentNumber} / ${totalNumber}`;
  }

  function getLoopDistance() {
    const firstClone = carousel.children[cards.length];
    return firstClone.offsetLeft - cards[0].offsetLeft;
  }

  function showProject(index) {
    active = (index + cards.length) % cards.length;
    const selectedCard = cards[active];
    const selectedPosition = selectedCard.offsetLeft - carousel.clientWidth / 2 + selectedCard.offsetWidth / 2;
    carousel.scrollTo({
      left: selectedPosition,
      behavior: reducedMotion.matches ? "instant" : "smooth"
    });
    updateCounter();
  }

  previousButton.addEventListener("click", () => showProject(active - 1));
  nextButton.addEventListener("click", () => showProject(active + 1));
  carousel.addEventListener("mouseenter", () => { paused = true; });
  carousel.addEventListener("mouseleave", () => { paused = false; });
  carousel.addEventListener("focusin", () => { paused = true; });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) paused = false;
  });
  carousel.addEventListener("pointerdown", () => { paused = true; });
  carousel.addEventListener("pointerup", () => {
    window.setTimeout(() => { paused = false; }, 2000);
  });

  // The original continuous movement remains on a 30 ms interval.
  window.setInterval(() => {
    if (paused || reducedMotion.matches || document.hidden) return;
    carousel.scrollLeft += 1;
    if (carousel.scrollLeft >= getLoopDistance()) carousel.scrollLeft = 0;
  }, 30);

  updateCounter();
}

// Reveal only the marked sections. The carousel cards do not receive this animation.
const revealItems = document.querySelectorAll("[data-reveal]");
if (revealItems.length && !reducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}
