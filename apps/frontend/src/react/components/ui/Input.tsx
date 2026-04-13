import React, {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

type InputTypeData = "text" | "date" | "number" | "email";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  type: InputTypeData;
  label?: string;
  required?: boolean;
  placeholder?: string;
  caption?: string;
  isError?: boolean;
  errorMessage?: string;
  containerClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const renderCalendarIcon = (): React.JSX.Element => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-[18px] w-[18px] shrink-0"
      aria-hidden="true"
    >
      <path
        d="M12.0001 3.34106C13.8281 3.34107 15.5139 3.38096 17.1647 3.45825C19.9536 3.58883 22.213 5.72941 22.5252 8.43788C22.8997 11.6855 22.8997 14.4615 22.5252 17.7091C22.2131 20.4176 19.9536 22.5581 17.1647 22.6887C15.5138 22.7661 13.8281 22.8059 12.0001 22.8059C10.172 22.8059 8.4858 22.7661 6.83467 22.6887C4.04595 22.5581 1.78646 20.4176 1.47418 17.7091C1.09976 14.4615 1.09975 11.6855 1.47418 8.43788C1.78647 5.72942 4.04593 3.58883 6.83467 3.45825C8.48578 3.38094 10.172 3.34106 12.0001 3.34106ZM12.0001 5.05535C10.1978 5.05535 8.53848 5.09485 6.91503 5.17086C4.96609 5.26212 3.39366 6.76052 3.17759 8.63459C2.81824 11.7515 2.81825 14.3955 3.17759 17.5124C3.39366 19.3865 4.96606 20.8848 6.91503 20.9761C8.53844 21.0522 10.1978 21.0916 12.0001 21.0916C13.8024 21.0916 15.4619 21.0522 17.0852 20.9761C19.034 20.8847 20.6057 19.3869 20.8218 17.5132V17.5124C21.1812 14.3955 21.1812 11.7515 20.8218 8.63459C20.6059 6.76067 19.0342 5.26228 17.0852 5.17086C15.4619 5.09485 13.8024 5.05535 12.0001 5.05535Z"
        fill="currentColor"
      />
      <path
        d="M11.9994 3.34106C13.8276 3.34106 15.5138 3.38094 17.1649 3.45825C19.9536 3.58883 22.213 5.72944 22.5254 8.43788H22.5246C22.5673 8.80833 22.6054 9.17314 22.6384 9.53359C22.6603 9.77345 22.5806 10.0119 22.4183 10.1898C22.2559 10.3677 22.0262 10.4693 21.7854 10.4694H2.21429C1.97344 10.4694 1.74387 10.3677 1.58148 10.1898C1.41907 10.0119 1.33851 9.77351 1.3605 9.53359C1.39352 9.17326 1.43161 8.80847 1.47433 8.43788C1.78663 5.72943 4.04612 3.58883 6.83483 3.45825C8.48575 3.38096 10.1715 3.34107 11.9994 3.34106ZM11.9994 5.05535C10.1972 5.05535 8.53779 5.09485 6.91435 5.17086C4.96555 5.26225 3.3938 6.76061 3.17774 8.63459C3.1731 8.67481 3.1697 8.71507 3.16518 8.75513H20.8345C20.83 8.71508 20.8266 8.67481 20.822 8.63459C20.6059 6.76048 19.0334 5.26212 17.0845 5.17086C15.4611 5.09485 13.8018 5.05535 11.9994 5.05535Z"
        fill="currentColor"
      />
      <path
        d="M6.76855 6.42878V2.05099C6.76855 1.5776 7.15231 1.19385 7.6257 1.19385C8.09908 1.19385 8.48284 1.5776 8.48284 2.05099V6.42878C8.48271 6.90206 8.099 7.28592 7.6257 7.28592C7.15239 7.28592 6.76868 6.90206 6.76855 6.42878Z"
        fill="currentColor"
      />
      <path
        d="M15.5171 6.42878V2.05099C15.5171 1.5776 15.9008 1.19385 16.3742 1.19385C16.8476 1.19385 17.2314 1.5776 17.2314 2.05099V6.42878C17.2312 6.90206 16.8475 7.28592 16.3742 7.28592C15.9009 7.28592 15.5172 6.90206 15.5171 6.42878Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    label = "Phone Number",
    placeholder = "+1 403 XXX XXXX",
    caption = "Enter your name exactly as it appears on your ID or license.",
    isError = false,
    errorMessage,
    id,
    name,
    value,
    defaultValue,
    disabled = false,
    required = false,
    autoComplete,
    inputMode,
    className,
    containerClassName,
    onChange,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? name ?? `input-${generatedId}`;
  const helperText = isError ? (errorMessage ?? caption) : caption;
  const helperTextId = helperText ? `${inputId}-helper-text` : undefined;

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleDatePickerOpen(): void {
    const currentInput = inputRef.current;

    if (!currentInput) {
      return;
    }

    currentInput.focus();
    currentInput.showPicker?.();
  }

  return (
    <div
      className={joinClasses("flex w-full flex-col gap-2", containerClassName)}
      data-error={isError ? "true" : "false"}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className="flex w-full items-center gap-1 text-base leading-5 font-normal"
          style={{ color: "var(--color-n-700)" }}
        >
          <span>{label}</span>
          {required ? (
            <span aria-hidden="true" style={{ color: "var(--color-error-500, #ef4444)" }}>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div
        className={joinClasses(
          "relative w-full border-b transition-colors duration-200",
          type === "date" && "overflow-hidden",
        )}
        style={{
          backgroundColor: "var(--color-n-100)",
          borderBottomWidth: "1.6px",
          borderBottomColor: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-400)",
        }}
      >
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={handleChange}
          aria-invalid={isError}
          aria-describedby={helperTextId}
          className={joinClasses(
            "block w-full border-0 bg-transparent px-4 pt-4 pb-[17.6px] text-xl leading-normal font-medium outline-none placeholder:opacity-100",
            type === "date" && "custom-date-input appearance-none pr-16",
            isError
              ? "placeholder:text-[var(--color-error-500,_#dc2626)]"
              : "placeholder:text-n-400",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
          style={{
            color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-700)",
            appearance: type === "date" ? "none" : undefined,
            WebkitAppearance: type === "date" ? "none" : undefined,
          }}
        />

        {type === "date" ? (
          <button
            type="button"
            onClick={handleDatePickerOpen}
            className="absolute top-0 right-0 flex h-full items-center bg-[var(--color-n-100)] pr-4 pl-3"
            style={{
              color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-700)",
            }}
            aria-label={label ? `Open ${label} date picker` : "Open date picker"}
          >
            {renderCalendarIcon()}
          </button>
        ) : null}
      </div>

      {helperText ? (
        <p
          id={helperTextId}
          className="w-full text-sm leading-5 font-normal"
          style={{
            color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-500)",
          }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
