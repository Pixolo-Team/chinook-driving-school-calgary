interface SupabaseResult<T> {
  data: T | null;
  ok: boolean;
}

interface CourseTypeRow {
  description: string | null;
  id: string;
  image: string | null;
  name: string;
}

interface CourseRow {
  features?: string[] | null;
  course_price?: number | string | null;
  course_type_id: string;
  hours_in_car?: number | string | null;
  hours_in_classroom?: number | string | null;
  id: string;
  image?: string | null;
  name: string;
  tax_amount?: number | string | null;
  total_amount?: number | string | null;
}

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

const SUPABASE_URL = "https://rwosruoldgimytqwdkwg.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3b3NydW9sZGdpbXl0cXdka3dnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgzNjI2MSwiZXhwIjoyMDkwNDEyMjYxfQ.Cy9CHcQhqM1_fgPsIofIVS8ivTn50LSBEola2OgADR0";

async function supabaseSelect<T>(table: string): Promise<SupabaseResult<T>> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return {
      ok: false,
      data: null,
    };
  }

  return {
    ok: true,
    data: await response.json() as T,
  };
}

export async function getCourseGroups(): Promise<CourseGroup[]> {
  const [courseTypesResult, coursesResult] = await Promise.all([
    supabaseSelect<CourseTypeRow[]>("course_types"),
    supabaseSelect<CourseRow[]>("courses"),
  ]);

  if (!courseTypesResult.ok || !coursesResult.ok || !courseTypesResult.data || !coursesResult.data) {
    throw new Error("Failed to fetch course data from Supabase.");
  }

  const courseGroupMap: Record<string, CourseGroup> = {};

  courseTypesResult.data.forEach((courseType) => {
    courseGroupMap[courseType.id] = {
      id: courseType.id,
      name: courseType.name,
      description: courseType.description,
      image: courseType.image,
      courses: [],
    };
  });

  coursesResult.data.forEach((course) => {
    const group = courseGroupMap[course.course_type_id];

    if (!group) {
      return;
    }

    group.courses.push({
      id: course.id,
      name: course.name,
      course_price: course.course_price,
      tax_amount: course.tax_amount,
      total_amount: course.total_amount,
      hours_in_car: course.hours_in_car,
      hours_in_classroom: course.hours_in_classroom,
      image: course.image,
      features: (course.features || []).map((feature) => ({
        title: feature,
      })),
    });
  });

  return Object.values(courseGroupMap);
}
