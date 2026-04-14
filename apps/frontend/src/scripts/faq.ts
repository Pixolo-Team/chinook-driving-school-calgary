type FAQAnswerEl = HTMLElement & {
  _transitionHandler?: (e: TransitionEvent) => void;
};

const openFaqAnswer = (item: HTMLElement, answer: FAQAnswerEl) => {
  item.dataset.open = "true";

  // Cancel any previous handler
  if (answer._transitionHandler) {
    answer.removeEventListener("transitionend", answer._transitionHandler);
    answer._transitionHandler = undefined;
  }

  // Start animation
  answer.style.height = `${answer.scrollHeight}px`;
  answer.style.opacity = "1";

  const handler = (event: TransitionEvent) => {
    if (event.propertyName !== "height") return;

    // ✅ Only finalize if still open
    if (item.dataset.open !== "true") return;

    answer.style.height = "auto";

    answer.removeEventListener("transitionend", handler);
    answer._transitionHandler = undefined;
  };

  answer._transitionHandler = handler;
  answer.addEventListener("transitionend", handler);
};

const closeFaqAnswer = (item: HTMLElement, answer: FAQAnswerEl) => {
  item.dataset.open = "false";

  // Cancel any pending open handler
  if (answer._transitionHandler) {
    answer.removeEventListener("transitionend", answer._transitionHandler);
    answer._transitionHandler = undefined;
  }

  // If height is "auto", convert it to px first
  answer.style.height = `${answer.scrollHeight}px`;

  // Force reflow
  answer.offsetHeight;

  // Animate closed
  answer.style.height = "0px";
  answer.style.opacity = "0";
};

export const initializeFaqSection = () => {
  document.querySelectorAll<HTMLElement>(".faq-item").forEach((item) => {
    if (item.dataset.initialized === "true") return;

    item.dataset.initialized = "true";
    item.dataset.open = "false";

    const trigger = item.querySelector<HTMLButtonElement>(".faq-trigger");
    const answer = item.querySelector<FAQAnswerEl>(".faq-answer");
    const arrow = item.querySelector<HTMLElement>(".faq-arrow");

    if (!trigger || !answer) return;

    // Initial state
    answer.style.height = "0px";
    answer.style.opacity = "0";

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", () => {
      const isOpening = item.dataset.open !== "true";

      if (isOpening) {
        openFaqAnswer(item, answer);
      } else {
        closeFaqAnswer(item, answer);
      }

      trigger.setAttribute("aria-expanded", String(isOpening));

      if (arrow) {
        arrow.style.transform = isOpening ? "rotate(180deg)" : "rotate(0deg)";
      }
    });
  });
};
