import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data = await req.json();

    const name = data.name || data.members?.[0]?.name;
    const email = data.email || data.members?.[0]?.email;
    const mobile = data.mobile || data.whatsapp || data.members?.[0]?.mobile || data.members?.[0]?.whatsapp;
    const state = data.state || data.members?.[0]?.state;
    const city = data.city || data.address || data.members?.[0]?.city || data.members?.[0]?.address;
    const schoolName = data.schoolName || data.members?.[0]?.schoolName;
    const isOtherSchool = !!data.isOtherSchool;
    const studentClass = data.studentClass || data.class || data.members?.[0]?.studentClass || "12th";
    const schoolIdCard = data.schoolIdCard || data.members?.[0]?.schoolIdCard;
    const aadharCard = data.aadharCard || data.members?.[0]?.aadharCard;

    if (!name || !email || !mobile || !state || !city || !schoolName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields: Full Name, Email, Mobile Number, State, City, and School Name.",
        },
        { status: 400 }
      );
    }

    if (!schoolIdCard || !aadharCard) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload both your School ID card and Aadhar card.",
        },
        { status: 400 }
      );
    }

    const registrationId = uuidv4();

    const qrCodeURL = await QRCode.toDataURL(
      `${process.env.NEXTAUTH_URL || "https://aaghaz-gu.vercel.app"}/checkin?regId=${registrationId}`
    );

    console.log("Generated QR for student registration:", registrationId);

    const newGuest = new GuestDetails({
      registrationId,
      registrationType: "guest",
      name,
      email,
      mobile,
      state,
      city,
      schoolName,
      isOtherSchool,
      studentClass,
      schoolIdCard,
      aadharCard,
      members: [
        {
          name,
          email,
          mobile,
          whatsapp: mobile,
          state,
          city,
          schoolName,
          isOtherSchool,
          studentClass,
          schoolIdCard,
          aadharCard,
          address: `${city}, ${state}`,
          checkedIn: false,
        },
      ],
      totalMembers: 1,
      totalAmount: 0,
      totalAfterDiscount: 0,
      appliedCoupon: "",
      discountPercentage: 0,
      utrNumber: `STUDENT_PASS_${registrationId.slice(0, 8).toUpperCase()}`,
      qrCode: qrCodeURL,
      paymentStatus: "pending",
      qrSent: false,
    });

    await newGuest.save();

    // EMAIL CONFIG
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // EMAIL TO USER
    try {
      await transporter.sendMail({
        from: `"Aaghaz 2K26" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Aaghaz 2K26 Registration Received - Pending Verification",
        html: `
<div style="background:#f3f4f6;padding:40px 10px;font-family:Arial,Helvetica,sans-serif">

<table align="center" width="600" cellpadding="0" cellspacing="0"
style="background:white;border-radius:10px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.08)">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);color:white;padding:30px;text-align:center">

<h1 style="margin:0;font-size:28px">Aaghaz 2K26</h1>
<p style="margin:6px 0 0 0;font-size:14px">Geeta University</p>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:30px;color:#374151">

<h2 style="margin-top:0">Registration Received 🎉</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>
Your registration request for <strong>Aaghaz 2K26</strong> has been successfully received.
</p>

<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;margin:20px 0;border-radius:4px;color:#92400e;font-size:14px">
  <strong>⏳ Verification in Progress:</strong> Our admin team is reviewing your uploaded School ID card and Aadhar card. Once approved, your official <strong>QR Entry Pass</strong> will be sent to your email.
</div>

<!-- REGISTRATION BOX -->
<table width="100%" style="margin-top:20px;background:#f9fafb;border-radius:8px;padding:20px">

<tr>
<td style="padding:8px 0"><strong>Registration ID</strong></td>
<td>${registrationId}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>Student Name</strong></td>
<td>${name}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>School Name</strong></td>
<td>${schoolName}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>State & City</strong></td>
<td>${city}, ${state}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>Class</strong></td>
<td>${studentClass}</td>
</tr>

</table>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<!-- EVENT DETAILS -->
<h3>Event Details</h3>

<table width="100%" style="font-size:14px">

<tr>
<td style="padding:6px 0"><strong>Event</strong></td>
<td>Aaghaz 2K26</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Date</strong></td>
<td>2–3 October 2026</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Venue</strong></td>
<td>Geeta University</td>
</tr>

</table>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<!-- IMPORTANT NOTES -->
<h3>Important Notes</h3>

<ul style="line-height:1.6;font-size:14px;color:#4b5563">
<li>Your QR entry ticket will be emailed once our team verifies your IDs.</li>
<li>Please carry the original School ID card and Aadhar card on the event day.</li>
<li>The QR code will be scanned at the entry gate.</li>
<li>Entry passes are strictly personal and non-transferable.</li>
</ul>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<p style="margin-bottom:4px">If you have any questions, feel free to contact us.</p>
<p style="margin:4px 0;font-size:14px">📞 9211067540</p>
<p style="margin:4px 0;font-size:14px">📞 8168906211</p>

<p style="margin-top:25px">
Regards,<br>
<strong>Team DSW</strong><br>
Geeta University
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#111827;color:#9ca3af;text-align:center;padding:14px;font-size:12px">
© 2026 Geeta University — Aaghaz 2K26
</td>
</tr>

</table>

</div>
`,
      });
    } catch (mailErr) {
      console.error("Failed to send user acknowledgement email:", mailErr);
    }

    // EMAIL TO ADMIN
    if (process.env.ADMIN_EMAIL) {
      try {
        await transporter.sendMail({
          from: `"Aaghaz 2K26" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New Student Pass Awaiting Approval - ${name}`,
          html: `
            <h3>New Student Registration Pending Verification</h3>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>School Name:</strong> ${schoolName} ${isOtherSchool ? "(Custom Entry)" : ""}</p>
            <p><strong>Class:</strong> ${studentClass}</p>
            <p><strong>School ID & Aadhar:</strong> Uploaded and ready for review in Admin Dashboard.</p>
          `,
        });
      } catch (adminMailErr) {
        console.error("Failed to send admin notification email:", adminMailErr);
      }
    }

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Student registered successfully. Pending verification.",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register student.",
      },
      { status: 500 }
    );
  }
}