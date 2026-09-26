"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Copy, Check, QrCode, ArrowLeft, ShieldCheck, Loader2, Info } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [qrCode, setQrCode] = useState("");
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const UPI_ID = "geetauniversity.62417837@hdfcbank";
  const PAYEE_NAME = "Freshers 2K26";

  useEffect(() => {
    const data = sessionStorage.getItem("registrationData");

    if (!data) {
      router.push("/register/guest");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setMembers(parsed.members || []);
      setCoupon(parsed.coupon || "");
      setDiscountPercentage(parsed.discountPercentage || 0);
    } catch {
      router.push("/register/guest");
    }
  }, [router]);

  const totalMembers = members.length;
  const baseAmount = totalMembers * 1000;
  const discount = (baseAmount * discountPercentage) / 100;
  const finalAmount = baseAmount - discount;

  useEffect(() => {
    const generateQR = async () => {
      // If amount > 0, generate exact amount UPI link. If amount === 0, generate general link
      const upiLink =
        finalAmount > 0
          ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${finalAmount}&cu=INR`
          : `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;

      try {
        const qr = await QRCode.toDataURL(upiLink, { width: 300, margin: 2 });
        setQrCode(qr);
      } catch (err) {
        console.error("QR Generation error", err);
      }
    };

    generateQR();
  }, [finalAmount]);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const submitRegistration = async () => {
    const effectiveUtr = finalAmount === 0 
      ? (utr.trim() || `COUPON_${coupon.toUpperCase() || "100OFF"}`)
      : utr.trim();

    if (finalAmount > 0 && !effectiveUtr) {
      toast.error("Please enter the 12-digit UPI / Bank Transaction UTR Number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members,
          coupon,
          discountPercentage,
          totalMembers,
          totalAmount: finalAmount,
          utrNumber: effectiveUtr,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Registration submitted successfully");
      sessionStorage.removeItem("registrationData");
      router.push(`/register/success?registrationId=${result.registrationId}`);
    } catch (err: any) {
      toast.error(err.message || "Registration submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-10 sm:pt-14 pb-12 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-6 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => router.push("/register/guest")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Modify Registrant Details
        </button>

        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-lg space-y-6">
          
          {/* Invoice Header */}
          <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
                Payment Step 02/02
              </span>
              <h1 className="text-xl font-bold text-neutral-900">
                {finalAmount === 0 ? "Complimentary Pass Confirmation" : "UPI Payment & UTR Verification"}
              </h1>
            </div>
            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-md ${
              finalAmount === 0 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-neutral-100 text-neutral-900"
            }`}>
              {finalAmount === 0 ? "FREE (100% OFF)" : `₹${finalAmount}`}
            </span>
          </div>

          {/* Breakdown summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Total Attendees:</span>
              <span className="font-semibold text-neutral-900">{totalMembers} Guests</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Standard Base Rate:</span>
              <span>₹1,000 × {totalMembers}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Applied ({discountPercentage}% off):</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900 text-sm">
              <span>Total Payable Amount:</span>
              <span className={finalAmount === 0 ? "text-emerald-600" : ""}>
                {finalAmount === 0 ? "₹0 (Complimentary)" : `₹${finalAmount}`}
              </span>
            </div>
          </div>

          {/* 100% Discount Banner OR QR Code Container */}
          {finalAmount === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-900 text-sm">
                100% Promo Code Applied ({coupon || "FREE PASS"})
              </h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                Your entry pass is 100% complimentary. No UPI payment is required. Click the button below to confirm your registration.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-neutral-50/70 border border-neutral-200 text-center space-y-3">
              <span className="text-xs font-mono uppercase text-neutral-500">
                Scan with any UPI App (GPay, PhonePe, Paytm)
              </span>

              {qrCode ? (
                <div className="p-2 bg-white rounded-lg border border-neutral-200 shadow-xs">
                  <img
                    src={qrCode}
                    alt="UPI Payment QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-neutral-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-neutral-400">
                  Generating QR...
                </div>
              )}

              {/* UPI ID copy button */}
              <div className="flex items-center gap-2 pt-1">
                <span className="font-mono text-xs text-neutral-700 bg-white px-2.5 py-1 rounded border border-neutral-200">
                  {UPI_ID}
                </span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white text-xs transition"
                  title="Copy UPI ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* UTR Input Form (Only required if finalAmount > 0) */}
          {finalAmount > 0 && (
            <div className="space-y-2">
              <Label htmlFor="utr" className="text-xs font-semibold text-neutral-800">
                Transaction UTR / Reference ID *
              </Label>
              <Input
                id="utr"
                placeholder="e.g. 412345678901 (12 digits)"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="text-xs font-mono uppercase tracking-wider focus-visible:ring-neutral-900"
                required
              />
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                After paying ₹{finalAmount}, enter the 12-digit UTR number from your UPI payment receipt.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 space-y-3">
            <Button
              type="button"
              onClick={submitRegistration}
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 rounded-lg text-xs font-medium shadow-sm transition active:scale-98"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Submitting Registration...
                </span>
              ) : (
                <span>
                  {finalAmount === 0 ? "Claim Complimentary Entry Pass →" : "Confirm & Submit Registration"}
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified by Geeta University Administration.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}