
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit2, Trash2, UserCheck, UserX, Plus, Loader2, UserPlus, ShieldAlert, Lock } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { fetchAllUsers, createUserProfile, updateUserProfile, type UserProfile } from '@/lib/services/cms-service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Required for creating users without signing out the admin
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

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
    password: '',
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
    if (!newUser.email || !newUser.displayName || !newUser.password) {
        toast({ title: "Validation Error", description: "Email, Name and Password are required.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    
    // To create a user without signing out the current admin session, 
    // we use a secondary Firebase app instance.
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, `SecondaryApp-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);
      
      // 1. Create the real Auth user
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      // 2. Set the display name in Auth
      await updateProfile(userCredential.user, { displayName: newUser.displayName });

      // 3. Create the Firestore profile linked to the UID
      await createUserProfile(uid, {
        email: newUser.email,
        displayName: newUser.displayName,
        isCreator: newUser.isCreator,
        isAdmin: newUser.isAdmin,
      });
      
      toast({ 
        title: "Viable Account Created", 
        description: `Successfully registered ${newUser.displayName}. They can now login using their email and password.` 
      });
      
      setIsCreateModalOpen(false);
      setNewUser({ email: '', displayName: '', password: '', isCreator: false, isAdmin: false });
      loadUsers();
    } catch (err: any) {
        console.error("Auth Creation Snag:", err);
        toast({ 
            title: "Registration Failed", 
            description: err.message || "Ensure password is at least 6 characters and email is unique.", 
            variant: "destructive" 
        });
    } finally {
        if (secondaryApp) {
            await deleteApp(secondaryApp);
        }
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
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <UserPlus className="mr-2 h-4 w-4" /> Create Traveler Account
        </Button>
      </div>

      <Card className="transition-all duration-300 ease-out hover:shadow-lg border-primary/5">
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
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
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
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user)} title={user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}>
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
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary uppercase font-black">Add New Traveler</DialogTitle>
                <DialogDescription>Register a new client account in Firebase Auth.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTraveler} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <Input 
                        value={newUser.displayName} 
                        onChange={e => setNewUser(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="e.g. Jane Doe"
                        required
                        className="h-11 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                    <Input 
                        type="email"
                        value={newUser.email} 
                        onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jane@example.com"
                        required
                        className="h-11 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temporary Password</Label>
                    <div className="relative">
                        <Input 
                            type="password"
                            value={newUser.password} 
                            onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Min 6 characters"
                            required
                            className="h-11 rounded-xl pr-10"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="isCreator" 
                        checked={newUser.isCreator} 
                        onChange={e => setNewUser(prev => ({ ...prev, isCreator: e.target.checked }))}
                        className="h-4 w-4 rounded border-primary/20 accent-primary"
                    />
                    <Label htmlFor="isCreator" className="text-xs font-bold text-primary">Add to Explorer's Club (Verified Tier)</Label>
                </div>
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-[10px] text-accent/80 leading-relaxed font-medium">
                        This will create a <strong>viable account</strong>. The client can immediately use these credentials to log in and track their safari progress.
                    </p>
                </div>
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register traveler"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
