'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, LogOut, Menu, Send, Ticket, Search, CheckCircle2, Clock, XCircle, Users, RefreshCw } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Member {
  name: string;
  email: string;
  whatsapp?: string;
  mobile?: string;
  schoolName?: string;
  studentClass?: string;
  city?: string;
  address?: string;
}

interface Registration {
  registrationId: string;
  name?: string;
  email?: string;
  mobile?: string;
  schoolName?: string;
  studentClass?: string;
  city?: string;
  members: Member[];
  totalMembers: number;
  paymentStatus: string;
  qrCode: string;
  qrSent: boolean;
  totalAmount: number;
  utrNumber?: string;
  appliedCoupon?: string;
  discountPercentage?: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [sendingQr, setSendingQr] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      "School Name",
      "Class",
      "City",
      "Pass Status",
      "Created At"
    ];

    let csv = "\uFEFF" + headers.join(",") + "\n";

    registrations.forEach(reg => {
      const primary = reg.members?.[0];
      const name = reg.name || primary?.name || "";
      const email = reg.email || primary?.email || "";
      const phone = reg.mobile || primary?.mobile || primary?.whatsapp || "";
      const school = reg.schoolName || primary?.schoolName || "";
      const cls = reg.studentClass || primary?.studentClass || "";
      const city = reg.city || primary?.city || primary?.address || "";

      const row = [
        reg.registrationId,
        name,
        email,
        phone,
        school,
        cls,
        city,
        reg.paymentStatus,
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

  const sendQRCode = async (user: Registration) => {
    setSendingQr(prev => ({ ...prev, [user.registrationId]: true }));

    try {
      const primary = user.members?.[0];

      if (!primary?.email) {
        toast.error("Primary member email is missing");
        return;
      }

      if (!user.qrCode) {
        toast.error("QR code is not generated yet for this pass");
        return;
      }

      const response = await fetch("/api/sendQr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: primary.email,
          qrCodeImage: user.qrCode,
          name: primary.name,
          registrationId: user.registrationId,
          totalMembers: user.totalMembers
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success(`QR code successfully dispatched to ${primary.email}`);

      await fetch("/api/updateQrStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          registrationId: user.registrationId
        })
      });

      setRegistrations(prev =>
        prev.map(r =>
          r.registrationId === user.registrationId
            ? { ...r, qrSent: true }
            : r
        )
      );

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send QR code email");
    } finally {
      setSendingQr(prev => ({ ...prev, [user.registrationId]: false }));
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
              Freshers 2K26 Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Admin Pass Management
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
            <div className="text-[10px] font-mono uppercase text-neutral-400">Total Bookings</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.totalRegistrations}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-600">Verified Payments</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalVerified}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-600">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600">{stats.totalPending}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-rose-600">Failed / Rejected</div>
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
                placeholder="Search by ID, name, email or UTR..."
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
                onClick={() => setStatusFilter("verified")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "verified" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  statusFilter === "pending" ? "bg-white shadow-2xs text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Pending
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
                    <TableHead className="font-semibold text-neutral-700">School & Class</TableHead>
                    <TableHead className="font-semibold text-neutral-700">City</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Status</TableHead>
                    <TableHead className="font-semibold text-neutral-700">QR Dispatch</TableHead>
                    <TableHead className="font-semibold text-neutral-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {filteredRegistrations.map((user) => {
                    const primary = user.members?.[0];
                    const studentName = user.name || primary?.name || "N/A";
                    const email = user.email || primary?.email || "N/A";
                    const mobile = user.mobile || primary?.mobile || primary?.whatsapp || "N/A";
                    const school = user.schoolName || primary?.schoolName || "N/A";
                    const cls = user.studentClass || primary?.studentClass || "";
                    const city = user.city || primary?.city || primary?.address || "N/A";

                    return (
                      <TableRow key={user.registrationId} className="hover:bg-neutral-50/50">
                        <TableCell className="font-mono font-bold text-neutral-900">
                          {user.registrationId.slice(0, 8)}...
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900">{studentName}</div>
                          <div className="text-[11px] text-neutral-500">{email}</div>
                          <div className="text-[10px] text-neutral-400">{mobile}</div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-neutral-900">{school}</div>
                          {cls && (
                            <span className="inline-block text-[10px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded border border-neutral-200">
                              {cls}
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-neutral-700">
                          {city}
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

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendQRCode(user)}
                            disabled={user.qrSent || sendingQr[user.registrationId]}
                            className="text-xs h-7 px-2.5 border-neutral-200"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            {user.qrSent ? "Sent" : sendingQr[user.registrationId] ? "Sending..." : "Send QR"}
                          </Button>
                        </TableCell>

                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedUser(user)}
                                className="text-xs h-7 px-2 text-neutral-600 hover:text-neutral-900"
                              >
                                <FileText className="w-3.5 h-3.5 mr-1" /> View
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md bg-white text-xs">
                              <DialogHeader>
                                <DialogTitle className="text-base font-bold text-neutral-900">
                                  Student Pass Details
                                </DialogTitle>
                              </DialogHeader>

                              {selectedUser && (
                                <div className="space-y-4 pt-2">
                                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-[11px]">
                                    <div className="col-span-2"><b>Registration ID:</b> {selectedUser.registrationId}</div>
                                    <div><b>Status:</b> {selectedUser.paymentStatus}</div>
                                    <div><b>QR Sent:</b> {selectedUser.qrSent ? "Yes" : "No"}</div>
                                  </div>

                                  <div className="space-y-2 p-3 rounded-lg border border-neutral-200 text-neutral-800">
                                    <div className="font-semibold text-neutral-900 text-xs pb-1 border-b border-neutral-100">
                                      Student Information
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                      <div><span className="text-neutral-400">Name:</span> <span className="font-semibold text-neutral-900">{selectedUser.name || selectedUser.members?.[0]?.name}</span></div>
                                      <div><span className="text-neutral-400">Email:</span> <span className="font-semibold text-neutral-900">{selectedUser.email || selectedUser.members?.[0]?.email}</span></div>
                                      <div><span className="text-neutral-400">Mobile:</span> <span className="font-semibold text-neutral-900">{selectedUser.mobile || selectedUser.members?.[0]?.mobile || selectedUser.members?.[0]?.whatsapp || "—"}</span></div>
                                      <div><span className="text-neutral-400">Class:</span> <span className="font-semibold text-neutral-900">{selectedUser.studentClass || selectedUser.members?.[0]?.studentClass || "—"}</span></div>
                                      <div className="col-span-2"><span className="text-neutral-400">School:</span> <span className="font-semibold text-neutral-900">{selectedUser.schoolName || selectedUser.members?.[0]?.schoolName || "—"}</span></div>
                                      <div className="col-span-2"><span className="text-neutral-400">City:</span> <span className="font-semibold text-neutral-900">{selectedUser.city || selectedUser.members?.[0]?.city || selectedUser.members?.[0]?.address || "—"}</span></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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