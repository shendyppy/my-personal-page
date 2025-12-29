import { PrismaClient } from "../src/generated/prisma";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.projectImage.deleteMany();
  await prisma.projectHighlight.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.love.deleteMany();
  await prisma.aboutSection.deleteMany();
  await prisma.cvInfo.deleteMany();

  // ============ EXPERIENCES ============
  console.log("💼 Seeding experiences...");
  await prisma.experience.createMany({
    data: [
      {
        company: "PT. Daya Dimensi Indonesia (DDI)",
        companyLogo: "/assets/img/content/ddi-logo.webp",
        title: "Front End Developer",
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
        employmentType: "Full Time",
        order: 1,
      },
      {
        company: "80&Company/OCT-PATH",
        companyLogo: "/assets/img/content/80&company-logo.jpg",
        title: "Brain Manager (Project Manager & Fullstack Engineer)",
        location: "Jakarta, Indonesia",
        period: "November 2025 - Present",
        current: true,
        description:
          "Lead strategic planning, execution, and delivery of multi-layered digital products while contributing directly to system architecture, development, and DevOps.",
        responsibilities: [
          "Managed end-to-end delivery across multiple workstreams including business flow design, workflow automation, and technical architecture.",
          "Built full-stack features involving PDF automation, assessment engines, secure authentication flows, and content platforms.",
          "Contributed to DevOps processes including environment setup, CI/CD, deployment, and performance optimization.",
          "Acted as both project manager and technical contributor, ensuring balance between execution speed and product quality.",
        ],
        projects: [
          "EB-PLT – Pharmacist Administration Platform (Released)",
          "Various workflow automation and internal tools",
        ],
        techStack:
          "Next.js, shadcn UI, Tailwind CSS, TypeScript, Prisma, PostgreSQL (Neon), Gotenberg, Vercel Blob, Zod, GitHub Projects (Agile Management - ticketing, roadmap, milestones), CI/CD (Vercel), Error Logging (Sentry)",
        employmentType: "Part Time",
        order: 2,
      },
      {
        company: "PT. Mahardika Solusi Teknologi (IDE Asia)",
        companyLogo: "/assets/img/content/ide-logo.webp",
        title: "Front End Developer",
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
        employmentType: "Contract",
        order: 3,
      },
    ],
  });

  // ============ PROJECTS ============
  console.log("📁 Seeding projects...");

  // DDI Released Project
  const ddiReleased = await prisma.project.create({
    data: {
      slug: "ddi-released",
      title: "Daya Dimensi Indonesia - HR Consultant [RELEASED PROJECT]",
      description:
        "Building assessment platform for HR consultants to evaluate candidates, also manage clients and reports.",
      image: "/assets/img/content/bg-released-ddi.png",
      company: "Daya Dimensi Indonesia",
      overview:
        "Daya Dimensi Indonesia (DDI) is an Indonesian consulting firm that has been around for quite some time. They're known mainly in the HR and talent management space, helping companies with leadership assessments, organizational development, and workforce capability building.",
      scope: "Front End Developer",
      industry: "Human Resources",
    },
  });

  // DDI Released - EnGauge Highlight
  const engauge = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "engauge",
      title: "Engauge",
      description:
        "EnGauge seems like a strong asset for DDI because psychometric/assessment platforms are highly valuable in HR consulting. It provides recurring value, could help differentiate them, and possibly generate reliable revenue (via clients subscribing).",
      impact: ["Scale code to be maintainable", "Revamped UI/UX"],
      order: 1,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/cms-1.png",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/cms-2.png",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-1.png",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-2.png",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-3.png",
        isScrollable: false,
        order: 5,
      },
    ],
  });

  // Learning Hub
  const learningHub = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "learning-hub",
      title: "Learning Hub",
      description:
        "Learning Hub is a learning platform for employees to learn and grow. It provides a convenient way for employees to access educational content, resources, and tools to improve their skills and knowledge. Have multiple learning paths, learning modules, and quizzes.",
      impact: ["Scale code to be maintainable", "Revamped UI/UX"],
      order: 2,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/cms-1.png",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/cms-2.png",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/cms-3.png",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-1.png",
        isScrollable: true,
        order: 4,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-2.png",
        isScrollable: true,
        order: 5,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-3.png",
        isScrollable: false,
        order: 6,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-4.png",
        isScrollable: false,
        order: 7,
      },
    ],
  });

  // TPOP
  const tpop = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "tpop",
      title: "Talent Potential Predictors",
      description:
        "Talent Potential Predictors (TPOP) is a platform that predicts the potential of candidates based on their performance on a test. It provides an objective way to evaluate candidates and help companies make informed hiring decisions.",
      impact: ["Scale code to be maintainable", "Revamped UI/UX"],
      order: 3,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: tpop.id,
        link: "/assets/img/projects/tpop/cms-1.png",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: tpop.id,
        link: "/assets/img/projects/tpop/participant-1.png",
        isScrollable: true,
        order: 2,
      },
      {
        highlightId: tpop.id,
        link: "/assets/img/projects/tpop/validator-1.png",
        isScrollable: false,
        order: 3,
      },
    ],
  });

  // DASH SaaS
  const dashSaaS = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "dash-saas",
      title: "DASH SaaS",
      description:
        "Dash SaaS is a voluntary SaaS implementation of the assessment platform with video conferencing. It provides a convenient way for HR consultants to evaluate candidates, and then the test integrated with EnGauge make it more effective.",
      impact: [
        "Initiate a new project",
        "Make new code environment",
        "Software as a Service (SaaS)",
      ],
      order: 4,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-1.png",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-1.png",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-2.png",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-3.png",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-1.png",
        isScrollable: false,
        order: 5,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-2.png",
        isScrollable: false,
        order: 6,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-3.png",
        isScrollable: false,
        order: 7,
      },
    ],
  });

  // WISH
  const wish = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "wish",
      title: "Acelents for Education (WISH)",
      description:
        "One stop education solutions for students, parents, and educational institution",
      impact: ["AI Agent", "Payment Gateway", "Software as a Service (SaaS)"],
      link: "https://education.acelents.com/",
      order: 5,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-1.png",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-2.png",
        isScrollable: true,
        order: 2,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-3.png",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-4.png",
        isScrollable: true,
        order: 4,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-5.png",
        isScrollable: false,
        order: 5,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-6.png",
        isScrollable: true,
        order: 6,
      },
    ],
  });

  // DDI Incoming Project
  const ddiIncoming = await prisma.project.create({
    data: {
      slug: "ddi-incoming",
      title: "Daya Dimensi Indonesia - HR Consultant [INCOMING PROJECT]",
      description:
        "Building assessment platform for HR consultants to evaluate candidates, also manage clients and reports.",
      image: "/assets/img/content/bg-incoming-ddi.png",
      company: "Daya Dimensi Indonesia",
      overview:
        "After developing assessment platforms to minimize paperwork and increase efficiency, Daya Dimensi Indonesia (DDI) is now focusing on building an AI-driven assessment platform and consolidating all applications into a single platform.",
      scope: "Front End Developer",
      industry: "Human Resources",
    },
  });

  // ACELENTS
  const acelents = await prisma.projectHighlight.create({
    data: {
      projectId: ddiIncoming.id,
      highlightId: "acelents",
      title: "Acelents",
      description:
        "Acelents seems like a strong asset for DDI because psychometric/assessment platforms are highly valuable in HR consulting. It provides recurring value, could help differentiate them, and possibly generate reliable revenue (via clients subscribing).",
      impact: [
        "Scale code to be maintainable",
        "Initiate a new project",
        "Software as a Service (SaaS)",
      ],
      order: 1,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-1.png",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-2.png",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-3.png",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-4-1.png",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-4-2.png",
        isScrollable: false,
        order: 5,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-5.png",
        isScrollable: false,
        order: 6,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-6.png",
        isScrollable: false,
        order: 7,
      },
    ],
  });

  // PortrAI
  const portrai = await prisma.projectHighlight.create({
    data: {
      projectId: ddiIncoming.id,
      highlightId: "portrai",
      title: "PortrAI",
      description:
        "PortrAI is a learning platform for employees to learn and grow. It provides a convenient way for employees to access educational content, resources, and tools to improve their skills and knowledge. Have multiple learning paths, learning modules, and quizzes.",
      impact: [
        "Scale code to be maintainable",
        "New Codes Environment",
        "Software as a Service (SaaS)",
      ],
      order: 2,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/cms-1.png",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/home-participant-3.png",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/chat-participant-2.png",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/email-participant-1.png",
        isScrollable: true,
        order: 4,
      },
    ],
  });

  // UOB Infinity Project
  const uobInfinity = await prisma.project.create({
    data: {
      slug: "uob-infinity",
      title: "UOB Infinity - Banking Platform",
      description:
        "A banking platform for UOB customers to manage accounts, transfer funds, pay bills, and access financial services.",
      image: "/assets/img/content/bg-uob-infinity.png",
      company: "United Overseas Bank (UOB)",
      overview:
        "UOB is rated as one of the world's top banks, ranked 'Aa1' by Moody's Investors Service and 'AA-' by both S&P Global and Fitch Ratings. With a global network of 500 branches and offices across 19 countries in Asia Pacific, Europe and North America. In Asia, we operate through our head office in Singapore and banking subsidiaries in China, Indonesia, Malaysia, Thailand and Vietnam, as well as branches and offices throughout the region.",
      scope: "Front End Developer",
      industry: "Financial Services",
    },
  });

  // UOB Indonesia
  await prisma.projectHighlight.create({
    data: {
      projectId: uobInfinity.id,
      highlightId: "uob-indonesia",
      title: "UOB Infinity - Indonesia",
      description:
        "BI-FAST implementation for UOB Indonesia, for Single and Bulk Transactions",
      impact: ["Scale code to be maintainable"],
      order: 1,
      images: {
        create: [
          {
            link: "/assets/img/projects/uob-infinity/uob-indonesia.png",
            isScrollable: false,
            order: 1,
          },
        ],
      },
    },
  });

  // UOB Vietnam
  await prisma.projectHighlight.create({
    data: {
      projectId: uobInfinity.id,
      highlightId: "uob-vietnam",
      title: "UOB Infinity - Vietnam",
      description:
        "Vietnam ETax implementation for UOB Vietnam, for Single and Bulk Transactions (General Tax, Customs Tax, Customs Fee Payment)",
      impact: [
        "Scale code to be maintainable",
        "Review code",
        "Refactor code",
      ],
      order: 2,
      images: {
        create: [
          {
            link: "/assets/img/projects/uob-infinity/uob-vietnam.png",
            isScrollable: false,
            order: 1,
          },
        ],
      },
    },
  });

  // Sapasonny Project
  const sapasonny = await prisma.project.create({
    data: {
      slug: "sapasonny",
      title: "Sapasonny - Personal Branding Website",
      description:
        "A personal branding website to showcase portfolio, services, contact information, and can be used as aspiration tracker.",
      image: "/assets/img/content/bg-bandung-makin-juara.png",
      company: "Dr. H. Sonny Salimi, S.ST., MT.",
      overview:
        "Sonny Salimi is Direktur Utama (President Director / CEO) of Perumda Tirtawening Kota Bandung — the municipal water utility company in Bandung. He at that time, need to gain personal branding or exposure to the public, so he created this website.",
      scope: "Front End Developer & Devops Engineer",
      industry: "Personal Branding",
    },
  });

  await prisma.projectHighlight.create({
    data: {
      projectId: sapasonny.id,
      highlightId: "sapasonny-website",
      title: "Sapasonny - Personal Branding Website",
      description:
        "Provide personal branding to promote his profile, achievements, and also provide a platform for aspiration tracker for Bandung citizens.",
      impact: [
        "Scale code to be maintainable",
        "Deploy to production",
        "Initiate a new project",
        "Review code",
      ],
      link: "https://sonny-salimi-dummy.web.app/",
      order: 1,
      images: {
        create: [
          {
            link: "/assets/img/projects/sapasonny/homepage-1.png",
            isScrollable: true,
            order: 1,
          },
          {
            link: "/assets/img/projects/sapasonny/aspiration-1.png",
            isScrollable: true,
            order: 2,
          },
        ],
      },
    },
  });

  // EB-PLT Project (In Development)
  const ebplt = await prisma.project.create({
    data: {
      slug: "ebplt",
      title: "EB-PLT - Pharmacist Administration Platform [IN DEVELOPMENT]",
      description:
        "Web application for pharmacist administration including notifications, submissions, store transfers, name changes, and other management workflows.",
      image: "/assets/img/content/80&company-logo.jpg",
      company: "80&Company/OCT-PATH",
      overview:
        "EB-PLT is a comprehensive web-based platform designed to streamline pharmaceutical administration processes. The platform enables pharmacists to handle various administrative tasks efficiently, including form submissions, notifications, store transfers, and name change requests.",
      scope: "Project Manager & Fullstack Engineer",
      industry: "Healthcare",
    },
  });

  // ============ SKILLS ============
  console.log("🛠️  Seeding skills...");
  await prisma.skill.createMany({
    data: [
      {
        name: "TypeScript",
        level: 90,
        category: "Frontend",
        logo: "/assets/img/content/typescript.png",
        model: "/assets/models/typescript.glb",
        color: "#3178C6",
        order: 1,
      },
      {
        name: "JavaScript",
        level: 95,
        category: "Frontend",
        logo: "/assets/img/content/javascript.png",
        model: "/assets/models/javascript.glb",
        color: "#F7DF1E",
        order: 2,
      },
      {
        name: "Vue.js",
        level: 50,
        category: "Frontend",
        logo: "/assets/img/content/vue.png",
        model: "/assets/models/vue.glb",
        color: "#42B883",
        order: 3,
      },
      {
        name: "React.js",
        level: 95,
        category: "Frontend",
        logo: "/assets/img/content/react.png",
        model: "/assets/models/react.glb",
        color: "#61DAFB",
        order: 4,
      },
      {
        name: "Next.js",
        level: 75,
        category: "Frontend",
        logo: "/assets/img/content/nextjs.png",
        model: "/assets/models/nextjs.glb",
        color: "#000000",
        order: 5,
      },
      {
        name: "AXIOS",
        level: 90,
        category: "Frontend",
        logo: "/assets/img/content/axios.png",
        model: "/assets/models/axios.glb",
        color: "#5A29E4",
        order: 6,
      },
      {
        name: "Redux",
        level: 80,
        category: "Frontend",
        logo: "/assets/img/content/redux.png",
        model: "/assets/models/redux.glb",
        color: "#764ABC",
        order: 7,
      },
      {
        name: "Jest",
        level: 70,
        category: "Frontend",
        logo: "/assets/img/content/jest.png",
        model: "/assets/models/jest.glb",
        color: "#C21325",
        order: 8,
      },
      {
        name: "Python",
        level: 40,
        category: "Backend",
        logo: "/assets/img/content/python.png",
        model: "/assets/models/python.glb",
        color: "#3776AB",
        order: 8,
      },
      {
        name: "Node.js",
        level: 60,
        category: "Backend",
        logo: "/assets/img/content/nodejs.png",
        model: "/assets/models/nodejs.glb",
        color: "#339933",
        order: 9,
      },
      {
        name: "NestJS",
        level: 50,
        category: "Backend",
        logo: "/assets/img/content/nestjs.png",
        model: "/assets/models/nestjs.glb",
        color: "#E0234E",
        order: 10,
      },
      {
        name: "Sequelize",
        level: 50,
        category: "Backend",
        logo: "/assets/img/content/sequelize.png",
        model: "/assets/models/sequelize.glb",
        color: "#52B0E7",
        order: 11,
      },
      {
        name: "Github Actions",
        level: 60,
        category: "DevOps",
        logo: "/assets/img/content/github-actions.png",
        model: "/assets/models/github-actions.glb",
        color: "#2088FF",
        order: 11,
      },
      {
        name: "Vercel",
        level: 80,
        category: "DevOps",
        logo: "/assets/img/content/vercel.png",
        model: "/assets/models/vercel.glb",
        color: "#000000",
        order: 12,
      },
      {
        name: "AWS",
        level: 50,
        category: "DevOps",
        logo: "/assets/img/content/aws.png",
        model: "/assets/models/aws.glb",
        color: "#FF9900",
        order: 13,
      },
      {
        name: "cPanel",
        level: 50,
        category: "DevOps",
        logo: "/assets/img/content/cPanel.png",
        model: "/assets/models/cPanel.glb",
        color: "#FF6C2C",
        order: 14,
      },
      {
        name: "Firebase",
        level: 75,
        category: "DevOps",
        logo: "/assets/img/content/firebase.png",
        model: "/assets/models/firebase.glb",
        color: "#FFCA28",
        order: 15,
      },
      {
        name: "PostgreSQL",
        level: 60,
        category: "Database",
        logo: "/assets/img/content/postgresql.png",
        model: "/assets/models/postgresql.glb",
        color: "#336791",
        order: 16,
      },
      {
        name: "Neon Tech",
        level: 65,
        category: "Database",
        logo: "/assets/img/content/neon-tech.png",
        model: "/assets/models/neon-tech.glb",
        color: "#0095FF",
        order: 17,
      },
      {
        name: "Prisma",
        level: 50,
        category: "Database",
        logo: "/assets/img/content/prisma.png",
        model: "/assets/models/prisma.glb",
        color: "#0C344B",
        order: 18,
      },
      {
        name: "GitHub Projects",
        level: 60,
        category: "Project Management",
        logo: "/assets/img/content/github-project.png",
        model: "/assets/models/github-project.glb",
        color: "#1f6feb",
        order: 19,
      },
      {
        name: "Jira",
        level: 80,
        category: "Project Management",
        logo: "/assets/img/content/jira.png",
        model: "/assets/models/jira.glb",
        color: "#0052CC",
        order: 20,
      },
    ],
  });

  // ============ TECH STACK ============
  console.log("💻 Seeding tech stack...");
  await prisma.techStack.createMany({
    data: [
      { name: "React", src: "/assets/img/content/react.png", order: 1 },
      {
        name: "TypeScript",
        src: "/assets/img/content/typescript.png",
        order: 2,
      },
      {
        name: "JavaScript",
        src: "/assets/img/content/javascript.png",
        order: 3,
      },
      { name: "Redux", src: "/assets/img/content/redux.png", order: 4 },
      { name: "Axios", src: "/assets/img/content/axios.png", order: 5 },
      { name: "Jest", src: "/assets/img/content/jest.png", order: 6 },
      { name: "NodeJS", src: "/assets/img/content/nodejs.png", order: 7 },
      { name: "NestJS", src: "/assets/img/content/nestjs.png", order: 8 },
      { name: "Prisma", src: "/assets/img/content/prisma.png", order: 9 },
      {
        name: "Firebase",
        src: "/assets/img/content/firebase.png",
        order: 10,
      },
      { name: "Vue", src: "/assets/img/content/vue.png", order: 11 },
    ],
  });

  // ============ SOCIAL LINKS ============
  console.log("🔗 Seeding social links...");
  await prisma.socialLink.createMany({
    data: [
      {
        platform: "github",
        url: "https://github.com/shendyppy",
        label: "GitHub",
        iconName: "Github",
        order: 1,
      },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/shendyppy/",
        label: "LinkedIn",
        iconName: "Linkedin",
        order: 2,
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/shendyppy/",
        label: "Instagram",
        iconName: "Instagram",
        order: 3,
      },
      {
        platform: "twitter",
        url: "https://www.twitter.com/shendyppy/",
        label: "Twitter",
        iconName: "Twitter",
        order: 4,
      },
      {
        platform: "email",
        url: "mailto:shendyppy@gmail.com?subject=Hello Shendy&body=I%20saw%20your%20portfolio!",
        label: "Email",
        iconName: "Mail",
        order: 5,
      },
    ],
  });

  // ============ ABOUT SECTIONS ============
  console.log("📄 Seeding about sections...");
  await prisma.aboutSection.createMany({
    data: [
      {
        key: "professional_bio",
        title: "Professional Dreamer",
        content:
          "I began my career as a civil engineer, but curiosity soon pulled me into tech (during the pandemic I challenged myself to switch paths by joining a coding bootcamp). Growing up as a gamer — and still one today — I was always fascinated by how those worlds were built. Realizing that a few lines of code could bring something interactive to life was game-changing. Since then, I've been all-in on front-end craft: experimenting with 3D on the web, and polishing interfaces that feel playful and intuitive.",
      },
      {
        key: "current_learning",
        title: "Currently Learning",
        content:
          "Recently, I've been revisiting the backend, DevOps, and even dipping my toes into LLMs — learning my way through Node.js, Nest.js, ORMs, Python, and the world of CI/CD and deployment. I'm still early on this path, but my aim is clear: to eventually feel just as comfortable building systems behind the scenes as I do shaping the UI up front.",
      },
    ],
  });

  // ============ CV INFO ============
  console.log("📄 Seeding CV info...");
  await prisma.cvInfo.create({
    data: {
      title: "Curriculum Vitae",
      previewImage: "/assets/Screenshot_CV.png",
      downloadPath:
        "/assets/CV_Shendy Putra Perdana Yohansah_03 Dec 2025.pdf",
    },
  });

  // ============ LOVES ============
  console.log("❤️  Seeding interests...");
  await prisma.love.createMany({
    data: [
      {
        mainName: "DOTA 2",
        mainSrc: "/assets/img/content/dota-2.png",
        clubs: JSON.stringify([
          { name: "Rekonix", src: "/assets/img/content/rekonix.png" },
          {
            name: "Tundra Esports",
            src: "/assets/img/content/tundra-esports.png",
          },
        ]),
        order: 1,
      },
      {
        mainName: "Football",
        mainSrc: "/assets/img/content/football.png",
        clubs: JSON.stringify([
          { name: "Real Madrid", src: "/assets/img/content/real-madrid.png" },
        ]),
        order: 2,
      },
      {
        mainName: "Basketball",
        mainSrc: "/assets/img/content/basketball.png",
        clubs: JSON.stringify([
          { name: "Los Angeles Lakers", src: "/assets/img/content/lakers.png" },
          {
            name: "Golden State Warriors",
            src: "/assets/img/content/warriors.png",
          },
        ]),
        order: 3,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
