
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit2, Trash2, UserCheck, UserX, Plus, Loader2, UserPlus, ShieldAlert } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { fetchAllUsers, createUserProfile, updateUserProfile, type UserProfile } from '@/lib/services/cms-service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    displayName: '',
    isCreator: false,
    isAdmin: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    const newStatus = user.status === 'suspended' ? 'approved' : 'suspended';
    try {
        await updateUserProfile(user.id, { status: newStatus });
        toast({ title: `User ${newStatus === 'approved' ? 'Unsuspended' : 'Suspended'}` });
        loadUsers();
    } catch (err) {
        toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  const handleCreateTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.displayName) return;
    
    setIsSubmitting(true);
    try {
      // In this prototype, we simulate creation by adding a Firestore profile.
      // The traveler will "claim" this email when they sign up with the same email.
      const mockUid = `traveler_${Date.now()}`;
      await createUserProfile(mockUid, newUser);
      
      toast({ 
        title: "Traveler Profile Created", 
        description: "The client can now register with this email to access their dashboard." 
      });
      setIsCreateModalOpen(false);
      setNewUser({ email: '', displayName: '', isCreator: false, isAdmin: false });
      loadUsers();
    } catch (err) {
        toast({ title: "Failed to create profile", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' && user.isAdmin) || (roleFilter === 'creator' && user.isCreator);
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary">Traveler Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary">
            <UserPlus className="mr-2 h-4 w-4" /> Create Traveler
        </Button>
      </div>

      <Card className="transition-all duration-300 ease-out hover:shadow-lg">
        <CardHeader>
          <CardTitle>User Database</CardTitle>
          <CardDescription>Monitor platform access and traveler tiers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input 
              placeholder="Search by name or email..." 
              className="w-full sm:max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="creator">Explorer Club</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-bold">{user.displayName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.isAdmin ? 'destructive' : 'secondary'} className="uppercase text-[9px] font-black">
                            {user.isAdmin ? 'Admin' : user.isCreator ? "Club Member" : "Traveler"}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'suspended' ? 'destructive' : 'default'}
                        className="capitalize text-[10px]"
                      >
                        {user.status || 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-stone-500 font-medium">{user.memberSince}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user)}>
                        {user.status === 'suspended' ? <UserCheck className="h-4 w-4 text-green-600" /> : <UserX className="h-4 w-4 text-orange-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-20 italic">No users found in the registry.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add New Traveler</DialogTitle>
                <DialogDescription>Manually create a profile for a client.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTraveler} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                        value={newUser.displayName} 
                        onChange={e => setNewUser(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="e.g. Jane Doe"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                        type="email"
                        value={newUser.email} 
                        onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jane@example.com"
                        required
                    />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="isCreator" 
                        checked={newUser.isCreator} 
                        onChange={e => setNewUser(prev => ({ ...prev, isCreator: e.target.checked }))}
                    />
                    <Label htmlFor="isCreator" className="text-xs">Add to Explorer's Club (Member Tier)</Label>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        This creates a profile placeholder. The client must still register via the website using this email to set their own password and claim the account.
                    </p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Profile"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
