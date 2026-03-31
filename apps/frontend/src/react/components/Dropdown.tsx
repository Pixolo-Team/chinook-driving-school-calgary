import type { ChangeEvent, SelectHTMLAttributes } from "react";

const CHEVRON_ICON_SRC = "https://www.figma.com/api/mcp/asset/566123f9-9eb6-4e0d-b7cd-507eec3c54f7";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  helperText?: string;
  placeholder?: string;
  options?: DropdownOption[];
  containerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({
  label = "License Type",
  helperText = "Choose your current licence category (e.g., learner, full licence).",
  placeholder = "Select licence type",
  options = [],
  value,
  defaultValue = "",
  disabled = false,
  className,
  containerClassName,
  onChange,
  id,
  ...props
}: DropdownProps) {
  const inputId = id ?? "dropdown-field";
  const isControlled = value !== undefined;
  const hasSelectedValue =
    typeof value === "string"
      ? value.length > 0
      : defaultValue !== undefined && String(defaultValue).length > 0;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange?.(event);
  }

  return (
    <div className={joinClasses("flex w-full max-w-164 flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className="text-base leading-5 font-normal text-n-700)]"
      >
        {label}
      </label>

      <div className="relative w-full">
        <select
          {...props}
          id={inputId}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          onChange={handleChange}
          className={joinClasses(
            "w-full appearance-none border-0 border-b-[1.6px] border-n-700)] bg-transparent px-4 pt-4 pr-10 pb-[17.6px] text-xl leading-normal font-semibold text-n-700)] transition-colors duration-200 outline-none",
            "focus:border-blue-500)]",
            !hasSelectedValue && "text-n-700)]",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2">
          <img src={CHEVRON_ICON_SRC} alt="" className="block h-1.5 w-3" />
        </span>
      </div>

      <p className="text-sm leading-5 font-normal text-n-500)]">{helperText}</p>
    </div>
  );
}
