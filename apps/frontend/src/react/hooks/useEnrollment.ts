// REACT //
import { useState } from "react";

// SERVICES //
import { submitEnrollmentRequest } from "../services/api/enrollment.api.service";

// TYPES //
import type {
  EnrollmentPayloadData,
  EnrollmentResponseData,
} from "../types/enrollment.type";

/**
 * Manages the enrollment submission lifecycle for the React flow.
 */
export function useEnrollment(): {
  enroll: (payload: EnrollmentPayloadData) => Promise<EnrollmentResponseData<EnrollmentPayloadData>>;
  isSubmitting: boolean;
  response: EnrollmentResponseData<EnrollmentPayloadData> | null;
} {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<EnrollmentResponseData<EnrollmentPayloadData> | null>(
    null,
  );

  // Helper Functions
  async function enroll(
    payload: EnrollmentPayloadData,
  ): Promise<EnrollmentResponseData<EnrollmentPayloadData>> {
    // Start the submission state before making the API request
    setIsSubmitting(true);

    try {
      const enrollmentResponseInfo = await submitEnrollmentRequest(payload);
      setResponse(enrollmentResponseInfo);
      return enrollmentResponseInfo;
    } finally {
      setIsSubmitting(false);
    }
  }

  // Use Effects

  return {
    enroll,
    isSubmitting,
    response,
  };
}
