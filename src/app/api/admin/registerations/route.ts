import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GuestDetails from "@/models/Guest";
import Coupon from "@/models/Coupon";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
    try {
        // Enforce server-side authentication check
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "admin" && session.user.role !== "accountant")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Access restricted to authorized personnel" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const registrationId = searchParams.get("registrationId") || searchParams.get("id");

        // If specific registration is requested, return full document including proof images
        if (registrationId) {
            const guest: any = await GuestDetails.findOne({
                $or: [
                    { registrationId: registrationId },
                    ...(registrationId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: registrationId }] : [])
                ]
            }).lean();

            if (!guest) {
                return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
            }

            let couponDetails = null;
            if (guest.appliedCoupon) {
                const coupon: any = await Coupon.findOne({ name: guest.appliedCoupon }).lean();
                if (coupon) {
                    couponDetails = {
                        name: coupon.name,
                        assignedTo: coupon.assignedTo,
                        discount: coupon.discount
                    };
                }
            }

            return NextResponse.json({
                ...guest,
                couponDetails
            });
        }

        // List all registrations with lightweight projection (excluding heavy base64 images for superfast loading)
        const guests = await GuestDetails.find({}, {
            schoolIdCard: 0,
            aadharCard: 0,
            "members.schoolIdCard": 0,
            "members.aadharCard": 0
        })
            .sort({ _id: -1 })
            .lean();

        // Fetch coupon details for users who have applied a coupon
        const couponCodes = guests
            .map((user: any) => user.appliedCoupon)
            .filter((code: any) => Boolean(code));

        const coupons: any[] = couponCodes.length > 0
            ? await Coupon.find({ name: { $in: couponCodes } }).lean()
            : [];

        // Map users with coupon details
        const userData = guests.map((user: any) => {
            const userCoupon = coupons.find((coupon: any) => coupon.name === user.appliedCoupon);
            return {
                ...user,
                couponDetails: userCoupon ? {
                    name: userCoupon.name,
                    assignedTo: userCoupon.assignedTo,
                    discount: userCoupon.discount
                } : null
            };
        });

        return NextResponse.json(userData);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
