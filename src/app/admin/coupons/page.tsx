'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Menu, Pencil, Ticket, Plus, Tag, ArrowLeft, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";
import AccessDenied from "@/components/layout/AccessDenied";

interface Coupon {
  _id: string;
  name: string;
  assignedTo: string;
  quantity: number;
  discount: number;
}

const Coupons = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ name: "", assignedTo: "", quantity: 1, discount: 0 });
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchCoupons();
    }
  }, [status, session]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.user.role !== "admin") {
    return <AccessDenied />;
  }

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/coupons");
      const data = await response.json();
      if (Array.isArray(data)) {
        setCoupons(data);
      }
    } catch {
      toast.error("Failed to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    setLoading(true);
    if (!newCoupon.name || !newCoupon.assignedTo || newCoupon.quantity <= 0 || newCoupon.discount <= 0) {
      toast.error("Please enter valid coupon details");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });

      if (response.ok) {
        toast.success("Coupon added successfully");
        setNewCoupon({ name: "", assignedTo: "", quantity: 1, discount: 0 });
        setIsAddDialogOpen(false);
        fetchCoupons();
      } else {
        toast.error("Failed to add coupon");
      }
    } catch {
      toast.error("Error adding coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!editCoupon) return;
    setEditLoading(true);

    try {
      const response = await fetch(`/api/coupons/${editCoupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCoupon.name,
          assignedTo: editCoupon.assignedTo,
          quantity: editCoupon.quantity,
          discount: editCoupon.discount
        }),
      });

      if (response.ok) {
        toast.success("Coupon updated successfully");
        setIsEditDialogOpen(false);
        fetchCoupons();
      } else {
        toast.error("Failed to update coupon");
      }
    } catch {
      toast.error("Error updating coupon");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-neutral-900 transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Coupon Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCoupons}
              disabled={loading}
              className="text-xs border-neutral-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-neutral-900">Create New Coupon</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="coupon-name">Coupon Code Name *</Label>
                    <Input
                      id="coupon-name"
                      placeholder="e.g. VIP2026"
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value.toUpperCase() })}
                      className="uppercase font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="assigned-to">Assigned Representative / Ambassador *</Label>
                    <Input
                      id="assigned-to"
                      placeholder="e.g. Student Council / Dean Office"
                      value={newCoupon.assignedTo}
                      onChange={(e) => setNewCoupon({ ...newCoupon, assignedTo: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="quantity">Quantity Limit</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newCoupon.quantity}
                        onChange={(e) => setNewCoupon({ ...newCoupon, quantity: Number(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="discount">Discount Percentage (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="1"
                        max="100"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddCoupon}
                    disabled={loading}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs mt-2"
                  >
                    {loading ? "Creating..." : "Save Coupon"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs border-neutral-200">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <Link href="/admin/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                <DropdownMenuItem className="text-rose-600" onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 w-3.5 h-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">
              Active Promotional Codes ({coupons.length})
            </h3>
          </div>

          {loading && coupons.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono">
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No active coupons found. Click "Create Coupon" to add one.
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50/80 text-[11px] font-mono">
                  <TableRow>
                    <TableHead className="font-semibold text-neutral-700">Code</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Assigned Recipient</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Available Uses</TableHead>
                    <TableHead className="font-semibold text-neutral-700">Discount</TableHead>
                    <TableHead className="font-semibold text-neutral-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {coupons.map((coupon) => (
                    <TableRow key={coupon._id} className="hover:bg-neutral-50/50">
                      <TableCell className="font-mono font-bold text-neutral-900">
                        {coupon.name}
                      </TableCell>
                      <TableCell className="text-neutral-700">
                        {coupon.assignedTo}
                      </TableCell>
                      <TableCell className="font-mono">
                        {coupon.quantity} remaining
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          {coupon.discount}% OFF
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(coupon)}
                          className="text-xs h-7 px-2 text-neutral-600 hover:text-neutral-900"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">Edit Coupon Details</DialogTitle>
          </DialogHeader>
          {editCoupon && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Coupon Code Name</Label>
                <Input
                  id="edit-name"
                  value={editCoupon.name}
                  onChange={(e) => setEditCoupon({ ...editCoupon, name: e.target.value.toUpperCase() })}
                  className="uppercase font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-assigned">Assigned Representative</Label>
                <Input
                  id="edit-assigned"
                  value={editCoupon.assignedTo}
                  onChange={(e) => setEditCoupon({ ...editCoupon, assignedTo: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-quantity">Quantity Limit</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={editCoupon.quantity}
                    onChange={(e) => setEditCoupon({ ...editCoupon, quantity: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-discount">Discount Percentage (%)</Label>
                  <Input
                    id="edit-discount"
                    type="number"
                    min="1"
                    max="100"
                    value={editCoupon.discount}
                    onChange={(e) => setEditCoupon({ ...editCoupon, discount: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
              </div>

              <Button
                onClick={handleUpdateCoupon}
                disabled={editLoading}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs mt-2"
              >
                {editLoading ? "Updating..." : "Update Coupon"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
