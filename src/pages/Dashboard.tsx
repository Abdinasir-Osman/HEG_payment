import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, AlertTriangle } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { usePaymentStats } from "@/hooks/usePayments";

export default function Dashboard() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: stats, isLoading: statsLoading } = usePaymentStats();

  if (usersLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalPayments = stats?.total || 0;
  const paidCount = stats?.paid || 0;
  const unpaidCount = stats?.unpaid || 0;
  const partialCount = stats?.partial || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
            <p className="text-xs text-muted-foreground">
              Users with full payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Users</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unpaidCount}</div>
            <p className="text-xs text-muted-foreground">
              Users with no payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{partialCount}</div>
            <p className="text-xs text-muted-foreground">
              Users with outstanding balance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>Summary of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Paid</span>
                <span className="text-green-600 font-medium">{paidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Unpaid</span>
                <span className="text-destructive font-medium">{unpaidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Partial</span>
                <span className="text-orange-600 font-medium">{partialCount}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{totalPayments}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a 
                href="/register" 
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Register New User</div>
                <div className="text-sm text-muted-foreground">Add a new user to the system</div>
              </a>
              <a 
                href="/payments" 
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Record Payment</div>
                <div className="text-sm text-muted-foreground">Process a new payment</div>
              </a>
              <a 
                href="/reports" 
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-muted-foreground">Export payment reports</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}