
// src/app/admin/page.tsx (Overview Page)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/stat-card"; // Assuming you have or will create this
import { Users, CheckCircle2, FileText, Activity, Hourglass } from "lucide-react";

// Mock Data for Stats
const mockStats = {
  totalUsers: 1250,
  approvedCommunityMembers: 350,
  onlineMembers: 85, // This might mean e-Rotaract Online members
  totalPosts: 780,
  pendingApprovals: 15, // Combined pending members + posts
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-primary">Admin Overview</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={mockStats.totalUsers.toLocaleString()} icon={Users} description="All registered users" />
        <StatCard title="Community Members" value={mockStats.approvedCommunityMembers.toLocaleString()} icon={CheckCircle2} description="Approved Rotaract Club members" />
        <StatCard title="e-Rotaract Online Members" value={mockStats.onlineMembers.toLocaleString()} icon={Activity} description="Paid e-Rotaract members" />
        <StatCard title="Total Posts" value={mockStats.totalPosts.toLocaleString()} icon={FileText} description="Blog posts & other content" />
        <StatCard title="Pending Approvals" value={mockStats.pendingApprovals.toLocaleString()} icon={Hourglass} description="Memberships & posts awaiting review" />
      </div>

      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of recent important actions will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Recent activity feed placeholder...</p>
          {/* Example: List of recent signups, posts, approvals */}
        </CardContent>
      </Card>

      {/* More sections can be added here, e.g., quick links to common tasks */}
    </div>
  );
}
