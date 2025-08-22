import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { useUsers, useDeleteUser, useSearchUsers, useUpdateUser } from "@/hooks/useUsers";
import { usePayments } from "@/hooks/usePayments";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    gender: "",
    address: "",
  });
  
  const { data: allUsers, isLoading: allUsersLoading } = useUsers();
  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(searchTerm);
  const { data: payments } = usePayments();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const users = searchTerm.trim() ? searchResults : allUsers;
  const isLoading = searchTerm.trim() ? searchLoading : allUsersLoading;

  const getUserPaymentStatus = (userId: string) => {
    // Get all payments for this user
    const userPaymentRecords = payments?.filter(payment => payment.user_id === userId) || [];
    
    if (userPaymentRecords.length === 0) return "unpaid";
    
    // Check if user has any paid payments
    const hasPaid = userPaymentRecords.some(payment => payment.status === "paid");
    const hasPartial = userPaymentRecords.some(payment => payment.status === "partial");
    const hasUnpaid = userPaymentRecords.some(payment => payment.status === "unpaid");
    
    if (hasPaid) return "paid";
    if (hasPartial) return "partial";
    if (hasUnpaid) return "unpaid";
    
    return "unpaid";
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

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email || "",
      gender: user.gender || "",
      address: user.address || "",
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser || !editFormData.full_name || !editFormData.phone_number) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        userData: {
          full_name: editFormData.full_name,
          phone_number: editFormData.phone_number,
          email: editFormData.email || null,
          gender: editFormData.gender || null,
          address: editFormData.address || null,
        },
      });

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setShowEditDialog(false);
      setEditingUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser.mutateAsync(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };



  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button onClick={() => navigate("/register")}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Search & Management</CardTitle>
          <CardDescription>
            Search by name, phone number, or email. Click on a row to view payment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {users && users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell className="capitalize">{user.gender || "N/A"}</TableCell>
                      <TableCell>
                        {getStatusBadge(getUserPaymentStatus(user.id))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/payments?user=${user.id}`);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            title="View user payments"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="hover:bg-green-50 hover:text-green-600"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id, user.full_name);
                            }}
                            disabled={deleteUser.isPending}
                            className="hover:bg-red-50 hover:text-red-600"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm.trim() ? "No users found matching your search." : "No users registered yet."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={editFormData.full_name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={editFormData.phone_number}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={editFormData.gender} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? "Updating..." : "Update User"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}