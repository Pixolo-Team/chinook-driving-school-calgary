export interface EnrollmentPayload {
  [key: string]: unknown;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
