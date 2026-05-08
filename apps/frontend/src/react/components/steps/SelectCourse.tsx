// REACT //
import React, { useCallback, useEffect, useMemo, useState } from "react";

// TYPES //
import type {
  CourseCategoryData,
  SelectCourseValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Dropdown from "@/react/components/ui/Dropdown";
import InfoBox from "@/react/components/ui/InfoBox";
import RadioCustomGroup from "@/react/components/ui/RadioCustomGroup";

// CONSTANTS //
import {
  resolveCourseCategoryImage,
  SESSION_TYPE_OPTIONS,
} from "@/react/constants/form-items";

const DRIVING_CATEGORY_ID = "driving-courses";
const BRUSH_UP_CATEGORY_ID = "brush-up-lessons";
const CAR_RENTAL_CATEGORY_ID = "car-rental";

type CourseSelectionCategoryData = "driving" | "brush_up" | "car_rental" | "unknown";

type SelectCoursePropsData = Readonly<{
  courses: CourseCategoryData[];
  isLoadingCourses?: boolean;
  coursesErrorMessage?: string | null;
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
  courses,
  isLoadingCourses = false,
  coursesErrorMessage = null,
  value,
  onChange,
  registerValidator,
  onNext,
}: SelectCoursePropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeCourseCategoryValue, setActiveCourseCategoryValue] = useState<string>(
    courses.find((courseCategoryItem) => {
      const normalizedCategoryId = courseCategoryItem.id.trim().toLowerCase();
      const normalizedCategoryName = courseCategoryItem.name.trim().toLowerCase();

      return normalizedCategoryId === DRIVING_CATEGORY_ID || normalizedCategoryName === "driving courses";
    })?.id ??
      courses[0]?.id ??
      "",
  );
  const [touchedFields, setTouchedFields] = useState<SelectCourseTouchedFieldsData>({
    session_type: false,
    course: false,
  });

  const activeSessionValue: string = value.session_type ?? "";
  const selectedCourseIds: string[] = value.course.selected_course_ids ?? [];
  const activeCourseTypeValue: string = activeCourseCategoryValue || courses[0]?.id || "";
  const allCourses = useMemo(
    () => courses.flatMap((courseCategoryItem) => courseCategoryItem.courses),
    [courses],
  );
  const allCoursesById = useMemo(
    () =>
      allCourses.reduce<Record<string, CourseCategoryData["courses"][number]>>(
        (accumulator, courseItem) => {
          accumulator[courseItem.id] = courseItem;
          return accumulator;
        },
        {},
      ),
    [allCourses],
  );
  const courseCategoryByCourseId = useMemo(() => {
    const nextCourseCategoryByCourseId: Record<string, CourseSelectionCategoryData> = {};

    courses.forEach((courseCategoryItem) => {
      const normalizedCategoryId = courseCategoryItem.id.trim().toLowerCase();
      const normalizedCategoryName = courseCategoryItem.name.trim().toLowerCase();

      let resolvedCategory: CourseSelectionCategoryData = "unknown";

      if (normalizedCategoryId === DRIVING_CATEGORY_ID || normalizedCategoryName === "driving courses") {
        resolvedCategory = "driving";
      } else if (
        normalizedCategoryId === BRUSH_UP_CATEGORY_ID ||
        normalizedCategoryName === "brush up lessons"
      ) {
        resolvedCategory = "brush_up";
      } else if (
        normalizedCategoryId === CAR_RENTAL_CATEGORY_ID ||
        normalizedCategoryName === "car rental"
      ) {
        resolvedCategory = "car_rental";
      }

      courseCategoryItem.courses.forEach((courseItem) => {
        nextCourseCategoryByCourseId[courseItem.id] = resolvedCategory;
      });
    });

    return nextCourseCategoryByCourseId;
  }, [courses]);
  const selectedCourseInfos = useMemo(
    () =>
      selectedCourseIds
        .map((courseId) => allCoursesById[courseId])
        .filter(Boolean),
    [allCoursesById, selectedCourseIds],
  );
  const selectedDrivingCourses = selectedCourseInfos.filter(
    (courseItem) => courseCategoryByCourseId[courseItem.id] === "driving",
  );
  const selectedBrushUpCourses = selectedCourseInfos.filter(
    (courseItem) => courseCategoryByCourseId[courseItem.id] === "brush_up",
  );
  const selectedCarRentalCourses = selectedCourseInfos.filter(
    (courseItem) => courseCategoryByCourseId[courseItem.id] === "car_rental",
  );
  const hasSelectedDrivingCourse = selectedDrivingCourses.some(
    (courseItem) => Number(courseItem.hours_in_classroom ?? 0) > 0,
  );
  const hasSelectedAnyCourse = selectedCourseIds.length > 0;

  /** Change the Courses when the Course Type changes */
  const selectedCourseCategoryInfo: CourseCategoryData | undefined = useMemo(
    () =>
      courses.find(
        (courseCategoryItem: CourseCategoryData) => courseCategoryItem.id === activeCourseTypeValue,
      ),
    [activeCourseTypeValue, courses],
  );
  const activeCourseSelectionCategory = useMemo<CourseSelectionCategoryData>(() => {
    const normalizedCategoryId = selectedCourseCategoryInfo?.id.trim().toLowerCase() ?? "";
    const normalizedCategoryName = selectedCourseCategoryInfo?.name.trim().toLowerCase() ?? "";

    if (normalizedCategoryId === DRIVING_CATEGORY_ID || normalizedCategoryName === "driving courses") {
      return "driving";
    }

    if (normalizedCategoryId === BRUSH_UP_CATEGORY_ID || normalizedCategoryName === "brush up lessons") {
      return "brush_up";
    }

    if (normalizedCategoryId === CAR_RENTAL_CATEGORY_ID || normalizedCategoryName === "car rental") {
      return "car_rental";
    }

    return "unknown";
  }, [selectedCourseCategoryInfo]);
  const isDrivingCoursesCategory = activeCourseSelectionCategory === "driving";
  const requiresSessionType = hasSelectedDrivingCourse;
  const shouldShowSessionType =
    activeCourseSelectionCategory === "driving" ||
    (activeCourseSelectionCategory === "car_rental" && selectedDrivingCourses.length > 0);

  /** Set the Course Type options data as needed by the component */
  const courseTypeOptions = useMemo(
    () =>
      courses.map((courseCategoryItem: CourseCategoryData) => ({
        value: courseCategoryItem.id,
        title: courseCategoryItem.name,
        imageSrc: (
          resolveCourseCategoryImage(courseCategoryItem.id, courseCategoryItem.name) ??
          courseCategoryItem.image
        ) || undefined,
        imageAlt: courseCategoryItem.name,
      })),
    [courses],
  );

  /** Set the Available Courses for the active category panel. */
  const availableCourseOptions = useMemo(
    () =>
      (selectedCourseCategoryInfo?.courses ?? []).map((courseItem) => ({
        value: courseItem.id,
        label: courseItem.name,
        description: ` ${courseItem.course_price}+GST= $${courseItem.total_amount.toFixed(2)}${
          isDrivingCoursesCategory ? " Insurance Reduction" : ""
        }`,
      })),
    [isDrivingCoursesCategory, selectedCourseCategoryInfo],
  );

  const selectedCategoryValues = useMemo(
    () =>
      courses
        .filter((courseCategoryItem) =>
          courseCategoryItem.courses.some((courseItem) => selectedCourseIds.includes(courseItem.id)),
        )
        .map((courseCategoryItem) => courseCategoryItem.id),
    [courses, selectedCourseIds],
  );

  // Helper Functions
  const buildSelectedCourseValue = useCallback((
    nextSelectedCourseIds: string[],
    preferredCourseId?: string | null,
  ): SelectCourseValueData["course"] => {
    const selectedCourseInfos = nextSelectedCourseIds
      .map((courseId) => allCoursesById[courseId])
      .filter(Boolean);

    const primaryCourseInfo =
      selectedCourseInfos.find((courseItem) => courseItem?.id === preferredCourseId) ??
      selectedCourseInfos[selectedCourseInfos.length - 1];

    if (!selectedCourseInfos.length || !primaryCourseInfo) {
      return {
        selected_course_ids: [],
        course_id: null,
        course_price: null,
        tax_amount: null,
        total_amount: null,
      };
    }

    const totals = selectedCourseInfos.reduce(
      (accumulator, courseItem) => ({
        course_price: accumulator.course_price + (courseItem?.course_price ?? 0),
        tax_amount: accumulator.tax_amount + (courseItem?.tax_amount ?? 0),
        total_amount: accumulator.total_amount + (courseItem?.total_amount ?? 0),
      }),
      {
        course_price: 0,
        tax_amount: 0,
        total_amount: 0,
      },
    );

    return {
      selected_course_ids: nextSelectedCourseIds,
      course_id: primaryCourseInfo.id,
      course_price: totals.course_price,
      tax_amount: totals.tax_amount,
      total_amount: totals.total_amount,
    };
  }, [allCoursesById]);

  const sanitizeSelectedCourseIds = useCallback((courseIds: string[]): string[] => {
    const nextSelectedCourseIds: string[] = [];
    let hasDrivingCourse = false;
    let hasBrushUpCourse = false;
    let hasCarRentalCourse = false;

    courseIds.forEach((courseId) => {
      const courseCategory = courseCategoryByCourseId[courseId];

      if (courseCategory === "driving") {
        if (hasDrivingCourse || hasBrushUpCourse) {
          return;
        }

        hasDrivingCourse = true;
        nextSelectedCourseIds.push(courseId);
        return;
      }

      if (courseCategory === "brush_up") {
        if (hasBrushUpCourse || hasDrivingCourse) {
          return;
        }

        hasBrushUpCourse = true;
        nextSelectedCourseIds.push(courseId);
        return;
      }

      if (courseCategory === "car_rental") {
        if (hasCarRentalCourse) {
          return;
        }

        hasCarRentalCourse = true;
        nextSelectedCourseIds.push(courseId);
        return;
      }

      nextSelectedCourseIds.push(courseId);
    });

    return nextSelectedCourseIds;
  }, [courseCategoryByCourseId]);

  const isCourseOptionDisabled = useCallback((courseId: string): boolean => {
    if (selectedCourseIds.includes(courseId)) {
      return false;
    }

    const courseCategory = courseCategoryByCourseId[courseId];

    if (courseCategory === "driving") {
      return selectedDrivingCourses.length > 0 || selectedBrushUpCourses.length > 0;
    }

    if (courseCategory === "brush_up") {
      return selectedBrushUpCourses.length > 0 || selectedDrivingCourses.length > 0;
    }

    if (courseCategory === "car_rental") {
      return selectedCarRentalCourses.length > 0;
    }

    return false;
  }, [
    courseCategoryByCourseId,
    selectedBrushUpCourses.length,
    selectedCarRentalCourses.length,
    selectedCourseIds,
    selectedDrivingCourses.length,
  ]);

  const markFieldAsTouched = (fieldKey: keyof SelectCourseTouchedFieldsData): void => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  };

  const revealValidationErrors = (): void => {
    setTouchedFields({
      session_type: requiresSessionType,
      course: true,
    });
  };

  const getSessionTypeError = (): string | null =>
    !requiresSessionType
      ? null
      : activeSessionValue && activeSessionValue !== "not_applicable"
        ? null
        : "Please select a session type.";

  const getCourseError = (): string | null =>
    isLoadingCourses
      ? "Courses are loading. Please wait a moment."
      : coursesErrorMessage
        ? coursesErrorMessage
        : selectedCourseIds.length > 0
          ? null
          : "Please select at least one course before continuing.";

  /**
   * Updates the active Course Type panel without changing the selected courses.
   */
  const handleCourseTypeChange = (value: string): void => {
    setActiveCourseCategoryValue(value);
  };

  /**
   * Adds or removes a course from the multi-select state.
   */
  const handleCourseChange = (courseId: string, checked: boolean): void => {
    const courseCategory = courseCategoryByCourseId[courseId];
    let nextSelectedCourseIds = checked
      ? Array.from(new Set([...selectedCourseIds, courseId]))
      : selectedCourseIds.filter((selectedCourseId) => selectedCourseId !== courseId);

    if (checked && (courseCategory === "driving" || courseCategory === "brush_up")) {
      nextSelectedCourseIds = nextSelectedCourseIds.filter((selectedCourseId) => {
        if (selectedCourseId === courseId) {
          return true;
        }

        const selectedCourseCategory = courseCategoryByCourseId[selectedCourseId];

        if (selectedCourseCategory === courseCategory) {
          return false;
        }

        if (courseCategory === "driving" && selectedCourseCategory === "brush_up") {
          return false;
        }

        if (courseCategory === "brush_up" && selectedCourseCategory === "driving") {
          return false;
        }

        return true;
      });
    }

    if (checked && courseCategory === "car_rental") {
      nextSelectedCourseIds = nextSelectedCourseIds.filter((selectedCourseId) => {
        if (selectedCourseId === courseId) {
          return true;
        }

        return courseCategoryByCourseId[selectedCourseId] !== "car_rental";
      });
    }

    nextSelectedCourseIds = sanitizeSelectedCourseIds(nextSelectedCourseIds);

    onChange(
      "course",
      buildSelectedCourseValue(nextSelectedCourseIds, checked ? courseId : value.course.course_id),
    );
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
    if (getCourseError() || getSessionTypeError()) {
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
    if (activeCourseCategoryValue) {
      return;
    }

    const defaultCourseCategory =
      courses.find((courseCategoryItem) => {
        const normalizedCategoryId = courseCategoryItem.id.trim().toLowerCase();
        const normalizedCategoryName = courseCategoryItem.name.trim().toLowerCase();

        return normalizedCategoryId === DRIVING_CATEGORY_ID || normalizedCategoryName === "driving courses";
      }) ?? courses[0];

    if (defaultCourseCategory?.id) {
      setActiveCourseCategoryValue(defaultCourseCategory.id);
    }
  }, [activeCourseCategoryValue, courses]);

  useEffect(() => {
    if (activeCourseTypeValue) {
      return;
    }

    const firstSelectedCategoryInfo = courses.find((courseCategoryItem) =>
      courseCategoryItem.courses.some((courseItem) => selectedCourseIds.includes(courseItem.id)),
    );

    if (firstSelectedCategoryInfo) {
      setActiveCourseCategoryValue(firstSelectedCategoryInfo.id);
    }
  }, [activeCourseTypeValue, courses, selectedCourseIds]);

  useEffect(() => {
    const sanitizedSelectedCourseIds = sanitizeSelectedCourseIds(selectedCourseIds);

    const hasSelectionChanged =
      sanitizedSelectedCourseIds.length !== selectedCourseIds.length ||
      sanitizedSelectedCourseIds.some((courseId, index) => courseId !== selectedCourseIds[index]);

    if (!hasSelectionChanged) {
      return;
    }

    onChange(
      "course",
      buildSelectedCourseValue(sanitizedSelectedCourseIds, value.course.course_id),
    );
  }, [
    buildSelectedCourseValue,
    onChange,
    sanitizeSelectedCourseIds,
    selectedCourseIds,
    value.course.course_id,
  ]);

  useEffect(() => {
    if (hasSelectedAnyCourse && !requiresSessionType && value.session_type !== "not_applicable") {
      onChange("session_type", "not_applicable");
      return;
    }

    if (requiresSessionType && value.session_type === "not_applicable") {
      onChange("session_type", null);
    }
  }, [hasSelectedAnyCourse, onChange, requiresSessionType, value.session_type]);

  useEffect(() => {
    // Register the Validator (so parent can use it)
    registerValidator?.(1, getStepState);
  }, [registerValidator, value, activeCourseCategoryValue]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-5 md:gap-7">
      <div className="flex w-full flex-col gap-5 md:gap-7">
        {shouldShowSessionType ? (
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
        ) : null}

        {/* Course Type Options */}
        <div className="flex w-full flex-col gap-[10px] md:gap-3">
          <RadioCustomGroup
            label="Select Course Category"
            items={courseTypeOptions}
            selectedValues={selectedCategoryValues}
            activeValue={activeCourseTypeValue}
            onChangeSelection={handleCourseTypeChange}
            containerClassName="grid w-full grid-cols-1 gap-2 md:grid-cols-3 md:gap-4"
            itemContainerClassName="min-w-0"
          />
          {coursesErrorMessage ? (
            <p className="text-red-500 text-sm leading-5 font-normal">{coursesErrorMessage}</p>
          ) : null}
        </div>

        {isDrivingCoursesCategory ? <InfoBox /> : null}

        {/* Enrollment Options */}
        <div className="flex w-full flex-col gap-[10px] md:gap-5">
          <div className="flex w-full flex-col gap-5 md:gap-10">
            <p className="text-n-900 flex items-center gap-1 text-lg leading-normal font-semibold">
              <span>Enroll me in</span>
              <span aria-hidden="true" className="text-red-500">*</span>
            </p>
            <p className="text-n-600 text-sm leading-5 md:text-base">
              Choose one driving lesson package or one brush up lesson. Car rental can be added to either of those, or booked on its own.
            </p>

            <div className="grid w-full grid-cols-1 gap-[10px] md:grid-cols-3 md:gap-4">
              {availableCourseOptions.map((courseOption) => {
                const isChecked = selectedCourseIds.includes(courseOption.value);
                const isDisabled = isCourseOptionDisabled(courseOption.value);

                return (
                  <label
                    key={courseOption.value}
                    className={`relative flex w-full items-center gap-6 rounded-[8px] border px-[21px] py-[17px] transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isChecked
                        ? "border-blue-500 bg-blue-500 text-n-50"
                        : isDisabled
                          ? "cursor-not-allowed border-n-200 bg-n-100 text-n-400 opacity-70"
                          : "cursor-pointer border-n-300 bg-n-50 text-n-600 hover:scale-[1.01] hover:shadow-[0_10px_24px_rgba(14,23,43,0.08)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={(event) => {
                        markFieldAsTouched("course");
                        handleCourseChange(courseOption.value, event.target.checked);
                      }}
                      className="peer sr-only"
                    />

                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 ${
                        isChecked
                          ? "border-n-50 bg-blue-500 text-n-50"
                          : "border-n-300 bg-n-50 text-transparent"
                      }`}
                    >
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4.4 8.3 6.8 10.7 11.6 5.9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <span className={`min-w-0 flex-1 text-base leading-5 ${isChecked ? "text-n-50" : "text-n-600"}`}>
                      <span className="font-semibold">{courseOption.label}</span>
                      <span className="font-medium">{courseOption.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {shouldShowCourseError ? (
              <p className="text-sm leading-5 font-normal text-red-500">{courseError}</p>
            ) : null}
          </div>
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
