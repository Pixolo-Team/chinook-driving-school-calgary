import { URLS } from "@/infrastructure/constants/urls";

export const footerSectionData = {
  certification: {
    prefix: "Certified by ",
    emphasis: "Alberta Transportation",
  },
  navLinks: [
    { label: "About Us", href: URLS.ABOUT },
    { label: "Courses", href: URLS.COURSES },
    { label: "Enroll", href: URLS.ENROLL },
    { label: "Contact Support", href: URLS.CONTACT },
  ],
  socialLinks: [
    {
      label: "Instagram",
      icon: "/images/footer-social-instagram.svg",
      href: "https://www.instagram.com/",
    },
    {
      label: "LinkedIn",
      icon: "/images/footer-social-linkedin.svg",
      href: "https://www.linkedin.com/",
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  craftedBy: {
    label: "Crafted by",
    logo: "/images/footer-crafted-by.svg",
    alt: "Pixolo logo",
  },
  copyright: "© 2026 Chinook Driving School Calgary.",
};
