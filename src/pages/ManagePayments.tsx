import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Edit, X } from "lucide-react";
import { usePayments, usePaymentPlans, useCreatePayment, useUpdatePayment } from "@/hooks/usePayments";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ManagePayments() {
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get("user");
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    user_id: preselectedUserId || "",
    plan_id: "",
    amount_paid: "",
    status: "unpaid" as "paid" | "unpaid" | "partial",
  });

  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: users } = useUsers();
  const { data: plans } = usePaymentPlans();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (preselectedUserId) {
      setFormData(prev => ({ ...prev, user_id: preselectedUserId }));
      setShowAddForm(true);
    }
  }, [preselectedUserId]);

  const filteredPayments = payments?.filter(payment => {
    // If a user is preselected, only show their payments
    if (preselectedUserId && payment.user_id !== preselectedUserId) {
      return false;
    }
    // Apply status filter
    return statusFilter === "all" || payment.status === statusFilter;
  }) || [];

  const resetForm = () => {
    setFormData({
      user_id: preselectedUserId || "",
      plan_id: "",
      amount_paid: "",
      status: "unpaid",
    });
    setEditingPayment(null);
    setShowAddForm(false);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setFormData({
      user_id: payment.user_id,
      plan_id: payment.plan_id,
      amount_paid: payment.amount_paid.toString(),
      status: payment.status,
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id || !formData.plan_id || !formData.amount_paid) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedPlan = plans?.find(p => p.id === formData.plan_id);
    if (!selectedPlan) return;

    const amountPaid = parseFloat(formData.amount_paid);
    
    // Validate that amount paid doesn't exceed plan amount
    if (amountPaid > selectedPlan.amount) {
      toast({
        title: "Invalid Amount",
        description: `Amount paid ($${amountPaid}) cannot exceed plan amount ($${selectedPlan.amount})`,
        variant: "destructive",
      });
      return;
    }
    
    const amountRemaining = Math.max(0, selectedPlan.amount - amountPaid);
    
    let status: "paid" | "unpaid" | "partial" = "unpaid";
    if (amountPaid >= selectedPlan.amount) {
      status = "paid";
    } else if (amountPaid > 0) {
      status = "partial";
    }

    try {
      if (editingPayment) {
        // Update existing payment
        await updatePayment.mutateAsync({
          id: editingPayment.id,
          paymentData: {
            user_id: formData.user_id,
            plan_id: formData.plan_id,
            amount_paid: amountPaid,
            amount_remaining: amountRemaining,
            status: status,
            payment_date: status !== "unpaid" ? new Date().toISOString() : null,
          },
        });

        toast({
          title: "Success",
          description: "Payment updated successfully",
        });
      } else {
        // Create new payment
        await createPayment.mutateAsync({
          user_id: formData.user_id,
          plan_id: formData.plan_id,
          amount_paid: amountPaid,
          amount_remaining: amountRemaining,
          status: status,
          payment_date: status !== "unpaid" ? new Date().toISOString() : undefined,
        });

        toast({
          title: "Success",
          description: "Payment recorded successfully",
        });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save payment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "unpaid":
        return <Badge variant="destructive">Unpaid</Badge>;
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800">Partial</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (paymentsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Payments</h1>
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {preselectedUserId && users?.find(u => u.id === preselectedUserId) 
              ? `Payments for ${users.find(u => u.id === preselectedUserId)?.full_name}`
              : "Manage Payments"
            }
          </h1>
          {preselectedUserId && (
            <p className="text-muted-foreground mt-1">
              Viewing payment records for this user
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {preselectedUserId && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/payments")}
            >
              ← Back to All Payments
            </Button>
          )}
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{editingPayment ? "Edit Payment" : "Record New Payment"}</CardTitle>
                <CardDescription>
                  {editingPayment ? "Update payment details" : "Enter payment details for a user"}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">User *</Label>
                  <Select 
                    value={formData.user_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} - {user.phone_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan_id">Payment Plan *</Label>
                  <Select 
                    value={formData.plan_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans?.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_paid">Amount Paid *</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  step="0.01"
                  min="0"
                  max={plans?.find(p => p.id === formData.plan_id)?.amount || undefined}
                  value={formData.amount_paid}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount_paid: e.target.value }))}
                  placeholder="Enter amount paid"
                  required
                />
                {formData.plan_id && plans?.find(p => p.id === formData.plan_id) && (
                  <p className="text-sm text-muted-foreground">
                    Maximum allowed: ${plans.find(p => p.id === formData.plan_id)?.amount}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createPayment.isPending || updatePayment.isPending}>
                  {createPayment.isPending || updatePayment.isPending 
                    ? (editingPayment ? "Updating..." : "Recording...") 
                    : (editingPayment ? "Update Payment" : "Record Payment")
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {preselectedUserId ? "User Payment Records" : "Payment Records"}
          </CardTitle>
          <CardDescription>
            {preselectedUserId 
              ? "View and manage payment records for this user"
              : "View and manage all payment records"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredPayments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Plan Amount</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.users.full_name}
                      </TableCell>
                      <TableCell>{payment.users.phone_number}</TableCell>
                      <TableCell>{payment.payment_plans.name}</TableCell>
                      <TableCell>${payment.payment_plans.amount}</TableCell>
                      <TableCell>${payment.amount_paid}</TableCell>
                      <TableCell>
                        {payment.amount_remaining > 0 ? `$${payment.amount_remaining}` : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        {payment.payment_date 
                          ? new Date(payment.payment_date).toLocaleDateString()
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPayment(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {preselectedUserId 
                ? "No payment records found for this user. Use the form above to record a new payment."
                : "No payment records found."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}