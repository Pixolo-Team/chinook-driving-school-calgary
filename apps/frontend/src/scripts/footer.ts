import { initializeInViewAxisFade } from "@/scripts/motion";

export const initializeFooterReveal = () => {
  const footerBlocks = [...document.querySelectorAll("[data-footer-reveal]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );

  initializeInViewAxisFade(footerBlocks, {
    axis: "y",
    from: 26,
    duration: 0.62,
    delayMs: 140,
    initializedDatasetKey: "footerRevealInitialized",
    margin: "0px 0px -8% 0px",
  });
};
