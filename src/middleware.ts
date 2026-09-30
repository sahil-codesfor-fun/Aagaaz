import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1. Guard Admin Frontend Web Pages (/admin, /admin/dashboard, /admin/coupons, etc.)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "admin") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Accounts Frontend Web Pages (/accounts, /accounts/dashboard, etc.)
  if (pathname.startsWith("/accounts")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "accountant" && token.role !== "admin") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Guard Admin API Endpoints (/api/admin/registerations, /api/admin/approvePass, etc.)
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Staff authentication required" },
        { status: 401 }
      );
    }

    // Pass approval & rejection is strictly admin-only
    if (pathname.startsWith("/api/admin/approvePass") && token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    // Registrations viewable by admin & accounts
    if (token.role !== "admin" && token.role !== "accountant") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Insufficient privileges" },
        { status: 403 }
      );
    }
  }

  // 4. Guard Accounts & Payment Verification APIs (/api/confirmPayment)
  if (pathname.startsWith("/api/confirmPayment")) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Staff authentication required" },
        { status: 401 }
      );
    }

    if (token.role !== "accountant" && token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Accounts or Admin role required" },
        { status: 403 }
      );
    }
  }

  // 5. Guard Coupon Management API Modifications (POST, PUT, DELETE)
  if (pathname.startsWith("/api/coupons")) {
    // Note: Public registration only queries /api/coupons/code/[code]
    if (pathname === "/api/coupons" || pathname.startsWith("/api/coupons/")) {
      // Exclude public coupon validation endpoint used by checkout
      if (!pathname.startsWith("/api/coupons/code/")) {
        if (!token) {
          return NextResponse.json(
            { success: false, message: "Unauthorized: Authentication required" },
            { status: 401 }
          );
        }

        if (req.method !== "GET" && token.role !== "admin") {
          return NextResponse.json(
            { success: false, message: "Forbidden: Admin role required to modify coupons" },
            { status: 403 }
          );
        }
      }
    }
  }

  // 6. Guard QR manual dispatch & status updates
  if (pathname.startsWith("/api/sendQr") || pathname.startsWith("/api/updateQrStatus")) {
    if (!token || (token.role !== "admin" && token.role !== "accountant")) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Authorized staff only" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/accounts/:path*",
    "/api/admin/:path*",
    "/api/confirmPayment/:path*",
    "/api/coupons",
    "/api/coupons/:path*",
    "/api/sendQr/:path*",
    "/api/updateQrStatus/:path*",
  ],
};
