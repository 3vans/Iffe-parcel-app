

'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Award, BarChart3, Bookmark, CalendarCheck2, Edit, ExternalLink, Eye, HandHeart, MessageSquare, Settings, ShieldCheck as ShieldCheckIcon, Star, UserPlus, UserCircle, Mountain, MapPin } from 'lucide-react';
import VerifiedBadge from '@/components/verified-badge'; 
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

// Mock data
const userData = {
  name: 'Alex Johnson',
  avatarUrl: placeholderImages.dashboardAvatar.src,
  avatarWidth: placeholderImages.dashboardAvatar.width,
  avatarHeight: placeholderImages.dashboardAvatar.height,
  dataAiHint: placeholderImages.dashboardAvatar.hint,
  email: 'alex.johnson@example.com',
  memberSince: 'January 15, 2023',
  impactPoints: 1250,
  level: 'Gold Explorer',
  nextLevelPoints: 2000,
  isERotaractMember: true, 
  isCreator: false, 
};

const joinedCampaigns = [
  { id: '1', title: 'Serengeti Great Migration', status: 'Booked', progress: 100, role: 'Upcoming Traveler' },
  { id: '3', title: 'Okavango Delta Mokoro Trip', status: 'Completed', progress: 100, role: 'Past Traveler' },
];

const followedContent = [
  { id: 'c1', type: 'Guide', name: 'Safari Jane', link: '/profile' }, 
  { id: 'r1', type: 'Discussion', name: 'Birdwatching Hotspots', link: '/chat' }, 
  { id: 'b2', type: 'Journal Entry', name: 'A Lion\'s Tale', link: '/blog/2' }, 
];

const milestones = [
  { name: 'First Trip Booked', achieved: true, date: 'Feb 01, 2023' },
  { name: '1000 Explorer Points', achieved: true, date: 'Aug 20, 2023' },
  { name: 'Visited East Africa', achieved: true, date: 'Mar 15, 2024' },
  { name: 'Submitted a Travel Story', achieved: false },
  { name: 'Joined Explorer\'s Club', achieved: userData.isERotaractMember, date: userData.isERotaractMember ? 'Nov 10, 2023' : undefined }
];

const volunteeringRecord = [
  { activity: 'Serengeti Safari', hours: 7, date: 'March 10, 2024', campaign: '7 Days' },
  { activity: 'Okavango Delta Trip', hours: 5, date: 'July 22, 2023', campaign: '5 Days' },
];

const AnimatedCard = ({ children, className, ...props }: { children: React.ReactNode, className?: string;[key: string]: any }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <Card ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in', className)} {...props}>
            {children}
        </Card>
    );
};

