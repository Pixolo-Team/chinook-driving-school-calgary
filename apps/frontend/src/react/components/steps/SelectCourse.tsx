// REACT //
import React, { useEffect, useMemo, useState } from "react";

// TYPES //
import type {
  CourseCategoryData,
  SelectCourseValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Dropdown from "@/react/components/ui/Dropdown";
import RadioCustomGroup from "@/react/components/ui/RadioCustomGroup";
import RadioGroup from "@/react/components/ui/RadioGroup";

// CONSTANTS //
import { COURSES, SESSION_TYPE_OPTIONS } from "@/react/constants/form-items";

type SelectCoursePropsData = Readonly<{
  value: SelectCourseValueData;
  onChange: (
    fieldKey: keyof SelectCourseValueData,
    fieldValue: SelectCourseValueData[keyof SelectCourseValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
}>;

type SelectCourseTouchedFieldsData = {
  session_type: boolean;
  course: boolean;
};

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
  const [touchedFields, setTouchedFields] = useState<SelectCourseTouchedFieldsData>({
    session_type: false,
    course: false,
  });

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
        description: `${courseItem.course_price}+GST= $${courseItem.total_amount.toFixed(2)} Insurance Reduction`,
      })),
    [selectedCourseCategoryInfo],
  );

  // Helper Functions
  const markFieldAsTouched = (fieldKey: keyof SelectCourseTouchedFieldsData): void => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  };

  const revealValidationErrors = (): void => {
    setTouchedFields({
      session_type: true,
      course: true,
    });
  };

  const getSessionTypeError = (): string | null =>
    activeSessionValue ? null : "Please select a session type.";

  const getCourseError = (): string | null =>
    activeCourseValue ? null : "Please select a course before continuing.";

  /**
   * Updates the selected Course Type and clears the selected Course.
   */
  const handleCourseTypeChange = (value: string): void => {
    // Reset the selected Course whenever the Course Type changes
    setSelectedCourseTypeValue(value);

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
    const selectedCourseInfo = selectedCourseCategoryInfo?.courses.find(
      (courseItem) => courseItem.id === value,
    );

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
    // Update the Parent State
    onChange("session_type", value || null);
  };

  /**
   * Evaluates the completion state for the Select Course step.
   */
  const getStepState = (): StepStateData => {
    if (!activeCourseTypeValue || getCourseError() || getSessionTypeError()) {
      return "pending";
    }

    return "completed";
  };

  /**
   * Validates the step before asking the parent to move forward.
   */
  const handleNext = (): void => {
    revealValidationErrors();

    if (getStepState() !== "completed") {
      return;
    }

    onNext?.(getStepState());
  };

  const sessionTypeError = getSessionTypeError();
  const courseError = getCourseError();
  const shouldShowSessionTypeError = touchedFields.session_type && Boolean(sessionTypeError);
  const shouldShowCourseError = touchedFields.course && Boolean(courseError);

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
    <section className="bg-n-50 flex w-full flex-col gap-5 md:gap-7">
      <div className="flex w-full flex-col gap-5 md:gap-7">
        {/* Session Type Dropdown */}
        <Dropdown
          label="Select Session Type:"
          name="session-type"
          value={activeSessionValue}
          onChange={(event) => {
            markFieldAsTouched("session_type");
            handleSessionChange(event.target.value);
          }}
          placeholder="Select Session"
          options={SESSION_TYPE_OPTIONS}
          helperText=""
          isError={shouldShowSessionTypeError}
          errorMessage={sessionTypeError ?? undefined}
          containerClassName="max-w-none gap-[10px]"
          labelClassName="text-n-800 text-base leading-5 font-semibold md:text-lg"
          showTriggerLabel={false}
          styleVariant="minimal"
        />

        {/* Course Type Options */}
        <div className="flex w-full flex-col gap-[10px] md:gap-3">
          <RadioCustomGroup
            label="Select Primary Course"
            items={courseTypeOptions}
            selected={activeCourseTypeValue}
            onChangeSelection={handleCourseTypeChange}
            containerClassName="grid w-full grid-cols-1 gap-2 md:grid-cols-3 md:gap-4"
            itemContainerClassName="min-w-0"
          />
        </div>

        {/* Enrollment Options */}
        <div className="flex w-full flex-col gap-[10px] md:gap-5">
          <RadioGroup
            label="Enroll me in"
            name="enrollment-course"
            caption=""
            isError={shouldShowCourseError}
            errorMessage={courseError ?? undefined}
            items={availableCourseOptions}
            selectedItem={activeCourseValue}
            onChange={(value) => {
              markFieldAsTouched("course");
              handleCourseChange(value);
            }}
            containerClassName="grid w-full grid-cols-1 gap-[10px] md:grid-cols-3 md:gap-4"
            itemContainerClassName="min-w-0"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex w-full items-center justify-end gap-4">
        <Button
          variant="filled"
          onClick={handleNext}
          className="w-full text-[14px] md:w-auto md:text-lg"
        >
          Continue to User Info
        </Button>
      </div>
    </section>
  );
}
