export type StepStatusData = "completed" | "untouched" | "pending";

export type StepIconData =
  | "course"
  | "user"
  | "license"
  | "availability"
  | "parent"
  | "payment";

export type StepItemData = {
  label: string;
  icon: StepIconData;
};

export type StepsPropsData = Readonly<{
  currentStep: number;
  stepStates?: Record<number, StepStatusData>;
  steps?: StepItemData[];
  className?: string;
  onStepChange?: (step: number) => void;
}>;
