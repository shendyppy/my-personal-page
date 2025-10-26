import { ProjectCard, ProjectDetail } from "@/types";

export const projectCards: ProjectCard[] = [
  {
    slug: "ddi-released",
    title: "Daya Dimensi Indonesia - HR Consultant [RELEASED PROJECT]",
    description:
      "Building assessment platform for HR consultants to evaluate candidates, also manage clients and reports.",
    image: "/assets/img/content/bg-released-ddi.png",
  },
  {
    slug: "ddi-incoming",
    title: "Daya Dimensi Indonesia - HR Consultant [INCOMING PROJECT]",
    description:
      "Building assessment platform for HR consultants to evaluate candidates, also manage clients and reports.",
    image: "/assets/img/content/bg-incoming-ddi.png",
  },
  {
    slug: "uob-infinity",
    title: "UOB Infinity - Banking Platform",
    description:
      "A banking platform for UOB customers to manage accounts, transfer funds, pay bills, and access financial services.",
    image: "/assets/img/content/bg-uob-infinity.png",
  },
  {
    slug: "sapasonny",
    title: "Sapasonny - Personal Branding Website",
    description:
      "A personal branding website to showcase portfolio, services, contact information, and can be used as aspiration tracker.",
    image: "/assets/img/content/bg-bandung-makin-juara.png",
  },
];

