interface FloatingMenuConfigData {
  menuId: string;
  scrollThreshold: number;
}

/**
 * Initializes the floating menu visibility behavior for the provided menu element.
 */
export const initializeFloatingMenu = ({
  menuId,
  scrollThreshold,
}: FloatingMenuConfigData) => {
  const floatingMenu = document.getElementById(menuId) as HTMLElement | null;

  if (!floatingMenu) {
    return;
  }

  let ticking = false;
  let isVisible = false;

  const setFloatingMenuVisibility = (shouldShow: boolean) => {
    floatingMenu.classList.toggle("opacity-100", shouldShow);
    floatingMenu.classList.toggle("translate-y-0", shouldShow);
    floatingMenu.classList.toggle("pointer-events-auto", shouldShow);
    floatingMenu.classList.toggle("opacity-0", !shouldShow);
    floatingMenu.classList.toggle("-translate-y-4", !shouldShow);
    floatingMenu.classList.toggle("pointer-events-none", !shouldShow);
    floatingMenu.setAttribute("aria-hidden", String(!shouldShow));
    floatingMenu.toggleAttribute("inert", !shouldShow);
    isVisible = shouldShow;
  };

  const updateFloatingMenuVisibility = () => {
    const shouldShow = window.scrollY > scrollThreshold;

    if (shouldShow !== isVisible) {
      setFloatingMenuVisibility(shouldShow);
    }

    ticking = false;
  };

  const handleScroll = () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(updateFloatingMenuVisibility);
  };

  setFloatingMenuVisibility(window.scrollY > scrollThreshold);
  window.addEventListener("scroll", handleScroll, { passive: true });
};
