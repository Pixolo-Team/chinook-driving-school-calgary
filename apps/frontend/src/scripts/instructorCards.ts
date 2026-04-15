import { animateStaggeredAxisFade, prefersReducedMotion, wait } from "@/scripts/motion";
import { inView } from "motion";

const staggerDelayMs = 210;
const inViewStartDelayMs = 160;

export const initializeInstructorCards = () => {
  const instructorSections = [...document.querySelectorAll("[data-instructors-section]")].filter(
    (section): section is HTMLElement => section instanceof HTMLElement,
  );

  if (instructorSections.length === 0) {
    return;
  }

  instructorSections.forEach((section) => {
    if (section.dataset.instructorCardsInitialized === "true") {
      return;
    }

    section.dataset.instructorCardsInitialized = "true";

    const cards = [...section.querySelectorAll("[data-instructor-card]")].filter(
      (card): card is HTMLElement => card instanceof HTMLElement,
    );

    if (cards.length === 0) {
      return;
    }

    if (prefersReducedMotion()) {
      void animateStaggeredAxisFade(cards, {
        axis: "x",
        from: 30,
        duration: 0.66,
        staggerDelayMs,
        animatedDatasetKey: "instructorCardAnimated",
      });
      return;
    }

    const stopWatching = inView(
      section,
      () => {
        void (async () => {
          await wait(inViewStartDelayMs);
          await animateStaggeredAxisFade(cards, {
            axis: "x",
            from: 30,
            duration: 0.66,
            staggerDelayMs,
            animatedDatasetKey: "instructorCardAnimated",
          });
        })();

        stopWatching();
      },
      { margin: "0px 0px -12% 0px" },
    );
  });
};
