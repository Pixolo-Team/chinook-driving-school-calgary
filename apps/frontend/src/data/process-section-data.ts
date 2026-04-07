import ellipseLight from "@/assets/ellipse-light.svg";
import ellipseLightAlt from "@/assets/ellipse-light-alt.svg";

export const processSectionData = {
  eyebrow: "Your Learning Journey",
  heading: "How Our Driving Lessons Work",
  description:
    "Follow a simple step-by-step process designed to help you learn safely and confidently.",
  steps: [
    {
      number: "01",
      titleLines: ["Choose a Course"],
      description:
        "Select the driving course that best fits your experience level and learning goals.",
      ellipse: ellipseLight,
    },
    {
      number: "02",
      titleLines: ["Book Your Lesson"],
      description:
        "Pick a convenient date and time for your lesson through our easy online booking system or by contacting our team.",
      ellipse: ellipseLightAlt,
    },
    {
      number: "03",
      titleLines: ["Register Online or", "Contact Us"],
      description:
        "Fill out the registration form on our website or contact our team to enroll in your preferred course.",
      ellipse: ellipseLightAlt,
    },
    {
      number: "04",
      titleLines: ["Confirm Your Booking"],
      description:
        "Once your registration is received, our team will confirm your enrollment and schedule your driving lessons.",
      ellipse: ellipseLight,
    },
    {
      number: "05",
      titleLines: ["Start Your Driving Lessons"],
      description:
        "Begin your training with a professional instructor and practice real-world driving skills step by step.",
      ellipse: ellipseLightAlt,
    },
    {
      number: "06",
      titleLines: ["Prepare for Your", "Driving Test"],
      description:
        "Complete your lessons, build confidence on the road, and get ready for your driving test.",
      ellipse: ellipseLightAlt,
    },
  ],
};
