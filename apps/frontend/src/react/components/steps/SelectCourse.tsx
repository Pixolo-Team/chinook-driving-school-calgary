// REACT //
import React, { useEffect, useMemo, useState } from "react";

// TYPES //
import type {
  CourseCategoryData,
  SelectCourseValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import RadioCustomGroup from "../ui/RadioCustomGroup";
import RadioGroup from "../ui/RadioGroup";

// CONSTANTS //
import { COURSES, SESSION_TYPE_OPTIONS } from "@/react/constants/form-items";

// COMPONENT PROPS //
type SelectCoursePropsData = Readonly<{
  value: SelectCourseValueData;
  onChange: (
    fieldKey: keyof SelectCourseValueData,
    fieldValue: SelectCourseValueData[keyof SelectCourseValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
}>;

/**
 * Renders the Course selection step and validates selections before proceeding.
 */
export default function SelectCourse({
  value,
  onChange,
  registerValidator,
  onNext,
}: SelectCoursePropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedCourseTypeValue, setSelectedCourseTypeValue] = useState<string>(
    COURSES[0]?.id ?? "",
  );
  const [isSelectionErrorVisible, setIsSelectionErrorVisible] = useState<boolean>(false);

  const activeSessionValue: string = value.session_type ?? "";
  const activeCourseTypeValue: string = selectedCourseTypeValue || (COURSES[0]?.id ?? "");
  const activeCourseValue: string = value.course.course_id ?? "";

  /** Change the Courses when the Course Type changes */
  const selectedCourseCategoryInfo: CourseCategoryData | undefined = useMemo(
    () =>
      COURSES.find(
        (courseCategoryItem: CourseCategoryData) => courseCategoryItem.id === activeCourseTypeValue,
      ),
    [activeCourseTypeValue],
  );

  /** Set the Course Type options data as needed by the component */
  const courseTypeOptions = useMemo(
    () =>
      COURSES.map((courseCategoryItem: CourseCategoryData) => ({
        value: courseCategoryItem.id,
        title: courseCategoryItem.name,
        imageSrc: courseCategoryItem.image || undefined,
        imageAlt: courseCategoryItem.name,
      })),
    [],
  );

  /** Set the Available Courses, as needed by the Radio Component */
  const availableCourseOptions = useMemo(
    () =>
      (selectedCourseCategoryInfo?.courses ?? []).map((courseItem) => ({
        value: courseItem.id,
        label: courseItem.name,
        description: `($${courseItem.course_price}+GST= $${courseItem.total_amount.toFixed(2)} Insurance Reduction)`,
      })),
    [selectedCourseCategoryInfo],
  );

  // Helper Functions
  /**
   * Updates the selected Course Type and clears the selected Course.
   */
  const handleCourseTypeChange = (value: string): void => {
    // Reset the selected Course whenever the Course Type changes
    setSelectedCourseTypeValue(value);
    setIsSelectionErrorVisible(false);

    // Update the Parent State
    onChange("course", {
      course_id: null,
      course_price: null,
      tax_amount: null,
      total_amount: null,
    });
  };

  /**
   * Updates the selected Course value.
   */
  const handleCourseChange = (value: string): void => {
    // Clear the validation error after a valid Course selection change
    const selectedCourseInfo = selectedCourseCategoryInfo?.courses.find(
      (courseItem) => courseItem.id === value,
    );

    setIsSelectionErrorVisible(false);

    // Update the Parent State
    onChange("course", {
      course_id: selectedCourseInfo?.id ?? null,
      course_price: selectedCourseInfo?.course_price ?? null,
      tax_amount: selectedCourseInfo?.tax_amount ?? null,
      total_amount: selectedCourseInfo?.total_amount ?? null,
    });
  };

  /**
   * Updates the selected Session Type value.
   */
  const handleSessionChange = (value: string): void => {
    // Session Type is optional, but changing it should clear any stale validation message
    setIsSelectionErrorVisible(false);

    // Update the Parent State
    onChange("session_type", value || null);
  };

  /**
   * Evaluates the completion state for the Select Course step.
   */
  const getStepState = (): StepStateData => {
    // Course Type and Course are required to move forward
    if (!activeCourseTypeValue || !activeCourseValue) {
      return "pending";
    }

    // Session Type upgrades the step from pending to completed
    if (activeSessionValue) {
      return "completed";
    }

    return "pending";
  };

  /**
   * Validates the step before asking the parent to move forward.
   */
  const handleNext = (): void => {
    const stepStateInfo: StepStateData = getStepState();

    // Block navigation when the required selections are missing
    if (stepStateInfo === "untouched") {
      setIsSelectionErrorVisible(true);
      return;
    }

    onNext?.(stepStateInfo);
  };

  // Use Effects
  useEffect(() => {
    if (!selectedCourseTypeValue && COURSES[0]?.id) {
      setSelectedCourseTypeValue(COURSES[0].id);
    }
  }, [selectedCourseTypeValue]);

  useEffect(() => {
    // Register the Validator (so parent can use it)
    registerValidator?.(1, getStepState);
  }, [registerValidator, value, selectedCourseTypeValue]);

  return (
    <section className="bg-n-50 flex w-full flex-col items-center">
      <div className="flex w-full max-w-screen-2xl flex-col items-end gap-8 px-6 py-12 md:px-12 xl:px-20">
        <div className="flex w-full flex-col gap-7">
          {/* Session Type Dropdown */}
          <Dropdown
            label="Session Type"
            name="session-type"
            value={activeSessionValue}
            onChange={(event) => handleSessionChange(event.target.value)}
            placeholder="Select Session"
            helperText="Optional. Select a session type if you already know your preferred format."
            options={SESSION_TYPE_OPTIONS}
            containerClassName="max-w-none"
          />

          {/* Course Type Radio */}
          <RadioCustomGroup
            label="Course Type"
            items={courseTypeOptions}
            selected={activeCourseTypeValue}
            onChangeSelection={handleCourseTypeChange}
          />

          {/* Courses Radio */}
          <RadioGroup
            label="Course"
            name="enrollment-course"
            items={availableCourseOptions}
            selectedItem={activeCourseValue}
            onChange={handleCourseChange}
            containerClassName="gap-4"
          />

          {/* Error Message */}
          {isSelectionErrorVisible ? (
            <p className="text-sm leading-6" style={{ color: "var(--color-error-500, #dc2626)" }}>
              Select both a course type and a course before continuing.
            </p>
          ) : null}
        </div>

        {/* Next Button */}
        <div className="flex w-full items-center justify-end gap-4">
          <Button variant="filled" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
