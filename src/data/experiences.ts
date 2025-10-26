import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Front End Developer",
    company: "PT. Daya Dimensi Indonesia (DDI)",
    logo: "/assets/img/content/ddi-logo.webp",
    location: "Jakarta, Indonesia - Remote",
    period: "February 2022 - Present",
    current: true,
    description:
      "Human resources consultant specializing in learning management systems and assessment platforms.",
    responsibilities: [
      "Drove product iteration cycles by participating in planning and quality reviews, ensuring timely delivery of high-impact features.",
      "Enhanced learning management systems with focus on usability, scalability, and performance.",
      "Built and delivered 80+ features including face recognition, video conferencing, dynamic organizational charts, and real-time communication.",
      "Led end-to-end development of multiple applications across diverse business domains.",
    ],
    projects: [
      "EnGauge – Assessment Platform (Released, internal use)",
      "Learning Hub – Learning Platform (Released, internal use)",
      "TPOP (Talent Potential Predictors) – (Released, internal use)",
      "DASH SaaS – SaaS assessment platform with video conferencing (Released, internal use)",
      "WISH – Career discovery platform (Released, education.acelents.com)",
      "ACELENTS – SaaS platform for assessment and recruitment (In development)",
      "PortrAI – AI-driven assessment platform (In development)",
    ],
    techStack:
      "React.js, Redux, Axios, Ant Design, Firebase, Vite.js, JavaScript, TypeScript",
  },
  {
    id: 2,
    title: "Front End Developer",
    company: "PT. Mahardika Solusi Teknologi (IDE Asia)",
    logo: "/assets/img/content/ide-logo.webp",
    location: "Jakarta, Indonesia - Remote",
    period: "October 2021 - May 2022, September 2024 - August 2025",
    current: false,
    description:
      "Technology consultant working on banking integration features and cross-border payment solutions.",
    responsibilities: [
      "Contributed to BI-FAST, one of Indonesia's largest banking integration features for interbank transactions.",
      "Implemented Vietnam eTax Payment, a regional cross-border banking initiative.",
      "Delivered 20+ production-ready features enhancing customer experience in banking applications.",
      "Collaborated with Big 4 global consulting firm on retail/consumer banking platform.",
      "Built responsive, accessible, and user-friendly banking service interfaces.",
    ],
    projects: [
      "Banking Platform – BI-FAST & VN eTax features (Released, internal use)",
    ],
    techStack:
      "React.js, JavaScript, Redux, Axios, Material UI, Jenkins, Sonar, Jest",
  },
];
