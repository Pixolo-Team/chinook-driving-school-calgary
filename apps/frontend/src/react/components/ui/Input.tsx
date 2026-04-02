import React, { forwardRef, useId, type ChangeEvent, type InputHTMLAttributes } from "react";

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
  const generatedId = useId();
  const inputId = id ?? name ?? `input-${generatedId}`;
  const helperText = isError ? (errorMessage ?? caption) : caption;
  const helperTextId = helperText ? `${inputId}-helper-text` : undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
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
        className="w-full border-b transition-colors duration-200"
        style={{
          backgroundColor: "var(--color-n-100)",
          borderBottomWidth: "1.6px",
          borderBottomColor: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-400)",
        }}
      >
        <input
          {...props}
          ref={ref}
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
            isError
              ? "placeholder:text-[var(--color-error-500,_#dc2626)]"
              : "placeholder:text-n-400",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
          style={{
            color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-700)",
          }}
        />
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
