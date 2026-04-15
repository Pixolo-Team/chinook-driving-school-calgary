// TYPES //
import type { TestimonialData } from "@/types/testimonial";

// Testimonial Section Details
export const testimonialSectionDetails: {
  eyebrow: string;
  heading: string;
  reviewSummary: {
    label: string;
    rating: number;
    summaryText: string;
  };
  testimonials: TestimonialData[];
} = {
  eyebrow: "Google Reviews",
  heading: "Trusted by 100s of Calgary Learners",
  reviewSummary: {
    label: "Customer reviews on Google",
    rating: 5,
    summaryText: "5.0 rating of 12 reviews",
  },
  testimonials: [
    {
      id: "custom",
      customReview: true,
      rating: 3,
      review:
        "The marketing campaign they created for us was outstanding, and we saw significant engagement. However, I wish they had provided more frequent updates during the process.",
      name: "Henry Foster",
      role: "Project Manager",
      profilePhoto: "/images/testimonials/profile-photo-placeholder.png",
      backgroundImage: "/images/testimonials/bg-image.png",
    },
    {
      id: "standard",
      customReview: false,
      rating: 5,
      review:
        "The marketing campaign they created for us was outstanding, and we saw significant engagement. However, I wish they had provided more frequent updates during the process.",
      name: "Henry Foster",
      role: "Project Manager",
      profilePhoto: "/images/testimonials/profile-photo-placeholder.png",
    },
    {
      id: "standard",
      customReview: false,
      rating: 5,
      review:
        "The marketing campaign they created for us was outstanding, and we saw significant engagement. However, I wish they had provided more frequent updates during the process.",
      name: "Henry Foster",
      role: "Project Manager",
      profilePhoto: "/images/testimonials/profile-photo-placeholder.png",
      backgroundImage: "/images/testimonials/bg-image.png",
    },
       {
      id: "custom",
      customReview: true,
      rating: 3,
      review:
        "The marketing campaign they created for us was outstanding, and we saw significant engagement. However, I wish they had provided more frequent updates during the process.",
      name: "Henry Foster",
      role: "Project Manager",
      profilePhoto: "/images/testimonials/profile-photo-placeholder.png",
      backgroundImage: "/images/testimonials/bg-image.png",
    },
    {
      id: "standard",
      customReview: false,
      rating: 5,
      review:
        "The marketing campaign they created for us was outstanding, and we saw significant engagement. However, I wish they had provided more frequent updates during the process.",
      name: "Henry Foster",
      role: "Project Manager",
      profilePhoto: "/images/testimonials/profile-photo-placeholder.png",
      backgroundImage: "/images/testimonials/bg-image.png",
    },
  ],
};
