import { aboutHeroSectionData } from "@/data/about";
import { aboutStorySectionData } from "@/data/about-story";
import { contactHeroSectionData } from "@/data/contact";
import { contactSectionData } from "@/data/contact-section-data";
import { courseSectionData, coursesHeroSectionData } from "@/data/courses";
import { ctaData } from "@/data/cta";
import { enrollHeroData } from "@/data/enroll-hero-data";
import { faqSectionData } from "@/data/faqSectionData";
import { FeaturesSectionDetails } from "@/data/features";
import { founderSectionData } from "@/data/founder-section-data";
import { heroSectionData } from "@/data/hero-section-data";
import { instructorsSectionData } from "@/data/instructors-section-data";
import { numberStatsData, statHeaderData } from "@/data/numberSection";
import { processSectionData } from "@/data/process-data";
import { testimonialSectionDetails } from "@/data/testimonials";
import {
  getSiteContentData,
  isNonEmptyString,
  normalizeApiImagePath,
} from "@/data/site-content-api";

// Prefer API value, otherwise keep current local fallback.
function pickString(value: unknown, fallback: string): string {
  return isNonEmptyString(value) ? value : fallback;
}

function pickNonEmptyArray<T>(value: T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export async function getLegalContactDetails() {
  const siteContentData = await getSiteContentData();
  const contactMetaData = siteContentData?.meta?.contact;

  return {
    email: isNonEmptyString(contactMetaData?.email) ? contactMetaData.email.trim() : null,
    phoneNumber: isNonEmptyString(contactMetaData?.phone_number)
      ? contactMetaData.phone_number.trim()
      : null,
  };
}

export async function getHomeHeroViewModel() {
  const siteContentData = await getSiteContentData();
  const heroApiData = siteContentData?.hero;
  const heroApiSlides = Array.isArray(heroApiData?.images)
  ? heroApiData.images
      .map((imagePath) => normalizeApiImagePath(imagePath))
      .filter((imagePath): imagePath is string => imagePath !== null)
  : [];

  return {
    eyebrow: pickString(heroApiData?.title, heroSectionData.eyebrow),
    heading: pickString(heroApiData?.description, heroSectionData.heading),
    slides: pickNonEmptyArray(heroApiSlides, heroSectionData.slides),
  };
}

export async function getHomeStatsViewModel() {
  const siteContentData = await getSiteContentData();
  const statsApiData = siteContentData?.stats;

  const cardsFromApi =
    statsApiData?.stat_cards
      ?.filter(
        (statCard) =>
          isNonEmptyString(statCard.stat_number) &&
          isNonEmptyString(statCard.description),
      )
      .map((statCard, index) => ({
        icon: numberStatsData[index]?.icon ?? numberStatsData[0]?.icon ?? "",
        stat_number: statCard.stat_number ?? "",
        stat_suffix: statCard.stat_suffix ?? "",
        description: statCard.description ?? "",
      })) ?? [];

  return {
    eyebrow: pickString(statsApiData?.eyebrow, statHeaderData.eyebrow),
    heading: pickString(statsApiData?.title, statHeaderData.heading),
    cards: pickNonEmptyArray(cardsFromApi, numberStatsData),
  };
}

export async function getHomeFeaturesViewModel() {
  const siteContentData = await getSiteContentData();
  const featuresApiData = siteContentData?.features;

  const cardsFromApi =
    featuresApiData?.feature_cards
      ?.filter(
        (featureCard) =>
          isNonEmptyString(featureCard.title) && isNonEmptyString(featureCard.description),
      )
      .map((featureCard, index) => ({
        title: featureCard.title ?? "",
        description: featureCard.description ?? "",
        imageAlt:
          FeaturesSectionDetails.cards[index]?.imageAlt ??
          featureCard.title ??
          "Feature image",
        imageSrc:
          FeaturesSectionDetails.cards[index]?.imageSrc ??
          FeaturesSectionDetails.cards[0]?.imageSrc ??
          "/images/features/certified-driving.png",
      })) ?? [];

  return {
    eyebrow: pickString(featuresApiData?.eyebrow, FeaturesSectionDetails.content.eyebrow),
    heading: pickString(featuresApiData?.title, FeaturesSectionDetails.content.title),
    description: pickString(featuresApiData?.description, FeaturesSectionDetails.content.description),
    cards: pickNonEmptyArray(cardsFromApi, FeaturesSectionDetails.cards),
  };
}

export async function getFaqViewModel() {
  const siteContentData = await getSiteContentData();
  const faqApiData = siteContentData?.faq;

  const cardsFromApi =
    faqApiData?.faq_cards
      ?.filter((faqCard) => isNonEmptyString(faqCard.question) && isNonEmptyString(faqCard.answer))
      .map((faqCard) => ({
        question: faqCard.question ?? "",
        answer: faqCard.answer ?? "",
      })) ?? [];

  return {
    eyebrow: "Got Questions ?",
    heading: pickString(faqApiData?.title, "Frequently Asked Questions"),
    description: isNonEmptyString(faqApiData?.description) ? faqApiData.description : "",
    cards: pickNonEmptyArray(cardsFromApi, faqSectionData),
  };
}

export async function getHomeInstructorsViewModel() {
  const siteContentData = await getSiteContentData();
  const instructorsApiData = siteContentData?.instructors;

  const cardsFromApi =
    instructorsApiData?.instructor_cards
      ?.filter(
        (instructorCard) =>
          isNonEmptyString(instructorCard.name) &&
          isNonEmptyString(instructorCard.role) &&
          isNonEmptyString(instructorCard.description),
      )
      .map((instructorCard) => ({
        name: instructorCard.name ?? "",
        role: instructorCard.role ?? "",
        description: instructorCard.description ?? "",
      })) ?? [];

  return {
    eyebrow: pickString(instructorsApiData?.eyebrow, instructorsSectionData.eyebrow),
    heading: pickString(instructorsApiData?.title, instructorsSectionData.heading),
    description: pickString(instructorsApiData?.description, instructorsSectionData.description),
    instructors: pickNonEmptyArray(cardsFromApi, instructorsSectionData.instructors),
  };
}

export async function getHomeTestimonialsViewModel() {
  const siteContentData = await getSiteContentData();
  const testimonialsApiData = siteContentData?.testimonials;
  const testimonialCardsFromApi = Array.isArray(testimonialsApiData?.testimonial_cards)
    ? testimonialsApiData.testimonial_cards
    : null;

  const cardsFromApi =
    testimonialCardsFromApi
      ?.filter((testimonialCard) =>
        [
          testimonialCard.name,
          testimonialCard.role,
          testimonialCard.rating,
          testimonialCard.review,
        ].some((value) => isNonEmptyString(value)),
      )
      .map((testimonialCard, index) => ({
        id: testimonialSectionDetails.testimonials[index]?.id ?? `api-${index + 1}`,
        customReview: testimonialSectionDetails.testimonials[index]?.customReview ?? false,
        rating: Number.parseFloat(testimonialCard.rating ?? "") || 5,
        review: testimonialCard.review ?? "",
        name: testimonialCard.name ?? "",
        role: testimonialCard.role ?? "",
        profilePhoto:
          testimonialSectionDetails.testimonials[index]?.profilePhoto ??
          "/images/testimonials/profile-photo-placeholder.png",
        backgroundImage: testimonialSectionDetails.testimonials[index]?.backgroundImage,
      })) ?? [];

  return {
    eyebrow: pickString(testimonialsApiData?.eyebrow, testimonialSectionDetails.eyebrow),
    heading: pickString(testimonialsApiData?.title, testimonialSectionDetails.heading),
    reviewSummary: testimonialSectionDetails.reviewSummary,
    testimonials: testimonialCardsFromApi ? cardsFromApi : testimonialSectionDetails.testimonials,
  };
}

export async function getHomeCtaViewModel() {
  const siteContentData = await getSiteContentData();
  const ctaApiData = siteContentData?.cta;

  return {
    eyebrow: pickString(ctaApiData?.eyebrow, ctaData.eyebrow),
    heading: pickString(ctaApiData?.title, ctaData.heading),
    description: pickString(ctaApiData?.description, ctaData.description),
    imageSrc: normalizeApiImagePath(ctaApiData?.image) ?? ctaData.imageSrc,
    imageAlt: ctaData.imageAlt,
  };
}

export async function getContactHeroViewModel() {
  const siteContentData = await getSiteContentData();
  const contactHeroApiData = siteContentData?.contact_hero;

  return {
    title: pickString(contactHeroApiData?.title, contactHeroSectionData.title),
    description: pickString(contactHeroApiData?.description, contactHeroSectionData.description),
    illustration: contactHeroSectionData.illustration,
    illustrationAlt: contactHeroSectionData.illustrationAlt,
  };
}

export async function getContactInfoViewModel() {
  const siteContentData = await getSiteContentData();
  const contactApiData = siteContentData?.contact;
  const contactMetaData = siteContentData?.meta?.contact;

  const openingHoursFromApi =
    contactApiData?.opening_hours
      ?.filter((openingHour) => isNonEmptyString(openingHour.day) && isNonEmptyString(openingHour.time))
      .map((openingHour) => ({
        icon: "clock",
        label: `${openingHour.day}:`,
        value: openingHour.time ?? "",
      })) ?? [];

  const locationsFromApi =
    contactMetaData?.locations
      ?.filter((location) => isNonEmptyString(location.title) && isNonEmptyString(location.address))
      .map((location) => ({
        icon: "location-pin",
        name: location.title ?? "",
        address: location.address ?? "",
        actionLabel: "Get Directions",
        href: `https://maps.google.com/?q=${encodeURIComponent(location.address ?? "")}`,
      })) ?? [];

  const serviceAreaLocation = contactMetaData?.locations?.find((location) =>
    isNonEmptyString(location.service_area),
  );
  const email = isNonEmptyString(contactMetaData?.email)
    ? contactMetaData.email.trim()
    : contactSectionData.cards.getInTouch.details[0].value;

  return {
    eyebrow: pickString(contactApiData?.eyebrow, contactSectionData.eyebrow),
    heading: pickString(contactApiData?.title, contactSectionData.heading),
    description: pickString(contactApiData?.description, contactSectionData.description),
    cards: {
      getInTouch: {
        ...contactSectionData.cards.getInTouch,
        details: [
          {
            icon: "mail-send-envelope",
            value: email,
            href: `mailto:${email}`,
          },
          contactSectionData.cards.getInTouch.details[1],
        ],
      },
      openingHours: {
        ...contactSectionData.cards.openingHours,
        details: pickNonEmptyArray(openingHoursFromApi, contactSectionData.cards.openingHours.details),
      },
      officeDetails: {
        ...contactSectionData.cards.officeDetails,
        locations: pickNonEmptyArray(locationsFromApi, contactSectionData.cards.officeDetails.locations),
        serviceArea: {
          ...contactSectionData.cards.officeDetails.serviceArea,
          value: pickString(
            serviceAreaLocation?.service_area,
            contactSectionData.cards.officeDetails.serviceArea.value,
          ),
        },
      },
    },
  };
}

export async function getAboutHeroViewModel() {
  const siteContentData = await getSiteContentData();
  const aboutHomeApiData = siteContentData?.about_home;

  return {
    title: pickString(aboutHomeApiData?.title, aboutHeroSectionData.title),
    description: pickString(aboutHomeApiData?.description, aboutHeroSectionData.description),
    illustration: aboutHeroSectionData.illustration,
    illustrationAlt: aboutHeroSectionData.illustrationAlt,
  };
}

export async function getAboutStoryViewModel() {
  const siteContentData = await getSiteContentData();
  const aboutStoryApiData = siteContentData?.about_story;

  const cardsFromApi =
    aboutStoryApiData?.story_cards
      ?.filter((storyCard) => isNonEmptyString(storyCard.title) && isNonEmptyString(storyCard.description))
      .map((storyCard, index) => ({
        icon: aboutStorySectionData.cards[index]?.icon ?? "badge-award-star",
        title: storyCard.title ?? "",
        description: storyCard.description ?? "",
      })) ?? [];

  return {
    content: {
      eyebrow: pickString(aboutStoryApiData?.eyebrow, aboutStorySectionData.content.eyebrow),
      heading:
        isNonEmptyString(aboutStoryApiData?.title) && typeof aboutStoryApiData.title === "string"
          ? aboutStoryApiData.title
          : aboutStorySectionData.content.heading,
      story: pickString(aboutStoryApiData?.description, aboutStorySectionData.content.story),
    },
    cards: pickNonEmptyArray(cardsFromApi, aboutStorySectionData.cards),
  };
}

export async function getAboutFounderViewModel() {
  const siteContentData = await getSiteContentData();
  const founderApiData = siteContentData?.about_founder;

  const paragraphsFromApi =
    founderApiData?.paragraphs?.filter((paragraph) => isNonEmptyString(paragraph)) ?? [];

  return {
    eyebrow: pickString(founderApiData?.eyebrow, founderSectionData.eyebrow),
    heading: pickString(founderApiData?.title, founderSectionData.heading),
    paragraphs: pickNonEmptyArray(paragraphsFromApi, founderSectionData.paragraphs),
    name: pickString(founderApiData?.name, founderSectionData.name),
    title: pickString(founderApiData?.title_role, founderSectionData.title),
    imageSrc: normalizeApiImagePath(founderApiData?.image) ?? founderSectionData.imageSrc,
    imageAlt: founderSectionData.imageAlt,
  };
}

export async function getCoursesHeroViewModel() {
  const siteContentData = await getSiteContentData();
  const coursesHeroApiData = siteContentData?.courses_hero;

  return {
    title: pickString(coursesHeroApiData?.title, coursesHeroSectionData.title),
    description: pickString(coursesHeroApiData?.description, coursesHeroSectionData.description),
    illustration: coursesHeroSectionData.illustration,
    illustrationAlt: coursesHeroSectionData.illustrationAlt,
  };
}

export async function getCoursesProcessViewModel() {
  const siteContentData = await getSiteContentData();
  const coursesProcessApiData = siteContentData?.courses_process;

  const groupsFromApi =
    coursesProcessApiData?.course_categories
      ?.filter((category) => isNonEmptyString(category.title))
      .map((category) => ({
        category: category.title ?? "",
        steps:
          category.steps
            ?.filter((step) => isNonEmptyString(step.title) && isNonEmptyString(step.description))
            .map((step) => ({
              title: step.title ?? "",
              description: step.description ?? "",
            })) ?? [],
      }))
      .filter((category) => category.steps.length > 0) ?? [];

  return {
    eyebrow: pickString(coursesProcessApiData?.eyebrow, processSectionData.eyebrow),
    heading: pickString(coursesProcessApiData?.title, processSectionData.heading),
    description: pickString(coursesProcessApiData?.description, processSectionData.description),
    stepGroups: pickNonEmptyArray(groupsFromApi, processSectionData.stepGroups),
  };
}

export async function getCoursesSectionViewModel() {
  const siteContentData = await getSiteContentData();
  const coursesApiData = siteContentData?.courses;

  return {
    eyebrow: pickString(coursesApiData?.eyebrow, courseSectionData.eyebrow),
    heading: pickString(coursesApiData?.title, courseSectionData.heading),
    description: pickString(coursesApiData?.description, courseSectionData.description),
  };
}

export async function getEnrollHeroViewModel() {
  const siteContentData = await getSiteContentData();
  const enrollHeroApiData = siteContentData?.enroll_hero;

  return {
    title: pickString(enrollHeroApiData?.title, enrollHeroData.title),
    description: pickString(enrollHeroApiData?.description, enrollHeroData.description),
    illustration: enrollHeroData.illustration,
    illustrationAlt: enrollHeroData.illustrationAlt,
  };
}
