
// src/app/admin/posts/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Content Moderation</CardTitle>
          <CardDescription>Manage existing posts, comments, and other user-generated content. Approvals for new posts are handled in the 'Approvals' section.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Content moderation tools will be available here.</p>
          <p className="text-muted-foreground mt-2">This section will allow admins to:</p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 ml-4">
            <li>View a list of all published blog posts.</li>
            <li>Edit or delete existing blog posts.</li>
            <li>View and moderate comments on posts.</li>
            <li>Handle reported content.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
