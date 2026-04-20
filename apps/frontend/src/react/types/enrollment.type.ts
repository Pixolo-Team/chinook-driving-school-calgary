export interface EnrollmentPayloadData {
  session_type: string;

  course: Partial<CourseData>;
  courses?: Array<Partial<CourseData>>;

  student_first_name: string;
  student_middle_name?: string | null;
  student_last_name: string;
  student_date_of_birth: string; // YYYY-MM-DD
  student_address: string;
  student_city: string;
  student_state: string;
  student_postal_code: string;
  student_email: string;
  student_mobile_phone_number: string;

  license_status: string;
  license_number: string | null;
  license_issuing_region: string | null;
  license_type: string | null;
  license_issue_date: string | null;
  license_expiry_date: string | null;
  driving_experience: string;

  availability_date: string;
  avilability_time_slots: TimeSlotData[];
  availability_days_of_week: string[];

  parent_full_name: string | null;
  parent_email: string | null;
  parent_contact_number: string | null;

  payment_method: string;
  amount: number;
  name_on_card: string | null;
  card_number: string | null;
  expiry_date: string | null;

  did_agree_conditions: boolean;
}

export interface EnrollmentResponseData<T> {
  status: boolean;
  status_code: number;
  message: string;
  data?: T;
  error: string;
}

export type ProvinceOptionData = { name: string; value: string };

export type TimeSlotData = {
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
};

type CourseFeatureData = {
  title: string;
};

export type CourseData = {
  id: string;
  name: string;
  course_price: number;
  tax_amount: number;
  total_amount: number;
  hours_in_car: number;
  hours_in_classroom: number;
  image: string;
  features: CourseFeatureData[];
};

export type CourseCategoryData = {
  id: string;
  name: string;
  description: string;
  image: string;
  courses: CourseData[];
};

export type StepStateData = "completed" | "untouched" | "pending";

export type SessionOptionData = {
  label: string;
  value: string;
};

// Broken Down Payload data into Steps
export type SelectCourseValueData = {
  session_type: string | null;
  course: {
    selected_course_ids: string[];
    course_id: string | null;
    course_price: number | null;
    tax_amount: number | null;
    total_amount: number | null;
  };
};

export type UserInfoValueData = {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  email: string;
  phone: string;
};

export type LicenseInformationValueData = {
  status: string;
  number: string | null;
  issuing_region: string | null;
  type: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  experience: string;
};

export type AvailabilityValueData = {
  date: string;
  days: string[];
  time_slots: string[];
};

export type ParentInformationValueData = {
  full_name: string | null;
  email: string | null;
  contact_number: string | null;
};

export type PaymentDetailsValueData = {
  method: string;
  amount: number;
  name_on_card: string | null;
  card_number: string | null;
  expiry_date: string | null;
  did_agree_conditions: boolean;
};

export type EnrollmentFormValueData = {
  select_course: SelectCourseValueData;
  user_info: UserInfoValueData;
  license_information: LicenseInformationValueData;
  availability: AvailabilityValueData;
  parent_information: ParentInformationValueData;
  payment_details: PaymentDetailsValueData;
};
