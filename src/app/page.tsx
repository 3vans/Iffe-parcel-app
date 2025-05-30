import Link from 'next/link';
import CampaignCarousel from '@/components/campaign-carousel';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Edit3, Lightbulb, MessageCircle, Users, DollarSign, Award, HeartHandshake, CalendarPlus, HelpingHand, Users2 } from 'lucide-react';
import Image from 'next/image';

// Mock data - replace with actual data fetching
const mockCampaigns = [
  { id: '1', title: 'Clean Water Initiative', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'water nature', shortDescription: 'Bringing clean and safe drinking water to underserved communities in rural Uganda.' },
  { id: '2', title: 'Youth Empowerment Workshops', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'youth education', shortDescription: 'Equipping young people with skills for a brighter future through interactive workshops.' },
  { id: '3', title: 'Reforestation Project "Green Future"', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'forest trees', shortDescription: 'Planting 10,000 trees to combat climate change and restore local ecosystems.' },
];

const suggestedCreators = [
  { id: 'c1', name: 'Eco Warriors Uganda', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person nature', specialty: 'Waste Management' },
  { id: 'c2', name: 'Youth Climate Activists', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'group protest', specialty: 'Climate Advocacy' },
];

const suggestedRooms = [
  { id: 'r1', name: 'Plastic Recycling Hub', topic: 'Discuss innovative plastic recycling methods.' },
  { id: 'r2', name: 'Sustainable Agriculture Now', topic: 'Share tips on eco-friendly farming.' },
];

export default function Home() {
  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <CampaignCarousel campaigns={mockCampaigns} />
      </section>

      <section>
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button size="lg" className="w-full py-8 text-lg bg-primary hover:bg-primary/90" asChild>
            <Link href="/chat">
              <MessageCircle className="mr-2 h-6 w-6" /> Join Chatroom
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="w-full py-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/create?action=campaign">
              <BarChart3 className="mr-2 h-6 w-6" /> Start Campaign
            </Link>
          </Button>
          <Button size="lg" className="w-full py-8 text-lg bg-primary hover:bg-primary/90" asChild>
            <Link href="/blog">
              <Edit3 className="mr-2 h-6 w-6" /> Read Blog
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full py-8 text-lg border-accent text-accent hover:bg-accent/10" asChild>
            <Link href="/donate">
              <HeartHandshake className="mr-2 h-6 w-6" /> Donate Now
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Our Impact This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Active Campaigns" value="14" icon={HelpingHand} description="Driving change together" />
          <StatCard title="Volunteers Engaged" value="78" icon={Users2} description="Making a difference" />
          <StatCard title="Funds Raised" value="$2,400" icon={DollarSign} description="Powering our projects" />
        </div>
      </section>
      
      <section>
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Discover Creators & Rooms</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Suggested Creators</CardTitle>
              <CardDescription>Connect with inspiring individuals making a difference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedCreators.map(creator => (
                <Link href={`/profile/${creator.id}`} key={creator.id} className="block hover:bg-muted/50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <Image src={creator.avatarUrl} alt={creator.name} width={48} height={48} className="rounded-full" data-ai-hint={creator.dataAiHint} />
                    <div>
                      <p className="font-semibold text-primary-600">{creator.name}</p>
                      <p className="text-sm text-muted-foreground">{creator.specialty}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Hot Chatrooms</CardTitle>
              <CardDescription>Join conversations on pressing environmental and social topics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedRooms.map(room => (
                <Link href={`/chat/${room.id}`} key={room.id} className="block hover:bg-muted/50 p-3 rounded-lg transition-colors">
                    <p className="font-semibold text-primary-600">{room.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{room.topic}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
