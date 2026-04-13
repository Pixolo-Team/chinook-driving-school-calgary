// TYPES //
import type {
  CourseCategoryData,
  ProvinceOptionData,
  SessionOptionData,
} from "@/react/types/enrollment.type";

export const TOTAL_ENROLLMENT_STEPS = 6;

export const COURSE_CATEGORY_IMAGE_BY_ID: Record<string, string> = {
  "driving-courses": "/images/driving-course.png",
  "brush-up-lessons": "/images/brush-up-lesson.png",
  "car-rental": "/images/car-rental.png",
};

export const COURSE_CATEGORY_IMAGE_BY_NAME: Record<string, string> = {
  "driving courses": "/images/driving-course.png",
  "brush up lessons": "/images/brush-up-lesson.png",
  "car rental": "/images/car-rental.png",
};

export function resolveCourseCategoryImage(
  categoryId?: string | null,
  categoryName?: string | null,
): string | undefined {
  const normalizedId = (categoryId ?? "").trim().toLowerCase();
  const normalizedName = (categoryName ?? "").trim().toLowerCase();

  return (
    COURSE_CATEGORY_IMAGE_BY_ID[normalizedId] ??
    COURSE_CATEGORY_IMAGE_BY_NAME[normalizedName] ??
    undefined
  );
}

export const SESSION_TYPE_OPTIONS: SessionOptionData[] = [
  { label: "In Person ($55+GST extra charges)", value: "in_person" },
  { label: "Online", value: "online" },
  { label: "Not Applicable", value: "not_applicable" },
];

export const COURSES: CourseCategoryData[] = [
  {
    id: "driving-courses",
    name: "Driving Courses",
    description: "Structured beginner-friendly driving lessons with insurance reduction.",
    image: COURSE_CATEGORY_IMAGE_BY_ID["driving-courses"],
    courses: [
      {
        id: "30a15f9e-56e0-4d00-9480-5a0a132d5b91",
        name: "Basic",
        course_price: 798,
        tax_amount: 39.9,
        total_amount: 837.9,
        hours_in_car: 10,
        hours_in_classroom: 15,
        image: "/images/driving-course.png",
        features: [
          { title: "Insurance reduction certificate" },
          { title: "10 hours in-car training" },
          { title: "15 hours classroom lessons" },
        ],
      },
      {
        id: "premium",
        name: "Premium",
        course_price: 1068,
        tax_amount: 53.4,
        total_amount: 1121.4,
        hours_in_car: 14,
        hours_in_classroom: 15,
        image: "https://www.figma.com/api/mcp/asset/44d18bfb-aa51-40fb-978d-4fe2146080e7",
        features: [
          { title: "Insurance reduction certificate" },
          { title: "14 hours in-car training" },
          { title: "Flexible rescheduling" },
        ],
      },
      {
        id: "ultimate",
        name: "Ultimate",
        course_price: 1468,
        tax_amount: 73.4,
        total_amount: 1541.4,
        hours_in_car: 20,
        hours_in_classroom: 15,
        image: "https://www.figma.com/api/mcp/asset/44d18bfb-aa51-40fb-978d-4fe2146080e7",
        features: [
          { title: "Insurance reduction certificate" },
          { title: "20 hours in-car training" },
          { title: "Road test preparation" },
        ],
      },
    ],
  },
  {
    id: "brush-up-lessons",
    name: "Brush Up Lessons",
    description: "Short focused lessons for nervous drivers and test preparation.",
    image: COURSE_CATEGORY_IMAGE_BY_ID["brush-up-lessons"],
    courses: [
      {
        id: "brush-up-2h",
        name: "Starter",
        course_price: 180,
        tax_amount: 9,
        total_amount: 189,
        hours_in_car: 2,
        hours_in_classroom: 0,
        image: "https://www.figma.com/api/mcp/asset/ff7d5666-f216-493e-b1bb-66a6ed45ee91",
        features: [{ title: "2 hours one-on-one coaching" }, { title: "Parallel parking refresh" }],
      },
      {
        id: "brush-up-5h",
        name: "Extended",
        course_price: 425,
        tax_amount: 21.25,
        total_amount: 446.25,
        hours_in_car: 5,
        hours_in_classroom: 0,
        image: "https://www.figma.com/api/mcp/asset/ff7d5666-f216-493e-b1bb-66a6ed45ee91",
        features: [{ title: "5 hours one-on-one coaching" }, { title: "Road test route review" }],
      },
    ],
  },
  {
    id: "car-rental",
    name: "Car Rental",
    description: "Use an instructor vehicle for your road test or practice session.",
    image: COURSE_CATEGORY_IMAGE_BY_ID["car-rental"],
    courses: [
      {
        id: "road-test-rental",
        name: "Road Test Rental",
        course_price: 155,
        tax_amount: 7.75,
        total_amount: 162.75,
        hours_in_car: 1,
        hours_in_classroom: 0,
        image: "",
        features: [{ title: "Vehicle for road test" }, { title: "Pickup before road test" }],
      },
    ],
  },
];

export const PROVINCES: ProvinceOptionData[] = [
  { name: "Alberta", value: "alberta" },
  { name: "British Columbia", value: "british-columbia" },
  { name: "Manitoba", value: "manitoba" },
  { name: "Ontario", value: "ontario" },
  { name: "Saskatchewan", value: "saskatchewan" },
];

export const LICENSE_ISSUING_REGIONS: ProvinceOptionData[] = [
  { name: "Alberta", value: "AB" },
  { name: "British Columbia", value: "BC" },
  { name: "Manitoba", value: "MB" },
  { name: "Ontario", value: "ON" },
  { name: "Saskatchewan", value: "SK" },
];

export const LICENSE_STATUS_ITEMS = [
  { value: "none", label: "No License Yet", description: "" },
  { value: "learning", label: "Learner License", description: "" },
  { value: "permanent", label: "Permanent License", description: "" },
];

export const LICENSE_TYPES = [
  { label: "Class 7 Learner", value: "CLASS_7" },
  { label: "Class 5 GDL", value: "CLASS_5_GDL" },
  { label: "Class 5 Full", value: "CLASS_5" },
  { label: "International License", value: "OTHER" },
];

export const DRIVING_EXPERIENCE_ITEMS = [
  { label: "No experience", value: "no-experience" },
  { label: "0-6 months", value: "0-6-months" },
  { label: "6-12 months", value: "6-12-months" },
  { label: "1-2 years", value: "1-2-years" },
  { label: "2+ years", value: "2-plus-years" },
];

export const PREFERRED_DAYS_ITEMS = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export const TIME_SLOT_ITEMS = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

export const PAYMENT_METHOD_ITEMS = [
  {
    title: "Credit Card",
    description: "Visa, Mastercard, Amex",
    name: "card",
    iconName: "card",
  },
  {
    title: "Online Transfer",
    description: "Visa Debit or Debit Mastercard",
    name: "online",
    iconName: "online",
  },
  {
    title: "Bank Transfer",
    description: "Fast and secure bank transfer",
    name: "bank_transfer",
    iconName: "bank_transfer",
  },
  {
    title: "Pay in Person",
    description: "Fast and secure bank transfer",
    name: "in_person",
    iconName: "in_person",
  },
];
