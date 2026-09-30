'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  LogOut,
  Menu,
  Send,
  Ticket,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  IdCard,
  CreditCard,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";
import AccessDenied from "@/components/layout/AccessDenied";

interface Member {
  name: string;
  email: string;
  whatsapp?: string;
  mobile?: string;
  state?: string;
  city?: string;
  schoolName?: string;
  isOtherSchool?: boolean;
  studentClass?: string;
  schoolIdCard?: string;
  aadharCard?: string;
  address?: string;
}

interface Registration {
  _id?: string;
  registrationId: string;
  name?: string;
  email?: string;
  mobile?: string;
  state?: string;
  city?: string;
  schoolName?: string;
  isOtherSchool?: boolean;
  studentClass?: string;
  schoolIdCard?: string;
  aadharCard?: string;
  rejectionReason?: string;
  members: Member[];
  totalMembers: number;
  paymentStatus: "pending" | "verified" | "failed" | string;
  qrCode?: string;
  qrSent?: boolean;
  totalAmount?: number;
  utrNumber?: string;
  appliedCoupon?: string;
  discountPercentage?: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  const [processingAction, setProcessingAction] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalVerified: 0,
    totalPending: 0,
    totalFailed: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchData();
    }
  }, [status, session]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.user.role !== "admin") {
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
        setStats({
          totalRegistrations: data.length,
          totalVerified: data.filter((r: Registration) => r.paymentStatus === "verified").length,
          totalPending: data.filter((r: Registration) => r.paymentStatus === "pending").length,
          totalFailed: data.filter((r: Registration) => r.paymentStatus === "failed").length,
        });
      }
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (user: Registration) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
    setShowRejectBox(false);

    // If proof images aren't loaded yet in memory, fetch the full single dossier
    if (!user.schoolIdCard && !user.aadharCard && (!user.members?.[0]?.schoolIdCard && !user.members?.[0]?.aadharCard)) {
      try {
        setIsLoadingDetail(true);
        const res = await fetch(`/api/admin/registerations?id=${encodeURIComponent(user.registrationId)}`);
        if (res.ok) {
          const fullData = await res.json();
          setSelectedUser(fullData);
          setRegistrations(prev =>
            prev.map(r => (r.registrationId === user.registrationId ? { ...r, ...fullData } : r))
          );
        }
      } catch (err) {
        console.error("Failed to load registration details:", err);
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  const exportUserDetailsToExcel = () => {
    const headers = [
      "Registration ID",
      "Student Name",
      "Email Address",
      "Mobile Number",
      "State",
      "City",
      "School Name",
      "Custom School Flag",
      "Class",
      "Pass Status",
      "QR Sent",
      "Created At"
    ];

    let csv = "\uFEFF" + headers.join(",") + "\n";

    registrations.forEach(reg => {
      const primary = reg.members?.[0];
      const name = reg.name || primary?.name || "";
      const email = reg.email || primary?.email || "";
      const phone = reg.mobile || primary?.mobile || primary?.whatsapp || "";
      const state = reg.state || primary?.state || "";
      const city = reg.city || primary?.city || primary?.address || "";
      const school = reg.schoolName || primary?.schoolName || "";
      const isOther = reg.isOtherSchool || primary?.isOtherSchool ? "Yes" : "No";
      const cls = reg.studentClass || primary?.studentClass || "12th";

      const row = [
        reg.registrationId,
        name,
        email,
        phone,
        state,
        city,
        school,
        isOther,
        cls,
        reg.paymentStatus,
        reg.qrSent ? "Yes" : "No",
        new Date(reg.createdAt).toLocaleString("en-IN")
      ].map(x => `"${x}"`).join(",");

      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_passes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleApprove = async (reg: Registration) => {
    setProcessingAction(prev => ({ ...prev, [reg.registrationId]: true }));

    try {
      const res = await fetch("/api/admin/approvePass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.registrationId,
          action: "approve",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to approve pass");

      toast.success(data.message || "Pass approved & QR dispatched via email!");

      // Update local state
      setRegistrations(prev =>
        prev.map(r =>
          r.registrationId === reg.registrationId
            ? { ...r, paymentStatus: "verified", qrSent: true }
            : r
        )
      );

      if (selectedUser?.registrationId === reg.registrationId) {
        setSelectedUser(prev => prev ? { ...prev, paymentStatus: "verified", qrSent: true } : null);
      }

      setStats(prev => ({
        ...prev,
        totalVerified: prev.totalVerified + (reg.paymentStatus !== "verified" ? 1 : 0),
        totalPending: Math.max(0, prev.totalPending - (reg.paymentStatus === "pending" ? 1 : 0)),
      }));

    } catch (err: any) {
      toast.error(err.message || "Approval failed");
    } finally {
      setProcessingAction(prev => ({ ...prev, [reg.registrationId]: false }));
    }
  };

  const handleReject = async (reg: Registration) => {
    setProcessingAction(prev => ({ ...prev, [reg.registrationId]: true }));

    try {
      const res = await fetch("/api/admin/approvePass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.registrationId,
          action: "reject",
          reason: rejectReason.trim() || "Documents could not be verified",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reject pass");

      toast.success("Pass marked as rejected.");

      setRegistrations(prev =>
        prev.map(r =>
          r.registrationId === reg.registrationId
            ? { ...r, paymentStatus: "failed", rejectionReason: rejectReason }
            : r
        )
      );

      if (selectedUser?.registrationId === reg.registrationId) {
        setSelectedUser(prev => prev ? { ...prev, paymentStatus: "failed", rejectionReason: rejectReason } : null);
      }

      setShowRejectBox(false);
      setRejectReason("");

      setStats(prev => ({
        ...prev,
        totalFailed: prev.totalFailed + (reg.paymentStatus !== "failed" ? 1 : 0),
        totalPending: Math.max(0, prev.totalPending - (reg.paymentStatus === "pending" ? 1 : 0)),
      }));

    } catch (err: any) {
      toast.error(err.message || "Rejection failed");
    } finally {
      setProcessingAction(prev => ({ ...prev, [reg.registrationId]: false }));
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const primary = r.members?.[0];
    const name = r.name || primary?.name || "";
    const email = r.email || primary?.email || "";
    const mobile = r.mobile || primary?.mobile || primary?.whatsapp || "";
    const school = r.schoolName || primary?.schoolName || "";
    const city = r.city || primary?.city || "";
    const state = r.state || primary?.state || "";

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      r.registrationId.toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      mobile.toLowerCase().includes(query) ||
      school.toLowerCase().includes(query) ||
      city.toLowerCase().includes(query) ||
      state.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || r.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-28 pb-20 transition-colors duration-300 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/10 via-orange-100/15 dark:via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/5 via-amber-100/10 dark:via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              Aagaaz 2K26 Administration Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Student ID Verification & Pass Approval
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="text-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101015] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>

            <Button
              onClick={exportUserDetailsToExcel}
              size="sm"
              variant="outline"
              className="text-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101015] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101015] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="text-xs bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200">
                <Link href="/admin/dashboard">
                  <DropdownMenuItem className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">Dashboard Overview</DropdownMenuItem>
                </Link>
                <Link href="/admin/coupons">
                  <DropdownMenuItem className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <Ticket className="mr-2 w-3.5 h-3.5" /> Manage Coupons
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-700 dark:text-rose-400 dark:focus:text-rose-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 w-3.5 h-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500">Total Passes Registered</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalRegistrations}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-semibold">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.totalPending}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">Approved & Sent</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalVerified}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 font-semibold">Rejected / Failed</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.totalFailed}</div>
          </div>
        </div>

        {/* Table & Filters */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              <Input
                placeholder="Search by student, school, city, state, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-neutral-50/70 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-neutral-900 focus-visible:ring-amber-400/50 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900/90 p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === "all" ? "bg-white dark:bg-neutral-800 shadow-2xs text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                All ({registrations.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === "pending" ? "bg-white dark:bg-neutral-800 shadow-2xs text-amber-700 dark:text-amber-400 font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Pending Review ({stats.totalPending})
              </button>
              <button
                onClick={() => setStatusFilter("verified")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === "verified" ? "bg-white dark:bg-neutral-800 shadow-2xs text-emerald-700 dark:text-emerald-400 font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Approved ({stats.totalVerified})
              </button>
              <button
                onClick={() => setStatusFilter("failed")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === "failed" ? "bg-white dark:bg-neutral-800 shadow-2xs text-rose-700 dark:text-rose-400 font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Rejected ({stats.totalFailed})
              </button>
            </div>
          </div>

          {/* Table View */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-neutral-500 font-mono">
              Loading registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400 dark:text-neutral-500">
              No matching registrations found.
            </div>
          ) : (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-mono">
                  <TableRow className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
                    <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">Reg ID</TableHead>
                    <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">Student Info</TableHead>
                    <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">School & Region</TableHead>
                    <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300">Status</TableHead>
                    <TableHead className="font-semibold text-neutral-700 dark:text-neutral-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {filteredRegistrations.map((user) => {
                    const primary = user.members?.[0];
                    const studentName = user.name || primary?.name || "N/A";
                    const email = user.email || primary?.email || "N/A";
                    const mobile = user.mobile || primary?.mobile || primary?.whatsapp || "N/A";
                    const state = user.state || primary?.state || "";
                    const city = user.city || primary?.city || primary?.address || "N/A";
                    const school = user.schoolName || primary?.schoolName || "N/A";
                    const isOther = user.isOtherSchool || primary?.isOtherSchool;
                    const studentClass = user.studentClass || primary?.studentClass || "12th";
                    const isProcessing = processingAction[user.registrationId];

                    return (
                      <TableRow key={user.registrationId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
                        <TableCell className="font-mono font-bold text-neutral-900 dark:text-neutral-200">
                          {user.registrationId.slice(0, 8)}...
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900 dark:text-white">{studentName}</div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{email}</div>
                          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">{mobile}</div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            <span>{school}</span>
                            {isOther && (
                              <span className="text-[9px] font-mono bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                            {city}{state ? `, ${state}` : ""} • Class {studentClass}
                          </div>
                        </TableCell>

                        <TableCell>
                          {user.paymentStatus === "verified" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {user.paymentStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {user.paymentStatus === "failed" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800/80">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.paymentStatus === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(user)}
                                disabled={isProcessing}
                                className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs cursor-pointer"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-3 h-3 mr-1" /> Approve
                                  </>
                                )}
                              </Button>
                            )}

                            {user.paymentStatus === "verified" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(user)}
                                disabled={isProcessing}
                                className="text-xs h-7 px-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101015] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="w-3 h-3 mr-1" /> Resend QR
                                  </>
                                )}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(user)}
                              className="text-xs h-7 px-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
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
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white flex items-center justify-between gap-3">
                <span>Student Verification Dossier</span>
                {selectedUser && (
                  <Badge variant={selectedUser.paymentStatus === "verified" ? "default" : "secondary"}>
                    Status: {selectedUser.paymentStatus.toUpperCase()}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-5 pt-2">
                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
                  <div className="col-span-2">
                    <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">REGISTRATION ID</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{selectedUser.registrationId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">PASS CLASS</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{selectedUser.studentClass ? (selectedUser.studentClass.toLowerCase().includes("class") ? selectedUser.studentClass : `${selectedUser.studentClass} Class`) : "12th Class"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">QR DISPATCHED</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{selectedUser.qrSent ? "Yes (Email)" : "No"}</span>
                  </div>
                </div>

                {/* Personal & School Info */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-3">
                  <div className="font-bold text-neutral-900 dark:text-white text-xs pb-1.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span>Student & Institute Profile</span>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      Submitted: {new Date(selectedUser.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">FULL NAME</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{selectedUser.name || selectedUser.members?.[0]?.name}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">EMAIL ADDRESS</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{selectedUser.email || selectedUser.members?.[0]?.email}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">MOBILE NUMBER</span>
                      <span className="font-mono text-neutral-900 dark:text-white">{selectedUser.mobile || selectedUser.members?.[0]?.mobile || selectedUser.members?.[0]?.whatsapp}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">STATE & CITY</span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {selectedUser.city || selectedUser.members?.[0]?.city}, {selectedUser.state || selectedUser.members?.[0]?.state || ""}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">SCHOOL NAME</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm">
                          {selectedUser.schoolName || selectedUser.members?.[0]?.schoolName}
                        </span>
                        {(selectedUser.isOtherSchool || selectedUser.members?.[0]?.isOtherSchool) && (
                          <span className="text-[9px] font-mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">
                            Custom Entered School
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents Preview Section */}
                <div className="space-y-2">
                  <div className="font-bold text-neutral-900 dark:text-white text-xs flex items-center justify-between">
                    <span>Uploaded Proof Documents</span>
                    {isLoadingDetail ? (
                      <span className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading full images...
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Click images to zoom</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* School ID Card Card */}
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <IdCard className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                          <span>School ID Card</span>
                        </div>
                      </div>

                      {isLoadingDetail ? (
                        <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800/60 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 text-[11px] font-mono gap-1">
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                          <span>Loading School ID...</span>
                        </div>
                      ) : (selectedUser.schoolIdCard || selectedUser.members?.[0]?.schoolIdCard) ? (
                        <div
                          onClick={() => setZoomImage({
                            url: (selectedUser.schoolIdCard || selectedUser.members?.[0]?.schoolIdCard)!,
                            title: `${selectedUser.name}'s School ID Card`
                          })}
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-black aspect-video flex items-center justify-center"
                        >
                          <img
                            src={selectedUser.schoolIdCard || selectedUser.members?.[0]?.schoolIdCard}
                            alt="School ID"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                            <Eye className="w-4 h-4 mr-1" /> Click to Zoom
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-[11px] font-mono">
                          No School ID Uploaded
                        </div>
                      )}
                    </div>

                    {/* Aadhar Card Card */}
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                          <span>Aadhar Card</span>
                        </div>
                      </div>

                      {isLoadingDetail ? (
                        <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800/60 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 text-[11px] font-mono gap-1">
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                          <span>Loading Aadhar Card...</span>
                        </div>
                      ) : (selectedUser.aadharCard || selectedUser.members?.[0]?.aadharCard) ? (
                        <div
                          onClick={() => setZoomImage({
                            url: (selectedUser.aadharCard || selectedUser.members?.[0]?.aadharCard)!,
                            title: `${selectedUser.name}'s Aadhar Card`
                          })}
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-black aspect-video flex items-center justify-center"
                        >
                          <img
                            src={selectedUser.aadharCard || selectedUser.members?.[0]?.aadharCard}
                            alt="Aadhar Card"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                            <Eye className="w-4 h-4 mr-1" /> Click to Zoom
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-[11px] font-mono">
                          No Aadhar Card Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rejection input box if triggered */}
                {showRejectBox && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Specify Rejection Reason (sent to student)</span>
                    </div>
                    <Input
                      placeholder="e.g. Uploaded School ID is blurry / Student not in 11th or 12th class"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="bg-white dark:bg-neutral-900 text-xs border-rose-300 dark:border-rose-800/80 text-neutral-900 dark:text-white"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowRejectBox(false)}
                        className="text-xs h-7 px-2 text-neutral-600 dark:text-neutral-400"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReject(selectedUser)}
                        disabled={processingAction[selectedUser.registrationId]}
                        className="text-xs h-7 px-3 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                    {selectedUser.paymentStatus === "verified" ? "Pass is already verified and dispatched." : "Review IDs before approving pass."}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedUser.paymentStatus !== "failed" && !showRejectBox && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowRejectBox(true)}
                        className="text-xs h-8 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleApprove(selectedUser)}
                      disabled={processingAction[selectedUser.registrationId]}
                      className="text-xs h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm cursor-pointer"
                    >
                      {processingAction[selectedUser.registrationId] ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          {selectedUser.paymentStatus === "verified" ? "Resend Approval Email" : "Approve & Send Pass"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Lightbox / High-Res Image Zoom Modal */}
        <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
          <DialogContent className="sm:max-w-4xl bg-black/95 text-white border-neutral-800 p-5">
            <DialogHeader className="pr-10">
              <DialogTitle className="text-sm font-mono text-neutral-300 flex items-center justify-between gap-4">
                <span className="truncate text-white font-semibold">{zoomImage?.title}</span>
                {zoomImage?.url && (
                  <a
                    href={zoomImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 hover:bg-neutral-800 flex items-center gap-1.5 font-mono shrink-0 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700 transition"
                  >
                    <span>Open Fullscreen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </DialogTitle>
            </DialogHeader>
            {zoomImage && (
              <div className="max-h-[80vh] flex items-center justify-center p-2">
                <img
                  src={zoomImage.url}
                  alt={zoomImage.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}