/**
 * Renders the enrollment info section before starting the enrollment flow.
 */
export default function EnrollmentInfo() {
  return (
    <section className="bg-n-50">
      <div className="container mx-auto flex w-full max-w-screen-2xl flex-col items-center gap-10 px-5 py-20 sm:px-6 lg:gap-16 lg:px-10 lg:py-20">
        <div className="flex w-full flex-col items-center gap-2.5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.6px] text-blue-500 sm:text-sm">
            Before You Start
          </p>
          <p className="text-3xl font-bold leading-tight text-n-800 sm:text-4xl lg:text-5xl">
            Start Your Enrollment
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-9 lg:gap-16">
          <div className="flex w-full flex-col divide-y divide-n-200 lg:flex-row lg:divide-y-0 lg:divide-x">
            <div className="flex w-full flex-col gap-2 py-6 lg:px-6 lg:py-0">
              <p className="text-xs font-medium text-n-500">Time Required</p>
              <p className="text-base text-n-800 sm:text-lg">
                Takes about <span className="font-bold">10 minutes</span> to
                complete all steps.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 py-6 lg:px-6 lg:py-0">
              <p className="text-xs font-medium text-n-500">What You’ll Need</p>
              <ul className="list-disc space-y-1 pl-4 text-base text-n-800 sm:text-lg">
                <li>
                  Valid <span className="font-bold">ID / Licence</span> details
                </li>
                <li>Contact information</li>
                <li>Preferred schedule</li>
              </ul>
            </div>

            <div className="flex w-full flex-col gap-2 py-6 lg:px-6 lg:py-0">
              <p className="text-xs font-medium text-n-500">What You’ll Need</p>
              <p className="text-base text-n-800 sm:text-lg">
                Fields marked with{" "}
                <span className="font-bold text-red-500">*</span> are{" "}
                <span className="font-bold">required</span>.
              </p>
              <p className="text-xs text-n-600 sm:text-sm">
                You can complete them anytime before submitting.
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-4">
            <button
              type="button"
              className="h-[59px] w-full rounded-full bg-blue-500 px-14 text-lg font-bold text-n-50 lg:h-[78px] lg:text-xl"
            >
              Start Enrollment
            </button>
            <a
              className="text-sm font-medium text-n-800 underline lg:text-base"
              href="/courses"
            >
              Browse Courses Again
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
