// REACT //
import React, { type ChangeEvent, type InputHTMLAttributes } from "react";

const DEFAULT_IMAGE_SRC =
  "https://www.figma.com/api/mcp/asset/a8ed0865-c140-4e9b-a2da-332eeb1922a1";

type RadioCustomData = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

type RadioCustomPropsData = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  value: string;
  data: RadioCustomData;
  containerClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function renderCheckIcon(): React.JSX.Element {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M6.2 10.2 8.6 12.6 13.8 7.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Renders the custom course-selection radio card.
 */
export default function RadioCustom({
  value,
  data,
  checked = false,
  disabled = false,
  className,
  containerClassName,
  onChange,
  ...props
}: RadioCustomPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);
  }

  // Use Effects

  return (
    <label
      className={joinClasses(
        "bg-n-50 relative flex w-full flex-col gap-3 rounded-2xl border-2 p-3.5 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(1,1.05,0.94,1)]",
        checked ? "border-blue-500" : "border-n-300",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:animate-[radio-tab-bounce_300ms_cubic-bezier(1,1.05,0.94,1)] hover:cursor-pointer hover:shadow-[6px_9px_17.8px_rgba(0,0,0,0.09)]",
        containerClassName,
      )}
    >
      <input
        {...props}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={joinClasses("peer sr-only", className)}
      />

      <div className="bg-n-100 relative h-[155px] w-full overflow-hidden rounded-[8px]">
        <img
          src={data.imageSrc ?? DEFAULT_IMAGE_SRC}
          alt={data.imageAlt ?? data.title}
          className="block h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-between px-2">
        <span
          className={joinClasses(
            "text-lg leading-normal",
            checked ? "font-semibold text-blue-500" : "text-n-600 font-medium",
          )}
        >
          {data.title}
        </span>

        <span
          className={joinClasses(
            "shrink-0 transition-colors duration-200",
            checked ? "text-blue-500" : "text-n-300",
          )}
          aria-hidden="true"
        >
          {renderCheckIcon()}
        </span>
      </div>
    </label>
  );
}
