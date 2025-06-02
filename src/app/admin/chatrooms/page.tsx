
// src/app/admin/chatrooms/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminChatroomsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Chatroom Monitoring</CardTitle>
          <CardDescription>Oversee active chatrooms, manage users, and moderate messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chatroom monitoring tools and active room list will appear here.</p>
           <p className="text-muted-foreground mt-2">This section will allow admins to:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 ml-4">
                <li>View a list of all active chatrooms.</li>
                <li>Join chatrooms as an administrator.</li>
                <li>Mute, kick, or ban users from specific chatrooms.</li>
                <li>Delete inappropriate messages.</li>
                <li>View chat logs (if implemented).</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
