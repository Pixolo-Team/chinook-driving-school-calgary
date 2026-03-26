// OTHERS //
import { animate } from "motion";

interface FloatingMenuConfigData {
  menuId: string;
  scrollThreshold: number;
}

interface MotionAnimationData {
  stop: () => void;
}

const FLOATING_MENU_SHELL_ID = "floating-menu-shell";
const FLOATING_MENU_HIDDEN_CLASS_NAMES = ["opacity-0", "pointer-events-none"];
const FLOATING_MENU_VISIBLE_CLASS_NAMES = ["opacity-100", "pointer-events-auto"];
const FLOATING_MENU_ENTER_DURATION = 0.34;
const FLOATING_MENU_ENTER_TIMES = [0, 0.82, 1];
const FLOATING_MENU_ENTER_EASING = [0.22, 1, 0.36, 1];
const FLOATING_MENU_EXIT_DURATION = 0.2;
const FLOATING_MENU_EXIT_TIMES = [0, 0.35, 1];
const FLOATING_MENU_EXIT_EASING = [0.4, 0, 1, 1];
const FLOATING_MENU_HIDDEN_TRANSFORM = "scaleX(0.88)";
const FLOATING_MENU_VISIBLE_TRANSFORM = "scaleX(1)";

/**
 * Initializes the floating menu scroll behavior for the provided menu element.
 * @param menuId The DOM id of the floating menu element that receives the animation.
 * @param scrollThreshold The vertical scroll offset that toggles the floating menu.
 * @returns Nothing when initialization completes or when the required elements are missing.
 */
export const initializeFloatingMenu = ({ menuId, scrollThreshold }: FloatingMenuConfigData) => {
  const floatingMenu = document.getElementById(menuId) as HTMLElement | null;
  const floatingMenuShell = document.getElementById(FLOATING_MENU_SHELL_ID) as HTMLElement | null;

  if (!floatingMenu || !floatingMenuShell) {
    return;
  }

  let ticking = false;
  let isVisible = false;
  let menuAnimation: MotionAnimationData | null = null;
  let visibilityTimeoutId: number | null = null;

  /** Clears the visibility timeout if it exists. */
  const clearVisibilityTimeout = () => {
    if (visibilityTimeoutId === null) {
      return;
    }

    window.clearTimeout(visibilityTimeoutId);
    visibilityTimeoutId = null;
  };

  /** Schedules the completion of the floating menu visibility animation. */
  const scheduleVisibilityCompletion = (durationInSeconds: number, callback: () => void) => {
    clearVisibilityTimeout();
    visibilityTimeoutId = window.setTimeout(() => {
      visibilityTimeoutId = null;
      callback();
    }, durationInSeconds * 1000);
  };

  /** Stops the floating menu animation if it is running. */
  const stopFloatingMenuAnimation = () => {
    menuAnimation?.stop();
    menuAnimation = null;
    clearVisibilityTimeout();
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
    updateFloatingMenuClasses(FLOATING_MENU_VISIBLE_CLASS_NAMES, false);
    updateFloatingMenuClasses(FLOATING_MENU_HIDDEN_CLASS_NAMES, true);
    floatingMenu.style.opacity = "0";
    floatingMenu.style.transform = FLOATING_MENU_HIDDEN_TRANSFORM;
    setFloatingMenuShellVisibility(false);
    isVisible = false;
  };

  /** Sets the floating menu to its visible state. */
  const setFloatingMenuVisibleState = () => {
    updateFloatingMenuClasses(FLOATING_MENU_HIDDEN_CLASS_NAMES, false);
    updateFloatingMenuClasses(FLOATING_MENU_VISIBLE_CLASS_NAMES, true);
    floatingMenu.style.opacity = "1";
    floatingMenu.style.transform = FLOATING_MENU_VISIBLE_TRANSFORM;
    setFloatingMenuShellVisibility(true);
    isVisible = true;
  };

  /** Animates the floating menu into view. */
  const animateFloatingMenuIn = () => {
    stopFloatingMenuAnimation();
    setFloatingMenuShellVisibility(true);
    updateFloatingMenuClasses(FLOATING_MENU_HIDDEN_CLASS_NAMES, false);
    updateFloatingMenuClasses(FLOATING_MENU_VISIBLE_CLASS_NAMES, true);

    menuAnimation = animate(
      floatingMenu,
      {
        opacity: [0, 1, 1],
        scaleX: [0.88, 1.02, 1],
      },
      {
        duration: FLOATING_MENU_ENTER_DURATION,
        ease: FLOATING_MENU_ENTER_EASING,
        times: FLOATING_MENU_ENTER_TIMES,
      },
    ) as MotionAnimationData;

    scheduleVisibilityCompletion(FLOATING_MENU_ENTER_DURATION, () => {
      menuAnimation = null;
      setFloatingMenuVisibleState();
    });
  };

  /** Animates the floating menu out of view. */
  const animateFloatingMenuOut = () => {
    stopFloatingMenuAnimation();
    setFloatingMenuShellVisibility(true);
    updateFloatingMenuClasses(FLOATING_MENU_HIDDEN_CLASS_NAMES, false);
    updateFloatingMenuClasses(FLOATING_MENU_VISIBLE_CLASS_NAMES, true);

    menuAnimation = animate(
      floatingMenu,
      {
        opacity: [1, 1, 0],
        scaleX: [1, 0.98, 0.88],
      },
      {
        duration: FLOATING_MENU_EXIT_DURATION,
        ease: FLOATING_MENU_EXIT_EASING,
        times: FLOATING_MENU_EXIT_TIMES,
      },
    ) as MotionAnimationData;

    scheduleVisibilityCompletion(FLOATING_MENU_EXIT_DURATION, () => {
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
