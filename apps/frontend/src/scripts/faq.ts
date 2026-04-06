const closeFaqAnswer = (answer: HTMLElement) => {
  // Start from the current full height so the collapse transition has a concrete value to animate from.
  answer.style.height = `${answer.scrollHeight}px`;

  window.requestAnimationFrame(() => {
    answer.style.height = "0px";
    answer.style.opacity = "0";
  });
};

const openFaqAnswer = (answer: HTMLElement) => {
  // Expand to the measured content height first, then release back to auto once the animation finishes.
  answer.style.height = `${answer.scrollHeight}px`;
  answer.style.opacity = "1";

  const handleTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== "height") {
      return;
    }

    answer.style.height = "auto";
    answer.removeEventListener("transitionend", handleTransitionEnd);
  };

  answer.addEventListener("transitionend", handleTransitionEnd);
};

export const initializeFaqSection = () => {
  document.querySelectorAll<HTMLElement>(".faq-item").forEach((item) => {

    // Prevent duplicate listeners when Astro re-runs this script on navigation.
    if (item.dataset.initialized === "true") {
      return;
    }

    item.dataset.initialized = "true";
    item.dataset.open = "false";

    const trigger = item.querySelector<HTMLButtonElement>(".faq-trigger");
    const answer = item.querySelector<HTMLElement>(".faq-answer");
    const arrow = item.querySelector<HTMLElement>(".faq-arrow");

    if (!trigger || !answer) {
      return;
    }

    trigger.addEventListener("click", () => {
      
      const isOpening = item.dataset.open !== "true";

      item.dataset.open = String(isOpening);
      trigger.setAttribute("aria-expanded", String(isOpening));

      if (isOpening) {
        openFaqAnswer(answer);
      } else {
        closeFaqAnswer(answer);
      }

      if (arrow) {
        arrow.style.transform = isOpening ? "rotate(180deg)" : "rotate(0deg)";
      }
    });
  });
};
