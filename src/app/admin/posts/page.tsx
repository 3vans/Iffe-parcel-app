
'use client';

import { useState } from 'react';
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit2, Trash2, EyeOff, Flag, MessageSquare, Search, ShieldAlert } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManagedPost {
  id: string;
  title: string;
  authorName: string;
  status: 'Published' | 'Hidden' | 'Reported';
  publishDate: string;
  lastActivityDate: string;
  reportCount?: number;
}

interface ManagedComment {
  id: string;
  contentSnippet: string;
  authorName: string;
  onPostTitle: string;
  postId: string;
  status: 'Visible' | 'Hidden' | 'Reported';
  commentDate: string;
  reportCount?: number;
}

const mockPosts: ManagedPost[] = [
  { id: 'p1', title: 'The Future of Waste Management', authorName: 'Jane Doe', status: 'Published', publishDate: '2023-10-26', lastActivityDate: '2023-11-01', reportCount: 0 },
  { id: 'p2', title: 'Youth Voices: Leading Change', authorName: 'John Smith', status: 'Reported', publishDate: '2023-10-22', lastActivityDate: '2023-10-30', reportCount: 3 },
  { id: 'p3', title: 'Community Water Projects', authorName: 'Alice Green', status: 'Hidden', publishDate: '2023-10-18', lastActivityDate: '2023-10-20', reportCount: 0 },
  { id: 'p4', title: 'Tech for Good Initiatives', authorName: 'Bob The Builder', status: 'Published', publishDate: '2023-09-05', lastActivityDate: '2023-09-10', reportCount: 0 },
];

const mockComments: ManagedComment[] = [
  { id: 'c1', contentSnippet: 'Great article, very insightful...', authorName: 'Charlie Brown', onPostTitle: 'The Future of Waste Management', postId: 'p1', status: 'Visible', commentDate: '2023-10-27', reportCount: 0 },
  { id: 'c2', contentSnippet: 'This is inappropriate and off-topic...', authorName: 'Lucy Van Pelt', onPostTitle: 'Youth Voices: Leading Change', postId: 'p2', status: 'Reported', commentDate: '2023-10-25', reportCount: 5 },
  { id: 'c3', contentSnippet: 'I disagree with this point, but...', authorName: 'Linus Van Pelt', onPostTitle: 'Community Water Projects', postId: 'p3', status: 'Hidden', commentDate: '2023-10-19', reportCount: 1 },
  { id: 'c4', contentSnippet: 'Amazing work! Keep it up.', authorName: 'Patty Swanson', onPostTitle: 'Tech for Good Initiatives', postId: 'p4', status: 'Visible', commentDate: '2023-09-06', reportCount: 0 },
];


