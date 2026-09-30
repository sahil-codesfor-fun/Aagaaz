import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GuestDetails from "@/models/Guest";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        // Enforce accountant or admin authentication check
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "accountant" && session.user.role !== "admin")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Accounts officer access required." },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const { registrationId, status } = await req.json();

        if (!registrationId || !status) {
            return NextResponse.json({ success: false, message: "Registration ID and status are required" }, { status: 400 });
        }

        if (!["verified", "failed"].includes(status.toLowerCase())) {
            return NextResponse.json({ success: false, message: "Invalid status. Must be 'verified' or 'failed'." }, { status: 400 });
        }

        const user = await GuestDetails.findOne({ registrationId });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update the payment status
        user.paymentStatus = status.toLowerCase();
        await user.save();

        return NextResponse.json({ success: true, message: `Payment status updated to ${status}` });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
