// REACT //
import React, { useEffect, useState } from "react";

// COMPONENTS //
import CheckboxTab from "@/react/components/ui/CheckboxTab";
import type { CheckboxTabIconNameData } from "@/react/components/ui/CheckboxTab";

type CheckboxTabGroupItemData = {
  title: string;
  description: string;
  name: string;
  iconName?: CheckboxTabIconNameData;
};

type CheckboxTabGroupPropsData = Readonly<{
  label?: string;
  required?: boolean;
  items: CheckboxTabGroupItemData[];
  selectedItem: string;
  containerClassName?: string;
  itemsWrapperClassName?: string;
  itemContainerClassName?: string;
  onSelectionChange?: (selectedItem: string) => void;
}>;

const joinClasses = (...classes: Array<string | false | null | undefined>): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Renders a single-select checkbox-tab group for payment-style options.
 */
export default function CheckboxTabGroup({
  label,
  required = false,
  items,
  selectedItem,
  containerClassName,
  itemsWrapperClassName,
  itemContainerClassName,
  onSelectionChange,
}: CheckboxTabGroupPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeItem, setActiveItem] = useState<string>(selectedItem);

  // Helper Functions
  useEffect(() => {
    setActiveItem(selectedItem);
  }, [selectedItem]);

  const handleSelect = (name: string): void => {
    setActiveItem(name);
    onSelectionChange?.(name);
  };

  // Use Effects

  return (
    <div className={joinClasses("flex w-full flex-col gap-4", containerClassName)}>
      {/* Group label */}
      {label ? (
        <p className="text-n-900 flex items-center gap-1 text-lg leading-normal font-semibold">
          <span>{label}</span>
          {required ? <span aria-hidden="true" className="text-error-500">*</span> : null}
        </p>
      ) : null}

      {/* Tab items */}
      <div className={joinClasses("grid w-full grid-cols-1 gap-4 lg:grid-cols-4", itemsWrapperClassName)}>
        {items.map((itemItem) => (
          <CheckboxTab
            key={itemItem.name}
            name={itemItem.name}
            title={itemItem.title}
            description={itemItem.description}
            iconName={itemItem.iconName}
            checked={activeItem === itemItem.name}
            onChange={() => handleSelect(itemItem.name)}
            containerClassName={itemContainerClassName}
          />
        ))}
      </div>
    </div>
  );
}
