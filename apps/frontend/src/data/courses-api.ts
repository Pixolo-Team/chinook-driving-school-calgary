export interface CourseFeature {
  title: string;
}

export interface Course {
  course_price?: number | string | null;
  features: CourseFeature[];
  hours_in_car?: number | string | null;
  hours_in_classroom?: number | string | null;
  id: string;
  image?: string | null;
  name: string;
  tax_amount?: number | string | null;
  total_amount?: number | string | null;
}

export interface CourseGroup {
  courses: Course[];
  description: string | null;
  id: string;
  image: string | null;
  name: string;
}

// Served by the PHP backend so the Supabase service-role key never appears in
// frontend source (direct Supabase calls shipped that key to the browser).
const COURSES_API_URL = "https://api.pixoloproductions.com/chinook/calgary/courses.php";

interface CourseApiRow {
  course_price?: number | string | null;
  features?: Array<{ title?: string }> | null;
  hours_in_car?: number | string | null;
  hours_in_classroom?: number | string | null;
  id: string;
  image?: string | null;
  name: string;
  tax_amount?: number | string | null;
  total_amount?: number | string | null;
}

interface CourseCategoryApiRow {
  courses?: CourseApiRow[] | null;
  description: string | null;
  id: string;
  image: string | null;
  name: string;
}

interface CoursesApiResponse {
  data?: CourseCategoryApiRow[] | null;
  status?: boolean;
}

/**
 * Fetches the full course catalog from the Chinook Calgary courses API.
 *
 * @throws When the request fails or the payload is malformed, so callers can
 * fall back to static content instead of rendering a half-empty section.
 */
export async function getCourseGroups(): Promise<CourseGroup[]> {
  const response = await fetch(COURSES_API_URL, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Course catalog request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as CoursesApiResponse;

  if (payload.status !== true || !Array.isArray(payload.data)) {
    throw new Error("Course catalog response did not contain any groups.");
  }

  return payload.data.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    courses: (category.courses ?? []).map((course) => ({
      id: course.id,
      name: course.name,
      course_price: course.course_price,
      tax_amount: course.tax_amount,
      total_amount: course.total_amount,
      hours_in_car: course.hours_in_car,
      hours_in_classroom: course.hours_in_classroom,
      image: course.image,
      features: (course.features ?? []).flatMap((feature) =>
        feature?.title ? [{ title: feature.title }] : [],
      ),
    })),
  }));
}
