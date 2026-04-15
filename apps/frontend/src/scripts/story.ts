import { inView } from "motion";
import {
  animateStaggeredAxisFade,
  initializeInViewAxisFade,
  prefersReducedMotion,
} from "@/scripts/motion";

export const initializeStorySection = () => {
  const storyTextBlocks = [...document.querySelectorAll("[data-story-text]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );
  const storySections = [...document.querySelectorAll("[data-story-section]")].filter(
    (section): section is HTMLElement => section instanceof HTMLElement,
  );

  initializeInViewAxisFade(storyTextBlocks, {
    axis: "x",
    from: 30,
    duration: 0.6,
    delayMs: 120,
    initializedDatasetKey: "storyTextInitialized",
    margin: "0px 0px -10% 0px",
  });

  storySections.forEach((section) => {
    if (section.dataset.storyCardsInitialized === "true") {
      return;
    }

    section.dataset.storyCardsInitialized = "true";

    const storyCards = [...section.querySelectorAll("[data-story-card]")].filter(
      (card): card is HTMLElement => card instanceof HTMLElement,
    );

    if (storyCards.length === 0) {
      return;
    }

    const animateCards = () =>
      animateStaggeredAxisFade(storyCards, {
        axis: "y",
        from: 26,
        duration: 1.8,
        staggerDelayMs: 300,
        animatedDatasetKey: "storyCardAnimated",
      });

    if (prefersReducedMotion()) {
      void animateCards();
      return;
    }

    const stopWatching = inView(
      section,
      () => {
        void animateCards();
        stopWatching();
      },
      { margin: "0px 0px -10% 0px" },
    );
  });
};
