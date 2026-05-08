import { NextResponse } from "next/server";
import { getExperiences } from "@/server/queries/experiences";

export async function GET() {
  try {
    return NextResponse.json(await getExperiences());
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}
