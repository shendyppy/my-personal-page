import { NextResponse } from "next/server";
import { getProjects } from "@/server/queries/projects";

export async function GET() {
  try {
    return NextResponse.json(await getProjects());
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
