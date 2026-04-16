import { getLegalContactDetails } from "@/data/site-content-mappers";

type TermsConditionItem = {
  text: string;
  children?: string[];
};

type TermsConditionSection = {
  title: string;
  paragraphs?: string[];
  preserveLineBreaks?: boolean;
  listIntro?: string;
  items?: TermsConditionItem[];
};

export const termsConditionsData: TermsConditionSection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      'Welcome to Chinook Driving School ("we," "our," "us"). By accessing our website, enrolling in our courses, or using our services, you agree to be bound by these Terms & Conditions.',
      "If you do not agree, please do not use our services.",
    ],
  },
  {
    title: "2. Eligibility",
    items: [
      {
        text: "You must meet the minimum legal age requirements for driving in Alberta.",
      },
      {
        text: "If you are under 18, parental or guardian consent is required.",
      },
      {
        text: "You must provide accurate and complete information during registration.",
      },
    ],
  },
  {
    title: "3. Course Enrollment",
    items: [
      {
        text: "Enrollment is confirmed only after successful registration and payment (if applicable).",
      },
      {
        text: "Course availability is subject to scheduling and instructor availability.",
      },
      {
        text: "We reserve the right to modify course schedules if necessary.",
      },
    ],
  },
  {
    title: "4. Payments & Fees",
    items: [
      {
        text: "All fees must be paid as per the selected package.",
      },
      {
        text: "Prices may be subject to applicable taxes (GST).",
      },
      {
        text: "Payment methods include credit/debit cards, e-transfer, or in-person payment.",
      },
    ],
  },
  {
    title: "5. Cancellation & Refund Policy",
    items: [
      {
        text: "Cancellations must be made at least 24 hours before the scheduled lesson.",
      },
      {
        text: "Late cancellations or no-shows may result in a forfeited lesson or fee.",
      },
      {
        text: "Refunds (if applicable) are subject to review and may include administrative deductions.",
      },
    ],
  },
  {
    title: "6. Lesson Scheduling",
    items: [
      {
        text: "Lessons are scheduled based on your availability and instructor schedules.",
      },
      {
        text: "We will make reasonable efforts to accommodate preferred timings but cannot guarantee them.",
      },
    ],
  },
  {
    title: "7. Student Responsibilities",
    listIntro: "You agree to:",
    items: [
      {
        text: "Arrive on time for lessons.",
      },
      {
        text: "Carry required documents (license, ID).",
      },
      {
        text: "Follow instructor guidance and road safety rules.",
      },
      {
        text: "Maintain respectful behavior.",
      },
      {
        text: "Failure to comply may result in suspension or termination of services.",
      },
    ],
  },
  {
    title: "8. Instructor Responsibilities",
    items: [
      {
        text: "Provide professional, safe, and structured training.",
      },
      {
        text: "Follow Alberta driving regulations.",
      },
      {
        text: "Ensure a supportive learning environment.",
      },
    ],
  },
  {
    title: "9. Road Test & Results",
    items: [
      {
        text: "Passing the driving test is not guaranteed.",
      },
      {
        text: "Performance depends on individual learning and practice.",
      },
      {
        text: "We may provide guidance and preparation but cannot influence official testing outcomes.",
      },
    ],
  },
  {
    title: "10. Liability",
    items: [
      {
        text: "Chinook Driving School is not responsible for:",
        children: [
          "Test results.",
          "External delays (traffic, weather, etc.).",
          "Personal belongings.",
        ],
      },
      {
        text: "All training is conducted with safety as a priority.",
      },
    ],
  },
  {
    title: "11. Use of Website",
    listIntro: "You agree not to:",
    items: [
      {
        text: "Use the website for unlawful purposes.",
      },
      {
        text: "Provide false information.",
      },
      {
        text: "Attempt to disrupt or hack services.",
      },
    ],
  },
  {
    title: "12. Changes to Terms",
    paragraphs: [
      "We may update these Terms & Conditions at any time. Continued use of our services implies acceptance of the updated terms.",
    ],
  },
  {
    title: "13. Contact Information",
    preserveLineBreaks: true,
    paragraphs: [
      "Chinook Driving School",
      "Calgary, Alberta",
      "Email: chinookdriving@gmail.com",
      "Phone: +1 (403) XXX-XXXX",
    ],
  },
];

export async function getTermsConditionsData(): Promise<TermsConditionSection[]> {
  const legalContactDetails = await getLegalContactDetails();
  const email = legalContactDetails.email ?? "chinookdriving@gmail.com";
  const phoneNumber = legalContactDetails.phoneNumber ?? "+1 (403) 281-8050";

  return termsConditionsData.map((section) =>
    section.title === "13. Contact Information"
      ? {
          ...section,
          paragraphs: [
            "Chinook Driving School",
            "Calgary, Alberta",
            `Email: ${email}`,
            `Phone: ${phoneNumber}`,
          ],
        }
      : section,
  );
}
