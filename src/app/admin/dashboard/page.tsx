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
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Floating hover preview state
  const [hoveredPreview, setHoveredPreview] = useState<{
    url: string;
    title: string;
    docType: string;
    x: number;
    y: number;
  } | null>(null);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/registerations");
      const data = await res.json();

      if (Array.isArray(data)) {
        setRegistrations(data);
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
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
              Aagaz 2K26 Administration Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Student ID Verification & Pass Approval
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="text-xs border-neutral-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>

            <Button
              onClick={exportUserDetailsToExcel}
              size="sm"
              variant="outline"
              className="text-xs border-neutral-200"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs border-neutral-200">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="text-xs">
                <Link href="/admin/dashboard">
                  <DropdownMenuItem>Dashboard Overview</DropdownMenuItem>
                </Link>
                <Link href="/admin/coupons">
                  <DropdownMenuItem>
                    <Ticket className="mr-2 w-3.5 h-3.5" /> Manage Coupons
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-700"
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
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-neutral-400">Total Passes Registered</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.totalRegistrations}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-600">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600">{stats.totalPending}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-600">Approved & Sent</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalVerified}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-rose-600">Rejected / Failed</div>
            <div className="text-2xl font-bold text-rose-600">{stats.totalFailed}</div>
          </div>
        </div>

        {/* Table & Filters */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-5">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              <Input
                placeholder="Search by student, school, city, state, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs focus-visible:ring-neutral-900"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "all" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                All ({registrations.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "pending" ? "bg-white shadow-2xs text-amber-700 font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Pending Review ({stats.totalPending})
              </button>
              <button
                onClick={() => setStatusFilter("verified")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "verified" ? "bg-white shadow-2xs text-emerald-700 font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Approved ({stats.totalVerified})
              </button>
              <button
                onClick={() => setStatusFilter("failed")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "failed" ? "bg-white shadow-2xs text-rose-700 font-bold" : "text-neutral-500 hover:text-neutral-900"
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
            <div className="py-16 text-center text-xs text-neutral-400">
              No matching registrations found.
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50/80 text-[11px] font-mono">
                  <TableRow>
                    <TableHead className="font-semibold text-neutral-700">Reg ID</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Student Info</TableHead>
                    <TableHead className="font-semibold text-neutral-700">School & Region</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Uploaded Documents (Hover to Preview)</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Status</TableHead>
                    <TableHead className="font-semibold text-neutral-700 text-right">Actions</TableHead>
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
                    const schoolIdCard = user.schoolIdCard || primary?.schoolIdCard;
                    const aadharCard = user.aadharCard || primary?.aadharCard;
                    const isProcessing = processingAction[user.registrationId];

                    return (
                      <TableRow key={user.registrationId} className="hover:bg-neutral-50/50">
                        <TableCell className="font-mono font-bold text-neutral-900">
                          {user.registrationId.slice(0, 8)}...
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900">{studentName}</div>
                          <div className="text-[11px] text-neutral-500">{email}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{mobile}</div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900 flex items-center gap-1.5 flex-wrap">
                            <span>{school}</span>
                            {isOther && (
                              <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            {city}{state ? `, ${state}` : ""} • Class 12th
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {schoolIdCard ? (
                              <button
                                type="button"
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredPreview({
                                    url: schoolIdCard,
                                    title: `${studentName} — School ID Card`,
                                    docType: "School ID Card",
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredPreview(null)}
                                onClick={() =>
                                  setZoomImage({
                                    url: schoolIdCard,
                                    title: `${studentName}'s School ID Card`,
                                  })
                                }
                                className="group relative flex items-center gap-1.5 text-[10px] font-mono bg-neutral-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 transition-all shadow-2xs cursor-pointer"
                              >
                                <IdCard className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-600" />
                                <span className="font-semibold">School ID</span>
                                <Eye className="w-3 h-3 text-neutral-400 group-hover:text-amber-600 transition" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-400 font-mono">No School ID</span>
                            )}

                            {aadharCard ? (
                              <button
                                type="button"
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredPreview({
                                    url: aadharCard,
                                    title: `${studentName} — Aadhar Card`,
                                    docType: "Aadhar Card",
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredPreview(null)}
                                onClick={() =>
                                  setZoomImage({
                                    url: aadharCard,
                                    title: `${studentName}'s Aadhar Card`,
                                  })
                                }
                                className="group relative flex items-center gap-1.5 text-[10px] font-mono bg-neutral-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 transition-all shadow-2xs cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-600" />
                                <span className="font-semibold">Aadhar</span>
                                <Eye className="w-3 h-3 text-neutral-400 group-hover:text-amber-600 transition" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-400 font-mono">No Aadhar</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          {user.paymentStatus === "verified" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {user.paymentStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {user.paymentStatus === "failed" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
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
                                className="text-xs h-7 px-2 border-neutral-200 text-neutral-700 cursor-pointer hover:bg-neutral-100"
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
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDetailOpen(true);
                                setShowRejectBox(false);
                              }}
                              className="text-xs h-7 px-2 text-neutral-600 hover:text-neutral-900 cursor-pointer"
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

        {/* Floating Hover Document Quick-Preview Card */}
        {hoveredPreview && (
          <div
            style={{
              left: `${hoveredPreview.x}px`,
              top: `${hoveredPreview.y}px`,
              transform: 'translate(-50%, -100%) translateY(-12px)',
            }}
            className="fixed z-[100] pointer-events-none transition-all duration-150 ease-out"
          >
            <div className="w-72 bg-neutral-950/95 text-white p-3 rounded-2xl border border-neutral-700 shadow-2xl space-y-2.5 backdrop-blur-md animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 px-0.5">
                <span className="font-bold truncate max-w-[190px] text-amber-300">
                  {hoveredPreview.title}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                  {hoveredPreview.docType}
                </span>
              </div>
              
              <div className="w-full h-44 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-1 relative">
                <img
                  src={hoveredPreview.url}
                  alt={hoveredPreview.title}
                  className="w-full h-full object-contain rounded-lg shadow-inner"
                />
              </div>

              <div className="text-[10px] text-neutral-400 text-center font-mono flex items-center justify-center gap-1.5 pt-0.5">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Click badge for full-screen zoom</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Review & Approval Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-2xl bg-white text-xs max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-base font-bold text-neutral-900 flex items-center justify-between gap-3">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-[11px]">
                  <div className="col-span-2">
                    <span className="text-neutral-400 block text-[10px]">REGISTRATION ID</span>
                    <span className="font-bold text-neutral-900">{selectedUser.registrationId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">PASS CLASS</span>
                    <span className="font-bold text-neutral-900">{selectedUser.studentClass || "12th Class"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">QR DISPATCHED</span>
                    <span className="font-bold text-neutral-900">{selectedUser.qrSent ? "Yes (Email)" : "No"}</span>
                  </div>
                </div>

                {/* Personal & School Info */}
                <div className="p-4 rounded-xl border border-neutral-200 space-y-3">
                  <div className="font-bold text-neutral-900 text-xs pb-1.5 border-b border-neutral-100 flex items-center justify-between">
                    <span>Student & Institute Profile</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Submitted: {new Date(selectedUser.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">FULL NAME</span>
                      <span className="font-bold text-neutral-900">{selectedUser.name || selectedUser.members?.[0]?.name}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px]">EMAIL ADDRESS</span>
                      <span className="font-semibold text-neutral-900">{selectedUser.email || selectedUser.members?.[0]?.email}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px]">MOBILE NUMBER</span>
                      <span className="font-mono text-neutral-900">{selectedUser.mobile || selectedUser.members?.[0]?.mobile || selectedUser.members?.[0]?.whatsapp}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px]">STATE & CITY</span>
                      <span className="font-medium text-neutral-900">
                        {selectedUser.city || selectedUser.members?.[0]?.city}, {selectedUser.state || selectedUser.members?.[0]?.state || ""}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-neutral-400 block text-[10px]">SCHOOL NAME</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-neutral-900 text-sm">
                          {selectedUser.schoolName || selectedUser.members?.[0]?.schoolName}
                        </span>
                        {(selectedUser.isOtherSchool || selectedUser.members?.[0]?.isOtherSchool) && (
                          <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                            Custom Entered School
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents Preview Section */}
                <div className="space-y-2">
                  <div className="font-bold text-neutral-900 text-xs flex items-center justify-between">
                    <span>Uploaded Proof Documents</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Click images to zoom</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* School ID Card Card */}
                    <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <div className="flex items-center gap-1.5">
                          <IdCard className="w-3.5 h-3.5 text-neutral-500" />
                          <span>School ID Card</span>
                        </div>
                      </div>

                      {(selectedUser.schoolIdCard || selectedUser.members?.[0]?.schoolIdCard) ? (
                        <div
                          onClick={() => setZoomImage({
                            url: (selectedUser.schoolIdCard || selectedUser.members?.[0]?.schoolIdCard)!,
                            title: `${selectedUser.name}'s School ID Card`
                          })}
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-black aspect-video flex items-center justify-center"
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
                        <div className="aspect-video rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-[11px] font-mono">
                          No School ID Uploaded
                        </div>
                      )}
                    </div>

                    {/* Aadhar Card Card */}
                    <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Aadhar Card</span>
                        </div>
                      </div>

                      {(selectedUser.aadharCard || selectedUser.members?.[0]?.aadharCard) ? (
                        <div
                          onClick={() => setZoomImage({
                            url: (selectedUser.aadharCard || selectedUser.members?.[0]?.aadharCard)!,
                            title: `${selectedUser.name}'s Aadhar Card`
                          })}
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-black aspect-video flex items-center justify-center"
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
                        <div className="aspect-video rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-[11px] font-mono">
                          No Aadhar Card Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rejection input box if triggered */}
                {showRejectBox && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Specify Rejection Reason (sent to student)</span>
                    </div>
                    <Input
                      placeholder="e.g. Uploaded School ID is blurry / Student not in 12th class"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="bg-white text-xs border-rose-300"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowRejectBox(false)}
                        className="text-xs h-7 px-2 text-neutral-600"
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
                <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {selectedUser.paymentStatus === "verified" ? "Pass is already verified and dispatched." : "Review IDs before approving pass."}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedUser.paymentStatus !== "failed" && !showRejectBox && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowRejectBox(true)}
                        className="text-xs h-8 border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
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