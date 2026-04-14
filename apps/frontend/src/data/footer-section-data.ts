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
      href: "https://www.instagram.com/chinookdrivingacademy?igsh=OWljODU3YjF2cDR1",
    },
    {
      label: "Facebook",
      icon: "/images/footer-social-facebook.svg",
      href: "https://www.facebook.com/ChinookDrivingAcademy/",
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: URLS.PRIVACY_POLICY },
    { label: "Terms of Service", href: URLS.TERMS_OF_SERVICE },
  ],
  craftedBy: {
    label: "Crafted by",
    alt: "Pixolo logo",
  },
  copyright: "© 2026 Chinook Driving School Calgary.",
};