export default function AdminPostsPage() {
  const { toast } = useToast();
  const [searchTermPosts, setSearchTermPosts] = useState('');
  const [statusFilterPosts, setStatusFilterPosts] = useState('all');
  const [searchTermComments, setSearchTermComments] = useState('');
  const [statusFilterComments, setStatusFilterComments] = useState('all');

  const handlePostAction = (action: string, postTitle: string) => {
    toast({
      title: `Post Action: ${action}`,
      description: `Simulated '${action}' for post "${postTitle}". Implement actual logic.`,
      variant: action.toLowerCase().includes('delete') || action.toLowerCase().includes('hide') ? 'destructive' : 'default'
    });
  };
  
  const handleCommentAction = (action: string, commentId: string) => {
    toast({
      title: `Comment Action: ${action}`,
      description: `Simulated '${action}' for comment ID "${commentId}". Implement actual logic.`,
      variant: action.toLowerCase().includes('delete') || action.toLowerCase().includes('hide') ? 'destructive' : 'default'
    });
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTermPosts.toLowerCase()) || 
                          post.authorName.toLowerCase().includes(searchTermPosts.toLowerCase());
    const matchesStatus = statusFilterPosts === 'all' || post.status === statusFilterPosts;
    return matchesSearch && matchesStatus;
  });

  const filteredComments = mockComments.filter(comment => {
    const matchesSearch = comment.contentSnippet.toLowerCase().includes(searchTermComments.toLowerCase()) || 
                          comment.authorName.toLowerCase().includes(searchTermComments.toLowerCase());
    const matchesStatus = statusFilterComments === 'all' || comment.status === statusFilterComments;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: ManagedPost['status'] | ManagedComment['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'Published' || status === 'Visible') return 'default';
    if (status === 'Hidden') return 'secondary';
    if (status === 'Reported') return 'destructive';
    return 'outline';
  }


  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Content Moderation</CardTitle>
          <CardDescription>
            Manage existing posts and comments. Approvals for new posts are handled in the 'Approvals' section.
            This section allows admins to view, edit, hide/unhide, delete, and handle reported content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:max-w-md">
              <TabsTrigger value="posts">Manage Posts</TabsTrigger>
              <TabsTrigger value="comments">Manage Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Card className="mt-4 border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Post List</CardTitle>
                  <CardDescription>Filter and manage published or reported blog posts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative w-full sm:max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                          placeholder="Search by title or author..." 
                          className="pl-9"
                          value={searchTermPosts}
                          onChange={(e) => setSearchTermPosts(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilterPosts} onValueChange={setStatusFilterPosts}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Hidden">Hidden</SelectItem>
                        <SelectItem value="Reported">Reported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.authorName}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(post.status)} className="capitalize">
                                {post.status === 'Reported' && <ShieldAlert className="h-3 w-3 mr-1.5" />}
                                {post.status}
                                {post.status === 'Reported' && post.reportCount && post.reportCount > 0 && ` (${post.reportCount})`}
                              </Badge>
                            </TableCell>
                            <TableCell>{post.publishDate}</TableCell>
                            <TableCell>{post.lastActivityDate}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" title="View Post" asChild>
                                <Link href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePostAction('Edit', post.title)} title="Edit Post"><Edit2 className="h-4 w-4" /></Button>
                              {post.status === 'Hidden' ?
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handlePostAction('Unhide', post.title)} title="Unhide Post"><Eye className="h-4 w-4" /></Button>
                                :
                                <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600" onClick={() => handlePostAction('Hide', post.title)} title="Hide Post"><EyeOff className="h-4 w-4" /></Button>
                              }
                              {post.status === 'Reported' && (
                                <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-600" onClick={() => handlePostAction('View Reports', post.title)} title="View Reports"><Flag className="h-4 w-4" /></Button>
                              )}
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handlePostAction('Delete', post.title)} title="Delete Post"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredPosts.length === 0 && (
                           <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No posts match current filters.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="mt-4 border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Comment List</CardTitle>
                  <CardDescription>Filter and moderate comments from various posts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative w-full sm:max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search by content or author..." 
                          className="pl-9"
                          value={searchTermComments}
                          onChange={(e) => setSearchTermComments(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilterComments} onValueChange={setStatusFilterComments}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Visible">Visible</SelectItem>
                        <SelectItem value="Hidden">Hidden</SelectItem>
                        <SelectItem value="Reported">Reported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Comment Snippet</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>On Post</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredComments.map((comment) => (
                          <TableRow key={comment.id}>
                            <TableCell className="font-medium truncate max-w-xs" title={comment.contentSnippet}>{comment.contentSnippet}</TableCell>
                            <TableCell>{comment.authorName}</TableCell>
                            <TableCell><a href={`/blog/${comment.postId}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{comment.onPostTitle}</a></TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(comment.status)} className="capitalize">
                                {comment.status === 'Reported' && <ShieldAlert className="h-3 w-3 mr-1.5" />}
                                {comment.status}
                                {comment.status === 'Reported' && comment.reportCount && comment.reportCount > 0 && ` (${comment.reportCount})`}
                                </Badge>
                            </TableCell>
                            <TableCell>{comment.commentDate}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleCommentAction('View on Post', comment.id)} title="View Comment on Post"><MessageSquare className="h-4 w-4" /></Button>
                              {comment.status === 'Hidden' ?
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleCommentAction('Unhide', comment.id)} title="Unhide Comment"><Eye className="h-4 w-4" /></Button>
                                :
                                <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600" onClick={() => handleCommentAction('Hide', comment.id)} title="Hide Comment"><EyeOff className="h-4 w-4" /></Button>
                              }
                              {comment.status === 'Reported' && (
                                <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-600" onClick={() => handleCommentAction('View Reports', comment.id)} title="View Reports"><Flag className="h-4 w-4" /></Button>
                              )}
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleCommentAction('Delete', comment.id)} title="Delete Comment"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredComments.length === 0 && (
                           <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No comments match current filters.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
