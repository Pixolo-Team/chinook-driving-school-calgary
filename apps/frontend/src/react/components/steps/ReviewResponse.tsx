// REACT //
import React, { useMemo } from "react";

// TYPES //
import type { EnrollmentFormValueData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";

// CONSTANTS //
import {
  COURSES,
  DRIVING_EXPERIENCE_ITEMS,
  LICENSE_ISSUING_REGIONS,
  LICENSE_TYPES,
  PAYMENT_METHOD_ITEMS,
  PREFERRED_DAYS_ITEMS,
  TIME_SLOT_ITEMS,
} from "@/react/constants/form-items";

type ReviewResponsePropsData = Readonly<{
  value: EnrollmentFormValueData;
  onEditStep?: (stepId: number) => void;
  onSubmit?: () => void;
}>;

/**
 * Renders the final enrollment summary review before submission.
 */
export default function ReviewResponse({
  value,
  onEditStep,
  onSubmit,
}: ReviewResponsePropsData): React.JSX.Element {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const selectedCourseInfos = useMemo(
    () =>
      COURSES.flatMap((courseCategoryItem) => courseCategoryItem.courses).filter((courseItem) =>
        (value.select_course.course.selected_course_ids ?? []).includes(courseItem.id),
      ),
    [value.select_course.course.selected_course_ids],
  );

  const selectedPaymentMethodInfo = useMemo(
    () =>
      PAYMENT_METHOD_ITEMS.find((paymentMethodItem) => paymentMethodItem.name === value.payment_details.method),
    [value.payment_details.method],
  );

  const selectedLicenseTypeInfo = useMemo(
    () => LICENSE_TYPES.find((licenseTypeItem) => licenseTypeItem.value === value.license_information.type),
    [value.license_information.type],
  );

  const selectedProvinceInfo = useMemo(
    () =>
      LICENSE_ISSUING_REGIONS.find(
        (provinceItem) => provinceItem.value === value.license_information.issuing_region,
      ),
    [value.license_information.issuing_region],
  );

  const selectedDaysLabel = useMemo(
    () =>
      PREFERRED_DAYS_ITEMS.filter((preferredDayItem) => value.availability.days.includes(preferredDayItem.value)).map(
        (preferredDayItem) => preferredDayItem.label,
      ),
    [value.availability.days],
  );

  const selectedTimeSlotsLabel = useMemo(
    () =>
      TIME_SLOT_ITEMS.filter((timeSlotItem) => value.availability.time_slots.includes(timeSlotItem.value)).map(
        (timeSlotItem) => {
          if (timeSlotItem.value === "morning") {
            return "9:00 AM - 11:00 AM";
          }

          if (timeSlotItem.value === "afternoon") {
            return "11:00 AM - 2:00 PM";
          }

          return "2:00 PM - 5:00 PM";
        },
      ),
    [value.availability.time_slots],
  );

  const selectedExperienceInfo = useMemo(
    () =>
      DRIVING_EXPERIENCE_ITEMS.find(
        (drivingExperienceItem) => drivingExperienceItem.value === value.license_information.experience,
      ),
    [value.license_information.experience],
  );

  const selectedAmountValue: string = `$${(
    value.select_course.course.total_amount ??
    value.payment_details.amount ??
    0
  ).toFixed(2)}`;

  const renderEditButton = (stepId: number): React.JSX.Element => {
    return (
      <Button
        variant="filled"
        onClick={() => onEditStep?.(stepId)}
        className="min-h-[32px] rounded-full bg-blue-100 px-4 py-2 text-sm leading-5 font-medium text-n-800 hover:bg-blue-200"
      >
        Edit
      </Button>
    );
  };

  // Use Effects
  return (
    <section className="bg-n-50 flex w-full flex-col gap-8 md:gap-10">
      <div className="flex w-full flex-col gap-6 md:gap-8">
        <p className="text-n-800 text-xl leading-normal font-bold md:text-2xl">
          Review & Confirm
        </p>

        <div className="border-n-300 flex w-full flex-col gap-4 rounded-xl border p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-n-800 text-lg leading-normal font-bold">Course Selection</p>
            {renderEditButton(1)}
          </div>
          <div className="bg-n-100 flex items-center justify-between gap-4 rounded-lg px-6 py-6">
            <div className="flex flex-col gap-1">
              {selectedCourseInfos.length ? (
                selectedCourseInfos.map((selectedCourseInfo) => (
                  <div key={selectedCourseInfo.id} className="flex flex-col gap-1">
                    <p className="text-n-800 text-base leading-6 font-bold">{selectedCourseInfo.name}</p>
                    <p className="text-n-600 text-sm leading-5 font-normal">
                      {`${selectedCourseInfo.hours_in_car} In-car hours • ${selectedCourseInfo.hours_in_classroom} classroom hours`}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-n-800 text-base leading-6 font-bold">Selected Course</p>
                  <p className="text-n-600 text-sm leading-5 font-normal">Course details pending</p>
                </>
              )}
            </div>
            <p className="text-n-800 text-base leading-6 font-bold">{selectedAmountValue}</p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="border-n-300 flex w-full flex-col gap-4 rounded-xl border p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-n-800 text-lg leading-normal font-bold">Student Information</p>
              {renderEditButton(2)}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Full Name
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {[value.user_info.first_name, value.user_info.middle_name, value.user_info.last_name]
                    .filter(Boolean)
                    .join(" ") || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Email Address
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {value.user_info.email || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Phone
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {value.user_info.phone || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Address
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {[value.user_info.address, value.user_info.city, value.user_info.state].filter(Boolean).join(", ") || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-n-300 flex w-full flex-col gap-4 rounded-xl border p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-n-800 text-lg leading-normal font-bold">License Information</p>
              {renderEditButton(3)}
            </div>
            <div className="bg-n-100 flex flex-col gap-1 rounded-lg px-5 py-5">
              <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                Current Status
              </p>
              <p className="text-n-800 text-base leading-5 font-semibold">
                {value.license_information.status === "permanent"
                  ? "Class 5"
                  : value.license_information.status === "learning"
                    ? "Learner License"
                    : value.license_information.status === "none"
                      ? "No License Yet"
                      : "Other"}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  License Number
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {value.license_information.number || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  License Type
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {selectedLicenseTypeInfo?.label || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Driving Experience
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {selectedExperienceInfo?.label || "Not provided"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                  Issuing Region
                </p>
                <p className="text-n-800 text-base leading-5 font-medium">
                  {selectedProvinceInfo?.name || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-n-300 flex w-full flex-col gap-4 rounded-xl border p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-n-800 text-lg leading-normal font-bold">Preferred Availability</p>
            {renderEditButton(4)}
          </div>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                Start Date
              </p>
              <p className="text-n-800 text-base leading-5 font-medium">
                {value.availability.date || "Not provided"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                Days
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedDaysLabel.length > 0 ? (
                  selectedDaysLabel.map((dayLabel) => (
                    <span key={dayLabel} className="bg-n-100 text-n-800 rounded px-2 py-1 text-xs leading-4 font-bold">
                      {dayLabel}
                    </span>
                  ))
                ) : (
                  <p className="text-n-800 text-base leading-5 font-medium">Not provided</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-n-500 text-xs leading-4 font-semibold tracking-[0.6px] uppercase">
                Time Slots
              </p>
              <p className="text-n-800 text-base leading-5 font-medium">
                {selectedTimeSlotsLabel.join(", ") || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-n-300 flex w-full flex-col gap-4 rounded-xl border p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-n-800 text-lg leading-normal font-bold">Payment Method</p>
            {renderEditButton(6)}
          </div>
          <div className="border-n-300 flex items-center justify-between gap-4 rounded-lg border px-5 py-5">
            <div className="flex flex-col gap-1">
              <p className="text-n-800 text-base leading-6 font-bold">
                {selectedPaymentMethodInfo?.title || "Payment Method"}
              </p>
              <p className="text-n-600 text-sm leading-5 font-normal">
                {value.payment_details.card_number
                  ? `Card ending in ${value.payment_details.card_number.slice(-4)}`
                  : selectedPaymentMethodInfo?.description || "Details pending"}
              </p>
            </div>
            <span className="bg-blue-500 text-n-50 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
              ✓
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button variant="filled" onClick={onSubmit} className="min-h-0 px-8 py-4 text-sm md:text-lg">
          Complete Enrollment
        </Button>
      </div>
    </section>
  );
}