export const projectDetails: ProjectDetail[] = [
  {
    slug: "ddi-released",
    company: "Daya Dimensi Indonesia",
    title:
      "Building assessment platform for HR consultants to minimalize paperwork and increase efficiency",
    overview:
      "Daya Dimensi Indonesia (DDI) is an Indonesian consulting firm that has been around for quite some time. They're known mainly in the HR and talent management space, helping companies with leadership assessments, organizational development, and workforce capability building.",
    scope: "Front End Developer",
    industry: "Human Resources",
    highlights: [
      {
        id: "engauge",
        title: "Engauge",
        description:
          "EnGauge seems like a strong asset for DDI because psychometric/assessment platforms are highly valuable in HR consulting. It provides recurring value, could help differentiate them, and possibly generate reliable revenue (via clients subscribing).",
        impact: ["Scale code to be maintainable", "Revamped UI/UX"],
        images: [
          {
            link: "/assets/img/projects/engauge/cms-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/engauge/cms-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/engauge/participant-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/engauge/participant-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/engauge/participant-3.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "learning-hub",
        title: "Learning Hub",
        description:
          "Learning Hub is a learning platform for employees to learn and grow. It provides a convenient way for employees to access educational content, resources, and tools to improve their skills and knowledge. Have multiple learning paths, learning modules, and quizzes.",
        impact: ["Scale code to be maintainable", "Revamped UI/UX"],
        images: [
          {
            link: "/assets/img/projects/learning-hub/cms-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/learning-hub/cms-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/learning-hub/cms-3.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/learning-hub/participant-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/learning-hub/participant-2.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/learning-hub/participant-3.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/learning-hub/participant-4.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "tpop",
        title: "Talent Potential Predictors",
        description:
          "Talent Potential Predictors (TPOP) is a platform that predicts the potential of candidates based on their performance on a test. It provides an objective way to evaluate candidates and help companies make informed hiring decisions.",
        impact: ["Scale code to be maintainable", "Revamped UI/UX"],
        images: [
          { link: "/assets/img/projects/tpop/cms-1.png", isScrollable: true },
          {
            link: "/assets/img/projects/tpop/participant-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/tpop/validator-1.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "dash-saas",
        title: "DASH SaaS",
        description:
          "Dash SaaS is a voluntary SaaS implementation of the assessment platform with video conferencing. It provides a convenient way for HR consultants to evaluate candidates, and then the test integrated with EnGauge make it more effective.",
        impact: [
          "Initiate a new project",
          "Make new code environment",
          "Software as a Service (SaaS)",
        ],
        images: [
          {
            link: "/assets/img/projects/dash-saas/cms-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/dash-saas/cms-assessor-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/dash-saas/cms-assessor-2.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/dash-saas/cms-assessor-3.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/dash-saas/participant-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/dash-saas/participant-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/dash-saas/participant-3.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "wish",
        title: "Acelents for Education (WISH)",
        description:
          "One stop education solutions for students, parents, and educational institution",
        impact: ["AI Agent", "Payment Gateway", "Software as a Service (SaaS)"],
        images: [
          {
            link: "/assets/img/projects/wish/participant-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/wish/participant-2.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/wish/participant-3.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/wish/participant-4.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/wish/participant-5.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/wish/participant-6.png",
            isScrollable: true,
          },
        ],
        link: "https://education.acelents.com/",
      },
    ],
  },
  {
    slug: "ddi-incoming",
    company: "Daya Dimensi Indonesia",
    title:
      "After developing assessment platforms to minimize paperwork and increase efficiency, Daya Dimensi Indonesia (DDI) is now focusing on building an AI-driven assessment platform and consolidating all applications into a single platform.",
    overview:
      "Daya Dimensi Indonesia (DDI) is an Indonesian consulting firm that has been around for quite some time. They're known mainly in the HR and talent management space, helping companies with leadership assessments, organizational development, and workforce capability building.",
    scope: "Front End Developer",
    industry: "Human Resources",
    highlights: [
      {
        id: "acelents",
        title: "Acelents",
        description:
          "Acelents seems like a strong asset for DDI because psychometric/assessment platforms are highly valuable in HR consulting. It provides recurring value, could help differentiate them, and possibly generate reliable revenue (via clients subscribing).",
        impact: [
          "Scale code to be maintainable",
          "Initiate a new project",
          "Software as a Service (SaaS)",
        ],
        images: [
          {
            link: "/assets/img/projects/acelents/cms-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/acelents/cms-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/acelents/cms-3.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/acelents/cms-4-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/acelents/cms-4-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/acelents/cms-5.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/acelents/cms-6.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "portrai",
        title: "PortrAI",
        description:
          "PortrAI is a learning platform for employees to learn and grow. It provides a convenient way for employees to access educational content, resources, and tools to improve their skills and knowledge. Have multiple learning paths, learning modules, and quizzes.",
        impact: [
          "Scale code to be maintainable",
          "New Codes Environment",
          "Software as a Service (SaaS)",
        ],
        images: [
          {
            link: "/assets/img/projects/portrAI/cms-1.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/portrAI/home-participant-3.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/portrAI/chat-participant-2.png",
            isScrollable: false,
          },
          {
            link: "/assets/img/projects/portrAI/email-participant-1.png",
            isScrollable: true,
          },
        ],
      },
    ],
  },
  {
    slug: "uob-infinity",
    company: "United Overseas Bank (UOB)",
    title:
      "Banking platform for UOB customers to cash managements, financial supply chain management, and Trade needs across 10 markets",
    overview:
      "UOB is rated as one of the world's top banks, ranked 'Aa1' by Moody's Investors Service and 'AA-' by both S&P Global and Fitch Ratings. With a global network of 500 branches and offices across 19 countries in Asia Pacific, Europe and North America. In Asia, we operate through our head office in Singapore and banking subsidiaries in China, Indonesia, Malaysia, Thailand and Vietnam, as well as branches and offices throughout the region.",
    scope: "Front End Developer",
    industry: "Financial Services",
    highlights: [
      {
        id: "uob-indonesia",
        title: "UOB Infinity - Indonesia",
        description:
          "BI-FAST implementation for UOB Indonesia, for Single and Bulk Transactions",
        impact: ["Scale code to be maintainable"],
        images: [
          {
            link: "/assets/img/projects/uob-infinity/uob-indonesia.png",
            isScrollable: false,
          },
        ],
      },
      {
        id: "uob-vietnam",
        title: "UOB Infinity - Vietnam",
        description:
          "Vietnam ETax implementation for UOB Vietnam, for Single and Bulk Transactions (General Tax, Customs Tax, Customs Fee Payment)",
        impact: [
          "Scale code to be maintainable",
          "Review code",
          "Refactor code",
        ],
        images: [
          {
            link: "/assets/img/projects/uob-infinity/uob-vietnam.png",
            isScrollable: false,
          },
        ],
      },
    ],
  },
  {
    slug: "sapasonny",
    company: "Dr. H. Sonny Salimi, S.ST., MT.",
    title: "Personal branding and aspiration tracker website",
    overview:
      "Sonny Salimi is Direktur Utama (President Director / CEO) of Perumda Tirtawening Kota Bandung — the municipal water utility company in Bandung. He at that time, need to gain personal branding or exposure to the public, so he created this website.",
    scope: "Front End Developer & Devops Engineer",
    industry: "Personal Branding",
    highlights: [
      {
        id: "sapasonny-website",
        title: "Sapasonny - Personal Branding Website",
        description:
          "Provide personal branding to promote his profile, achievements, and also provide a platform for aspiration tracker for Bandung citizens.",
        impact: [
          "Scale code to be maintainable",
          "Deploy to production",
          "Initiate a new project",
          "Review code",
        ],
        images: [
          {
            link: "/assets/img/projects/sapasonny/homepage-1.png",
            isScrollable: true,
          },
          {
            link: "/assets/img/projects/sapasonny/aspiration-1.png",
            isScrollable: true,
          },
        ],
        link: "https://sonny-salimi-dummy.web.app/",
      },
    ],
  },
];

export const getProjectBySlug = (slug: string): ProjectDetail | undefined => {
  return projectDetails.find((p) => p.slug === slug);
};

export const getAllProjectSlugs = (): string[] => {
  return projectDetails.map((p) => p.slug);
};
