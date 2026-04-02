// REACT //
import React from "react";

// COMPONENTS //
import Button from "../ui/Button";

// DATA //
import { enrollmentConfirmedSectionData } from "@/data/enrollment-confirmed-section-data";

/**
 * Renders the enrolled confirmation screen using the shared section content.
 */
export default function EnrollSuccess(): React.JSX.Element {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  /**
   * Navigates to the configured CTA destination.
   */
  const handleCtaClick = (): void => {
    window.location.href = enrollmentConfirmedSectionData.cta.href;
  };

  // Use Effects
  return (
    <section className="bg-n-50 pt-24 md:pt-28 lg:pt-32">
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-20 lg:py-24 xl:px-60">
        <div className="flex w-full flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-20">
          <div className="relative hidden lg:block">
            <img
              src={enrollmentConfirmedSectionData.image}
              alt=""
              width={500}
              height={500}
              className="h-full w-full scale-150 object-contain"
              aria-hidden="true"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-9 md:gap-10 lg:gap-16">
            <div className="flex w-full flex-col gap-6 md:gap-9 lg:gap-10">
              <div className="flex w-full flex-col gap-2">
                <p className="text-xs font-bold tracking-[0.6px] uppercase text-blue-500 md:text-sm">
                  {enrollmentConfirmedSectionData.eyebrow}
                </p>
                <h1 className="text-2xl leading-tight font-bold text-n-800 md:text-4xl lg:text-5xl">
                  {enrollmentConfirmedSectionData.heading}
                </h1>
              </div>

              <div className="flex w-full flex-col gap-2">
                <p className="text-xs font-medium text-n-500">
                  {enrollmentConfirmedSectionData.nextTitle}
                </p>
                <ul className="ml-5 list-disc space-y-2 text-lg text-n-800 lg:text-xl">
                  {enrollmentConfirmedSectionData.steps.map((step) => (
                    <li key={step.text ?? `${step.prefix}${step.emphasis}${step.suffix}`}>
                      {step.text ?? (
                        <>
                          {step.prefix}
                          <span className="font-bold">{step.emphasis}</span>
                          {step.suffix}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              variant="filled"
              onClick={handleCtaClick}
              className="h-auto w-full max-w-120 justify-center rounded-full px-10 py-4 text-lg font-bold md:px-16 md:py-5 lg:px-20 lg:py-6 lg:text-xl"
            >
              {enrollmentConfirmedSectionData.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
