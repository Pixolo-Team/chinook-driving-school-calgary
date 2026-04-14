import { animate } from "motion";

interface FloatingMenuConfigData {
  menuId: string;
  scrollThreshold: number;
}

interface MobileHeaderConfigData {
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

/**
 * Initializes the mobile header background state so it stays readable over lighter sections.
 * @param scrollThreshold The vertical scroll offset that toggles the mobile header background treatment.
 * @returns Nothing when initialization completes or when the required elements are missing.
 */
export const initializeMobileHeader = ({ scrollThreshold }: MobileHeaderConfigData) => {
  const mobileHeaderShell = document.getElementById("mobile-header-shell") as HTMLElement | null;
  const mobileMenuOpenButton = document.getElementById(
    "mobile-menu-open-button",
  ) as HTMLButtonElement | null;
  const mobileMenuOpenIcon = document.getElementById("mobile-menu-open-icon") as HTMLElement | null;

  if (!mobileHeaderShell || !mobileMenuOpenButton || !mobileMenuOpenIcon) {
    return;
  }

  /** Syncs the mobile header state with the current scroll position. */
  const handleMobileHeaderScroll = () => {
    const shouldShowBackground = window.scrollY > scrollThreshold;

    mobileHeaderShell.classList.toggle("bg-transparent", !shouldShowBackground);
    mobileHeaderShell.classList.toggle("bg-n-50", shouldShowBackground);
    mobileHeaderShell.classList.toggle("rounded-b-[24px]", shouldShowBackground);
    mobileMenuOpenButton.classList.toggle("border-blue-500/30", !shouldShowBackground);
    mobileMenuOpenButton.classList.toggle("border-n-300", shouldShowBackground);
    mobileMenuOpenButton.classList.toggle("bg-n-50/72", !shouldShowBackground);
    mobileMenuOpenButton.classList.toggle("bg-n-50", shouldShowBackground);
    mobileMenuOpenIcon.classList.toggle("text-blue-500", !shouldShowBackground);
    mobileMenuOpenIcon.classList.toggle("text-n-700", shouldShowBackground);
  };

  handleMobileHeaderScroll();
  window.addEventListener("scroll", handleMobileHeaderScroll, { passive: true });
};

/**
 * Initializes the mobile menu open and close behavior, including scroll locking and restoration.
 * @returns Nothing when initialization completes or when the required elements are missing.
 */
export const initializeMobileMenu = () => {
  const mobileMenuPanel = document.getElementById("mobile-menu-panel") as HTMLElement | null;
  const mobileMenuBackdrop = document.getElementById("mobile-menu-backdrop") as HTMLElement | null;
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer") as HTMLElement | null;
  const mobileMenuOpenButton = document.getElementById(
    "mobile-menu-open-button",
  ) as HTMLButtonElement | null;
  const mobileMenuCloseButton = document.getElementById(
    "mobile-menu-close-button",
  ) as HTMLButtonElement | null;
  const mobileMenuLinks = Array.from(
    document.querySelectorAll("[data-mobile-menu-link]"),
  ) as HTMLAnchorElement[];
  
  // Sections marked in the template are animated in sequence for the cascade effect.
  const mobileMenuSections = Array.from(
    mobileMenuPanel.querySelectorAll("[data-mobile-menu-section]"),
  ) as HTMLElement[];

  if (
    !mobileMenuPanel ||
    !mobileMenuBackdrop ||
    !mobileMenuDrawer ||
    !mobileMenuOpenButton ||
    !mobileMenuCloseButton
  ) {
    return;
  }

  let mobileMenuScrollY = 0;
  let isMenuOpen = false;
  let currentAnimationId = 0;
  let drawerAnimation: MotionAnimationData | null = null;
  let backdropAnimation: MotionAnimationData | null = null;
  let sectionAnimations: MotionAnimationData[] = [];

  /** Stops any in-flight mobile menu animations before starting a new one. */
  const stopMobileMenuAnimations = () => {
    drawerAnimation?.stop();
    backdropAnimation?.stop();
    sectionAnimations.forEach((animation) => animation.stop());
    drawerAnimation = null;
    backdropAnimation = null;
    sectionAnimations = [];
    currentAnimationId += 1;
  };

  /** Locks the page scroll while the mobile drawer is open. */
  const lockPageScroll = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    mobileMenuScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${mobileMenuScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
  };

  /** Restores the page scroll position after the mobile drawer closes. */
  const unlockPageScroll = () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.paddingRight = "";
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, mobileMenuScrollY);
    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = "";
    });
  };

  /** Applies the hidden drawer state without animation. */
  const setDrawerHiddenState = () => {
    mobileMenuPanel.classList.add("hidden");
    mobileMenuPanel.classList.remove("block");
    mobileMenuPanel.setAttribute("aria-hidden", "true");
    mobileMenuOpenButton.setAttribute("aria-expanded", "false");
    mobileMenuBackdrop.style.opacity = "0";
    mobileMenuDrawer.style.opacity = "0";
    mobileMenuDrawer.style.transform = "translateY(-40px)";
    mobileMenuSections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(-18px)";
    });
    isMenuOpen = false;
  };

  /** Prepares the drawer for its opening animation. */
  const prepareDrawerVisibleState = () => {
    mobileMenuPanel.classList.remove("hidden");
    mobileMenuPanel.classList.add("block");
    mobileMenuPanel.setAttribute("aria-hidden", "false");
    mobileMenuOpenButton.setAttribute("aria-expanded", "true");
    mobileMenuBackdrop.style.opacity = "0";
    mobileMenuDrawer.style.opacity = "0";
    mobileMenuDrawer.style.transform = "translateY(-40px)";
    mobileMenuSections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(-18px)";
    });
    isMenuOpen = true;
  };

  /** Applies the visible drawer state without animation. */
  const setDrawerVisibleState = () => {
    mobileMenuPanel.classList.remove("hidden");
    mobileMenuPanel.classList.add("block");
    mobileMenuPanel.setAttribute("aria-hidden", "false");
    mobileMenuOpenButton.setAttribute("aria-expanded", "true");
    mobileMenuBackdrop.style.opacity = "1";
    mobileMenuDrawer.style.opacity = "1";
    mobileMenuDrawer.style.transform = "translateY(0)";
    mobileMenuSections.forEach((section) => {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    });
    isMenuOpen = true;
  };

  /** Keeps the menu overlay and body scroll state in sync during open and close actions. */
  const setMobileMenuVisibility = (shouldShow: boolean) => {
    if (shouldShow === isMenuOpen) {
      return;
    }

    stopMobileMenuAnimations();
    const animationId = currentAnimationId;

    if (shouldShow) {
      lockPageScroll();
      prepareDrawerVisibleState();

      // Fade the backdrop in while the menu surface drops into place.
      backdropAnimation = animate(
        mobileMenuBackdrop,
        { opacity: [0, 1] },
        { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      ) as MotionAnimationData;

      drawerAnimation = animate(
        mobileMenuDrawer,
        { opacity: [0, 1], y: [-40, 0] },
        { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
      ) as MotionAnimationData;

      // Stagger each section slightly so the menu reads from top to bottom.
      sectionAnimations = mobileMenuSections.map((section, index) =>
        animate(
          section,
          { opacity: [0, 1], y: [-18, 0] },
          {
            duration: 0.26,
            delay: 0.08 + index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          },
        ) as MotionAnimationData,
      );

      drawerAnimation.then(() => {
        if (animationId !== currentAnimationId) {
          return;
        }

        drawerAnimation = null;
        backdropAnimation = null;
        sectionAnimations = [];
        setDrawerVisibleState();
      });
      return;
    }

    backdropAnimation = animate(
      mobileMenuBackdrop,
      { opacity: [1, 0] },
      { duration: 0.18, ease: [0.4, 0, 1, 1] },
    ) as MotionAnimationData;

    drawerAnimation = animate(
      mobileMenuDrawer,
      { opacity: [1, 0], y: [0, -28] },
      { duration: 0.22, ease: [0.4, 0, 1, 1] },
    ) as MotionAnimationData;

    drawerAnimation.then(() => {
      if (animationId !== currentAnimationId) {
        return;
      }

      drawerAnimation = null;
      backdropAnimation = null;
      setDrawerHiddenState();
      unlockPageScroll();
    });
  };

  /** Closes the mobile menu when escape is pressed. */
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMobileMenuVisibility(false);
    }
  };

  mobileMenuOpenButton.addEventListener("click", () => {
    setMobileMenuVisibility(true);
  });

  mobileMenuCloseButton.addEventListener("click", () => {
    setMobileMenuVisibility(false);
  });

  mobileMenuBackdrop.addEventListener("click", () => {
    setMobileMenuVisibility(false);
  });

  mobileMenuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", () => {
      setMobileMenuVisibility(false);
    });
  });

  window.addEventListener("keydown", handleEscapeKey);

  setDrawerHiddenState();
};
