import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Coupon from "@/models/Coupon";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Administrator access required" }, { status: 401 });
        }

        await connectToDatabase();
        const { name, assignedTo, quantity, discount } = await req.json();

        if (!name || !assignedTo || quantity <= 0 || discount <= 0) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const newCoupon = new Coupon({ name: name.trim().toUpperCase(), assignedTo, quantity, discount });
        await newCoupon.save();

        return NextResponse.json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "admin" && session.user.role !== "accountant")) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        await connectToDatabase();
        const coupons = await Coupon.find();
        return NextResponse.json(coupons);
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
