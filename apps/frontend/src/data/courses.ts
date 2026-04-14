import heroIllustration from "/public/images/courses-hero.png";

export const coursesHeroSectionData = {
  title: "Our Driving Programs",
  description: "Flexible courses designed for beginners and learners at every stage.",
  illustration: heroIllustration,
  illustrationAlt: "Student driver training illustration",
};

export const courseSectionData = {
  eyebrow: "Training Programs",
  heading: "Our Driving Courses",
  description: "Professional lessons to help beginners learn fast and drive with confidence.",
  tabs: ["Driving Courses", "Brush Up Lessons", "Car Rental"],
  cards: [
    {
      title: "Basic Package",
      price: "$870",
      duration: "10 Weeks",
      practice: {
        label: "Car Practice",
        value: "10 Hours",
      },
      classroom: {
        label: "Classroom Practice",
        value: "15 Hours",
      },
      features: ["15 Hours Online Theory", "Insurance Certificate", "Road Test Support"],
      theme: "light",
      ellipse: "light",
    },
    {
      title: "Premium Package",
      price: "$900",
      duration: "12 Weeks",
      practice: {
        label: "Car Practice",
        value: "10 Hours",
      },
      classroom: {
        label: "Classroom Practice",
        value: "15 Hours",
      },
      features: [
        "14 Hours In-Car Training",
        "15 Hours Online Theory",
        "Road Test Support",
        "Free Mock Test",
      ],
      theme: "brand",
      ellipse: "blue",
      badge: "Most Popular",
    },
    {
      title: "Ultimate Course",
      price: "$870",
      duration: "14 Weeks",
      practice: {
        label: "Car Practice",
        value: "10 Hours",
      },
      classroom: {
        label: "Classroom Practice",
        value: "15 Hours",
      },
      features: ["15 Hours Online Theory", "Insurance Certificate", "Road Test Support"],
      theme: "light",
      ellipse: "light-alt",
    },
  ],
};
