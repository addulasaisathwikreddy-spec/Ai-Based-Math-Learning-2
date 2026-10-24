export const CLASS_LEVELS = ["6", "7", "8", "9", "10", "11", "12"];

export const SYLLABUS = {
  "6": [
    "Knowing Our Numbers",
    "Whole Numbers",
    "Playing with Numbers",
    "Basic Geometrical Ideas",
    "Fractions",
    "Decimals",
    "Mensuration",
  ],
  "7": [
    "Integers",
    "Fractions & Decimals",
    "Simple Equations",
    "Lines & Angles",
    "Comparing Quantities",
    "Perimeter & Area",
    "Data Handling",
  ],
  "8": [
    "Rational Numbers",
    "Linear Equations in One Variable",
    "Squares & Square Roots",
    "Cubes & Cube Roots",
    "Algebraic Expressions",
    "Mensuration",
    "Data Handling",
  ],
  "9": [
    "Number Systems",
    "Polynomials",
    "Coordinate Geometry",
    "Linear Equations in Two Variables",
    "Triangles",
    "Surface Areas & Volumes",
    "Statistics",
  ],
  "10": [
    "Real Numbers",
    "Polynomials",
    "Pair of Linear Equations",
    "Quadratic Equations",
    "Arithmetic Progressions",
    "Triangles",
    "Circles",
    "Introduction to Trigonometry",
    "Statistics",
    "Probability",
  ],
  "11": [
    "Sets",
    "Relations & Functions",
    "Trigonometric Functions",
    "Complex Numbers",
    "Permutations & Combinations",
    "Sequences & Series",
    "Straight Lines",
    "Limits & Derivatives",
    "Probability",
  ],
  "12": [
    "Relations & Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity & Differentiability",
    "Application of Derivatives",
    "Integrals",
    "Differential Equations",
    "Vectors",
    "Probability",
  ],
};

export const BOARDS = ["CBSE", "State Board"];

export const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Bihar",
  "West Bengal",
  "Odisha",
  "Punjab",
  "Haryana",
  "Delhi",
  "Chhattisgarh",
  "Jharkhand",
  "Assam",
  "Uttarakhand",
  "Himachal Pradesh",
  "Goa",
  "Jammu & Kashmir",
  "Other",
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Odia",
  "Punjabi",
  "Urdu",
];

export const GOALS = [
  "School learning",
  "Board exam preparation",
  "JEE preparation",
  "NEET preparation",
  "Other competitive exams",
];

export const STREAMS = ["MPC", "BiPC", "Commerce", "Other"];

export const STUDY_TIMES = [
  { label: "30 minutes a day", value: 30 },
  { label: "1 hour a day", value: 60 },
  { label: "2 hours a day", value: 120 },
  { label: "3+ hours a day", value: 180 },
];

export function topicsFor(classLevel) {
  return SYLLABUS[String(classLevel)] || [];
}

export function needsStream(classLevel) {
  return ["11", "12"].includes(String(classLevel));
}
