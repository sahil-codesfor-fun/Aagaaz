# Implementation Plan: Student Entry Pass Registration & Confirmation Email Updates

## 1. Overview
This implementation plan outlines the exact changes required to convert the current paid/coupon-based guest registration flow into a **free, direct Student Entry Pass Registration flow**, align form fields according to specifications, remove all payment and referral sections, and update the confirmation email templates based on `1 & 2 Changes.png`, `3 Changes.png`, `Platform Changes.png`, and `Registration Successful - Email Updated Content.docx`.

---

## 2. Source Requirements & Assets Cross-Reference

| Source Asset | Key Requirement / Visual Indication |
| :--- | :--- |
| **`Platform Changes.png`** | • Replace form fields with: **Full Name**, **Email Address**, **Mobile Number**, **School Name**, **Class** (dropdown: 11th, 12th), **City**.<br>• **Remove Optional Referral Information** entirely.<br>• **Remove Promo Code & ₹1,000 Payment / Order Summary** section on the right side. |
| **`1 & 2 Changes.png`** | • In email: Change *"Our team will now verify your **payment** details."* ➔ *"Our team will now verify your **details**."*<br>• In email details table: Replace **Total Amount (₹1000)** row with **Student Name** (`<Name>`), and remove **Payment Status** row. |
| **`3 Changes.png`** | • In email Important Notes: Change *"Your QR entry ticket will be emailed after **payment verification**."* ➔ *"Your QR entry ticket will be emailed after **verification**."*<br>• Change *"Please carry a valid government-issued photo ID."* ➔ *"Please carry a valid government-issued photo ID **& School ID Card**."* |
| **`Registration Successful - Email Updated Content.docx`** | • Full canonical template reference for the confirmation email sent to students upon registration. |

---

## 3. Detailed Step-by-Step Implementation

### Step 1: Database Model Update
**File**: `src/models/Guest.ts`
- **Fields to Update / Add**:
  - `name`: String (Required)
  - `email`: String (Required, validated email format)
  - `mobile`: String (Required)
  - `schoolName`: String (Required)
  - `studentClass`: String (Enum: `["11th", "12th"]`, Required)
  - `city`: String (Required)
- **Fields to Deprecate / Adjust**:
  - Remove `referredBy` and `referenceContact` from subdocuments.
  - Set `totalAmount` default to `0`, `paymentStatus` default to `"verified"` or `"pending"`, and `totalMembers` default to `1`.
  - Make `utrNumber` optional / defaulted so that students do not need to provide a transaction reference.

---

### Step 2: Registration UI & Flow Overhaul
**File**: `src/app/register/guest/page.tsx`
- **Form Fields to Implement**:
  1. **Full Name** (`name`): Text input with user icon and required validation.
  2. **Email Address** (`email`): Email input with mail icon and format validation.
  3. **Mobile Number** (`mobile`): 10-digit phone input with phone icon.
  4. **School Name** (`schoolName`): Text input with school/building icon.
  5. **Class** (`studentClass`): Clean dropdown select with options: **11th** and **12th**.
  6. **City** (`city`): Text input with location pin icon.
- **Components to Remove**:
  - ❌ Remove `Optional Referral Information` (Referred By & Referrer Contact Number).
  - ❌ Remove `Apply Promo Code` input and validate coupon API call.
  - ❌ Remove `Passes (X × ₹1,000)`, discount lines, and `Final Payable ₹1000` order breakdown.
  - ❌ Remove `Add Another Companion Guest (+₹1,000)` button.
  - ❌ Remove multi-step checkout progress header (Step 1 -> Step 2 UTR Payment -> Step 3).
- **Redesigned Right Column**:
  - Retain and enhance the **Digital VIP Pass Preview Card** which updates in real-time with:
    - Student Name (or default placeholder)
    - School Name & Class
    - City
    - Live QR preview icon & Aagaz 2K26 branding.
- **Direct Submission Action**:
  - Direct CTA button: **"Register for Entry Pass"** / **"Claim Entry Pass"**.
  - On click, validate all 6 fields, submit directly via `POST /api/guest`, show a loading indicator, and upon success immediately redirect to `/register/success?registrationId={id}`.

---

### Step 3: Registration API & Confirmation Email Update
**File**: `src/app/api/guest/route.ts`
- **Payload Handling**:
  - Accept `{ name, email, mobile, schoolName, studentClass, city }`.
  - Validate required fields and email regex.
  - Save entry to MongoDB.
  - Generate check-in QR code URL for turnstile scanning.
- **User Confirmation Email Template (`transporter.sendMail`)**:
  - **Greeting**: `Hello <strong>${name}</strong>,`
  - **Subtext**:
    > Your registration for **Aagaz 2K26** has been successfully received.
    >
    > Our team will now verify your details. Once the details are verified, your **QR entry pass** will be sent to your email.
  - **Registration Details Table**:
    ```html
    <table width="100%" style="margin-top:25px;background:#f9fafb;border-radius:8px;padding:20px">
      <tr>
        <td style="padding:8px 0"><strong>Registration ID</strong></td>
        <td>${registrationId}</td>
      </tr>
      <tr>
        <td style="padding:8px 0"><strong>Total Members</strong></td>
        <td>1</td>
      </tr>
      <tr>
        <td style="padding:8px 0"><strong>Student Name</strong></td>
        <td>${name}</td>
      </tr>
    </table>
    ```
    *(Total Amount and Payment Status rows are removed)*
  - **Event Details Table**:
    - Event: Aagaz 2K26
    - Date: 2–3 October 2026
    - Venue: Geeta University
  - **Important Notes Section**:
    - <li>Your QR entry ticket will be emailed after verification.</li>
    - <li>Please carry a valid government-issued photo ID & School ID Card.</li>
    - <li>The QR code will be scanned at the entry gate.</li>
    - <li>Entry passes are non-transferable.</li>
  - **Support & Sign-off**:
    - Phone numbers: 9211067540 / 8168906211
    - Regards: Team DSW, Geeta University
- **Admin Notification Email**:
  - Update email sent to `ADMIN_EMAIL` to show student registration details: Name, Email, Mobile, School, Class, City, Registration ID.

---

### Step 4: Success Screen & Admin Dashboard Alignment
- **Success Page (`src/app/register/success/page.tsx`)**:
  - Update the "What Happens Next" text from *"Our accounts team will verify your submitted payment UTR"* to *"Our team will verify your details."*
- **Admin Dashboard (`src/app/admin/dashboard/page.tsx`) & API (`src/app/api/admin/registerations/route.ts`)**:
  - Update the table columns and CSV export to display: `Registration ID`, `Student Name`, `Email`, `Mobile`, `School Name`, `Class`, `City`, `Status`, `QR Sent`, `Date`.
  - Update dialog preview to display all student registration fields.

---

## 4. Testing & Validation Checklist

- [ ] **Form Validation**: Test empty fields, invalid email format, invalid phone number, and ensure class selection (11th/12th) is required.
- [ ] **Direct Submission**: Test that clicking "Register for Entry Pass" submits directly to `/api/guest` without requiring payment or redirecting to `/register/payment`.
- [ ] **Email Dispatch Verification**:
  - Verify "payment details" is replaced with "details".
  - Verify "Total Amount" is replaced with "Student Name".
  - Verify "Payment Status" is completely removed.
  - Verify Important Notes contains "after verification" and "& School ID Card".
- [ ] **Admin Table & CSV Export**: Check that admin dashboard displays student details (School, Class, City) and CSV download contains these columns.
