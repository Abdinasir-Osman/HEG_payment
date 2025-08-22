import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Users, CreditCard } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const [reportType, setReportType] = useState<string>("all");
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { toast } = useToast();

  const getFilteredData = () => {
    if (!payments) return [];
    
    switch (reportType) {
      case "paid":
        return payments.filter(p => p.status === "paid");
      case "unpaid":
        return payments.filter(p => p.status === "unpaid");
      case "partial":
        return payments.filter(p => p.status === "partial");
      default:
        return payments;
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "User Name",
      "Phone Number",
      "Email",
      "Payment Plan",
      "Plan Amount",
      "Amount Paid",
      "Amount Remaining",
      "Status",
      "Payment Date",
      "Created Date"
    ];

    const csvContent = [
      headers.join(","),
      ...data.map(payment => [
        `"${payment.users.full_name}"`,
        `"${payment.users.phone_number}"`, 
        `"${payment.users.email || ""}"`,
        `"${payment.payment_plans.name}"`,
        payment.payment_plans.amount,
        payment.amount_paid,
        payment.amount_remaining,
        payment.status,
        payment.payment_date ? `"${new Date(payment.payment_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}"` : "",
        `"${new Date(payment.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}"`
      ].join(","))
    ].join("\n");

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Report exported successfully",
    });
  };

  const exportUsersToCSV = () => {
    if (!users?.length) {
      toast({
        title: "No Data",
        description: "No users available to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Name",
      "Phone Number",
      "Email",
      "Gender",
      "Address",
      "Registration Date"
    ];

    const csvContent = [
      headers.join(","),
      ...users.map(user => [
        `"${user.full_name}"`,
        `"${user.phone_number}"`, 
        `"${user.email || ""}"`,
        `"${user.gender || ""}"`,
        `"${user.address || ""}"`,
        `"${new Date(user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}"`
      ].join(","))
    ].join("\n");

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Users report exported successfully",
    });
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

  if (paymentsLoading || usersLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const filteredPayments = getFilteredData();
  const totalUsers = users?.length || 0;
  const totalPayments = payments?.length || 0;
  const paidCount = payments?.filter(p => p.status === "paid").length || 0;
  const unpaidCount = payments?.filter(p => p.status === "unpaid").length || 0;
  const partialCount = payments?.filter(p => p.status === "partial").length || 0;
  
  // Calculate total amount from all payments
  const totalAmount = payments?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
            <CreditCard className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unpaidCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{partialCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Download reports in CSV format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={exportUsersToCSV}
              className="w-full justify-start"
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Export All Users
            </Button>
            
            <Button 
              onClick={() => exportToCSV(payments || [], "all_payments")}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export All Payments
            </Button>
            
            <Button 
              onClick={() => exportToCSV(payments?.filter(p => p.status === "paid") || [], "paid_users")}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Paid Users
            </Button>
            
            <Button 
              onClick={() => exportToCSV(payments?.filter(p => p.status === "unpaid") || [], "unpaid_users")}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Unpaid Users
            </Button>
            
            <Button 
              onClick={() => exportToCSV(payments?.filter(p => p.status === "partial") || [], "partial_payments")}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Partial Payments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Payment overview summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Payments</span>
                <span className="font-semibold">{totalPayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed</span>
                <span className="font-semibold text-green-600">{paidCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Outstanding</span>
                <span className="font-semibold text-destructive">{unpaidCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Partial</span>
                <span className="font-semibold text-orange-600">{partialCount}</span>
              </div>
                 <div className="flex justify-between items-center">
                <span>Total Amount</span>
                <span className="font-semibold text-blue-600">${totalAmount.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-semibold">
                    {totalPayments > 0 ? Math.round((paidCount / totalPayments) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Report</CardTitle>
          <CardDescription>
            Filter and view payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="unpaid">Unpaid Only</SelectItem>
                <SelectItem value="partial">Partial Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => exportToCSV(filteredPayments, `${reportType}_payments`)}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Filtered
            </Button>
          </div>

          {filteredPayments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No records found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}