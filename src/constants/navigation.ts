/**
 * Navigation links used across the header and floating menu.
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact-us" },
] as const;

/**
 * Scroll distance (in px) at which the floating menu becomes visible.
 */
export const FLOATING_MENU_SCROLL_THRESHOLD = 80;
