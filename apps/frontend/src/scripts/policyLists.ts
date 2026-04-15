import { inView } from "motion";
import { animateStaggeredAxisFade, prefersReducedMotion } from "@/scripts/motion";

export const initializePolicyLists = () => {
  const policySections = [...document.querySelectorAll("[data-policy-section]")].filter(
    (section): section is HTMLElement => section instanceof HTMLElement,
  );

  if (policySections.length === 0) {
    return;
  }

  policySections.forEach((section) => {
    if (section.dataset.policyListsInitialized === "true") {
      return;
    }

    section.dataset.policyListsInitialized = "true";

    const blocks = [...section.querySelectorAll("[data-policy-block]")].filter(
      (block): block is HTMLElement => block instanceof HTMLElement,
    );

    if (blocks.length === 0) {
      return;
    }

    const animateBlocks = () =>
      animateStaggeredAxisFade(blocks, {
        axis: "x",
        from: 28,
        duration: 1.8,
        staggerDelayMs: 200,
        animatedDatasetKey: "policyBlockAnimated",
      });

    if (prefersReducedMotion()) {
      void animateBlocks();
      return;
    }

    const stopWatching = inView(
      section,
      () => {
        void animateBlocks();
        stopWatching();
      },
      { margin: "0px 0px -8% 0px" },
    );
  });
};
