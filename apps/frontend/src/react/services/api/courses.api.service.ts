// LIBRARIES //
import axios, { type AxiosRequestConfig } from "axios";

// TYPES //
import type { CourseCategoryData, EnrollmentResponseData } from "../../types/enrollment.type";

/**
 * Fetches the available course catalog from the Chinook Calgary courses API.
 */
export async function fetchCoursesRequest(): Promise<EnrollmentResponseData<CourseCategoryData[]>> {
  const config: AxiosRequestConfig = {
    method: "get",
    url: "http://127.0.0.1:8000/courses.php",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.request<EnrollmentResponseData<CourseCategoryData[]>>(config);
  return response.data;
}
