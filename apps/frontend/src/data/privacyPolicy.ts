import { getLegalContactDetails } from "@/data/site-content-mappers";

type PrivacyPolicyItem = {
  text: string;
  children?: string[];
};

type PrivacyPolicySection = {
  title: string;
  paragraphs?: string[];
  preserveLineBreaks?: boolean;
  listIntro?: string;
  items?: PrivacyPolicyItem[];
};

export const privacyPolicyData: PrivacyPolicySection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      "We respect your privacy and are committed to protecting your personal information in accordance with Canadian privacy laws.",
    ],
  },
  {
    title: "2. Information We Collect",
    items: [
      {
        text: "Personal Information",
        children: [
          "Name",
          "Email address",
          "Phone number",
          "Address",
          "Date of birth",
          "License details",
        ],
      },
      {
        text: "Payment Information",
        children: [
          "Processed securely via third-party providers",
          "We do not store full card details",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    listIntro: "We use your information to:",
    items: [
      {
        text: "Process enrollments",
      },
      {
        text: "Schedule lessons",
      },
      {
        text: "Communicate updates",
      },
      {
        text: "Provide customer support",
      },
      {
        text: "Improve our services",
      },
    ],
  },
  {
    title: "4. Consent",
    paragraphs: [
      "By providing your information, you consent to its collection and use as described in this policy.",
    ],
  },
  {
    title: "5. Sharing of Information",
    paragraphs: ["We do not sell your personal data."],
    listIntro: "We may share information with:",
    items: [
      {
        text: "Instructors (for scheduling)",
      },
      {
        text: "Payment processors",
      },
      {
        text: "Legal authorities (if required)",
      },
    ],
  },
  {
    title: "6. Data Security",
    paragraphs: ["We take reasonable measures to protect your data, including:"],
    items: [
      {
        text: "Secure systems",
      },
      {
        text: "Encryption where applicable",
      },
      {
        text: "Restricted access",
      },
    ],
  },
  {
    title: "7. Cookies & Tracking",
    listIntro: "Our website may use cookies to:",
    items: [
      {
        text: "Improve user experience",
      },
      {
        text: "Analyze traffic",
      },
    ],
    paragraphs: ["You can disable cookies in your browser settings."],
  },
  {
    title: "8. Retention of Data",
    paragraphs: ["We retain your information only as long as necessary for:"],
    items: [
      {
        text: "Service delivery",
      },
      {
        text: "Legal compliance",
      },
    ],
  },
  {
    title: "9. Your Rights",
    listIntro: "You may:",
    items: [
      {
        text: "Request access to your data",
      },
      {
        text: "Request corrections",
      },
      {
        text: "Request deletion (subject to legal requirements)",
      },
    ],
  },
  {
    title: "10. Third-Party Services",
    paragraphs: [
      "We may use third-party tools (e.g., payment gateways, analytics). These services have their own privacy policies.",
    ],
  },
  {
    title: "11. Updates to Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Updates will be posted on this page.",
    ],
  },
  {
    title: "12. Contact Us",
    preserveLineBreaks: true,
    paragraphs: [
      "For any privacy-related concerns:",
      "Email: chinookdriving@gmail.com",
      "Phone: +1 (403) XXX-XXXX",
    ],
  },
];

export async function getPrivacyPolicyData(): Promise<PrivacyPolicySection[]> {
  const legalContactDetails = await getLegalContactDetails();
  const email = legalContactDetails.email ?? "chinookdriving@gmail.com";
  const phoneNumber = legalContactDetails.phoneNumber ?? "+1 (403) 281-8050";

  return privacyPolicyData.map((section) =>
    section.title === "12. Contact Us"
      ? {
          ...section,
          paragraphs: [
            "For any privacy-related concerns:",
            `Email: ${email}`,
            `Phone: ${phoneNumber}`,
          ],
        }
      : section,
  );
}
