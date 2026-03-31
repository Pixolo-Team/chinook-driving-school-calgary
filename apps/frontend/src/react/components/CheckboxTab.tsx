import type { ChangeEvent, InputHTMLAttributes } from "react";

const DEFAULT_ICON_SRC = "https://www.figma.com/api/mcp/asset/6108eefa-d366-4360-90ed-d66aca871df7";

type CheckboxTabProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  title?: string;
  description?: string;
  iconSrc?: string;
  containerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CheckIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={joinClasses(
        "absolute top-6 right-5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-200",
        checked
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-n-300)] bg-n-50)] text-transparent",
      )}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
        <path
          d="M5.5 10.25 8.625 13.375 14.5 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function CheckboxTab({
  title = "Credit Card",
  description = "Visa, Mastercard, Amex",
  iconSrc = DEFAULT_ICON_SRC,
  checked = true,
  disabled = false,
  className,
  containerClassName,
  onChange,
  ...props
}: CheckboxTabProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  return (
    <label
      className={joinClasses(
        "relative flex w-full max-w-[338px] cursor-pointer flex-col gap-3 rounded-xl border border-n-800)] bg-n-50)] p-5 text-left transition-shadow duration-200",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:shadow-[0_10px_24px_rgba(14,23,43,0.08)]",
        containerClassName,
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={joinClasses("peer sr-only", className)}
      />

      <div className="h-7 w-7 shrink-0">
        <img src={iconSrc} alt="" className="block h-full w-full" />
      </div>

      <div className="flex w-full flex-col gap-0.5pr-10">
        <span className="text-lg leading-normal font-bold text-n-800)]">{title}</span>
        <span className="text-sm leading-normal font-normal text-n-500)]">
          {description}
        </span>
      </div>

      <CheckIndicator checked={Boolean(checked)} />

      <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-transparent transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-n-50)]" />
    </label>
  );
}
