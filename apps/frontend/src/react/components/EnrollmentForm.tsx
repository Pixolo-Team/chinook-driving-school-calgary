// REACT //
import React, { useEffect, useRef, useState } from "react";

// TYPES //
import type {
  AvailabilityValueData,
  CourseCategoryData,
  EnrollmentFormValueData,
  EnrollmentPayloadData,
  EnrollmentResponseData,
  LicenseInformationValueData,
  ParentInformationValueData,
  StepStateData,
  PaymentDetailsValueData,
  UserInfoValueData,
} from "@/react/types/enrollment.type";
import type { StepStatusData } from "@/react/types/steps.type";

// COMPONENTS //
import Availability from "@/react/components/steps/Availability";
import LicenseInformation from "@/react/components/steps/LicenseInformation";
import ParentInformation from "@/react/components/steps/ParentInformation";
import PaymentDetails from "@/react/components/steps/PaymentDetails";
import SelectCourse from "@/react/components/steps/SelectCourse";
import SubmissionModal from "@/react/components/ui/SubmissionModal";
import UserInfo from "@/react/components/steps/UserInfo";
import Steps from "@/react/components/ui/Steps";

// API SERVICES //
import { submitEnrollmentRequest } from "@/react/services/api/enrollment.api.service";

// CONSTANTS //
import { TOTAL_ENROLLMENT_STEPS } from "@/react/constants/form-items";

// UTILS //
import { transformEnrollmentPayload } from "@/react/utils/api.util";

type SubmissionModalStateData = {
  isOpen: boolean;
  mode: "checking" | "sending" | "result";
  title: string;
  message: string;
};

type EnrollmentFormStorageData = {
  currentStep: number;
  stepStates: Record<number, StepStateData>;
  enrollmentFormValue: EnrollmentFormValueData;
};

type EnrollmentFormPropsData = Readonly<{
  courseCategories: CourseCategoryData[];
  isCoursesLoading: boolean;
  coursesErrorMessage?: string | null;
  onSuccess?: () => void;
}>;

const ENROLLMENT_FORM_STORAGE_KEY = "chinook-enrollment-form";

const LEGACY_LICENSE_REGION_MAP: Record<string, string> = {
  alberta: "AB",
  "british-columbia": "BC",
  manitoba: "MB",
  ontario: "ON",
  saskatchewan: "SK",
};

const LEGACY_LICENSE_TYPE_MAP: Record<string, string> = {
  "class-7": "CLASS_7",
  "class-5-gdl": "CLASS_5_GDL",
  "class-5-full": "CLASS_5",
  international: "OTHER",
};

/**
 * Coordinates the multi-step enrollment flow and stores the shared form state.
 */
