'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, X, RefreshCw, LogOut, Search, Clock, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import Loading from "@/components/layout/Loading";
import AccessDenied from "@/components/layout/AccessDenied";

interface Member {
  name: string;
  email: string;
  whatsapp?: string;
}

interface Registration {
  registrationId: string;
  members: Member[];
  totalMembers: number;
  paymentStatus: string;
  utrNumber: string;
  totalAmount: number;
  discountPercentage: number;
  appliedCoupon: string;
  createdAt?: string;
}

export default function AccountsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalVerified: 0,
    totalPending: 0,
    totalFailed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user?.role === "accountant" || session?.user?.role === "admin")) {
      fetchData();
    }
  }, [status, session]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || (session.user.role !== "accountant" && session.user.role !== "admin")) {
    return <AccessDenied />;
  }

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/registerations");
      const data = await res.json();

      if (Array.isArray(data)) {
        const sortedData = [...data].sort((a: Registration, b: Registration) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setRegistrations(sortedData);

        const totalRegistrations = data.length;
        const totalVerified = data.filter((r: Registration) => r.paymentStatus === "verified").length;
        const totalPending = data.filter((r: Registration) => r.paymentStatus === "pending").length;
        const totalFailed = data.filter((r: Registration) => r.paymentStatus === "failed").length;
        const totalRevenue = data
          .filter((r: Registration) => r.paymentStatus === "verified")
          .reduce((acc: number, r: Registration) => acc + (r.totalAmount || 0), 0);

        setStats({
          totalRegistrations,
          totalVerified,
          totalPending,
          totalFailed,
          totalRevenue,
        });
      }
    } catch {
      toast.error("Failed to fetch registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (registrationId: string, status: "verified" | "failed") => {
    setLoadingStatus(prev => ({ ...prev, [registrationId]: true }));

    try {
      const res = await fetch("/api/confirmPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ registrationId, status })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(`Payment status marked as ${status.toUpperCase()}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status");
    } finally {
      setLoadingStatus(prev => ({ ...prev, [registrationId]: false }));
    }
  };

  const formatAppliedDateTime = (dateStr?: string) => {
    if (!dateStr) return { date: "N/A", time: "" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: "N/A", time: "" };
      const date = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return { date, time };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const primary = r.members?.[0];
    const matchesSearch =
      r.registrationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (primary?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (primary?.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.utrNumber || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
              Finance & Ledger Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Accounts Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="text-xs border-neutral-200 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs border-rose-200 bg-rose-50/50 text-rose-600 hover:text-rose-700 hover:bg-rose-100 cursor-pointer font-medium"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-neutral-400">Total Requests</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.totalRegistrations}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-600">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600">{stats.totalPending}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-600">Verified</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalVerified}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-rose-600">Rejected</div>
            <div className="text-2xl font-bold text-rose-600">{stats.totalFailed}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
            <div className="text-[10px] font-mono uppercase text-neutral-500">Collected Revenue</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono">₹{stats.totalRevenue}</div>
          </div>
        </div>

        {/* Reconciliation Table */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              <Input
                placeholder="Filter by UTR, ID, name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs focus-visible:ring-neutral-900"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === "all" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === "pending" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Pending Review ({stats.totalPending})
              </button>
              <button
                onClick={() => setStatusFilter("verified")}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === "verified" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Verified
              </button>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-neutral-500 font-mono">
              Loading ledger records...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400">
              No matching records found.
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50/80 text-[11px] font-mono">
                  <TableRow>
                    <TableHead className="font-semibold text-neutral-700">Reg ID</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Primary Contact</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Applied Date & Time</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Guests</TableHead>
                    <TableHead className="font-semibold text-neutral-700">UTR / Reference</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Payable Amount</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Payment Status</TableHead>
                    <TableHead className="font-semibold text-neutral-700 text-right">Verification Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {filteredRegistrations.map((user) => {
                    const primary = user.members?.[0];
                    const isProcessing = loadingStatus[user.registrationId];
                    const applied = formatAppliedDateTime(user.createdAt);

                    return (
                      <TableRow key={user.registrationId} className="hover:bg-neutral-50/50">
                        <TableCell className="font-mono font-bold text-neutral-900">
                          {user.registrationId}
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900">{primary?.name || "N/A"}</div>
                          <div className="text-[11px] text-neutral-400">{primary?.email || "N/A"}</div>
                          <div className="text-[10px] text-neutral-400">{primary?.whatsapp || ""}</div>
                        </TableCell>

                        <TableCell>
                          <div className="font-semibold text-neutral-900 flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{applied.time || "—"}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {applied.date}
                          </div>
                        </TableCell>

                        <TableCell className="font-medium">
                          {user.totalMembers}
                        </TableCell>

                        <TableCell className="font-mono font-bold text-neutral-800 bg-neutral-50/80 px-2 py-1 rounded">
                          {user.utrNumber || "—"}
                        </TableCell>

                        <TableCell className="font-mono font-semibold">
                          ₹{user.totalAmount}
                          {user.discountPercentage > 0 && (
                            <span className="text-[10px] text-emerald-600 block">
                              ({user.discountPercentage}% off applied)
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {user.paymentStatus === "verified" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                          {user.paymentStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                          {user.paymentStatus === "failed" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.paymentStatus !== "verified" && (
                              <Button
                                size="sm"
                                onClick={() => updatePaymentStatus(user.registrationId, "verified")}
                                disabled={isProcessing}
                                className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                              >
                                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                                Approve
                              </Button>
                            )}

                            {user.paymentStatus !== "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePaymentStatus(user.registrationId, "failed")}
                                disabled={isProcessing}
                                className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
                              >
                                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3 mr-1" />}
                                Reject
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}