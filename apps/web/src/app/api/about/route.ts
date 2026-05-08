import { NextResponse } from "next/server";
import { getAbout } from "@/server/queries/about";

export async function GET() {
  try {
    return NextResponse.json(await getAbout());
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 }
    );
  }
}
