// LIBRARIES //
import axios, { type AxiosRequestConfig } from "axios";

// TYPES //
import type { EnrollmentPayloadData, EnrollmentResponseData } from "../../types/enrollment.type";

/**
 * Submits the enrollment payload to the Chinook Calgary enrollment API.
 */
export async function submitEnrollmentRequest(
  payload: EnrollmentPayloadData,
): Promise<EnrollmentResponseData<EnrollmentPayloadData>> {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: "https://api.pixoloproductions.com/chinook/calgary/enroll.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  };

  // Make the API Call and return Data
  const response = await axios.request<EnrollmentResponseData<EnrollmentPayloadData>>(config);
  return response.data;
}
