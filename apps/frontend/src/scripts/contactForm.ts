import { initializeInViewAxisFade } from "@/scripts/motion";

export const initializeContactForms = () => {
  const contactForms = [
    ...document.querySelectorAll("[data-contact-form-shell], [data-contact-info-shell]"),
  ].filter(
    (formShell): formShell is HTMLElement => formShell instanceof HTMLElement,
  );

  if (contactForms.length === 0) {
    return;
  }

  initializeInViewAxisFade(contactForms, {
    axis: "x",
    from: 34,
    duration: 0.8,
    initializedDatasetKey: "contactFormInitialized",
    margin: "0px 0px -10% 0px",
  });
};
