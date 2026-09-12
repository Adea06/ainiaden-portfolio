const carousel =
  document.querySelector("#carousel");

const cards = [
  ...document.querySelectorAll(".project")
];

const counter =
  document.querySelector("#counter");

const previousButton =
  document.querySelector("#previous");

const nextButton =
  document.querySelector("#next");

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

let active = 0;
let paused = false;

/*
  Duplicate the project cards once.
  This allows the carousel to loop
  without reaching an empty space.
*/

cards.forEach((card) => {
  const clone = card.cloneNode(true);

  clone.removeAttribute("id");

  clone.setAttribute(
    "aria-hidden",
    "true"
  );

  clone
    .querySelectorAll("a, button")
    .forEach((element) => {
      element.tabIndex = -1;
    });

  carousel.appendChild(clone);
});

function updateCounter() {
  const currentNumber =
    String(active + 1).padStart(2, "0");

  const totalNumber =
    String(cards.length).padStart(2, "0");

  counter.textContent =
    `${currentNumber} / ${totalNumber}`;
}

function getLoopDistance() {
  const firstCard = cards[0];

  const firstClone =
    carousel.children[cards.length];

  return (
    firstClone.offsetLeft -
    firstCard.offsetLeft
  );
}

function showProject(index) {
  active =
    (index + cards.length) %
    cards.length;

  const selectedCard =
    cards[active];

  const selectedPosition =
    selectedCard.offsetLeft -
    carousel.clientWidth / 2 +
    selectedCard.offsetWidth / 2;

  carousel.scrollTo({
    left: selectedPosition,
    behavior: "smooth"
  });

  updateCounter();
}

/* Arrow controls */

previousButton.addEventListener(
  "click",
  () => {
    showProject(active - 1);
  }
);

nextButton.addEventListener(
  "click",
  () => {
    showProject(active + 1);
  }
);

/* Pause while hovering */

carousel.addEventListener(
  "mouseenter",
  () => {
    paused = true;
  }
);

carousel.addEventListener(
  "mouseleave",
  () => {
    paused = false;
  }
);

/* Pause for keyboard users */

carousel.addEventListener(
  "focusin",
  () => {
    paused = true;
  }
);

carousel.addEventListener(
  "focusout",
  (event) => {
    if (
      !carousel.contains(
        event.relatedTarget
      )
    ) {
      paused = false;
    }
  }
);

/* Pause during dragging or swiping */

carousel.addEventListener(
  "pointerdown",
  () => {
    paused = true;
  }
);

carousel.addEventListener(
  "pointerup",
  () => {
    setTimeout(() => {
      paused = false;
    }, 2000);
  }
);

/*
  Slow automatic movement.

  Increase 30 to make it slower.
  Reduce 30 to make it faster.
*/

setInterval(() => {
  if (
    paused ||
    reducedMotion.matches
  ) {
    return;
  }

  carousel.scrollLeft += 1;

  const loopDistance =
    getLoopDistance();

  if (
    carousel.scrollLeft >=
    loopDistance
  ) {
    carousel.scrollLeft = 0;
  }
}, 30);

updateCounter();