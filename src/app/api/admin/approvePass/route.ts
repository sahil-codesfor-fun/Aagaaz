import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { registrationId, action, reason } = await req.json();

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "Registration ID is required." },
        { status: 400 }
      );
    }

    const guest = await GuestDetails.findOne({ registrationId });

    if (!guest) {
      return NextResponse.json(
        { success: false, message: "Registration not found." },
        { status: 404 }
      );
    }
    const primary = guest.members?.[0] || guest;
    const recipientEmail = guest.email || primary.email;
    const studentName = guest.name || primary.name;
    if (action === "approve") {
      // Ensure QR Code exists
      let qrCodeURL = guest.qrCode;
      if (!qrCodeURL) {
        qrCodeURL = await QRCode.toDataURL(
          `${process.env.NEXTAUTH_URL || "https://aagaaz-gu.vercel.app"}/checkin?regId=${registrationId}`
        );
        guest.qrCode = qrCodeURL;
      }
      guest.paymentStatus = "verified";
      // Configure Email transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Convert Base64 QR code to Buffer
      const base64Data = qrCodeURL.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(base64Data, "base64");

      // Send the approved pass email with QR Code
      await transporter.sendMail({
        from: `"Aagaaz 2K26" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: "Your Aagaaz 2K26 Check-in QR Code (Approved)",
        html: `
<div style="background:#0f172a;padding:30px 10px;font-family:Arial,Helvetica,sans-serif">

<table align="center" width="600" cellpadding="0" cellspacing="0" 
style="background:#111827;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.4)">

<!-- Gradient Header -->
<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:30px;text-align:center;color:white">

<h1 style="margin:0;font-size:28px;letter-spacing:1px">
Aagaaz 2K26
</h1>

<p style="margin:6px 0 0 0;font-size:14px">
Geeta University
</p>

</td>
</tr>

<!-- Ticket Card -->
<tr>
<td style="padding:30px;color:#e5e7eb">

<h2 style="margin-top:0;color:white">🎉 Pass Approved & Confirmed!</h2>

<p>Hello <strong>${studentName}</strong>,</p>

<p>Your entry pass for <strong>Aagaaz 2K26</strong> has been successfully verified and approved by our team.</p>

<!-- Ticket Box -->
<table width="100%" style="margin:25px 0;background:#1f2937;border-radius:10px;padding:20px">

<tr>

<td>

<p style="margin:0;font-size:12px;color:#9ca3af">Registration ID</p>
<h2 style="margin:6px 0;color:white">${registrationId}</h2>

<p style="margin:0;font-size:12px;color:#9ca3af">School</p>
<p style="margin:4px 0;font-size:15px;color:#f3f4f6"><b>${guest.schoolName || primary.schoolName}</b></p>

<p style="margin:0;font-size:12px;color:#9ca3af">Members</p>
<p style="margin:4px 0;font-size:15px;color:#f3f4f6">${guest.totalMembers || 1} Guest</p>

</td>

<td align="right">

<img src="cid:qrcode" width="180" height="180" 
style="border-radius:6px;border:4px solid #111827"/>

</td>

</tr>

</table>

<p style="font-size:14px;color:#9ca3af">
Please present this QR code at the entry gate during the event.
</p>

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Event Details -->

<h3 style="margin:0;color:white">Event Details</h3>

<table width="100%" style="margin-top:10px;font-size:14px;color:#d1d5db">

<tr>
<td style="padding:6px 0"><strong>Event</strong></td>
<td>Aagaaz 2K26</td>
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

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Rules -->

<h3 style="color:white;margin-bottom:10px">Rules & Guidelines</h3>

<ul style="font-size:14px;color:#9ca3af;line-height:1.6;padding-left:18px">

<li>This QR code is strictly personal and confidential.</li>

<li>Do not share this QR code with anyone.</li>

<li>This ticket is valid only for <strong>${guest.totalMembers || 1}</strong> member.</li>

<li>Carry your original School ID Card & Government-issued Photo ID / Aadhar Card.</li>

<li>Entry may be denied if QR code is misused.</li>

</ul>

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Support -->

<h3 style="color:white;margin-bottom:8px">Need Help?</h3>

<p style="margin:4px 0;font-size:14px;color:#9ca3af">📞 9211067540</p>
<p style="margin:4px 0;font-size:14px;color:#9ca3af">📞 8168906211</p>

<div style="margin-top:20px">

<a href="${process.env.NEXTAUTH_URL || 'https://aagaaz-gu.vercel.app'}" 
style="display:inline-block;background:#2563eb;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px">
Visit Event Website
</a>

</div>

<p style="margin-top:25px">
Regards,<br>
<strong>Team DSW</strong><br>
Geeta University
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#1f2937;color:#9ca3af;text-align:center;padding:16px;font-size:12px">

© 2026 Geeta University | Aagaaz 2K26

</td>
</tr>

</table>

</div>
`,
        attachments: [
          {
            filename: "ticket-qr.png",
            content: qrBuffer,
            cid: "qrcode",
          },
        ],
      });

      guest.qrSent = true;
      await guest.save();

      return NextResponse.json({
        success: true,
        message: `Pass approved and QR Code dispatched to ${recipientEmail}`,
      });
    } else if (action === "reject") {
      guest.paymentStatus = "failed";
      guest.rejectionReason = reason || "Documents could not be verified";
      await guest.save();

      // Optionally send rejection email
      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Aagaaz 2K26" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          subject: "Aagaaz 2K26 Registration Status Update",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Registration Update for Aagaaz 2K26</h2>
              <p>Hello <strong>${studentName}</strong>,</p>
              <p>We regret to inform you that your entry pass request (ID: <strong>${registrationId}</strong>) could not be approved.</p>
              <p><strong>Reason:</strong> ${reason || "Uploaded ID proofs were unclear or incomplete."}</p>
              <p>If you believe this was an error, please submit a new registration with valid documents or contact the event desk.</p>
              <br>
              <p>Regards,<br>Team DSW<br>Geeta University</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send rejection email:", err);
      }

      return NextResponse.json({
        success: true,
        message: "Registration marked as rejected.",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in approvePass API:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
