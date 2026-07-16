import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// `pg-connection-string` warns when the URL carries `sslmode=require|prefer|
// verify-ca` (their meaning changes in pg v9). TLS is governed by the `ssl`
// option below, so strip the redundant param to silence the deprecation warning.
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  return url
    .replace(/[?&]sslmode=[^&]*/i, (m) => (m[0] === "?" ? "?" : ""))
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

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
        companyLogo: "/assets/img/content/80&company-logo.webp",
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
        employmentType: "Freelance",
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
      image: "/assets/img/content/bg-released-ddi.webp",
      year: "2022—NOW",
      tags: ["React", "TypeScript", "Redux", "SaaS"],
      timeline: "Feb 2022 — Present",
      status: "Released — internal use",
      order: 3,
      stack: [
        "REACT",
        "TYPESCRIPT",
        "REDUX",
        "AXIOS",
        "ANT DESIGN",
        "FIREBASE",
        "VITE",
      ],
      storyBlocks: [
        {
          title: "The problem",
          body: "DDI's HR consultants needed a suite of assessment and learning products to evaluate thousands of candidates, manage clients, and produce reports — reliably, at enterprise scale, and behind a secure login.",
        },
        {
          title: "My role",
          body: "As a front-end developer I helped ship and iterate on 7 HR-tech products — EnGauge, Learning Hub, TPOP, DASH SaaS, WISH, Acelents, PortrAI — building 80+ features from face recognition and video conferencing to dynamic org charts and real-time communication.",
        },
        {
          title: "What shipped",
          body: "Released, in-production assessment and learning platforms used by enterprise HR teams — with revamped UI/UX and a codebase refactored to stay maintainable as the product family grew.",
        },
        {
          title: "What I learned",
          body: "Shipping into a live enterprise suite taught me to balance velocity with quality reviews, and to design components that survive years of iteration rather than one release.",
        },
      ],
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
        link: "/assets/img/projects/engauge/cms-1.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/cms-2.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-1.webp",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-2.webp",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: engauge.id,
        link: "/assets/img/projects/engauge/participant-3.webp",
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
        link: "/assets/img/projects/learning-hub/cms-1.webp",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/cms-2.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/cms-3.webp",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-1.webp",
        isScrollable: true,
        order: 4,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-2.webp",
        isScrollable: true,
        order: 5,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-3.webp",
        isScrollable: false,
        order: 6,
      },
      {
        highlightId: learningHub.id,
        link: "/assets/img/projects/learning-hub/participant-4.webp",
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
        link: "/assets/img/projects/tpop/cms-1.webp",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: tpop.id,
        link: "/assets/img/projects/tpop/participant-1.webp",
        isScrollable: true,
        order: 2,
      },
      {
        highlightId: tpop.id,
        link: "/assets/img/projects/tpop/validator-1.webp",
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
        link: "/assets/img/projects/dash-saas/cms-1.webp",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-1.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-2.webp",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/cms-assessor-3.webp",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-1.webp",
        isScrollable: false,
        order: 5,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-2.webp",
        isScrollable: false,
        order: 6,
      },
      {
        highlightId: dashSaaS.id,
        link: "/assets/img/projects/dash-saas/participant-3.webp",
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
        link: "/assets/img/projects/wish/participant-1.webp",
        isScrollable: true,
        order: 1,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-2.webp",
        isScrollable: true,
        order: 2,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-3.webp",
        isScrollable: true,
        order: 3,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-4.webp",
        isScrollable: true,
        order: 4,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-5.webp",
        isScrollable: false,
        order: 5,
      },
      {
        highlightId: wish.id,
        link: "/assets/img/projects/wish/participant-6.webp",
        isScrollable: true,
        order: 6,
      },
    ],
  });

  // Acelents — now released. Moved from the Incoming project and merged with the
  // public acelents.com landing page into a single Acelents highlight.
  const acelents = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "acelents",
      title: "Acelents",
      description:
        "Acelents is DDI's data-driven platform for talent growth, productivity, and retention — now released. The public landing page (acelents.com) pitches the value proposition and the wider product ecosystem (Klob, Engauge, Odyssey), while the app (apps.acelents.com) delivers the experience: succession planning, development-gap analysis, and connected employee data that turn HR decisions from instinct into measurable insight.",
      impact: [
        "Released data-driven HR platform",
        "Marketing landing + product app",
        "Succession & development-gap analysis",
      ],
      link: "https://acelents.com/",
      order: 6,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      // Landing page — acelents.com
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents-landing/01-hero.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents-landing/02-connected-data.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents-landing/03-succession.webp",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents-landing/04-development.webp",
        isScrollable: false,
        order: 4,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents-landing/05-ecosystem.webp",
        isScrollable: false,
        order: 5,
      },
      // Product app — apps.acelents.com
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-1.webp",
        isScrollable: true,
        order: 6,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-2.webp",
        isScrollable: false,
        order: 7,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-3.webp",
        isScrollable: false,
        order: 8,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-4-1.webp",
        isScrollable: false,
        order: 9,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-4-2.webp",
        isScrollable: false,
        order: 10,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-5.webp",
        isScrollable: false,
        order: 11,
      },
      {
        highlightId: acelents.id,
        link: "/assets/img/projects/acelents/cms-6.webp",
        isScrollable: false,
        order: 12,
      },
    ],
  });

  // PortrAI — the former DDI "Incoming Project" has since shipped, so its work
  // is folded into the released DDI platform as another highlight (same pattern
  // as the Acelents move above).
  const portrai = await prisma.projectHighlight.create({
    data: {
      projectId: ddiReleased.id,
      highlightId: "portrai",
      title: "PortrAI",
      description:
        "PortrAI is a learning platform for employees to learn and grow — now released. It gives employees a convenient way to access educational content, resources, and tools to improve their skills, with multiple learning paths, modules, and quizzes, built on a fresh, maintainable, AI-assisted foundation.",
      impact: [
        "Released, in production",
        "Scalable, maintainable codebase",
        "AI-assisted learning",
        "Software as a Service (SaaS)",
      ],
      order: 7,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/cms-1.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/home-participant-3.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/chat-participant-2.webp",
        isScrollable: false,
        order: 3,
      },
      {
        highlightId: portrai.id,
        link: "/assets/img/projects/portrAI/email-participant-1.webp",
        isScrollable: true,
        order: 4,
      },
    ],
  });

  // Nabunk — personal learning build (Java/Spring full-stack banking demo).
  const nabunk = await prisma.project.create({
    data: {
      slug: "nabunk",
      title: "Nabunk — Java Full-Stack Banking Demo",
      description:
        "A learning build to go deep on Java & Spring Boot: a mobile-first digital-banking demo with a typed web dashboard and a native-feel mobile app, backed by a real transactional core.",
      image: "/assets/img/projects/nabunk/web-dashboard.webp",
      year: "2025",
      tags: ["Java", "Spring Boot", "Expo", "Next.js", "Fullstack"],
      timeline: "2025 — Present",
      status: "In development — learning build",
      order: 6,
      stack: [
        "JAVA 17",
        "SPRING BOOT 3",
        "JWT",
        "NEXT.JS",
        "REACT NATIVE",
        "EXPO",
        "H2 / MYSQL",
      ],
      storyBlocks: [
        {
          title: "Why I built it",
          body: "To learn Java and Spring Boot properly by building something real end-to-end — not a toy CRUD, but a banking-shaped domain with the concepts banks actually ask about: ACID transfers, double-entry ledgers, JWT auth, and audit logging.",
        },
        {
          title: "The build",
          body: "A Spring Boot 3 backend (JPA/Hibernate, Spring Security + JWT, OTP-gated transfers) serving both a Next.js web dashboard and an Expo/React Native mobile app from one shared API. Pessimistic locking and idempotency keep transfers correct under contention.",
        },
        {
          title: "What I'm learning",
          body: "Layered architecture and DTO↔entity boundaries in Java, transactional integrity (pessimistic locks, idempotency keys, double-entry accounting), and sharing one typed contract across a web and a native client.",
        },
        {
          title: "Status",
          body: "Actively in development as a learning project — running locally end-to-end (backend + web + mobile), not yet deployed to production.",
        },
      ],
      company: "Personal project",
      overview:
        "Nabunk is a mobile-first digital-banking demo I'm building to learn Java and Spring Boot in depth. One Spring Boot API powers both a Next.js web dashboard and an Expo React Native app — covering auth, accounts, pockets, transfers with OTP, QRIS, bills, and transaction history over a real double-entry ledger.",
      scope: "Full-Stack (Java · Next.js · React Native)",
      industry: "Banking / Fintech (learning)",
    },
  });

  const nabunkWeb = await prisma.projectHighlight.create({
    data: {
      projectId: nabunk.id,
      highlightId: "nabunk-web",
      title: "Web dashboard (Next.js)",
      description:
        "A typed Next.js dashboard for the full banking surface: balances across accounts and pockets, a debit-card view, insights, transfers, bill splitting, and time-deposit (deposito) flows — all talking to the Spring Boot API.",
      impact: ["Next.js 14 App Router", "Typed API contract", "Charts & insights"],
      order: 1,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-dashboard.webp", isScrollable: false, order: 1 },
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-transactions.webp", isScrollable: false, order: 2 },
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-insights.webp", isScrollable: false, order: 3 },
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-kartu.webp", isScrollable: false, order: 4 },
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-split.webp", isScrollable: false, order: 5 },
      { highlightId: nabunkWeb.id, link: "/assets/img/projects/nabunk/web-deposito.webp", isScrollable: false, order: 6 },
    ],
  });

  const nabunkMobile = await prisma.projectHighlight.create({
    data: {
      projectId: nabunk.id,
      highlightId: "nabunk-mobile",
      title: "Mobile app (Expo / React Native)",
      description:
        "A native-feel Expo app sharing the same API: home with balance and pockets, transaction history, savings pockets, a debit card, notifications, and profile — with biometric login on device.",
      impact: ["Expo SDK 54", "Shared REST contract", "Biometric login"],
      order: 2,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-home.webp", isScrollable: true, order: 1 },
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-riwayat.webp", isScrollable: true, order: 2 },
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-pocket.webp", isScrollable: true, order: 3 },
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-kartu.webp", isScrollable: true, order: 4 },
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-notifications.webp", isScrollable: true, order: 5 },
      { highlightId: nabunkMobile.id, link: "/assets/img/projects/nabunk/mobile-profile.webp", isScrollable: true, order: 6 },
    ],
  });

  // UOB Infinity Project
  const uobInfinity = await prisma.project.create({
    data: {
      slug: "uob-infinity",
      title: "UOB Infinity - Banking Platform",
      description:
        "A banking platform for UOB customers to manage accounts, transfer funds, pay bills, and access financial services.",
      image: "/assets/img/content/bg-uob-infinity.webp",
      year: "2021—25",
      tags: ["React", "Banking", "Jest", "Sonar"],
      timeline: "Oct 2021 — Aug 2025",
      status: "Released — production",
      order: 2,
      stack: [
        "REACT",
        "JAVASCRIPT",
        "REDUX",
        "MATERIAL UI",
        "JENKINS",
        "SONAR",
        "JEST",
      ],
      storyBlocks: [
        {
          title: "The problem",
          body: "UOB — one of the world's top-rated banks — needed cross-border corporate banking features that met strict quality and compliance bars across Southeast Asia.",
        },
        {
          title: "My role",
          body: "Front-end developer on UOB Infinity: I built BI-FAST interbank transfers for Indonesia and Vietnam eTax payment flows, working alongside a Big-4 consulting team on the retail/consumer banking platform.",
        },
        {
          title: "What shipped",
          body: "20+ production-ready features for single and bulk transactions, delivered through Jenkins pipelines with Sonar quality gates and Jest coverage — responsive, accessible banking interfaces.",
        },
        {
          title: "What I learned",
          body: "Banking work rewired how I think about quality: every edge case is a real transaction, so tests, reviews, and static analysis stop being optional and become the way you move fast safely.",
        },
      ],
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
            link: "/assets/img/projects/uob-infinity/uob-indonesia.webp",
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
            link: "/assets/img/projects/uob-infinity/uob-vietnam.webp",
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
      image: "/assets/img/content/bg-bandung-makin-juara.webp",
      year: "2023",
      tags: ["React", "DevOps", "Side Project"],
      timeline: "2023",
      status: "Released",
      order: 5,
      stack: ["REACT", "FIREBASE", "CPANEL", "CI/CD"],
      storyBlocks: [
        {
          title: "The problem",
          body: "As President Director of Bandung's municipal water utility, Sonny Salimi needed public exposure and a channel to hear from citizens — a personal-branding site that doubled as an aspiration tracker.",
        },
        {
          title: "My role",
          body: "Front-end developer and DevOps engineer: I built the site end-to-end and handled deployment to production myself.",
        },
        {
          title: "What shipped",
          body: "A live personal-branding site promoting his profile and achievements, plus an aspiration tracker letting Bandung citizens submit and follow their voices.",
        },
        {
          title: "What I learned",
          body: "Owning both the build and the deploy taught me the DevOps half of the job — and how satisfying it is to ship something all the way to a real domain.",
        },
      ],
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
            link: "/assets/img/projects/sapasonny/homepage-1.webp",
            isScrollable: true,
            order: 1,
          },
          {
            link: "/assets/img/projects/sapasonny/aspiration-1.webp",
            isScrollable: true,
            order: 2,
          },
        ],
      },
    },
  });

  // EB-PLT Project (Released)
  const ebplt = await prisma.project.create({
    data: {
      slug: "ebplt",
      title: "EB-PLT - Pharmacist Administration Platform",
      description:
        "Web application for pharmacist administration including notifications, submissions, store transfers, name changes, and other management workflows.",
      image: "/assets/img/projects/ebplt/01-dashboard.webp",
      year: "2025—26",
      tags: ["Next.js", "Prisma", "PostgreSQL", "Fullstack", "Python"],
      timeline: "Nov 2025 — Present",
      status: "Released — in production",
      order: 1,
      stack: [
        "NEXT.JS",
        "TYPESCRIPT",
        "TAILWIND",
        "SHADCN UI",
        "PRISMA",
        "POSTGRESQL (NEON)",
        "ZOD",
        "GOTENBERG",
        "VERCEL CI/CD",
        "SENTRY",
        "GITHUB PROJECTS",
      ],
      storyBlocks: [
        {
          title: "The problem",
          body: "Pharmacist administration in Japan ran on paper and email: license submissions, store transfers, name changes — every workflow slow, error-prone, and invisible to managers. The client needed one platform that could digitize all of it without losing regulatory rigor.",
        },
        {
          title: "My role",
          body: "I wore two hats. As PM: roadmap, milestones, ticketing, and agile rituals on GitHub Projects. As engineer: system architecture, the Next.js app itself, Prisma data models on PostgreSQL, PDF generation via Gotenberg, and the CI/CD pipeline on Vercel with Sentry monitoring.",
        },
        {
          title: "What shipped",
          body: "A released production platform covering notifications, submissions, store transfers, and name-change workflows — with role-based dashboards, automated 変更届書 document generation, and full audit trails. Zero-downtime deploys, typed end-to-end with Zod at every boundary.",
        },
        {
          title: "What I learned",
          body: "Owning delivery and code at once forces honest scoping — you can't over-promise to yourself. It also completed my transition story: from front-end specialist to someone comfortable across the whole stack, database to DevOps.",
        },
      ],
      company: "80&Company/OCT-PATH",
      overview:
        "EB-PLT (薬剤師免許届出支援システム) is a comprehensive web-based platform that streamlines pharmacist license notification submissions to Japanese health centers. It automates a traditionally paper-heavy workflow — generating statutory change-notification forms (変更届書) as print-ready documents, tracking submission deadlines, and managing the full jurisdiction hierarchy from regional bureaus down to individual health centers. Built as a hybrid monorepo: a Next.js App Router web app and a FastAPI PDF microservice.",
      scope: "Project Manager & Fullstack Engineer",
      industry: "Healthcare",
    },
  });

  // EB-PLT — Highlight 1: Store & Employment Management
  const ebpltStores = await prisma.projectHighlight.create({
    data: {
      projectId: ebplt.id,
      highlightId: "store-employment",
      title: "Store & Employment Management",
      description:
        "A role-based admin dashboard surfaces system-wide stats and live deadline alerts, while stores and their pharmacist assignments are managed in one place. Each store tracks active, scheduled, and historical staff, with overdue-change badges that escalate by color as statutory deadlines approach.",
      impact: [
        "Centralized store & employment data",
        "Real-time deadline alerts",
        "Role-based access control (5 roles)",
      ],
      order: 1,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: ebpltStores.id,
        link: "/assets/img/projects/ebplt/02-stores-list.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: ebpltStores.id,
        link: "/assets/img/projects/ebplt/03-store-detail.webp",
        isScrollable: true,
        order: 2,
      },
      {
        highlightId: ebpltStores.id,
        link: "/assets/img/projects/ebplt/04-store-assignments.webp",
        isScrollable: false,
        order: 3,
      },
    ],
  });

  // EB-PLT — Highlight 2: Change-Notification Confirmation & PDF Generation
  const ebpltConfirm = await prisma.projectHighlight.create({
    data: {
      projectId: ebplt.id,
      highlightId: "change-notification",
      title: "変更届 Confirmation & PDF Generation",
      description:
        "The flagship workflow: a split-pane confirmation screen lets staff review pending changes and edit the live preview inline, then generates statutory change-notification documents (変更届書, 様式第六) as print-ready forms. The engine handles multiple official layouts, auto-splits overflowing content onto attached sheets (別紙), and validates missing fields before output.",
      impact: [
        "HTML→PDF 変更届書 generation",
        "Inline-editable print preview",
        "Auto 別紙 overflow & multi-layout support",
      ],
      order: 2,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: ebpltConfirm.id,
        link: "/assets/img/projects/ebplt/05-confirmation-editor.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: ebpltConfirm.id,
        link: "/assets/img/projects/ebplt/06-change-notification-print.webp",
        isScrollable: true,
        order: 2,
      },
    ],
  });

  // EB-PLT — Highlight 3: Pharmacist & License Management
  const ebpltPharmacist = await prisma.projectHighlight.create({
    data: {
      projectId: ebplt.id,
      highlightId: "pharmacist-license",
      title: "Pharmacist & License Management",
      description:
        "Pharmacist records consolidate personal details, employment history across stores, and license information with verification status. Licenses are stored with Japanese-era (和暦) issue dates and feed directly into generated notification forms.",
      impact: [
        "Pharmacist & license records",
        "Assignment history tracking",
        "Japanese-era (和暦) date support",
      ],
      order: 3,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: ebpltPharmacist.id,
        link: "/assets/img/projects/ebplt/07-pharmacists-list.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: ebpltPharmacist.id,
        link: "/assets/img/projects/ebplt/08-pharmacist-detail.webp",
        isScrollable: true,
        order: 2,
      },
    ],
  });

  // EB-PLT — Highlight 4: Admin & Submission Tracking
  const ebpltAdmin = await prisma.projectHighlight.create({
    data: {
      projectId: ebplt.id,
      highlightId: "admin-submissions",
      title: "Admin & Submission Tracking",
      description:
        "Submissions are tracked end-to-end with status, urgency, and deadline indicators. Administrators manage the full jurisdiction master — regional bureaus, prefectures, and health centers — plus per-health-center required-document rules that drive which forms each submission needs.",
      impact: [
        "Submission status & deadline tracking",
        "Jurisdiction master (厚生局→保健所)",
        "Per-health-center document rules",
      ],
      order: 4,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        highlightId: ebpltAdmin.id,
        link: "/assets/img/projects/ebplt/09-submissions.webp",
        isScrollable: false,
        order: 1,
      },
      {
        highlightId: ebpltAdmin.id,
        link: "/assets/img/projects/ebplt/10-admin-jurisdictions.webp",
        isScrollable: false,
        order: 2,
      },
      {
        highlightId: ebpltAdmin.id,
        link: "/assets/img/projects/ebplt/11-admin-requirements.webp",
        isScrollable: false,
        order: 3,
      },
    ],
  });

  // Stevana & Zulfikar — Digital Wedding Invitation (Side Project)
  const wedding = await prisma.project.create({
    data: {
      slug: "wedding-stevana-zulfikar",
      title: "Stevana & Zulfikar - Digital Wedding Invitation",
      description:
        "An elegant, mobile-first digital wedding invitation with an animated cover, countdown, couple story, event details, and RSVP.",
      image: "/assets/img/projects/wedding/01-cover.webp",
      year: "2025",
      tags: ["Motion", "Mobile-First", "Side Project"],
      timeline: "2025",
      status: "Released",
      order: 4,
      stack: ["NEXT.JS", "MOTION", "TAILWIND", "FIREBASE"],
      storyBlocks: [
        {
          title: "The problem",
          body: "Stevana & Zulfikar wanted a wedding invitation that felt personal and alive — not a static template — and a way to run the day-of guest logistics behind the scenes.",
        },
        {
          title: "My role",
          body: "Designer and front-end developer: I designed the mobile-first single-page experience and built both the guest-facing invitation and a password-protected admin panel.",
        },
        {
          title: "What shipped",
          body: "An animated cover reveal, save-the-date countdown, couple story, event details, venue map, and RSVP with wishes — plus an admin dashboard for guest lists, quotas, RSVP tracking, and an incoming wishes wall.",
        },
        {
          title: "What I learned",
          body: "Side projects deserve polish too. Sweating the scroll-reveal motion and micro-interactions proved how much craft shows up in something people actually open on their phones.",
        },
      ],
      company: "Personal Project",
      overview:
        "A bespoke digital wedding invitation built for Stevana & Zulfikar. Designed as a mobile-first single-page experience: a guest opens an animated cover, and the invitation gently reveals the couple's story, a live countdown, ceremony and reception details, a venue map, and an RSVP with wishes — all wrapped in a soft, editorial aesthetic with scroll-triggered animations and a background-music toggle. Behind it sits a password-protected admin panel for managing the guest list, tracking RSVPs, and reading incoming wishes.",
      scope: "Designer & Front End Developer",
      industry: "Digital Invitation",
    },
  });

  await prisma.projectHighlight.create({
    data: {
      projectId: wedding.id,
      highlightId: "wedding-invitation",
      title: "Mobile-First Wedding Invitation",
      description:
        "A single-page invitation that opens from an animated cover into a guided scroll: the couple's introduction, a save-the-date countdown, ceremony & reception schedule, venue location, and an RSVP with personal wishes. Built around soft typography, scroll-reveal motion, and an intimate, editorial feel.",
      impact: [
        "Mobile-first single-page experience",
        "Scroll-reveal animations & countdown",
        "RSVP & wedding wishes",
      ],
      link: "https://weddingstevanazulfikar.web.id/",
      order: 1,
      images: {
        create: [
          {
            link: "/assets/img/projects/wedding/01-cover.webp",
            isScrollable: true,
            order: 1,
          },
          {
            link: "/assets/img/projects/wedding/02-save-the-date.webp",
            isScrollable: true,
            order: 2,
          },
          {
            link: "/assets/img/projects/wedding/03-bride-groom.webp",
            isScrollable: true,
            order: 3,
          },
          {
            link: "/assets/img/projects/wedding/04-event-details.webp",
            isScrollable: true,
            order: 4,
          },
          {
            link: "/assets/img/projects/wedding/05-thank-you.webp",
            isScrollable: true,
            order: 5,
          },
        ],
      },
    },
  });

  await prisma.projectHighlight.create({
    data: {
      projectId: wedding.id,
      highlightId: "wedding-admin",
      title: "Admin & Guest Tracking",
      description:
        "A password-protected admin panel to run the day-of logistics: a dashboard with live guest-engagement stats (invites opened, RSVPs, expected attendees), a searchable guest list with per-invite quotas and statuses, end-to-end RSVP tracking, and an incoming wall of wedding wishes. (Guest names and contacts are blurred here for privacy.)",
      impact: [
        "Live guest-engagement dashboard",
        "Guest list, quotas & RSVP tracking",
        "Incoming wedding-wishes wall",
      ],
      order: 2,
      images: {
        create: [
          {
            link: "/assets/img/projects/wedding/admin-01-dashboard.webp",
            isScrollable: false,
            order: 1,
          },
          {
            link: "/assets/img/projects/wedding/admin-02-guests.webp",
            isScrollable: false,
            order: 2,
          },
          {
            link: "/assets/img/projects/wedding/admin-03-rsvps.webp",
            isScrollable: false,
            order: 3,
          },
          {
            link: "/assets/img/projects/wedding/admin-04-wishes.webp",
            isScrollable: false,
            order: 4,
          },
        ],
      },
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
        logo: "/assets/img/content/typescript.webp",
        order: 1,
      },
      {
        name: "JavaScript",
        level: 95,
        category: "Frontend",
        logo: "/assets/img/content/javascript.webp",
        order: 2,
      },
      {
        name: "Vue.js",
        level: 50,
        category: "Frontend",
        logo: "/assets/img/content/vue.webp",
        order: 3,
      },
      {
        name: "React.js",
        level: 95,
        category: "Frontend",
        logo: "/assets/img/content/react.webp",
        order: 4,
      },
      {
        name: "Next.js",
        level: 75,
        category: "Frontend",
        logo: "/assets/img/content/nextjs.webp",
        order: 5,
      },
      {
        name: "AXIOS",
        level: 90,
        category: "Frontend",
        logo: "/assets/img/content/axios.webp",
        order: 6,
      },
      {
        name: "Redux",
        level: 80,
        category: "Frontend",
        logo: "/assets/img/content/redux.webp",
        order: 7,
      },
      {
        name: "Jest",
        level: 70,
        category: "Frontend",
        logo: "/assets/img/content/jest.webp",
        order: 8,
      },
      {
        name: "Playwright",
        level: 70,
        category: "Frontend",
        logo: "/assets/img/content/playwright.webp",
        order: 9,
      },
      {
        name: "Python",
        level: 40,
        category: "Backend",
        logo: "/assets/img/content/python.webp",
        order: 8,
      },
      {
        name: "Node.js",
        level: 60,
        category: "Backend",
        logo: "/assets/img/content/nodejs.webp",
        order: 9,
      },
      {
        name: "NestJS",
        level: 50,
        category: "Backend",
        logo: "/assets/img/content/nestjs.webp",
        order: 10,
      },
      {
        name: "Sequelize",
        level: 50,
        category: "Backend",
        logo: "/assets/img/content/sequelize.webp",
        order: 11,
      },
      {
        name: "Github Actions",
        level: 60,
        category: "DevOps",
        logo: "/assets/img/content/github-actions.webp",
        order: 11,
      },
      {
        name: "Vercel",
        level: 80,
        category: "DevOps",
        logo: "/assets/img/content/vercel.webp",
        order: 12,
      },
      {
        name: "AWS",
        level: 50,
        category: "DevOps",
        logo: "/assets/img/content/aws.webp",
        order: 13,
      },
      {
        name: "cPanel",
        level: 50,
        category: "DevOps",
        logo: "/assets/img/content/cPanel.webp",
        order: 14,
      },
      {
        name: "Firebase",
        level: 75,
        category: "DevOps",
        logo: "/assets/img/content/firebase.webp",
        order: 15,
      },
      {
        name: "PostgreSQL",
        level: 60,
        category: "Database",
        logo: "/assets/img/content/postgresql.webp",
        order: 16,
      },
      {
        name: "Neon Tech",
        level: 65,
        category: "Database",
        logo: "https://cdn.simpleicons.org/neon",
        order: 17,
      },
      {
        name: "Prisma",
        level: 50,
        category: "Database",
        logo: "/assets/img/content/prisma.webp",
        order: 18,
      },
      {
        name: "GitHub Projects",
        level: 60,
        category: "Project Management",
        logo: "/assets/img/content/github-project.webp",
        order: 19,
      },
      {
        name: "Jira",
        level: 80,
        category: "Project Management",
        logo: "/assets/img/content/jira.webp",
        order: 20,
      },
      {
        name: "Java",
        level: 45,
        category: "Backend",
        logo: "/assets/img/content/java.webp",
        order: 21,
      },
      {
        name: "Expo",
        level: 40,
        category: "Frontend",
        logo: "/assets/img/content/expo.webp",
        order: 22,
      },
      {
        name: "Supabase",
        level: 45,
        category: "Database",
        logo: "/assets/img/content/supabase.webp",
        order: 23,
      },
      {
        name: "Railway",
        level: 55,
        category: "DevOps",
        logo: "/assets/img/content/railway.webp",
        order: 24,
      },
      {
        name: "Claude Code",
        level: 85,
        category: "AI",
        logo: "/assets/img/content/claude.webp",
        order: 25,
      },
      {
        name: "GitHub Copilot",
        level: 75,
        category: "AI",
        logo: "https://cdn.simpleicons.org/githubcopilot",
        order: 26,
      },
      {
        name: "Perplexity",
        level: 70,
        category: "AI",
        logo: "https://cdn.simpleicons.org/perplexity",
        order: 27,
      },
      {
        name: "NotebookLM",
        level: 65,
        category: "AI",
        logo: "https://cdn.simpleicons.org/notebooklm",
        order: 28,
      },
      {
        name: "ChatGPT",
        level: 70,
        category: "AI",
        // OpenAI blossom (LobeHub, mono) tinted the ChatGPT green so it stays
        // legible when the grid desaturates it on both themes.
        logo: "/assets/img/content/chatgpt.webp",
        order: 29,
      },
      {
        name: "Codex",
        level: 65,
        category: "AI",
        logo: "/assets/img/content/codex.webp",
        order: 30,
      },
      {
        name: "Antigravity",
        level: 60,
        category: "AI",
        logo: "/assets/img/content/antigravity.webp",
        order: 31,
      },
      {
        name: "TanStack Query",
        level: 80,
        category: "Frontend",
        logo: "https://cdn.simpleicons.org/reactquery",
        order: 32,
      },
      {
        name: "Express",
        level: 70,
        category: "Backend",
        // Express mark is monochrome black (invisible on dark); Simple Icons'
        // colour override tints it a Node-ish green so it reads on both themes.
        logo: "https://cdn.simpleicons.org/express/68A063",
        order: 33,
      },
      {
        name: "JWT",
        level: 75,
        category: "Backend",
        logo: "/assets/img/content/jwt.webp",
        order: 34,
      },
      {
        name: "Redis",
        level: 55,
        category: "Database",
        logo: "https://cdn.simpleicons.org/redis",
        order: 35,
      },
      {
        name: "Trello",
        level: 70,
        category: "Project Management",
        logo: "https://cdn.simpleicons.org/trello",
        order: 36,
      },
    ],
  });

  // ============ TECH STACK ============
  console.log("💻 Seeding tech stack...");
  await prisma.techStack.createMany({
    data: [
      { name: "React", src: "/assets/img/content/react.webp", order: 1 },
      {
        name: "TypeScript",
        src: "/assets/img/content/typescript.webp",
        order: 2,
      },
      {
        name: "JavaScript",
        src: "/assets/img/content/javascript.webp",
        order: 3,
      },
      { name: "Redux", src: "/assets/img/content/redux.webp", order: 4 },
      { name: "Axios", src: "/assets/img/content/axios.webp", order: 5 },
      { name: "Jest", src: "/assets/img/content/jest.webp", order: 6 },
      { name: "NodeJS", src: "/assets/img/content/nodejs.webp", order: 7 },
      { name: "NestJS", src: "/assets/img/content/nestjs.webp", order: 8 },
      { name: "Prisma", src: "/assets/img/content/prisma.webp", order: 9 },
      {
        name: "Firebase",
        src: "/assets/img/content/firebase.webp",
        order: 10,
      },
      { name: "Vue", src: "/assets/img/content/vue.webp", order: 11 },
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
      previewImage: "/assets/Screenshot_CV.webp",
      // Canonical clean filename — no date suffix. The downloaded file name
      // follows this path's basename (see AboutSection `download` attr).
      downloadPath: "/assets/CV_Shendy Putra Perdana Yohansah.pdf",
    },
  });

  // ============ LOVES ============
  console.log("❤️  Seeding interests...");
  await prisma.love.createMany({
    data: [
      {
        mainName: "DOTA 2",
        mainSrc: "/assets/img/content/dota-2.webp",
        clubs: JSON.stringify([
          {
            name: "Rekonix",
            src: "/assets/img/content/rekonix.webp",
            url: "https://liquipedia.net/dota2/REKONIX",
          },
          {
            name: "Tundra Esports",
            src: "/assets/img/content/tundra-esports.webp",
            url: "https://liquipedia.net/dota2/Tundra_Esports",
          },
        ]),
        order: 1,
      },
      {
        mainName: "Football",
        mainSrc: "/assets/img/content/football.webp",
        clubs: JSON.stringify([
          {
            name: "Real Madrid",
            src: "/assets/img/content/real-madrid.webp",
            url: "https://www.realmadrid.com/en-US",
          },
        ]),
        order: 2,
      },
      {
        mainName: "Basketball",
        mainSrc: "/assets/img/content/basketball.webp",
        clubs: JSON.stringify([
          {
            name: "Los Angeles Lakers",
            src: "/assets/img/content/lakers.webp",
            url: "https://www.nba.com/lakers/",
          },
          {
            name: "Golden State Warriors",
            src: "/assets/img/content/warriors.webp",
            url: "https://www.nba.com/warriors",
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
