import { initializeInViewAxisFade } from "@/scripts/motion";

export const initializeCtaSection = () => {
  const ctaImageBlocks = [...document.querySelectorAll("[data-cta-image]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );
  const ctaTextBlocks = [...document.querySelectorAll("[data-cta-text]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );

  initializeInViewAxisFade(ctaImageBlocks, {
    axis: "y",
    from: 0,
    duration: 0.6,
    initializedDatasetKey: "ctaImageInitialized",
    margin: "0px 0px -10% 0px",
  });

  initializeInViewAxisFade(ctaTextBlocks, {
    axis: "x",
    from: 30,
    duration: 0.6,
    delayMs: 250,
    initializedDatasetKey: "ctaTextInitialized",
    margin: "0px 0px -10% 0px",
  });
};
