import { animate } from "motion";

type MotionAnimationData = {
  stop: () => void;
  then: (onFulfilled: () => void) => unknown;
};

const illustrationAnimationOptions = {
  duration: 0.58,
  ease: [0.22, 1, 0.36, 1] as const,
};

const textAnimationOptions = {
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const initializeHeroCards = () => {
  const heroCards = [...document.querySelectorAll("[data-hero-card]")].filter(
    (card): card is HTMLElement => card instanceof HTMLElement,
  );

  if (heroCards.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  heroCards.forEach((card) => {
    if (card.dataset.heroCardInitialized === "true") {
      return;
    }

    card.dataset.heroCardInitialized = "true";

    const illustration = card.querySelector("[data-hero-card-illustration]");
    const text = card.querySelector("[data-hero-card-text]");

    if (!(illustration instanceof HTMLElement) || !(text instanceof HTMLElement)) {
      return;
    }

    if (prefersReducedMotion) {
      illustration.style.opacity = "1";
      illustration.style.transform = "translateY(0)";
      text.style.opacity = "1";
      text.style.transform = "translateY(0)";
      return;
    }

    const illustrationAnimation = animate(
      illustration,
      {
        opacity: [0, 1],
        y: [24, 0],
      },
      illustrationAnimationOptions,
    ) as MotionAnimationData;

    window.setTimeout(() => {
      animate(
        text,
        {
          opacity: [0, 1],
          y: [18, 0],
        },
        textAnimationOptions,
      );
    }, 140);

    illustrationAnimation.then(() => {
      illustration.style.opacity = "1";
      illustration.style.transform = "translateY(0)";
      text.style.opacity = "1";
      text.style.transform = "translateY(0)";
    });
  });
};
