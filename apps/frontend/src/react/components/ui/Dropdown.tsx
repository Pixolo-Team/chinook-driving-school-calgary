// REACT //
import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from "react";

type DropdownOptionData = {
  label: string;
  value: string;
};

type DropdownPropsData = Readonly<
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
    label?: string;
    required?: boolean;
    helperText?: string;
    isError?: boolean;
    errorMessage?: string;
    placeholder?: string;
    options?: DropdownOptionData[];
    containerClassName?: string;
    labelClassName?: string;
    showTriggerLabel?: boolean;
    styleVariant?: "card" | "minimal";
  }
>;

/**
 * Renders a custom-styled dropdown with a non-native option list.
 */
export default function Dropdown({
  label = "License Type",
  required = false,
  helperText = "Choose your current license category (e.g., learner, full license).",
  isError = false,
  errorMessage,
  placeholder = "Select license type",
  options = [],
  value,
  defaultValue = "",
  disabled = false,
  className,
  containerClassName,
  labelClassName,
  showTriggerLabel = true,
  styleVariant = "card",
  onChange,
  id,
  name,
  ...props
}: DropdownPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Define States
  const generatedId: string = useId();
  const inputId: string = id ?? name ?? `dropdown-${generatedId}`;
  const isControlled: boolean = value !== undefined;
  const initialValue: string = isControlled ? String(value ?? "") : String(defaultValue ?? "");
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const activeValue: string = isControlled ? String(value ?? "") : selectedValue;
  const selectedOptionInfo: DropdownOptionData | undefined = options.find(
    (optionItem) => optionItem.value === activeValue,
  );
  const helperMessage: string = isError ? (errorMessage ?? helperText) : helperText;

  // Helper Functions
  /**
   * Joins optional class names into a single string.
   */
  function joinClasses(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
  }

  /**
   * Closes the dropdown list.
   */
  function closeDropdown(): void {
    setIsDropdownOpen(false);
  }

  /**
   * Toggles the dropdown list when the trigger is pressed.
   */
  function toggleDropdown(): void {
    if (disabled) {
      return;
    }

    setIsDropdownOpen((currentDropdownState) => !currentDropdownState);
  }

  /**
   * Emits the current value using the existing select onChange shape.
   */
  function triggerChange(nextValue: string): void {
    const syntheticChangeEvent = {
      target: {
        value: nextValue,
        name,
        id: inputId,
      },
      currentTarget: {
        value: nextValue,
        name,
        id: inputId,
      },
    } as ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticChangeEvent);
  }

  /**
   * Updates the selected value and closes the custom dropdown list.
   */
  function handleOptionSelect(nextValue: string): void {
    if (!isControlled) {
      setSelectedValue(nextValue);
    }

    triggerChange(nextValue);
    closeDropdown();
  }

  /**
   * Handles keyboard support for opening and closing the dropdown.
   */
  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
    }
  }

  // Use Effects
  useEffect(() => {
    if (!isControlled) {
      setSelectedValue(String(defaultValue ?? ""));
    }
  }, [defaultValue, isControlled]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    if (!isDropdownOpen) {
      return;
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <div className={joinClasses("flex w-full max-w-164 flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className={joinClasses(
          "text-n-700 flex items-center gap-1 text-base leading-5 font-normal",
          labelClassName,
        )}
      >
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="text-error-500">
            *
          </span>
        ) : null}
      </label>

      <div ref={containerRef} className="relative w-full">
        <select
          {...props}
          id={inputId}
          name={name}
          value={activeValue}
          disabled={disabled}
          onChange={() => undefined}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        >
          <option value="">{placeholder}</option>
          {options.map((optionItem) => (
            <option key={optionItem.value} value={optionItem.value}>
              {optionItem.label}
            </option>
          ))}
        </select>

        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-controls={`${inputId}-listbox`}
          onClick={toggleDropdown}
          onKeyDown={handleTriggerKeyDown}
          className={joinClasses(
            styleVariant === "minimal"
              ? "bg-n-100 flex w-full items-center justify-between border-x-0 border-t-0 border-b-[0.8px] px-3 py-3 text-left opacity-70 transition-[border-color,background-color,box-shadow] duration-200 outline-none md:px-4 md:py-4"
              : isDropdownOpen
                ? "bg-n-50 border-blue-500 shadow-[0_18px_44px_rgba(14,23,43,0.08)]"
                : "bg-n-100 border-n-300",
            styleVariant === "card" &&
              "flex min-h-[76px] w-full items-center justify-between rounded-[18px] border px-4 py-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 outline-none",
            styleVariant === "minimal" &&
              (isError ? "border-b-[var(--color-error-500,_#dc2626)]" : "border-n-700"),
            "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          {showTriggerLabel ? (
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-n-500 text-sm leading-5 font-medium">{label}</span>
              <span
                className={joinClasses(
                  "truncate text-lg leading-normal font-semibold",
                  selectedOptionInfo ? "text-n-900" : "text-n-400",
                )}
              >
                {selectedOptionInfo?.label ?? placeholder}
              </span>
            </span>
          ) : (
            <span className="text-n-800 truncate text-lg leading-normal font-normal md:text-xl">
              {selectedOptionInfo?.label ?? placeholder}
            </span>
          )}

          <span
            aria-hidden="true"
            className={joinClasses(
              styleVariant === "minimal"
                ? "ml-4 flex shrink-0 items-center justify-center transition-transform duration-200"
                : "ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-blue-500" fill="none">
              <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isDropdownOpen ? (
          <div
            id={`${inputId}-listbox`}
            role="listbox"
            className="bg-n-50 border-n-200 absolute top-[calc(100%+12px)] z-30 max-h-72 w-full overflow-y-auto rounded-[22px] border p-2 shadow-[0_24px_64px_rgba(14,23,43,0.14)]"
          >
            {options.map((optionItem) => {
              const isActive: boolean = optionItem.value === activeValue;

              return (
                <button
                  key={optionItem.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleOptionSelect(optionItem.value)}
                  className={joinClasses(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors duration-200",
                    isActive
                      ? "bg-blue-500 text-n-50"
                      : "bg-transparent text-n-800 hover:bg-n-100 hover:text-blue-500",
                  )}
                >
                  <span className="text-base leading-normal font-medium">{optionItem.label}</span>

                  {isActive ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/16">
                      <svg viewBox="0 0 20 20" className="text-n-50 h-3.5 w-3.5" fill="none">
                        <path
                          d="M5.6 10.2 8.3 12.9 14.4 6.8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {helperMessage ? (
        <p
          className="text-sm leading-5 font-normal"
          style={{
            color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-500)",
          }}
        >
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
}
