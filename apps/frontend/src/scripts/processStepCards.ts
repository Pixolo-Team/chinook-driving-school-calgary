import { animateStaggeredAxisFade, prefersReducedMotion, wait } from "@/scripts/motion";
import { inView } from "motion";

const staggerDelayMs = 120;
const inViewStartDelayMs = 400;

const animatePanelCards = (panel: HTMLElement) => {
  const cards = [...panel.querySelectorAll("[data-process-step-card]")].filter(
    (card): card is HTMLElement => card instanceof HTMLElement,
  );

  if (cards.length === 0) {
    return;
  }

  void animateStaggeredAxisFade(cards, {
    axis: "x",
    from: 32,
    duration: 0.58,
    staggerDelayMs,
    animatedDatasetKey: "processStepAnimated",
  });
};

export const initializeProcessStepCards = () => {
  const processSections = [...document.querySelectorAll("[data-process-section]")].filter(
    (section): section is HTMLElement => section instanceof HTMLElement,
  );

  if (processSections.length === 0) {
    return;
  }

  processSections.forEach((section) => {
    if (section.dataset.processStepsInitialized === "true") {
      return;
    }

    section.dataset.processStepsInitialized = "true";

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
        section.dataset.processInView = "true";
        void (async () => {
          await wait(inViewStartDelayMs);
          revealActivePanel();
        })();
      },
      { margin: "0px 0px -12% 0px" },
    );

    const panelObserver = new MutationObserver(() => {
      if (section.dataset.processInView !== "true") {
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

    void stopWatching;
  });
};
