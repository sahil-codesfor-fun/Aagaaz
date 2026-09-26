"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, CheckCircle2, QrCode, RefreshCw, ShieldCheck, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Member = {
  name: string;
  checkedIn: boolean;
};

export default function GateScannerPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [registrationId, setRegistrationId] = useState("");
  const [scanLock, setScanLock] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [checkingIdx, setCheckingIdx] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          () => {}
        );
      } catch (err) {
        console.error("Camera scanner init failed:", err);
      }
    };

    if (document.getElementById("reader")) {
      start();
    }

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanLock) return;
    setScanLock(true);

    try {
      let regId = "";
      try {
        const url = new URL(decodedText);
        regId = url.searchParams.get("regId") || "";
      } catch {
        // In case QR contains plain regId string
        regId = decodedText;
      }

      if (!regId) {
        setScanLock(false);
        return;
      }

      navigator.vibrate?.(200);

      // pause camera
      scannerRef.current?.pause();

      const res = await fetch(`/api/verifyRegisteration?regId=${encodeURIComponent(regId)}`);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Invalid or Unverified Ticket QR");
        resetScanner();
        return;
      }

      setRegistrationId(data.registrationId);
      setMembers(data.members || []);
      setScanning(false);
      toast.success("Pass verified! Select members to check in.");
    } catch {
      toast.error("Invalid QR ticket format");
      resetScanner();
    }
  };

  const resetScanner = () => {
    setMembers([]);
    setRegistrationId("");
    setScanning(true);
    setScanLock(false);
    scannerRef.current?.resume();
  };

  const handleCheckIn = async (index: number) => {
    setCheckingIdx(index);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regId: registrationId,
          memberIndex: index
        })
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Check-in failed");
        return;
      }

      toast.success("Guest successfully checked in");

      const updated = [...members];
      updated[index].checkedIn = true;
      setMembers(updated);

      const allChecked = updated.every(m => m.checkedIn);
      if (allChecked) {
        toast.success("All members in this pass have been checked in!");
      }
    } catch {
      toast.error("Check-in request failed");
    } finally {
      setCheckingIdx(null);
    }
  };

  const checkedInCount = members.filter(m => m.checkedIn).length;

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20 px-6 flex flex-col items-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-mono text-neutral-600 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Turnstile QR Entry Terminal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Gate Entry Scanner
          </h1>
          <p className="text-xs text-neutral-500">
            Scan attendee QR tickets to verify payment and process gate check-in.
          </p>
        </div>

        {/* Camera Scanner Viewport */}
        <div className={`p-6 rounded-2xl bg-white border border-neutral-200 shadow-md ${scanning ? "" : "hidden"}`}>
          <div className="overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800">
            <div id="reader" className="w-full min-h-[300px]" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500 font-mono">
              Align attendee QR code inside the camera box
            </p>
          </div>
        </div>

        {/* Verified Attendee Result Card */}
        {!scanning && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-lg space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">Verified Registration</span>
                <h2 className="text-lg font-bold font-mono text-neutral-900">{registrationId}</h2>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                Active Pass
              </span>
            </div>

            {/* Counter Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-center font-mono text-xs">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Total</div>
                <div className="font-bold text-neutral-900">{members.length}</div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 uppercase">Checked In</div>
                <div className="font-bold text-emerald-600">{checkedInCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-amber-600 uppercase">Remaining</div>
                <div className="font-bold text-amber-600">{members.length - checkedInCount}</div>
              </div>
            </div>

            {/* Member List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {members.map((member, index) => (
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
                      {member.checkedIn ? "Checked In at gate" : "Pending Check-In"}
                    </div>
                  </div>

                  {!member.checkedIn && (
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(index)}
                      disabled={checkingIdx === index}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-7 px-3"
                    >
                      {checkingIdx === index ? "Checking..." : "Check In"}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={resetScanner}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs py-2.5 rounded-lg shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Scan Next Attendee QR
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}