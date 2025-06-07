

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, BarChart3, Bookmark, CalendarCheck2, Edit, ExternalLink, Eye, HandHeart, MessageSquare, Settings, ShieldCheck as ShieldCheckIcon, Star, UserPlus, UserCircle } from 'lucide-react';
import VerifiedBadge from '@/components/verified-badge'; // New import

// Mock data
const userData = {
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'smiling person',
  email: 'alex.johnson@example.com',
  memberSince: 'January 15, 2023',
  impactPoints: 1250,
  level: 'Gold Contributor',
  nextLevelPoints: 2000,
  isERotaractMember: true, // Added for badge logic
  isCreator: false, // Added for "Become a Creator"
};

const joinedCampaigns = [
  { id: '1', title: 'Clean Water Initiative', status: 'Ongoing', progress: 60, role: 'Volunteer Fundraiser' },
  { id: '3', title: 'Reforestation "Green Future"', status: 'Completed', progress: 100, role: 'Tree Planter' },
];

const followedContent = [
  { id: 'c1', type: 'Creator', name: 'Eco Warriors Uganda', link: '/dashboard' }, // Changed from /profile/c1
  { id: 'r1', type: 'Chatroom', name: 'Plastic Recycling Hub', link: '/chat' }, // Changed from /chat/r1
  { id: 'b2', type: 'Blog Post', name: 'Youth Voices: Leading Change', link: '/blog/2' }, // Will link to /blog/[id]
];

const milestones = [
  { name: 'First Campaign Joined', achieved: true, date: 'Feb 01, 2023' },
  { name: '1000 Impact Points', achieved: true, date: 'Aug 20, 2023' },
  { name: 'Led a Discussion', achieved: false },
  { name: 'Submitted First Blog Post', achieved: true, date: 'Sep 05, 2023' },
  { name: 'Became e-Rotaract Member', achieved: userData.isERotaractMember, date: userData.isERotaractMember ? 'Nov 10, 2023' : undefined }
];

const volunteeringRecord = [
  { activity: 'Tree Planting Day', hours: 5, date: 'May 10, 2023', campaign: 'Green Future' },
  { activity: 'Fundraising Booth', hours: 8, date: 'July 22, 2023', campaign: 'Clean Water Initiative' },
];

export default function DashboardPage() {
  const progressToNextLevel = (userData.impactPoints / userData.nextLevelPoints) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} data-ai-hint={userData.dataAiHint} />
            <AvatarFallback>{userData.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary flex items-center">
              {userData.name} {userData.isERotaractMember && <VerifiedBadge className="ml-2" size={24} />}
            </h1>
            <p className="text-muted-foreground">{userData.email}</p>
            <p className="text-sm text-muted-foreground">Member since: {userData.memberSince}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
                <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                {userData.isERotaractMember && !userData.isCreator && (
                  <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <UserPlus className="w-4 h-4 mr-2" /> Become a Creator
                  </Button>
                )}
            </div>
          </div>
        </div>
      </section>

      {userData.isERotaractMember && (
        <section>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><Award className="mr-2 h-5 w-5 text-accent"/>Impact Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-baseline">
                  <p className="text-4xl font-bold text-accent">{userData.impactPoints.toLocaleString()}</p>
                  <p className="text-lg text-muted-foreground">Impact Points</p>
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-primary">{userData.level}</span>
                      <span className="text-muted-foreground">{userData.nextLevelPoints.toLocaleString()} pts to next level</span>
                  </div>
                  <Progress value={progressToNextLevel} aria-label="Progress to next level" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-accent"/>My Campaigns</CardTitle>
            <CardDescription>Track your involvement in various initiatives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {joinedCampaigns.map(campaign => (
              <div key={campaign.id} className="p-3 bg-muted/30 rounded-md border">
                <div className="flex justify-between items-center mb-1">
                  <Link href={`/campaigns/${campaign.id}`} className="font-semibold text-primary hover:underline">{campaign.title}</Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${campaign.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{campaign.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Role: {campaign.role}</p>
                <Progress value={campaign.progress} className="h-1.5" />
              </div>
            ))}
            {joinedCampaigns.length === 0 && <p className="text-muted-foreground text-sm">You haven't joined any campaigns yet.</p>}
          </CardContent>
           <CardFooter>
                <Button variant="link" asChild className="text-accent hover:text-accent/80 px-0">
                    <Link href="/campaigns">Explore Campaigns <ExternalLink className="ml-1.5 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><ShieldCheckIcon className="mr-2 h-5 w-5 text-accent"/>Impact Milestones</CardTitle>
            <CardDescription>Celebrate your achievements within the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map(milestone => (
              <div key={milestone.name} className={`flex items-center p-2 rounded ${milestone.achieved ? 'bg-green-50 border-l-4 border-green-500' : 'bg-muted/30'}`}>
                <Star className={`h-5 w-5 mr-3 ${milestone.achieved ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground'}`} />
                <div>
                  <p className={`font-medium ${milestone.achieved ? 'text-green-700' : 'text-foreground'}`}>{milestone.name}</p>
                  {milestone.achieved && milestone.date && <p className="text-xs text-green-600">Achieved: {milestone.date}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><CalendarCheck2 className="mr-2 h-5 w-5 text-accent"/>Volunteering Record</CardTitle>
            <CardDescription>Keep track of your valuable contributions.</CardDescription>
          </CardHeader>
          <CardContent>
             {volunteeringRecord.length > 0 ? (
                <ul className="space-y-3">
                    {volunteeringRecord.map(record => (
                        <li key={`${record.activity}-${record.date}`} className="flex justify-between items-center p-3 bg-muted/30 rounded-md border">
                            <div>
                                <p className="font-medium text-primary">{record.activity} <span className="text-xs text-muted-foreground">({record.campaign})</span></p>
                                <p className="text-xs text-muted-foreground">{record.date}</p>
                            </div>
                            <p className="font-semibold text-accent">{record.hours} hrs</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">No volunteering activities recorded yet.</p>
            )}
          </CardContent>
           <CardFooter>
                <Button variant="outline">Log New Activity</Button>
            </CardFooter>
        </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Bookmark className="mr-2 h-5 w-5 text-accent"/>Followed Content</CardTitle>
          <CardDescription>Quick access to your favorite creators, rooms, and posts.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {followedContent.map(item => (
            <Link href={item.link} key={item.id} className="block p-3 bg-muted/30 rounded-md border hover:bg-muted/50 transition-colors">
              <div className="flex items-center mb-1">
                {item.type === 'Creator' && <UserCircle className="h-4 w-4 mr-2 text-primary" />}
                {item.type === 'Chatroom' && <MessageSquare className="h-4 w-4 mr-2 text-primary" />}
                {item.type === 'Blog Post' && <Edit className="h-4 w-4 mr-2 text-primary" />}
                <span className="text-xs font-semibold text-muted-foreground">{item.type}</span>
              </div>
              <p className="font-medium text-primary truncate">{item.name}</p>
            </Link>
          ))}
          {followedContent.length === 0 && <p className="text-muted-foreground text-sm col-span-full">You are not following any content yet.</p>}
        </CardContent>
      </Card>

    </div>
  );
}
