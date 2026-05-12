
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Plus, Loader2, UserPlus, ShieldAlert, Lock, Star, ShieldX, Trash2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { fetchAllUsers, createUserProfile, updateUserProfile, fetchCampaigns, type UserProfile, type Campaign } from '@/lib/services/cms-service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Required for creating users without signing out the admin
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    email: '',
    displayName: '',
    password: '',
    tier: 'user' as 'user' | 'creator' | 'admin',
    level: 'Novice Explorer',
    points: 0,
    assignedExpedition: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, campData] = await Promise.all([
        fetchAllUsers(),
        fetchCampaigns()
      ]);
      setUsers(userData);
      setCampaigns(campData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    const isCurrentlySuspended = user.status === 'suspended';
    const newStatus = isCurrentlySuspended ? 'approved' : 'suspended';
    
    if (!isCurrentlySuspended && !confirm("Permanently suspend this traveler's access? They will be blocked from their dashboard until manually un-suspended.")) {
        return;
    }

    setProcessingId(user.id);
    try {
        await updateUserProfile(user.id, { status: newStatus });
        toast({ 
            title: isCurrentlySuspended ? 'Access Restored' : 'Account Suspended', 
            description: isCurrentlySuspended ? `Enabled access for ${user.displayName}.` : `Revoked all access for ${user.displayName} (Permanent until un-suspended).`
        });
        await loadData();
    } catch (err) {
        toast({ title: "Operation failed", description: "Check permissions or database connection.", variant: "destructive" });
    } finally {
        setProcessingId(null);
    }
  };

  const handleCreateTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.displayName || !newUser.password) {
        toast({ title: "Validation Error", description: "Email, Name and Password are required.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, `SecondaryApp-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName: newUser.displayName });

      await createUserProfile(uid, {
        email: newUser.email,
        displayName: newUser.displayName,
        isCreator: newUser.tier === 'creator' || newUser.tier === 'admin',
        isAdmin: newUser.tier === 'admin',
        level: newUser.level,
        points: newUser.points,
        bio: newUser.assignedExpedition ? `Assigned to: ${newUser.assignedExpedition}` : 'New explorer at iffe-travels.'
      });
      
      toast({ 
        title: "Account Created Successfully", 
        description: `Registered ${newUser.displayName} as ${newUser.tier === 'admin' ? 'Admin' : newUser.tier === 'creator' ? 'Club Member' : 'Standard Traveler'}.` 
      });
      
      setIsCreateModalOpen(false);
      setNewUser({ email: '', displayName: '', password: '', tier: 'user', level: 'Novice Explorer', points: 0, assignedExpedition: '' });
      await loadData();
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
    const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' && user.isAdmin) || (roleFilter === 'creator' && user.isCreator && !user.isAdmin);
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
            <div className="relative flex-grow">
               <Input 
                placeholder="Search by name or email..." 
                className="w-full h-11 rounded-xl pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-45" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl">
                <SelectValue placeholder="Filter by Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="creator">Explorer Club (Verified)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Account Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold">{user.displayName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                        <Badge 
                          variant={user.isAdmin ? 'destructive' : user.isCreator ? 'default' : 'secondary'} 
                          className={cn(
                            "uppercase text-[9px] font-black px-2.5 py-0.5",
                            user.isCreator && !user.isAdmin ? "bg-accent text-accent-foreground" : ""
                          )}
                        >
                            {user.isAdmin ? 'Admin' : user.isCreator ? "Club Member" : "Standard"}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'suspended' ? 'destructive' : 'outline'}
                        className={cn(
                            "capitalize text-[10px] border-primary/20 flex items-center w-fit gap-1",
                            user.status === 'suspended' ? "bg-red-50 text-red-600 border-red-200" : ""
                        )}
                      >
                        {user.status === 'suspended' && <ShieldX className="h-2.5 w-2.5" />}
                        {user.status || 'Active'}
                        {user.status === 'suspended' && <span className="ml-1 text-[8px] font-black opacity-60">(PERMANENT)</span>}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                      {user.level || 'Novice'} ({user.points || 0} pts)
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleStatus(user)} 
                        disabled={processingId === user.id}
                        title={user.status === 'suspended' ? 'Unsuspend' : 'Suspend Access (Permanent)'}
                        className={user.status === 'suspended' ? "text-green-600" : "text-orange-500"}
                      >
                        {processingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.status === 'suspended' ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <ShieldAlert className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-20 italic">No users found matching your search.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-xl border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary uppercase font-black">Register New Traveler</DialogTitle>
                <DialogDescription>Create a viable client account with a linked tier and expedition interest.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTraveler} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Tier</Label>
                      <Select value={newUser.tier} onValueChange={(val: any) => setNewUser(prev => ({ ...prev, tier: val }))}>
                          <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Choose Role" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="user">Standard Traveler</SelectItem>
                              <SelectItem value="creator">Explorer's Club (Verified Member)</SelectItem>
                              <SelectItem value="admin">Platform Administrator</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temporary Password</Label>
                      <div className="relative">
                          <Input 
                              type="password"
                              value={newUser.password} 
                              onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Min 6 chars"
                              required
                              className="h-11 rounded-xl pr-10"
                          />
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                    <Star className="h-3 w-3" /> Advanced Classification
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Starting Level</Label>
                        <Select value={newUser.level} onValueChange={(val) => setNewUser(prev => ({ ...prev, level: val }))}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Novice Explorer">Novice Explorer</SelectItem>
                                <SelectItem value="Bronze Traveler">Bronze Traveler</SelectItem>
                                <SelectItem value="Silver Scout">Silver Scout</SelectItem>
                                <SelectItem value="Gold Pathfinder">Gold Pathfinder</SelectItem>
                                <SelectItem value="Elite Voyager">Elite Voyager</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initial Impact Points</Label>
                        <Input 
                            type="number"
                            value={newUser.points} 
                            onChange={e => setNewUser(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                            className="h-11 rounded-xl"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Tour Association (Optional)</Label>
                      <Select value={newUser.assignedExpedition} onValueChange={(val) => setNewUser(prev => ({ ...prev, assignedExpedition: val }))}>
                          <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Associate with an expedition for tracking..." />
                          </SelectTrigger>
                          <SelectContent>
                              {campaigns.map(c => (
                                <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                              ))}
                              {campaigns.length === 0 && <SelectItem value="none" disabled>No expeditions found</SelectItem>}
                          </SelectContent>
                      </Select>
                  </div>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] text-accent font-black uppercase tracking-widest">Viable Credential Notice</p>
                      <p className="text-[10px] text-accent/80 leading-relaxed font-medium">
                          This creates a functional <strong>Firebase Auth</strong> record. The traveler can immediately log in to access their assigned itineraries and track the planning process.
                      </p>
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex-grow" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                        {isSubmitting ? "Processing..." : "Register & Provision User"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
