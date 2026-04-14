// LIBRARIES //
import axios, { type AxiosRequestConfig } from "axios";

// TYPES //
import type { CourseCategoryData, EnrollmentResponseData } from "../../types/enrollment.type";

/**
 * Fetches the available course catalog from the Chinook Calgary courses API.
 */
export async function fetchCoursesRequest(): Promise<
  EnrollmentResponseData<CourseCategoryData[]>
> {
  const config: AxiosRequestConfig = {
    method: "get",
    url: "https://api.pixoloproductions.com/chinook/calgary/courses.php",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.request<EnrollmentResponseData<CourseCategoryData[]>>(config);
  return response.data;
}
