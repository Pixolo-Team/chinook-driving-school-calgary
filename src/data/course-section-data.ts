export const courseSectionData = {
  eyebrow: "Training Programs",
  heading: "Our Driving Courses",
  description:
    "Professional lessons to help beginners learn fast and drive with confidence.",
  tabs: [
    {
      label: "Driving Courses",
      isActive: true,
    },
    {
      label: "Brush Up Lessons",
      isActive: false,
    },
    {
      label: "Car Rental",
      isActive: false,
    },
  ],
  cards: [
    {
      id: "essential",
      label: "Essential",
      price: "$870",
      taxLabel: "+GST",
      duration: "10 Weeks",
      title: "Basic Package",
      features: [
        "10 Hours In-Car Training",
        "15 Hours Online Theory",
        "Insurance Certificate",
      ],
      isFeatured: false,
      checkIcon: "/images/courses/check-green.png",
      ellipse: "/images/courses/ellipse-light.png",
      buttonLabel: "Select Package",
    },
    {
      id: "enhanced",
      label: "Enhanced",
      price: "$900",
      taxLabel: "+GST",
      duration: "12 Weeks",
      title: "Premium Package",
      features: [
        "14 Hours In-Car Training",
        "15 Hours Online Theory",
        "Road Test Support",
        "Free Mock Test",
      ],
      isFeatured: true,
      checkIcon: "/images/courses/check-white.png",
      ellipse: "/images/courses/ellipse-blue.png",
      buttonLabel: "Select Package",
    },
    {
      id: "complete",
      label: "Complete",
      price: "$999",
      taxLabel: "+GST",
      duration: "14 Weeks",
      title: "Ultimate Course",
      features: [
        "20 Hours In-Car Training",
        "Car for Road Test Included",
        "Unlimited Access to Resources",
      ],
      isFeatured: false,
      checkIcon: "/images/courses/check-green.png",
      ellipse: "/images/courses/ellipse-light-alt.png",
      buttonLabel: "Select Package",
    },
  ],
};
