import { initializeInViewAxisFade } from "@/scripts/motion";

export const initializeFounderSection = () => {
  const founderImageBlocks = [...document.querySelectorAll("[data-founder-image]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );
  const founderTextBlocks = [...document.querySelectorAll("[data-founder-text]")].filter(
    (block): block is HTMLElement => block instanceof HTMLElement,
  );

  initializeInViewAxisFade(founderImageBlocks, {
    axis: "y",
    from: 0,
    duration: 0.6,
    initializedDatasetKey: "founderImageInitialized",
    margin: "0px 0px -10% 0px",
  });

  initializeInViewAxisFade(founderTextBlocks, {
    axis: "x",
    from: 30,
    duration: 0.6,
    delayMs: 250,
    initializedDatasetKey: "founderTextInitialized",
    margin: "0px 0px -10% 0px",
  });
};
