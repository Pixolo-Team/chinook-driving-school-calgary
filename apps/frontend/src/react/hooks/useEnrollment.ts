import { useState } from "react";

import { submitEnrollment } from "../services/api/enrollment.api.service";
import type { EnrollmentPayload, EnrollmentResponse } from "../types/enrollment.type";

export function useEnrollment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<EnrollmentResponse | null>(null);

  async function enroll(payload: EnrollmentPayload) {
    setIsSubmitting(true);

    try {
      const result = await submitEnrollment(payload);
      setResponse(result);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    enroll,
    isSubmitting,
    response,
  };
}
