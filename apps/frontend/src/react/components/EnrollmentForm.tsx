// REACT //
import React, { useEffect, useRef, useState } from "react";

// TYPES //
import type {
  AvailabilityValueData,
  EnrollmentFormValueData,
  EnrollmentResponseData,
  LicenseInformationValueData,
  ParentInformationValueData,
  PaymentDetailsValueData,
  EnrollmentPayloadData,
  StepStateData,
  UserInfoValueData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Availability from "./steps/Availability";
import LicenseInformation from "./steps/LicenseInformation";
import ParentInformation from "./steps/ParentInformation";
import PaymentDetails from "./steps/PaymentDetails";
import SelectCourse from "./steps/SelectCourse";
import SubmissionModal from "./ui/SubmissionModal";
import UserInfo from "./steps/UserInfo";
import Steps from "./ui/Steps";

// CONSTANTS //
import { TOTAL_ENROLLMENT_STEPS } from "../constants/form-items";

// SERVICES //
import { submitEnrollmentRequest } from "../services/api/enrollment.api.service";

// UTILS //
import { transformEnrollmentPayload } from "../utils/api.util";

type SubmissionModalStateData = {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  message: string;
};

type EnrollmentFormStorageData = {
  currentStep: number;
  stepStates: Record<number, StepStateData>;
  enrollmentFormValue: EnrollmentFormValueData;
};

type EnrollmentFormPropsData = Readonly<{
  onSuccess?: () => void;
}>;

const ENROLLMENT_FORM_STORAGE_KEY = "chinook-enrollment-form";

/**
 * Coordinates the multi-step enrollment flow and stores the shared form state.
 */
export default function EnrollmentForm({ onSuccess }: EnrollmentFormPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs
  const stepValidators = useRef<Record<number, () => StepStateData>>({});
  const hasHydratedFromStorageRef = useRef<boolean>(false);

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
      did_agree_conditions: false,
    },
  });
  const [submissionModalState, setSubmissionModalState] = useState<SubmissionModalStateData>({
    isOpen: false,
    isLoading: false,
    title: "",
    message: "",
  });

  // Helper Functions
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
   * Waits for a fixed delay before continuing the submission flow.
   */
  const waitForSubmissionDelay = async (): Promise<void> => {
    await new Promise((resolveDelay) => {
      window.setTimeout(resolveDelay, 2000);
    });
  };

  /**
   * Closes the submission popup and clears its message state.
   */
  const closeSubmissionModal = (): void => {
    setSubmissionModalState({
      isOpen: false,
      isLoading: false,
      title: "",
      message: "",
    });
  };

  /**
   * Validates all steps and submits the enrollment payload when everything is complete.
   */
  const handleEnrollmentCompletion = async (): Promise<void> => {
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
      isLoading: true,
      title: "",
      message: "",
    });

    // Fake Loader
    await waitForSubmissionDelay();

    // Check all steps
    const hasIncompleteSteps: boolean = Object.values(currentStepStatesInfo).some(
      (stepStateItem) => stepStateItem !== "completed",
    );

    // Steps are not complete then show message
    if (hasIncompleteSteps) {
      setSubmissionModalState({
        isOpen: true,
        isLoading: false,
        title: "Form Incomplete",
        message: "You have not completed all the steps in the Form",
      });
      return;
    }

    // Transform the Input Values
    const enrollmentPayloadInfo: EnrollmentPayloadData =
      transformEnrollmentPayload(enrollmentFormValue);

    try {
      // Submit the data to API
      const enrollmentResponseInfo: EnrollmentResponseData<EnrollmentPayloadData> =
        await submitEnrollmentRequest(enrollmentPayloadInfo);

      // Show Success or Error message
      setSubmissionModalState({
        isOpen: true,
        isLoading: false,
        title: enrollmentResponseInfo.status ? "Enrollment Submitted" : "Submission Result",
        message: enrollmentResponseInfo.message,
      });

      if (enrollmentResponseInfo.status) {
        console.log("OLA");
        clearEnrollmentFormStorage();
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage: string =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting the enrollment form.";

      setSubmissionModalState({
        isOpen: true,
        isLoading: false,
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

    if (currentStep === TOTAL_ENROLLMENT_STEPS) {
      void handleEnrollmentCompletion();
      return;
    }

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
   * Validates the current step before changing steps from the stepper.
   */
  const handleStepChange = (stepId: number): void => {
    const currentStepState: StepStateData = findStepState(currentStep);

    setStepStates((currentStates) => ({
      ...currentStates,
      [currentStep]: currentStepState,
    }));
    setCurrentStep(stepId);
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
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 1:
      default:
        return (
          <SelectCourse
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

      setCurrentStep(parsedEnrollmentFormValue.currentStep ?? 1);
      setStepStates(parsedEnrollmentFormValue.stepStates ?? stepStates);
      setEnrollmentFormValue(parsedEnrollmentFormValue.enrollmentFormValue ?? enrollmentFormValue);
    } catch (error) {
      console.error("Failed to restore enrollment form draft", error);
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

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
      {/* Steps Component */}
      <Steps currentStep={currentStep} stepStates={stepStates} onStepChange={handleStepChange} />

      {/* Step Section (Renders based on Step) */}
      {renderCurrentStep()}

      <SubmissionModal
        isOpen={submissionModalState.isOpen}
        isLoading={submissionModalState.isLoading}
        title={submissionModalState.title}
        message={submissionModalState.message}
        onClose={closeSubmissionModal}
      />
    </section>
  );
}
