"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Ticket, QrCode, ShieldCheck, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Loading from "@/components/layout/Loading";
import Link from "next/link";

type Member = {
  name: string;
  email: string;
  whatsapp?: string;
  checkedIn: boolean;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  registrationId?: string;
  totalMembers?: number;
  checkedIn?: number;
  remaining?: number;
  members?: Member[];
};

const CheckInContent = () => {
  const searchParams = useSearchParams();
  const regId = searchParams.get("regId");

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<number | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!regId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetch(`/api/verifyRegisteration?regId=${encodeURIComponent(regId)}`);
        const result = await res.json();
        setData(result);
      } catch {
        toast.error("Error verifying registration ticket");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [regId]);

  const handleCheckIn = async (memberIndex: number) => {
    if (!regId) return;

    setChecking(memberIndex);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          regId,
          memberIndex
        })
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Check-in failed");
        return;
      }

      toast.success("Guest check-in recorded successfully");

      // Update UI locally
      setData(prev => {
        if (!prev || !prev.members) return prev;

        const updatedMembers = [...prev.members];
        updatedMembers[memberIndex].checkedIn = true;

        const checked = updatedMembers.filter(m => m.checkedIn).length;

        return {
          ...prev,
          members: updatedMembers,
          checkedIn: checked,
          remaining: updatedMembers.length - checked
        };
      });
    } catch {
      toast.error("Check-in request failed");
    } finally {
      setChecking(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-mono text-neutral-600 mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Turnstile Pass Verification</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Event Pass Check-In
          </h1>
          <p className="text-xs text-neutral-500">
            Verify verified attendee registrations for Freshers 2K26 Star Night.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xl space-y-6">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-500">
              Verifying pass registration...
            </div>
          ) : !regId ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-neutral-500">
                No Registration ID provided in URL parameters. Please scan a valid attendee QR code.
              </p>
              <Button asChild size="sm" className="bg-neutral-900 text-white text-xs">
                <Link href="/gate-scanner">Open Gate Scanner</Link>
              </Button>
            </div>
          ) : !data?.success ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-600 font-medium">
                {data?.message || "Invalid or Unverified Entry Ticket"}
              </p>
              <Button asChild variant="outline" size="sm" className="text-xs border-neutral-200">
                <Link href="/gate-scanner">Scan Another Pass</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Card Title */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Pass Registration</span>
                  <div className="text-lg font-bold font-mono text-neutral-900">{data.registrationId}</div>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                  Verified Ticket
                </span>
              </div>

              {/* Counts */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-center font-mono text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Total</div>
                  <div className="font-bold text-neutral-900">{data.totalMembers}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-600 uppercase">Checked In</div>
                  <div className="font-bold text-emerald-600">{data.checkedIn}</div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-600 uppercase">Remaining</div>
                  <div className="font-bold text-amber-600">{data.remaining}</div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {data.members?.map((member, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs transition ${
                      member.checkedIn
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                        : "bg-white border-neutral-200 text-neutral-900"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold flex items-center gap-1.5">
                        {member.checkedIn && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        <span>{member.name}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {member.checkedIn ? "Checked In at gate" : "Awaiting Gate Entry"}
                      </div>
                    </div>

                    {!member.checkedIn && (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(index)}
                        disabled={checking === index}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-7 px-3"
                      >
                        {checking === index ? "Checking..." : "Check In"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button asChild variant="outline" className="w-full text-xs border-neutral-200">
                  <Link href="/gate-scanner">
                    <QrCode className="w-3.5 h-3.5 mr-1.5" /> Return to Camera Scanner
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const CheckInPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CheckInContent />
    </Suspense>
  );
};

export default CheckInPage;