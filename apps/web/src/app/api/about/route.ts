import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [aboutSections, cvInfo, techStacks, socialLinks, loves] =
      await Promise.all([
        prisma.aboutSection.findMany(),
        prisma.cvInfo.findFirst(),
        prisma.techStack.findMany({ orderBy: { order: "asc" } }),
        prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
        prisma.love.findMany({ orderBy: { order: "asc" } }),
      ]);

    // Parse the JSON string for clubs in loves
    const lovesWithParsedClubs = loves.map((love) => ({
      ...love,
      clubs: typeof love.clubs === "string" ? JSON.parse(love.clubs) : love.clubs,
    }));

    return NextResponse.json({
      aboutSections,
      cvInfo,
      techStacks,
      socialLinks,
      loves: lovesWithParsedClubs,
    });
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 }
    );
  }
}
