import { NextResponse } from "next/server";
import { getRegistrationStatus } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const status = await getRegistrationStatus();
    return NextResponse.json(
      {
        success: true,
        ...status,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch registration status:", error);
    return NextResponse.json(
      {
        success: false,
        isClosed: true,
        stoppedByAdmin: true,
        message: "Registration is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
