// OTHERS //
import { animate } from "motion";

interface FloatingMenuConfigData {
  menuId: string;
  scrollThreshold: number;
}

interface MotionAnimationData {
  stop: () => void;
  then: (onFulfilled: () => void) => unknown;
}

/**
 * Initializes the floating menu scroll behavior for the provided menu element.
 * @param menuId The DOM id of the floating menu element that receives the animation.
 * @param scrollThreshold The vertical scroll offset that toggles the floating menu.
 * @returns Nothing when initialization completes or when the required elements are missing.
 */
export const initializeFloatingMenu = ({ menuId, scrollThreshold }: FloatingMenuConfigData) => {
  const floatingMenu = document.getElementById(menuId) as HTMLElement | null;
  const floatingMenuShell = document.getElementById("floating-menu-shell") as HTMLElement | null;

  if (!floatingMenu || !floatingMenuShell) {
    return;
  }

  let ticking = false;
  let isVisible = false;
  let menuAnimation: MotionAnimationData | null = null;
  let currentAnimationId = 0;

  /** Stops the floating menu animation if it is running. */
  const stopFloatingMenuAnimation = () => {
    menuAnimation?.stop();
    menuAnimation = null;
    currentAnimationId += 1;
  };

  /** Updates the classes of the floating menu based on its visibility state. */
  const updateFloatingMenuClasses = (classNames: string[], shouldAdd: boolean) => {
    classNames.forEach((className) => {
      floatingMenu.classList.toggle(className, shouldAdd);
    });
  };

  /** Sets the visibility of the floating menu shell. */
  const setFloatingMenuShellVisibility = (shouldShow: boolean) => {
    floatingMenuShell.setAttribute("aria-hidden", String(!shouldShow));
    floatingMenuShell.toggleAttribute("inert", !shouldShow);
    floatingMenuShell.style.visibility = shouldShow ? "visible" : "hidden";
  };

  /** Sets the floating menu to its hidden state. */
  const setFloatingMenuHiddenState = () => {
    updateFloatingMenuClasses(["opacity-100", "pointer-events-auto"], false);
    updateFloatingMenuClasses(["opacity-0", "pointer-events-none"], true);
    floatingMenu.style.opacity = "0";
    floatingMenu.style.transform = "scaleX(0.88)";
    setFloatingMenuShellVisibility(false);
    isVisible = false;
  };

  /** Sets the floating menu to its visible state. */
  const setFloatingMenuVisibleState = () => {
    updateFloatingMenuClasses(["opacity-0", "pointer-events-none"], false);
    updateFloatingMenuClasses(["opacity-100", "pointer-events-auto"], true);
    floatingMenu.style.opacity = "1";
    floatingMenu.style.transform = "scaleX(1)";
    setFloatingMenuShellVisibility(true);
    isVisible = true;
  };

  /** Animates the floating menu into view. */
  const animateFloatingMenuIn = () => {
    stopFloatingMenuAnimation();
    const animationId = currentAnimationId;
    setFloatingMenuShellVisibility(true);
    updateFloatingMenuClasses(["opacity-0", "pointer-events-none"], false);
    updateFloatingMenuClasses(["opacity-100", "pointer-events-auto"], true);

    menuAnimation = animate(
      floatingMenu,
      {
        opacity: [0, 1, 1],
        scaleX: [0.88, 1.02, 1],
      },
      {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.82, 1],
      },
    ) as MotionAnimationData;

    menuAnimation.then(() => {
      if (animationId !== currentAnimationId) {
        return;
      }

      menuAnimation = null;
      setFloatingMenuVisibleState();
    });
  };

  /** Animates the floating menu out of view. */
  const animateFloatingMenuOut = () => {
    stopFloatingMenuAnimation();
    const animationId = currentAnimationId;
    setFloatingMenuShellVisibility(true);
    updateFloatingMenuClasses(["opacity-0", "pointer-events-none"], false);
    updateFloatingMenuClasses(["opacity-100", "pointer-events-auto"], true);

    menuAnimation = animate(
      floatingMenu,
      {
        opacity: [1, 1, 0],
        scaleX: [1, 0.98, 0.88],
      },
      {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
        times: [0, 0.35, 1],
      },
    ) as MotionAnimationData;

    menuAnimation.then(() => {
      if (animationId !== currentAnimationId) {
        return;
      }

      menuAnimation = null;
      setFloatingMenuHiddenState();
    });
  };

  /** Sets the visibility of the floating menu. */
  const setFloatingMenuVisibility = (shouldShow: boolean) => {
    if (shouldShow === isVisible) {
      return;
    }

    isVisible = shouldShow;

    if (shouldShow) {
      animateFloatingMenuIn();
      return;
    }

    animateFloatingMenuOut();
  };

  /** Updates the visibility of the floating menu based on the scroll position. */
  const updateFloatingMenuVisibility = () => {
    setFloatingMenuVisibility(window.scrollY > scrollThreshold);
    ticking = false;
  };

  /** Handles the scroll event and updates the floating menu visibility if necessary. */
  const handleScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateFloatingMenuVisibility);
  };

  if (window.scrollY > scrollThreshold) {
    setFloatingMenuVisibleState();
  } else {
    setFloatingMenuHiddenState();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
};