export default function EnrollmentForm({
  courseCategories,
  isCoursesLoading,
  coursesErrorMessage = null,
  onSuccess,
}: EnrollmentFormPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs
  const stepValidators = useRef<Record<number, () => StepStateData>>({});
  const hasHydratedFromStorageRef = useRef<boolean>(false);
  const stepCheckIntervalRef = useRef<number | null>(null);
  const isSubmissionCancelledRef = useRef<boolean>(false);

  // Define States
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepStates, setStepStates] = useState<Record<number, StepStateData>>({
    1: "pending",
    2: "untouched",
    3: "untouched",
    4: "untouched",
    5: "untouched",
    6: "untouched",
  });
  const [enrollmentFormValue, setEnrollmentFormValue] = useState<EnrollmentFormValueData>({
    select_course: {
      session_type: null,
      course: {
        course_id: null,
        course_price: null,
        tax_amount: null,
        total_amount: null,
      },
    },
    user_info: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      email: "",
      phone: "",
    },
    license_information: {
      status: "none",
      number: null,
      issuing_region: null,
      type: null,
      issue_date: null,
      expiry_date: null,
      experience: "no-experience",
    },
    availability: {
      date: "",
      days: [],
      time_slots: [],
    },
    parent_information: {
      full_name: null,
      email: null,
      contact_number: null,
    },
    payment_details: {
      method: "card",
      amount: 0,
      name_on_card: null,
      card_number: null,
      expiry_date: null,
      did_agree_conditions: true,
    },
  });
  const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalStateData>({
    isOpen: false,
    mode: "result",
    title: "",
    message: "",
  });
  const [submissionStepStatuses, setSubmissionStepStatuses] = useState<Record<number, StepStatusData>>({
    1: "untouched",
    2: "untouched",
    3: "untouched",
    4: "untouched",
    5: "untouched",
    6: "untouched",
  });
  // Helper Functions
  /**
   * Migrates older saved license values into the current backend-safe format.
   */
  const normalizeStoredEnrollmentFormValue = (
    storedValue: EnrollmentFormValueData,
  ): EnrollmentFormValueData => ({
    ...storedValue,
    license_information: {
      ...storedValue.license_information,
      issuing_region: storedValue.license_information.issuing_region
        ? LEGACY_LICENSE_REGION_MAP[storedValue.license_information.issuing_region] ??
          storedValue.license_information.issuing_region
        : storedValue.license_information.issuing_region,
      type: storedValue.license_information.type
        ? LEGACY_LICENSE_TYPE_MAP[storedValue.license_information.type] ??
          storedValue.license_information.type
        : storedValue.license_information.type,
    },
  });

  /**
   * Registers a validator function for a step.
   */
  const registerValidator = (stepId: number, validatorFunction: () => StepStateData): void => {
    stepValidators.current[stepId] = validatorFunction;
  };

  /**
   * Clears the persisted enrollment draft from local storage.
   */
  function clearEnrollmentFormStorage(): void {
    window.localStorage.removeItem(ENROLLMENT_FORM_STORAGE_KEY);
  }

  /**
   * Updates a single field inside an enrollment section.
   */
  function updateEnrollmentSectionValue<
    SectionKeyData extends keyof EnrollmentFormValueData,
    FieldKeyData extends keyof EnrollmentFormValueData[SectionKeyData],
  >(
    sectionKey: SectionKeyData,
    fieldKey: FieldKeyData,
    fieldValue: EnrollmentFormValueData[SectionKeyData][FieldKeyData],
  ): void {
    // Merge the target section so updates stay localized to the requested field
    setEnrollmentFormValue((currentEnrollmentFormValue) => ({
      ...currentEnrollmentFormValue,
      [sectionKey]: {
        ...currentEnrollmentFormValue[sectionKey],
        [fieldKey]: fieldValue,
      },
    }));
  }

  /**
   * Returns the latest known state for a step using its registered validator.
   */
  const findStepState = (stepId: number): StepStateData => {
    // Fetch the function
    const validatorFunction = stepValidators.current[stepId];

    // Execute the function - or return untouched
    return validatorFunction?.() ?? stepStates[stepId] ?? "untouched";
  };

  /**
   * Clears the in-flight step-check interval if it exists.
   */
  const clearStepCheckInterval = (): void => {
    if (stepCheckIntervalRef.current !== null) {
      window.clearInterval(stepCheckIntervalRef.current);
      stepCheckIntervalRef.current = null;
    }
  };

  /**
   * Waits for the specified number of milliseconds.
   */
  const waitForMilliseconds = async (durationInMs: number): Promise<void> => {
    await new Promise((resolveDelay) => {
      window.setTimeout(resolveDelay, durationInMs);
    });
  };

  /**
   * Animates step validation one item at a time with a 400ms interval.
   */
  const animateStepChecks = async (
    targetStepStates: Record<number, StepStateData>,
  ): Promise<void> => {
    const stepIds: number[] = [1, 2, 3, 4, 5, 6];

    setSubmissionStepStatuses({
      1: "untouched",
      2: "untouched",
      3: "untouched",
      4: "untouched",
      5: "untouched",
      6: "untouched",
    });

    await new Promise<void>((resolveValidationAnimation) => {
      let currentIndex: number = 0;

      clearStepCheckInterval();

      stepCheckIntervalRef.current = window.setInterval(() => {
        if (isSubmissionCancelledRef.current) {
          clearStepCheckInterval();
          resolveValidationAnimation();
          return;
        }

        if (currentIndex >= stepIds.length) {
          clearStepCheckInterval();
          resolveValidationAnimation();
          return;
        }

        const currentStepId: number = stepIds[currentIndex];

        setSubmissionStepStatuses((currentStates) => ({
          ...currentStates,
          [currentStepId]: targetStepStates[currentStepId] ?? "untouched",
        }));

        currentIndex += 1;
      }, 400);
    });
  };

  /**
   * Closes the submission popup and clears its message state.
   */
  const closeSubmissionModal = (): void => {
    isSubmissionCancelledRef.current = true;
    clearStepCheckInterval();

    setSubmissionModalState({
      isOpen: false,
      mode: "result",
      title: "",
      message: "",
    });
  };

  /**
   * Navigates directly to an incomplete step from the submission checker popup.
   */
  const jumpToStepFromModal = (stepId: number): void => {
    closeSubmissionModal();
    setCurrentStep(Math.min(Math.max(stepId, 1), TOTAL_ENROLLMENT_STEPS));
  };

  /**
   * Validates all steps and submits the enrollment payload when everything is complete.
   */
  const handleEnrollmentCompletion = async (): Promise<void> => {
    isSubmissionCancelledRef.current = false;

    const currentStepStatesInfo: Record<number, StepStateData> = {
      1: findStepState(1),
      2: findStepState(2),
      3: findStepState(3),
      4: findStepState(4),
      5: findStepState(5),
      6: findStepState(6),
    };

    setStepStates(currentStepStatesInfo);
    setSubmissionModalState({
      isOpen: true,
      mode: "checking",
      title: "Checking Your Enrollment Form",
      message: "",
    });
    await animateStepChecks(currentStepStatesInfo);

    if (isSubmissionCancelledRef.current) {
      return;
    }

    // Check all steps
    const hasIncompleteSteps: boolean = Object.values(currentStepStatesInfo).some(
      (stepStateItem) => stepStateItem !== "completed",
    );

    // Steps are not complete then show message
    if (hasIncompleteSteps) {
      setSubmissionModalState({
        isOpen: true,
        mode: "checking",
        title: "Checking Your Details",
        message: "Please complete the highlighted sections to continue.",
      });
      return;
    }

    // Transform the Input Values
    const enrollmentPayloadInfo: EnrollmentPayloadData =
      transformEnrollmentPayload(enrollmentFormValue, courseCategories);
    const requestStartedAtInMs: number = Date.now();

    setSubmissionModalState({
      isOpen: true,
      mode: "sending",
      title: "",
      message: "",
    });

    try {
      // Submit the data to API
      const enrollmentResponseInfo: EnrollmentResponseData<EnrollmentPayloadData> =
        await submitEnrollmentRequest(enrollmentPayloadInfo);

      if (isSubmissionCancelledRef.current) {
        return;
      }

      if (!enrollmentResponseInfo.status) {
        const elapsedMs: number = Date.now() - requestStartedAtInMs;

        if (elapsedMs < 2000) {
          await waitForMilliseconds(2000 - elapsedMs);
        }

        if (isSubmissionCancelledRef.current) {
          return;
        }
      }

      // Show Success or Error message
      setSubmissionModalState({
        isOpen: true,
        mode: "result",
        title: enrollmentResponseInfo.status ? "Enrollment Submitted" : "Submission Result",
        message: enrollmentResponseInfo.message,
      });

      if (enrollmentResponseInfo.status) {
        clearEnrollmentFormStorage();
        onSuccess?.();
      }
    } catch (error) {
      const elapsedMs: number = Date.now() - requestStartedAtInMs;

      if (elapsedMs < 2000) {
        await waitForMilliseconds(2000 - elapsedMs);
      }

      if (isSubmissionCancelledRef.current) {
        return;
      }

      const errorMessage: string =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting the enrollment form.";

      setSubmissionModalState({
        isOpen: true,
        mode: "result",
        title: "Submission Failed",
        message: errorMessage,
      });
    }
  };

  /**
   * Stores the state returned by the current step and advances to the next step.
   */
  const goToNextStep = (stepState?: StepStateData): void => {
    const currentStepState: StepStateData = stepState ?? findStepState(currentStep);

    // Set the State of the current Step (as told by the Step Section)
    setStepStates((currentStates) => ({
      ...currentStates,
      [currentStep]: currentStepState,
    }));

    // Go to Next Step
    setCurrentStep((step) => Math.min(step + 1, TOTAL_ENROLLMENT_STEPS));
  };

  /**
   * Stores the state returned by the current step and moves back one step.
   */
  const goToPreviousStep = (stepState?: StepStateData): void => {
    const currentStepState: StepStateData = stepState ?? findStepState(currentStep);

    // Set the State of the current Step (as told by the Step Section)
    setStepStates((currentStates) => ({
      ...currentStates,
      [currentStep]: currentStepState,
    }));
    // Go to Previous Step
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  /**
   * Stores the payment step state and submits the enrollment directly.
   */
  const handlePaymentSubmission = (stepState?: StepStateData): void => {
    const currentStepState: StepStateData = stepState ?? findStepState(currentStep);

    setStepStates((currentStates) => ({
      ...currentStates,
      [currentStep]: currentStepState,
    }));

    void handleEnrollmentCompletion();
  };

  /**
   * Validates the current step before changing steps from the stepper.
   */
  const handleStepChange = (stepId: number): void => {
    const currentStepState: StepStateData = findStepState(currentStep);

    setStepStates((currentStates) => ({
      ...currentStates,
      [currentStep]: currentStepState,
    }));
    setCurrentStep(Math.min(stepId, TOTAL_ENROLLMENT_STEPS));
  };

  /**
   * Renders the active step section for the current step number.
   */
  const renderCurrentStep = (): React.JSX.Element => {
    switch (currentStep) {
      case 2:
        return (
          <UserInfo
            value={enrollmentFormValue.user_info}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue(
                "user_info",
                fieldKey as keyof UserInfoValueData,
                fieldValue as UserInfoValueData[keyof UserInfoValueData],
              )
            }
            registerValidator={registerValidator}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <LicenseInformation
            value={enrollmentFormValue.license_information}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue(
                "license_information",
                fieldKey as keyof LicenseInformationValueData,
                fieldValue as LicenseInformationValueData[keyof LicenseInformationValueData],
              )
            }
            registerValidator={registerValidator}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <Availability
            value={enrollmentFormValue.availability}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue(
                "availability",
                fieldKey as keyof AvailabilityValueData,
                fieldValue as AvailabilityValueData[keyof AvailabilityValueData],
              )
            }
            registerValidator={registerValidator}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 5:
        return (
          <ParentInformation
            value={enrollmentFormValue.parent_information}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue(
                "parent_information",
                fieldKey as keyof ParentInformationValueData,
                fieldValue as ParentInformationValueData[keyof ParentInformationValueData],
              )
            }
            registerValidator={registerValidator}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 6:
        return (
          <PaymentDetails
            value={enrollmentFormValue.payment_details}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue(
                "payment_details",
                fieldKey as keyof PaymentDetailsValueData,
                fieldValue as PaymentDetailsValueData[keyof PaymentDetailsValueData],
              )
            }
            registerValidator={registerValidator}
            onNext={handlePaymentSubmission}
            onPrevious={goToPreviousStep}
          />
        );
      case 1:
      default:
        return (
          <SelectCourse
            courses={courseCategories}
            isLoadingCourses={isCoursesLoading}
            coursesErrorMessage={coursesErrorMessage}
            value={enrollmentFormValue.select_course}
            onChange={(fieldKey, fieldValue) =>
              updateEnrollmentSectionValue("select_course", fieldKey, fieldValue)
            }
            registerValidator={registerValidator}
            onNext={goToNextStep}
          />
        );
    }
  };

  // Use Effects
  useEffect(() => {
    const storedEnrollmentFormValue: string | null = window.localStorage.getItem(
      ENROLLMENT_FORM_STORAGE_KEY,
    );

    if (!storedEnrollmentFormValue) {
      hasHydratedFromStorageRef.current = true;
      return;
    }

    try {
      const parsedEnrollmentFormValue: EnrollmentFormStorageData = JSON.parse(
        storedEnrollmentFormValue,
      ) as EnrollmentFormStorageData;

      setCurrentStep(
        Math.min(parsedEnrollmentFormValue.currentStep ?? 1, TOTAL_ENROLLMENT_STEPS),
      );
      setStepStates(parsedEnrollmentFormValue.stepStates ?? stepStates);
      setEnrollmentFormValue(
        parsedEnrollmentFormValue.enrollmentFormValue
          ? normalizeStoredEnrollmentFormValue(parsedEnrollmentFormValue.enrollmentFormValue)
          : enrollmentFormValue,
      );
    } catch {
      clearEnrollmentFormStorage();
    } finally {
      hasHydratedFromStorageRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedFromStorageRef.current) {
      return;
    }

    const enrollmentFormStorageValue: EnrollmentFormStorageData = {
      currentStep,
      stepStates,
      enrollmentFormValue,
    };

    window.localStorage.setItem(
      ENROLLMENT_FORM_STORAGE_KEY,
      JSON.stringify(enrollmentFormStorageValue),
    );
  }, [currentStep, enrollmentFormValue, stepStates]);

  useEffect(() => {
    return () => {
      clearStepCheckInterval();
    };
  }, []);

  return (
    <section className="container mx-auto flex min-h-screen w-full flex-col gap-5 px-4 py-9 sm:px-6 md:gap-8 md:px-7 lg:px-8 lg:py-12 xl:px-10">
      {/* Steps Component */}
      <Steps currentStep={currentStep} stepStates={stepStates} onStepChange={handleStepChange} />

      {/* Step Section (Renders based on Step) */}
      {renderCurrentStep()}

      <SubmissionModal
        isOpen={submissionModalState.isOpen}
        mode={submissionModalState.mode}
        title={submissionModalState.title}
        message={submissionModalState.message}
        stepStatuses={submissionStepStatuses}
        onSelectStep={jumpToStepFromModal}
        onClose={closeSubmissionModal}
      />
    </section>
  );
}
