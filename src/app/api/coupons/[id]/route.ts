import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, props: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Administrator access required" }, { status: 401 });
        }

        const params = await props.params;
        await connectToDatabase();

        const id = (await params.id) || null;
        if (!id) {
            return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
        }

        const updatedData = await req.json();

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCoupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCoupon, { status: 200 });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update coupon", details: (error as Error).message }, { status: 500 });
    }
}