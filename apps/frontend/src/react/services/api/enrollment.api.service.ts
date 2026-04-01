import type { EnrollmentPayload, EnrollmentResponse } from "../../types/enrollment.type";

export async function submitEnrollment(
  payload: EnrollmentPayload,
): Promise<EnrollmentResponse> {
  return {
    success: false,
    message: "Enrollment API not implemented.",
    data: payload,
  };
}
