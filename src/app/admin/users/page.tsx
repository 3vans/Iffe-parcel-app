
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit2, Trash2, UserCheck, UserX } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'community' | 'online' | 'admin';
  status: 'pending' | 'approved' | 'suspended';
  clubName?: string;
  signupDate: string;
}

const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'admin', status: 'approved', signupDate: '2023-01-10' },
  { id: 'u2', name: 'Bob The Builder', email: 'bob@example.com', role: 'community', status: 'approved', clubName: 'Rotaract Club of Townsville', signupDate: '2023-02-15' },
  { id: 'u3', name: 'Charlie Chaplin', email: 'charlie@example.com', role: 'user', status: 'approved', signupDate: '2023-03-20' },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', role: 'online', status: 'approved', signupDate: '2023-04-05' },
  { id: 'u5', name: 'Edward Scissorhands', email: 'edward@example.com', role: 'community', status: 'pending', clubName: 'Rotaract Club of Suburbia', signupDate: '2023-05-01' },
  { id: 'u6', name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'user', status: 'suspended', signupDate: '2023-05-10' },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleAction = (action: string, userName: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Simulated '${action}' for user ${userName}. Implement actual logic.`,
    });
  };
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">User Management</CardTitle>
          <CardDescription>View, filter, and manage all platform users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input 
              placeholder="Search by name or email..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="online">e-Rotaract Online</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Signed Up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'approved' ? 'default' : user.status === 'pending' ? 'outline' : 'destructive'}
                        className={cn(user.status === 'approved' && 'bg-green-500/20 text-green-700 border-green-500/30', user.status === 'pending' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30')}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.clubName || 'N/A'}</TableCell>
                    <TableCell>{user.signupDate}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleAction('View Profile', user.name)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction('Edit User', user.name)}><Edit2 className="h-4 w-4" /></Button>
                      {user.status !== 'suspended' ? 
                        <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600" onClick={() => handleAction('Suspend User', user.name)}><UserX className="h-4 w-4" /></Button>
                        :
                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={() => handleAction('Unsuspend User', user.name)}><UserCheck className="h-4 w-4" /></Button>
                      }
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleAction('Delete User', user.name)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No users match the current filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
