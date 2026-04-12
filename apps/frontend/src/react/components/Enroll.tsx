// REACT //
import React, { useEffect, useState } from "react";

// TYPES //
import type { CourseCategoryData } from "@/react/types/enrollment.type";

// COMPONENTS //
import EnrollmentForm from "./EnrollmentForm";
import EnrollSuccess from "./steps/EnrollSuccess";
import EnrollmentInfo from "./steps/EnrollmentInfo";

// API SERVICES //
import { fetchCoursesRequest } from "@/react/services/api/courses.api.service";

// CONSTANTS //
import { COURSE_CATEGORY_IMAGE_BY_ID } from "@/react/constants/form-items";

type EnrollViewData = "start" | "form" | "success";

const withLocalCourseCategoryImages = (
  courseCategories: CourseCategoryData[],
): CourseCategoryData[] =>
  courseCategories.map((courseCategoryItem) => ({
    ...courseCategoryItem,
    image: COURSE_CATEGORY_IMAGE_BY_ID[courseCategoryItem.id] ?? courseCategoryItem.image,
  }));

/**
 * Coordinates the enrollment entry flow between start, form, and success screens.
 */
export default function EnrollForm(): React.JSX.Element {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeView, setActiveView] = useState<EnrollViewData>("start");
  const [courseCategories, setCourseCategories] = useState<CourseCategoryData[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState<boolean>(true);
  const [coursesErrorMessage, setCoursesErrorMessage] = useState<string | null>(null);

  // Helper Functions
  /**
   * Renders the start screen before the user opens the form.
   */
  function renderFormStart(): React.JSX.Element {
    return <EnrollmentInfo onStart={() => setActiveView("form")} />;
  }

  /**
   * Renders the success screen after a completed API submission.
   */
  function renderSuccessScreen(): React.JSX.Element {
    return <EnrollSuccess />;
  }

  /**
   * Renders the active enrollment view.
   */
  const renderActiveView = () => {
    if (activeView === "start") {
      return renderFormStart();
    }

    if (activeView === "success") {
      return renderSuccessScreen();
    }

    return (
      <EnrollmentForm
        courseCategories={courseCategories}
        isCoursesLoading={isCoursesLoading}
        coursesErrorMessage={coursesErrorMessage}
        onSuccess={() => setActiveView("success")}
      />
    );
  };

  // Use Effects
  useEffect(() => {
    let isMounted = true;

    const loadCourses = async (): Promise<void> => {
      setIsCoursesLoading(true);
      setCoursesErrorMessage(null);

      try {
        const coursesResponseInfo = await fetchCoursesRequest();

        if (!isMounted) {
          return;
        }

        if (!coursesResponseInfo.status || !coursesResponseInfo.data) {
          setCourseCategories([]);
          setCoursesErrorMessage(
            coursesResponseInfo.message || "Unable to load courses right now.",
          );
          return;
        }

        setCourseCategories(withLocalCourseCategoryImages(coursesResponseInfo.data));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCourseCategories([]);
        setCoursesErrorMessage(
          error instanceof Error ? error.message : "Unable to load courses right now.",
        );
      } finally {
        if (isMounted) {
          setIsCoursesLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return renderActiveView();
}
