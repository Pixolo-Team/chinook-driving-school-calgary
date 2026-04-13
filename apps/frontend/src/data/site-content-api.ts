const PIXSHEET_SITE_CONTENT_API_URL =
  "https://pixoloproductions.com/pixsheetdata/index.php?project=chinook-school";

type HeroData = {
  title?: string;
  description?: string;
  image?: string;
};

type StatsCardData = {
  icon?: string;
  stat_number?: string;
  stat_suffix?: string;
  description?: string;
};

type StatsData = {
  eyebrow?: string;
  title?: string;
  stat_cards?: StatsCardData[];
};

type FaqCardData = {
  question?: string;
  answer?: string;
};

type FaqData = {
  title?: string;
  description?: string;
  faq_cards?: FaqCardData[];
};

type FeatureCardData = {
  title?: string;
  description?: string;
  image?: string;
};

type FeaturesData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  feature_cards?: FeatureCardData[];
};

type CoursesData = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

type InstructorCardData = {
  name?: string;
  role?: string;
  description?: string;
};

type InstructorsData = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  instructor_cards?: InstructorCardData[];
};

type CtaData = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

type OpeningHoursData = {
  day?: string;
  time?: string;
};

type ContactData = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  opening_hours?: OpeningHoursData[];
};

type AboutHomeData = {
  title?: string;
  description?: string;
};

type AboutStoryCardData = {
  title?: string;
  description?: string;
};

type AboutStoryData = {
  eyebrow?: string;
  title?: string | boolean;
  description?: string;
  story_cards?: AboutStoryCardData[];
};

type AboutFounderData = {
  eyebrow?: string;
  heading?: string;
  paragraphs?: string[];
  image?: string;
  name?: string;
  title?: string;
};

type CoursesHeroData = {
  title?: string;
  description?: string;
};

type CourseProcessStepData = {
  title?: string;
  description?: string;
};

type CourseProcessCategoryData = {
  title?: string;
  steps?: CourseProcessStepData[];
};

type CoursesProcessData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  course_categories?: CourseProcessCategoryData[];
};

type ContactHeroData = {
  title?: string;
  description?: string;
};

type EnrollHeroData = {
  title?: string;
  description?: string;
};

type ContactLocationData = {
  title?: string;
  address?: string;
  service_area?: string;
};

type ContactMetaData = {
  email?: string;
  locations?: ContactLocationData[];
};

type MetaData = {
  contact?: ContactMetaData;
};

export type SiteContentData = {
  hero?: HeroData;
  stats?: StatsData;
  faq?: FaqData;
  features?: FeaturesData;
  courses?: CoursesData;
  instructors?: InstructorsData;
  cta?: CtaData;
  contact?: ContactData;
  about_home?: AboutHomeData;
  about_story?: AboutStoryData;
  about_founder?: AboutFounderData;
  courses_hero?: CoursesHeroData;
  courses_process?: CoursesProcessData;
  contact_hero?: ContactHeroData;
  enroll_hero?: EnrollHeroData;
  meta?: MetaData;
};

type SiteContentApiResponse = {
  data?: SiteContentData;
};

let siteContentRequestPromise: Promise<SiteContentData | null> | null = null;

export async function getSiteContentData(): Promise<SiteContentData | null> {
  // Reuse the same request during one render/build cycle.
  if (siteContentRequestPromise) {
    return siteContentRequestPromise;
  }

  siteContentRequestPromise = fetch(PIXSHEET_SITE_CONTENT_API_URL)
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }

      const responseData = (await response.json()) as SiteContentApiResponse;
      return responseData.data ?? null;
    })
    .catch(() => null);

  return siteContentRequestPromise;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeApiImagePath(value: unknown): string | null {
  // Keep only web-safe paths/URLs we can render directly.
  if (!isNonEmptyString(value)) {
    return null;
  }

  const normalizedValue = value.trim();
  if (normalizedValue.startsWith("http://") || normalizedValue.startsWith("https://")) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("/")) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("images/")) {
    return `/${normalizedValue}`;
  }

  return null;
}
