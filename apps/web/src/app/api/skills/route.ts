import { NextResponse } from "next/server";
import { getSkills } from "@/server/queries/skills";

export async function GET() {
  try {
    return NextResponse.json(await getSkills());
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
