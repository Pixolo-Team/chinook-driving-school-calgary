// TYPES //
import type {
  CourseCategoryData,
  EnrollmentFormValueData,
  EnrollmentPayloadData,
  TimeSlotData,
} from "@/react/types/enrollment.type";

const TIME_SLOT_MAP: Record<string, TimeSlotData> = {
  morning: {
    start_time: "09:00",
    end_time: "12:00",
  },
  afternoon: {
    start_time: "12:00",
    end_time: "16:00",
  },
  evening: {
    start_time: "16:00",
    end_time: "20:00",
  },
};

const LEGACY_PAYMENT_METHOD_MAP: Record<string, string> = {
  online: "upi",
  in_person: "cash",
};

/**
 * Converts the section-based enrollment form value into the API payload shape.
 */
export function transformEnrollmentPayload(
  enrollmentFormValue: EnrollmentFormValueData,
  courseCategories: CourseCategoryData[],
): EnrollmentPayloadData {
  const selectedCourseInfo =
    courseCategories.flatMap((courseCategoryItem) => courseCategoryItem.courses).find(
      (courseItem) =>
        courseItem.id ===
        (enrollmentFormValue.select_course.course.course_id ??
          enrollmentFormValue.select_course.course.selected_course_ids?.[0]),
    ) ?? null;

  return {
    session_type: enrollmentFormValue.select_course.session_type ?? "",
    course: selectedCourseInfo ?? {},
    student_first_name: enrollmentFormValue.user_info.first_name,
    student_last_name: enrollmentFormValue.user_info.last_name,
    student_date_of_birth: enrollmentFormValue.user_info.date_of_birth,
    student_address: enrollmentFormValue.user_info.address,
    student_city: enrollmentFormValue.user_info.city,
    student_state: enrollmentFormValue.user_info.state,
    student_postal_code: enrollmentFormValue.user_info.postal_code,
    student_email: enrollmentFormValue.user_info.email,
    student_mobile_phone_number: enrollmentFormValue.user_info.phone,
    license_status: enrollmentFormValue.license_information.status,
    license_number: enrollmentFormValue.license_information.number,
    license_issuing_region: enrollmentFormValue.license_information.issuing_region,
    license_type: enrollmentFormValue.license_information.type,
    license_issue_date: enrollmentFormValue.license_information.issue_date,
    license_expiry_date: enrollmentFormValue.license_information.expiry_date,
    driving_experience: enrollmentFormValue.license_information.experience,
    availability_date: enrollmentFormValue.availability.date,
    avilability_time_slots: enrollmentFormValue.availability.time_slots.map(
      (timeSlotValueItem) => TIME_SLOT_MAP[timeSlotValueItem],
    ),
    availability_days_of_week: enrollmentFormValue.availability.days,
    parent_full_name: enrollmentFormValue.parent_information.full_name,
    parent_email: enrollmentFormValue.parent_information.email,
    parent_contact_number: enrollmentFormValue.parent_information.contact_number,
    payment_method:
      LEGACY_PAYMENT_METHOD_MAP[enrollmentFormValue.payment_details.method] ??
      enrollmentFormValue.payment_details.method,
    amount:
      enrollmentFormValue.payment_details.amount ||
      enrollmentFormValue.select_course.course.total_amount ||
      0,
    name_on_card: enrollmentFormValue.payment_details.name_on_card,
    card_number: enrollmentFormValue.payment_details.card_number,
    expiry_date: enrollmentFormValue.payment_details.expiry_date,
    did_agree_conditions: enrollmentFormValue.payment_details.did_agree_conditions,
  };
}
