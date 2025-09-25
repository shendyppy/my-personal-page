import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProjectPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  const projects = [
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
            "/assets/img/projects/engauge/cms-1.png",
            "/assets/img/projects/engauge/cms-2.png",
            "/assets/img/projects/engauge/participant-1.png",
            "/assets/img/projects/engauge/participant-2.png",
            "/assets/img/projects/engauge/participant-3.png",
          ],
        },
        {
          id: "learning-hub",
          title: "Learning Hub",
          description:
            "Learning Hub is a learning platform for employees to learn and grow. It provides a convenient way for employees to access educational content, resources, and tools to improve their skills and knowledge. Have multiple learning paths, learning modules, and quizzes.",
          impact: ["Scale code to be maintainable", "Revamped UI/UX"],
          images: [
            "/assets/img/projects/learning-hub/cms-1.png",
            "/assets/img/projects/learning-hub/cms-2.png",
            "/assets/img/projects/learning-hub/cms-3.png",
            "/assets/img/projects/learning-hub/participant-1.png",
            "/assets/img/projects/learning-hub/participant-2.png",
            "/assets/img/projects/learning-hub/participant-3.png",
            "/assets/img/projects/learning-hub/participant-4.png",
          ],
        },
        {
          id: "tpop",
          title: "Talent Potential Predictors",
          description:
            "Talent Potential Predictors (TPOP) is a platform that predicts the potential of candidates based on their performance on a test. It provides an objective way to evaluate candidates and help companies make informed hiring decisions.",
          impact: ["Scale code to be maintainable", "Revamped UI/UX"],
          images: [
            "/assets/img/projects/tpop/cms-1.png",
            "/assets/img/projects/tpop/participant-1.png",
            "/assets/img/projects/tpop/validator-1.png",
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
            "/assets/img/projects/tpop/cms-1.png",
            "/assets/img/projects/tpop/participant-1.png",
            "/assets/img/projects/tpop/validator-1.png",
          ],
        },
        {
          id: "wish",
          title: "Acelents for Education (WISH)",
          description:
            "One stop education solutions for students, parents, and educational institution",
          impact: [
            "AI Agent",
            "Payment Gateway",
            "Software as a Service (SaaS)",
          ],
          images: [
            "/assets/img/projects/wish/participant-1.png",
            "/assets/img/projects/wish/participant-2.png",
            "/assets/img/projects/wish/participant-3.png",
            "/assets/img/projects/wish/participant-4.png",
            "/assets/img/projects/wish/participant-5.png",
            "/assets/img/projects/wish/participant-6.png",
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
            "/assets/img/projects/acelents/cms-1.png",
            "/assets/img/projects/acelents/cms-2.png",
            "/assets/img/projects/acelents/cms-3.png",
            "/assets/img/projects/acelents/cms-4-1.png",
            "/assets/img/projects/acelents/cms-4-2.png",
            "/assets/img/projects/acelents/cms-5.png",
            "/assets/img/projects/acelents/cms-6.png",
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
            "/assets/img/projects/portrAI/cms-1.png",
            "/assets/img/projects/portrAI/home-participant-3.png",
            "/assets/img/projects/portrAI/chat-participant-2.png",
            "/assets/img/projects/portrAI/email-participant-1.png",
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
          images: ["/assets/img/projects/uob-infinity/uob-indonesia.png"],
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
          images: ["/assets/img/projects/uob-infinity/uob-vietnam.png"],
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
            "/assets/img/projects/sapasonny/homepage-1.png",
            "/assets/img/projects/sapasonny/aspiration-1.png",
          ],
          link: "https://sonny-salimi-dummy.web.app/",
        },
      ],
    },
  ];

  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 gap-4">
      <div className="flex justify-start items-start mb-6">
        <Link href="/">
          <Button
            className="!p-0 mt-4 md:mt-6 cursor-pointer hover:translate-x-1 transition-transform duration-200"
            variant="link"
          >
            <ArrowBigLeft />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-stretch gap-4">
        <h1 className="w-full sm:w-4/5 text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
          {project.title}
        </h1>
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-400 sm:text-right">
          {project.company}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {project.overview}
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
            <h3 className="font-semibold">Scope</h3>
            <p className="text-sm text-gray-600">{project.scope}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
            <h3 className="font-semibold">Industry</h3>
            <p className="text-sm text-gray-600">{project.industry}</p>
          </div>
        </div>
      </div>

      {/* Highlights with sticky layout */}
      {project.highlights.map((highlight, index) => (
        <div key={highlight.id} className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left side - Sticky content */}
            <div className="lg:sticky lg:top-16 lg:self-start lg:flex lg:flex-col lg:justify-start">
              <div className="lg:py-8">
                <div className="text-sm text-gray-400 mb-2 font-mono">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(project.highlights.length).padStart(2, "0")}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  {highlight.title}
                </h2>
                <p className="text-muted-foreground mb-6 whitespace-pre-line leading-relaxed">
                  {highlight.description}
                </p>

                {/* Impacts */}
                {highlight.impact?.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {highlight.impact.map((item, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                {/* External link button */}
                {highlight.link && (
                  <Link
                    href={highlight.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="mt-4 hover:translate-y-[-2px] transition-transform duration-200 rounded-2xl"
                    >
                      Visit Project
                      <ArrowBigRight className="-rotate-45" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Scrollable images */}
            <div className="flex flex-col gap-8">
              {highlight.images.map((img, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-white to-gray-50 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-full h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden rounded-xl shadow-md relative bg-white">
                    <div className="absolute inset-0 transition-transform duration-[3000ms] ease-in-out group-hover:-translate-y-[70%]">
                      <Image
                        src={img}
                        alt={`${highlight.title} - Screenshot ${i + 1}`}
                        width={600}
                        height={1200}
                        className="w-full h-auto object-contain"
                        priority={i === 0}
                      />
                    </div>

                    {/* Gradient overlay at bottom to indicate more content */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500"></div>
                  </div>

                  {/* Image number indicator */}
                  <div className="absolute top-5 right-5 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {i + 1} / {highlight.images.length}
                  </div>

                  {/* Scroll hint */}
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs opacity-60 group-hover:opacity-0 transition-opacity duration-300">
                    Hover to scroll
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectPage;
