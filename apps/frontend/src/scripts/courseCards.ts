import { inView } from "motion";
import { animateStaggeredAxisFade, prefersReducedMotion } from "@/scripts/motion";

const staggerDelayMs = 130;

const animatePanelCards = (panel: HTMLElement) => {
  const cards = [...panel.querySelectorAll("[data-course-card]")].filter(
    (card): card is HTMLElement => card instanceof HTMLElement,
  );

  if (cards.length === 0) {
    return;
  }

  void animateStaggeredAxisFade(cards, {
    axis: "y",
    from: 26,
    duration: 0.62,
    staggerDelayMs,
    animatedDatasetKey: "courseCardAnimated",
  });
};

export const initializeCourseCards = () => {
  const coursesSections = [...document.querySelectorAll("[data-courses-section]")].filter(
    (section): section is HTMLElement => section instanceof HTMLElement,
  );

  if (coursesSections.length === 0) {
    return;
  }

  coursesSections.forEach((section) => {
    if (section.dataset.courseCardsInitialized === "true") {
      return;
    }

    section.dataset.courseCardsInitialized = "true";

    const panels = [...section.querySelectorAll("[data-tab-panel]")].filter(
      (panel): panel is HTMLElement => panel instanceof HTMLElement,
    );

    const revealActivePanel = () => {
      const activePanel = panels.find(
        (panel) => panel.dataset.active === "true" && panel.hidden === false,
      );

      if (!(activePanel instanceof HTMLElement)) {
        return;
      }

      animatePanelCards(activePanel);
    };

    if (prefersReducedMotion()) {
      revealActivePanel();
      return;
    }

    const stopWatching = inView(
      section,
      () => {
        section.dataset.coursesInView = "true";
        revealActivePanel();
      },
      { margin: "0px 0px -15% 0px" },
    );

    const panelObserver = new MutationObserver(() => {
      if (section.dataset.coursesInView !== "true") {
        return;
      }

      revealActivePanel();
    });

    panels.forEach((panel) => {
      panelObserver.observe(panel, {
        attributes: true,
        attributeFilter: ["data-active", "hidden"],
      });
    });

    section.dataset.courseCardsObserverAttached = "true";
    void stopWatching;
  });
};