export default function DashboardPage() {
  const progressToNextLevel = (userData.impactPoints / userData.nextLevelPoints) * 100;
  const [headerRef, isHeaderVisible] = useScrollAnimation();


  return (
    <div className="space-y-8 animate-fade-in">
      <section ref={headerRef} className={cn('scroll-animate bg-card p-6 rounded-lg shadow-lg', isHeaderVisible && 'scroll-animate-in')}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage asChild src={userData.avatarUrl} alt={userData.name}>
              <Image src={userData.avatarUrl} alt={userData.name} width={userData.avatarWidth} height={userData.avatarHeight} data-ai-hint={userData.dataAiHint} />
            </AvatarImage>
            <AvatarFallback>{userData.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary flex items-center">
              {userData.name} {userData.isERotaractMember && <VerifiedBadge className="ml-2" size={24} />}
            </h1>
            <p className="text-muted-foreground">{userData.email}</p>
            <p className="text-sm text-muted-foreground">Explorer since: {userData.memberSince}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
                <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                {userData.isERotaractMember && !userData.isCreator && (
                  <Button asChild variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/blog/submit">
                      <UserPlus className="w-4 h-4 mr-2" /> Share Your Stories
                    </Link>
                  </Button>
                )}
            </div>
          </div>
        </div>
      </section>

      {userData.isERotaractMember && (
        <section>
          <AnimatedCard className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><Award className="mr-2 h-5 w-5 text-accent"/>Explorer Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-baseline">
                  <p className="text-4xl font-bold text-accent">{userData.impactPoints.toLocaleString()}</p>
                  <p className="text-lg text-muted-foreground">Explorer Points</p>
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-primary">{userData.level}</span>
                      <span className="text-muted-foreground">{userData.nextLevelPoints.toLocaleString()} pts to next level</span>
                  </div>
                  <Progress value={progressToNextLevel} aria-label="Progress to next level" />
              </div>
            </CardContent>
          </AnimatedCard>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <AnimatedCard className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><Mountain className="mr-2 h-5 w-5 text-accent"/>My Trips</CardTitle>
            <CardDescription>Keep track of your past and upcoming adventures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {joinedCampaigns.map(campaign => (
              <div key={campaign.id} className="p-3 bg-muted/30 rounded-md border">
                <div className="flex justify-between items-center mb-1">
                  <Link href={`/campaigns/${campaign.id}`} className="font-semibold text-primary hover:underline">{campaign.title}</Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${campaign.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{campaign.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Status: {campaign.role}</p>
                <Progress value={campaign.progress} className="h-1.5" />
              </div>
            ))}
            {joinedCampaigns.length === 0 && <p className="text-muted-foreground text-sm">You haven't booked any trips yet.</p>}
          </CardContent>
           <CardFooter>
                <Button variant="link" asChild className="text-accent hover:text-accent/80 px-0">
                    <Link href="/campaigns">Explore Tours <ExternalLink className="ml-1.5 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </AnimatedCard>

        <AnimatedCard className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><ShieldCheckIcon className="mr-2 h-5 w-5 text-accent"/>Travel Milestones</CardTitle>
            <CardDescription>Celebrate your achievements as an explorer.</CardDescription>
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
        </AnimatedCard>
      </div>
      
      <AnimatedCard className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent"/>My Trip Log</CardTitle>
            <CardDescription>A summary of your adventures with us.</CardDescription>
          </CardHeader>
          <CardContent>
             {volunteeringRecord.length > 0 ? (
                <ul className="space-y-3">
                    {volunteeringRecord.map(record => (
                        <li key={`${record.activity}-${record.date}`} className="flex justify-between items-center p-3 bg-muted/30 rounded-md border">
                            <div>
                                <p className="font-medium text-primary">{record.activity}</p>
                                <p className="text-xs text-muted-foreground">{record.date}</p>
                            </div>
                            <p className="font-semibold text-accent">{record.campaign}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">No trips recorded yet.</p>
            )}
          </CardContent>
           <CardFooter>
                <Button variant="outline">Request Full Trip History</Button>
            </CardFooter>
        </AnimatedCard>

      <AnimatedCard className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Bookmark className="mr-2 h-5 w-5 text-accent"/>My Watchlist</CardTitle>
          <CardDescription>Quick access to your favorite guides, discussions, and stories.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {followedContent.map(item => (
            <Link href={item.link} key={item.id} className="block p-3 bg-muted/30 rounded-md border hover:bg-muted/50 transition-colors">
              <div className="flex items-center mb-1">
                {item.type === 'Guide' && <UserCircle className="h-4 w-4 mr-2 text-primary" />}
                {item.type === 'Discussion' && <MessageSquare className="h-4 w-4 mr-2 text-primary" />}
                {item.type === 'Journal Entry' && <Edit className="h-4 w-4 mr-2 text-primary" />}
                <span className="text-xs font-semibold text-muted-foreground">{item.type}</span>
              </div>
              <p className="font-medium text-primary truncate">{item.name}</p>
            </Link>
          ))}
          {followedContent.length === 0 && <p className="text-muted-foreground text-sm col-span-full">You are not following any content yet.</p>}
        </CardContent>
      </AnimatedCard>
    </div>
  );
}
