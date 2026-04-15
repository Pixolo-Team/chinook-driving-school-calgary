import { initializeInViewAxisFade } from "@/scripts/motion";

export const initializeSectionHeaders = () => {
  const sectionHeaders = [...document.querySelectorAll("[data-section-header]")].filter(
    (header): header is HTMLElement => header instanceof HTMLElement,
  );

  initializeInViewAxisFade(sectionHeaders, {
    axis: "x",
    from: 28,
    duration: 0.6,
    initializedDatasetKey: "sectionHeaderInitialized",
    margin: "0px 0px -12% 0px",
  });
};
