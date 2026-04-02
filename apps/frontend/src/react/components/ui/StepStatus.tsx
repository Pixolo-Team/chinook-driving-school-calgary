// REACT //
import React from "react";

// TYPES //
import type { StepStatusData } from "@/react/types/steps.type";

type StepStatusPropsData = Readonly<{
  status: StepStatusData;
  title: string;
  subTitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}>;

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders a compact status card for one enrollment step.
 */
export default function StepStatus({
  status,
  title,
  subTitle,
  icon,
  onClick,
  className,
}: StepStatusPropsData): React.JSX.Element {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const isCompleted: boolean = status === "completed";
  const isPending: boolean = status === "pending";
  const isClickablePending: boolean = isPending && Boolean(onClick);
  const containerClassName: string = isCompleted
    ? "border-green-200 bg-green-100"
    : isPending
      ? "border-amber-200 bg-amber-100"
      : "border-n-200 bg-n-50";
  const iconContainerClassName: string = isCompleted
    ? "bg-green-500 text-n-50"
    : isPending
      ? "bg-amber-500 text-n-50"
      : "bg-n-300 text-n-700";

  // Helper Functions

  // Use Effects
  const ComponentTag: "button" | "div" = isClickablePending ? "button" : "div";

  return (
    <ComponentTag
      type={isClickablePending ? "button" : undefined}
      onClick={isClickablePending ? onClick : undefined}
      className={joinClasses(
        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-[transform,box-shadow] duration-200",
        isClickablePending && "cursor-pointer hover:scale-[1.01] hover:shadow-[0_8px_18px_rgba(14,23,43,0.08)]",
        containerClassName,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={joinClasses(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          iconContainerClassName,
        )}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-n-900 truncate text-sm leading-5 font-semibold">{title}</p>
        <p className="text-n-700 truncate text-xs leading-4 font-normal">{subTitle}</p>
      </div>
      {isPending ? (
        <span aria-hidden="true" className="text-amber-700 ml-auto shrink-0">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path
              d="M7 4.5 12.5 10 7 15.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </ComponentTag>
  );
}
