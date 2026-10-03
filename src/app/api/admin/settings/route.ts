import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRegistrationStatus, setRegistrationStatus } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    const status = await getRegistrationStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { isClosed, message } = body;

    if (typeof isClosed !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Field 'isClosed' must be a boolean." },
        { status: 400 }
      );
    }

    const updated = await setRegistrationStatus(isClosed, message);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Failed to update registration status in database." },
        { status: 500 }
      );
    }

    const newStatus = await getRegistrationStatus();
    return NextResponse.json({
      success: true,
      actionMessage: isClosed ? "Registrations stopped successfully." : "Registrations resumed successfully.",
      ...newStatus,
    });
  } catch (error) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update admin settings." },
      { status: 500 }
    );
  }
}
