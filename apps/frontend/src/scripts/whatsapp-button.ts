const DESKTOP_QUERY = "(min-width: 1024px)";
const CLAMP_BUFFER = 8;

const parsePixelValue = (value: string) => {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const initializeWhatsAppButton = () => {
  const button = document.querySelector("[data-whatsapp-button]");
  const stopTarget = document.querySelector("[data-whatsapp-stop]");

  if (!(button instanceof HTMLElement) || !(stopTarget instanceof HTMLElement)) {
    return;
  }

  if (button.dataset.whatsappClampInitialized === "true") {
    return;
  }

  button.dataset.whatsappClampInitialized = "true";

  const desktopMedia = window.matchMedia(DESKTOP_QUERY);
  let frameId = 0;
  let fixedBottomOffset = 0;

  const unlockButton = () => {
    button.classList.remove("is-footer-locked");
    button.style.removeProperty("top");
  };

  const updateButtonPosition = () => {
    frameId = 0;

    if (!desktopMedia.matches) {
      unlockButton();
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const targetRect = stopTarget.getBoundingClientRect();

    if (!button.classList.contains("is-footer-locked")) {
      fixedBottomOffset = parsePixelValue(window.getComputedStyle(button).bottom);
    }

    const fixedTop = window.innerHeight - fixedBottomOffset - buttonRect.height;
    const scrollY = window.scrollY || window.pageYOffset;
    const targetDocumentTop =
      targetRect.top + scrollY + Math.max(0, (targetRect.height - buttonRect.height) / 2);
    const lockedViewportTop = targetDocumentTop - scrollY;
    const isLocked = button.classList.contains("is-footer-locked");

    if (isLocked && fixedTop < lockedViewportTop - CLAMP_BUFFER) {
      unlockButton();
      return;
    }

    if (isLocked || fixedTop > lockedViewportTop + CLAMP_BUFFER) {
      button.classList.add("is-footer-locked");
      button.style.top = `${targetDocumentTop}px`;
      return;
    }
  };

  const requestUpdate = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(updateButtonPosition);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  desktopMedia.addEventListener("change", requestUpdate);
  requestUpdate();
};
