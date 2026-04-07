export interface CourseCardData {
  title: string;
  price: string;
  duration: string;
  practice: {
    label: string;
    value: string;
  };
  classroom: {
    label: string;
    value: string;
  };
  features: string[];
  theme: "light" | "brand";
  ellipse: "light" | "blue" | "light-alt";
  badge?: string;
}

export interface CourseGroupData {
  cards: CourseCardData[];
  tab: string;
}
