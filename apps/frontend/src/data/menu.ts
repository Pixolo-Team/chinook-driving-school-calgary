import { URLS } from "@/infrastructure/constants/urls";

export const menuItems = [
  { name: "Home", url: URLS.HOME },
  { name: "About", url: URLS.ABOUT },
  { name: "Courses", url: URLS.COURSES },
  { name: "Contact", url: URLS.CONTACT },
  { name: "Enroll", url: URLS.ENROLL },
];

const normalizeMenuPath = (path: string): string => {
  if (!path || path === "/index.html") {
    return "/";
  }

  const normalizedPath = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

  return normalizedPath || "/";
};

export const isMenuItemActive = (currentPath: string, href: string): boolean => {
  const normalizedCurrentPath = normalizeMenuPath(currentPath);
  const normalizedHref = normalizeMenuPath(href);

  if (normalizedHref === "/") {
    return normalizedCurrentPath === normalizedHref;
  }

  return (
    normalizedCurrentPath === normalizedHref ||
    normalizedCurrentPath.startsWith(`${normalizedHref}/`)
  );
};
