
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingMember {
  id: string;
  name: string;
  email: string;
  clubName: string;
  signupDate: string;
}

const mockPendingMembers: PendingMember[] = [
  { id: 'm1', name: 'Eve Adams', email: 'eve@example.com', clubName: 'Rotaract Club of Metropolis', signupDate: '2023-06-01' },
  { id: 'm2', name: 'Frank Castle', email: 'frank@example.com', clubName: 'Rotaract Club of Gotham', signupDate: '2023-06-05' },
];

interface PendingPost {
  id: string;
  title: string;
  authorName: string;
  authorRole: string;
  submissionDate: string;
}
const mockPendingPosts: PendingPost[] = [
  { id: 'p1', title: 'My Thoughts on Community Engagement', authorName: 'Bob The Builder', authorRole: 'Community', submissionDate: '2023-06-02' },
  { id: 'p2', title: 'Innovative Recycling Project Idea', authorName: 'Diana Prince', authorRole: 'e-Rotaract Online', submissionDate: '2023-06-06' },
];


export default function AdminApprovalsPage() {
  const { toast } = useToast();

  const handleMemberAction = (action: 'Approve' | 'Reject', memberName: string) => {
    toast({
      title: `Member ${action}d`,
      description: `Simulated ${action.toLowerCase()} for ${memberName}. Implement actual logic.`,
      variant: action === 'Approve' ? 'default' : 'destructive',
    });
    // In a real app, you'd update the state/DB here
  };

  const handlePostAction = (action: 'Approve' | 'Reject' | 'Preview', postTitle: string) => {
     toast({
      title: `Post ${action}d`,
      description: `Simulated ${action.toLowerCase()} for post "${postTitle}". Implement actual logic.`,
      variant: action === 'Approve' ? 'default' : action === 'Reject' ? 'destructive' : 'default',
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-primary">Approval Management</h1>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger value="members">Pending Members</TabsTrigger>
          <TabsTrigger value="posts">Pending Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Pending Community Member Applications</CardTitle>
              <CardDescription>Review and approve or reject new community member sign-ups.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Club Name</TableHead>
                      <TableHead>Signup Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.clubName}</TableCell>
                        <TableCell>{member.signupDate}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleMemberAction('Approve', member.name)}>
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleMemberAction('Reject', member.name)}>
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     {mockPendingMembers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No pending member applications.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Pending Community Post Approvals</CardTitle>
              <CardDescription>Review and approve or reject submitted blog posts or other content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Author Role</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.authorName}</TableCell>
                        <TableCell>{post.authorRole}</TableCell>
                        <TableCell>{post.submissionDate}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handlePostAction('Preview', post.title)}><Eye className="h-5 w-5" /></Button>
                           <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handlePostAction('Approve', post.title)}>
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handlePostAction('Reject', post.title)}>
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockPendingPosts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No pending posts for approval.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
