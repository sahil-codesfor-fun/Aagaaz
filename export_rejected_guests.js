const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const MONGODB_URI = "mongodb+srv://sahil_geeta:leosahil2906@trial.yzbs7qm.mongodb.net/test?retryWrites=true&w=majority";

function saveBase64Image(dataStr, outputDir, prefix, regId) {
  if (!dataStr || typeof dataStr !== 'string' || dataStr.trim() === '') {
    return { status: "Not Provided", filePath: "" };
  }

  // If it's a regular URL
  if (dataStr.startsWith('http://') || dataStr.startsWith('https://')) {
    return { status: "Online URL", filePath: dataStr };
  }

  // Match base64 data URI
  const match = dataStr.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (match) {
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1].replace('+xml', '');
    const base64Data = match[2];
    const safeRegId = regId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeRegId}_${prefix}.${ext}`;
    const filePath = path.join(outputDir, fileName);

    try {
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      const sizeKB = (Buffer.from(base64Data, 'base64').length / 1024).toFixed(1);
      return { 
        status: `Saved (${sizeKB} KB)`, 
        filePath: `rejected_guest_documents/${fileName}` 
      };
    } catch (e) {
      return { status: "Base64 (Save Error)", filePath: "" };
    }
  }

  return { status: "Uploaded (Custom Format)", filePath: "" };
}

async function exportRejectedGuests() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('guestDetails');

  console.log("Querying rejected guests...");
  const rejectedGuests = await collection.find({
    $or: [
      { paymentStatus: "failed" },
      { rejectionReason: { $exists: true, $nin: ["", null] } }
    ]
  }).sort({ createdAt: -1 }).toArray();

  console.log(`Found ${rejectedGuests.length} rejected guest records.`);

  // Create documents folder
  const docsDir = path.join(__dirname, "rejected_guest_documents");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const formattedData = rejectedGuests.map((g, index) => {
    const primary = (g.members && g.members.length > 0) ? g.members[0] : {};

    const regId = g.registrationId || `guest_${index + 1}`;
    const name = g.name || primary.name || "";
    const email = g.email || primary.email || "";
    const mobile = g.mobile || primary.mobile || "";
    const whatsapp = primary.whatsapp || "";
    const schoolName = g.schoolName || primary.schoolName || "";
    const isOtherSchool = (g.isOtherSchool !== undefined ? g.isOtherSchool : primary.isOtherSchool) ? "Yes" : "No";
    const studentClass = g.studentClass || primary.studentClass || "";
    const state = g.state || primary.state || "";
    const city = g.city || primary.city || "";
    const address = primary.address || "";

    const schoolIdRaw = g.schoolIdCard || primary.schoolIdCard || "";
    const aadharRaw = g.aadharCard || primary.aadharCard || "";

    const schoolIdInfo = saveBase64Image(schoolIdRaw, docsDir, "school_id", regId);
    const aadharInfo = saveBase64Image(aadharRaw, docsDir, "aadhar", regId);

    const createdAt = g.createdAt ? new Date(g.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "";
    const updatedAt = g.updatedAt ? new Date(g.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "";

    return {
      "S.No.": index + 1,
      "Registration ID": regId,
      "Name": name,
      "Email": email,
      "Mobile Number": mobile,
      "WhatsApp Number": whatsapp,
      "School / College Name": schoolName,
      "Is Other School": isOtherSchool,
      "Class / Year": studentClass,
      "State": state,
      "City": city,
      "Address": address,
      "Status": g.paymentStatus || "failed",
      "Rejection Reason": g.rejectionReason || "Documents could not be verified",
      "Total Amount (₹)": g.totalAmount !== undefined ? g.totalAmount : 0,
      "Discount (%)": g.discountPercentage !== undefined ? g.discountPercentage : 0,
      "Amount Paid (₹)": g.totalAfterDiscount !== undefined ? g.totalAfterDiscount : 0,
      "Applied Coupon": g.appliedCoupon || "",
      "UTR / Transaction ID": g.utrNumber || "",
      "School ID Status": schoolIdInfo.status,
      "School ID File Path": schoolIdInfo.filePath,
      "Aadhar Card Status": aadharInfo.status,
      "Aadhar Card File Path": aadharInfo.filePath,
      "QR Dispatched": g.qrSent ? "Yes" : "No",
      "Registration Date (IST)": createdAt,
      "Rejection Date (IST)": updatedAt,
      "MongoDB ID": g._id ? g._id.toString() : ""
    };
  });

  // Create Excel Workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths
  const colWidths = [
    { wch: 6 },  // S.No.
    { wch: 38 }, // Registration ID
    { wch: 24 }, // Name
    { wch: 32 }, // Email
    { wch: 16 }, // Mobile
    { wch: 16 }, // WhatsApp
    { wch: 30 }, // School
    { wch: 15 }, // Is Other School
    { wch: 14 }, // Class
    { wch: 16 }, // State
    { wch: 16 }, // City
    { wch: 25 }, // Address
    { wch: 12 }, // Status
    { wch: 35 }, // Rejection Reason
    { wch: 16 }, // Total Amount
    { wch: 14 }, // Discount
    { wch: 16 }, // Amount Paid
    { wch: 16 }, // Applied Coupon
    { wch: 28 }, // UTR
    { wch: 20 }, // School ID Status
    { wch: 45 }, // School ID File Path
    { wch: 20 }, // Aadhar Status
    { wch: 45 }, // Aadhar File Path
    { wch: 14 }, // QR Dispatched
    { wch: 24 }, // Registration Date
    { wch: 24 }, // Rejection Date
    { wch: 26 }, // MongoDB ID
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Rejected Guests");

  const outputFilePath = path.join(__dirname, "rejected_guests.xlsx");
  XLSX.writeFile(wb, outputFilePath);
  console.log(`✅ Excel file successfully created at: ${outputFilePath}`);

  // Clean up scratch files
  const scratchFiles = ['scratch_inspect.js', 'scratch_inspect_guests.js', 'scratch_inspect_keys.js', 'scratch_inspect_cards.js'];
  for (const sf of scratchFiles) {
    const fullPath = path.join(__dirname, sf);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  process.exit(0);
}

exportRejectedGuests().catch(err => {
  console.error("Export failed:", err);
  process.exit(1);
});
