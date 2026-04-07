import { courseSectionData } from "@/data/courses";
import { getCourseGroups, type Course, type CourseGroup } from "@/data/courses-api";
import type { CourseCardData, CourseGroupData } from "@/types/course";

// Rotated across cards so the API-driven list keeps the same visual rhythm as the static design.
const DEFAULT_CARD_STYLES = [
  { theme: "light", ellipse: "light" },
  { theme: "brand", ellipse: "blue", badge: "Most Popular" },
  { theme: "light", ellipse: "light-alt" },
] as const;

// Static content used when the API is unavailable or returns empty groups.
export const fallbackCourseTabs = courseSectionData.tabs;
export const fallbackCourseCards = courseSectionData.cards;
export const fallbackCourseGroups: CourseGroupData[] = courseSectionData.tabs.map((tab, index) => ({
  tab,
  cards: index === 0 ? courseSectionData.cards : [],
}));

export interface CourseSectionData {
  cards: CourseCardData[];
  courseGroups: CourseGroupData[];
  tabs: string[];
}

export function mapCourseToCard(course: Course, index: number): CourseCardData {
  // Reuse the predefined card treatments in a repeating sequence.
  const style = DEFAULT_CARD_STYLES[index % DEFAULT_CARD_STYLES.length];
  const hoursInCar = Number(course.hours_in_car ?? 0);
  const hoursInClassroom = Number(course.hours_in_classroom ?? 0);
  const totalHours = hoursInCar + hoursInClassroom;

  return {
    title: course.name?.trim() || courseSectionData.cards[index]?.title || "Course",
    price: `$${course.course_price ?? 0}`,
    duration: totalHours > 0 ? `${totalHours} Hours` : "Flexible Schedule",
    practice: {
      label: "Car Practice",
      value: hoursInCar > 0 ? `${hoursInCar} Hours` : "Contact Us",
    },
    classroom: hoursInClassroom > 0
      ? {
          label: "Classroom Practice",
          value: `${hoursInClassroom} Hours`,
        }
      : undefined,
    features: course.features
      .map((feature) => feature.title?.trim())
      .filter((feature): feature is string => Boolean(feature)),
    theme: style.theme,
    ellipse: style.ellipse,
    badge: style.badge,
  };
}

export function mapCourseGroupsToCardGroups(groups: CourseGroup[]): CourseGroupData[] {
  return groups
    .map((courseType) => {
      
      // Ignore unnamed groups so tabs always have a usable label.
      const tab = courseType.name?.trim();

      if (!tab) {
        return null;
      }

      return {
        tab,
        cards: courseType.courses.map((course, index) => mapCourseToCard(course, index)),
      };
    })
    .filter((group): group is CourseGroupData => Boolean(group));
}

export async function getCourseSectionData(): Promise<CourseSectionData> {
  // Keep a ready-to-use fallback so the section still renders if the API fails.
  const fallbackData: CourseSectionData = {
    tabs: fallbackCourseTabs,
    cards: fallbackCourseCards,
    courseGroups: fallbackCourseGroups,
  };

  try {
    const groups = await getCourseGroups();
    const groupsFromApi = mapCourseGroupsToCardGroups(groups);

    if (!groupsFromApi.length) {
      return fallbackData;
    }

    return {
      tabs: groupsFromApi.map((group) => group.tab),
      cards: groupsFromApi[0]?.cards?.length ? groupsFromApi[0].cards : fallbackCourseCards,
      courseGroups: groupsFromApi,
    };
  } catch (error) {
    console.warn("Failed to load course groups for the courses section.", error);
    return fallbackData;
  }
}
