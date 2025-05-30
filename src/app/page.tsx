
'use client';
import Link from 'next/link';
import Image from 'next/image';
import CampaignCarousel from '@/components/campaign-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Edit3, Lightbulb, MessageCircle, UserPlus, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import SignupModal from '@/components/auth/signup-modal';


const mockCarouselCampaigns = [
  { id: 'c1', title: 'Clean Water Initiative', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'water nature', shortDescription: 'Bringing clean and safe drinking water to underserved communities in rural Uganda.' },
  { id: 'c2', title: 'Youth Empowerment Workshops', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'youth education', shortDescription: 'Equipping young people with skills for a brighter future through interactive workshops.' },
  { id: 'c3', title: 'Reforestation Project "Green Future"', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'forest trees', shortDescription: 'Planting 10,000 trees to combat climate change and restore local ecosystems.' },
];

interface FeedItemBase {
  id: string;
  type: 'creator' | 'room' | 'blog' | 'event';
}

interface CreatorFeedItem extends FeedItemBase {
  type: 'creator';
  name: string;
  avatarUrl: string;
  dataAiHint?: string;
  specialty: string;
  profileLink: string;
}

interface RoomFeedItem extends FeedItemBase {
  type: 'room';
  name: string;
  topic: string;
  chatLink: string;
}

interface BlogFeedItem extends FeedItemBase {
  type: 'blog';
  post: BlogCardProps;
}

interface EventFeedItem extends FeedItemBase {
  type: 'event';
  event: EventCardProps;
}

type FeedItem = CreatorFeedItem | RoomFeedItem | BlogFeedItem | EventFeedItem;

const feedItems: FeedItem[] = [
  {
    id: 'creator-1',
    type: 'creator',
    name: 'Eco Warriors Uganda',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'activist group',
    specialty: 'Waste Management & Advocacy',
    profileLink: '/profile/eco-warriors',
  },
  {
    id: 'blog-1',
    type: 'blog',
    post: {
      id: 'b1',
      title: 'The Urban Garden Revolution',
      author: 'Jane Doe',
      date: 'Nov 05, 2023',
      excerpt: 'Discover how communities are transforming urban spaces into thriving green havens, one rooftop and balcony at a time.',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'urban garden',
      tags: ['#UrbanFarming', '#Community'],
      commentCount: 18,
    }
  },
  {
    id: 'room-1',
    type: 'room',
    name: 'Sustainable Agriculture Now',
    topic: 'Share tips & challenges in eco-friendly farming practices globally.',
    chatLink: '/chat', // Corrected link
  },
  {
    id: 'event-1',
    type: 'event',
    event: {
      id: 'e1',
      title: 'Climate Action Dialogue: Youth Edition',
      date: 'Nov 28, 2023',
      time: '03:00 PM - 04:30 PM',
      location: 'Online (Zoom)',
      type: 'Online',
      excerpt: 'A platform for young leaders to discuss climate solutions and policy changes. Register to participate!',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'youth climate meeting',
      rsvpLink: '#',
      calendarLink: '#',
    }
  },
  {
    id: 'creator-2',
    type: 'creator',
    name: 'TechForGood Innovators',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'tech team',
    specialty: 'Developing Solutions for Social Impact',
    profileLink: '/profile/techforgood',
  },
];


export default function Home() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialStep, setSignupInitialStep] = useState<"user" | "community" | "erotaract" | null>(null);

  const openSignupModalForERotaract = () => {
    setSignupInitialStep("erotaract");
    setIsSignupModalOpen(true);
  };

  return (
    <>
    <div className="space-y-12 animate-fade-in">
      <section>
        <CampaignCarousel campaigns={mockCarouselCampaigns} />
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Ready to Make an Impact?</CardTitle>
            <CardDescription>Your voice and actions can shape a better future. Get started:</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
              <Link href="/create?action=campaign">
                <BarChart3 className="mr-2 h-5 w-5" /> Start a Campaign
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/blog/submit">
                <Edit3 className="mr-2 h-5 w-5" /> Share Your Story
              </Link>
            </Button>
             <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
               <Link href="/ideas">
                <Lightbulb className="mr-2 h-5 w-5" /> Pitch an Idea
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full py-6 text-base border-accent text-accent hover:bg-accent/10 hover:text-accent" onClick={openSignupModalForERotaract}>
              <UserPlus className="mr-2 h-5 w-5" /> Join e-Rotaract Online
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">What's Happening</h2>
        <div className="space-y-8">
          {feedItems.map((item) => {
            if (item.type === 'creator') {
              return (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.avatarUrl} alt={item.name} data-ai-hint={item.dataAiHint} />
                        <AvatarFallback>{item.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="font-headline text-lg text-primary">{item.name}</CardTitle>
                        <CardDescription className="text-xs">{item.specialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Discover content and initiatives from {item.name}.</p>
                     <Button variant="outline" asChild size="sm">
                       <Link href={item.profileLink}>
                         View Profile <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                     </Button>
                  </CardContent>
                </Card>
              );
            }
            if (item.type === 'room') {
              return (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                     <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent/20 rounded-full">
                           <MessageCircle className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-lg text-primary">{item.name}</CardTitle>
                        </div>
                     </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{item.topic}</p>
                    <Button variant="default" asChild size="sm" className="bg-primary hover:bg-primary/90">
                       <Link href={item.chatLink}>
                         Join Chat <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                     </Button>
                  </CardContent>
                </Card>
              );
            }
            if (item.type === 'blog') {
              return <BlogCard key={item.id} {...item.post} />;
            }
            if (item.type === 'event') {
              return <EventCard key={item.id} {...item.event} />;
            }
            return null;
          })}
        </div>
        {feedItems.length === 0 && (
            <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">The feed is quiet right now... Why not start something?</p>
            </div>
        )}
      </section>
    </div>
    <SignupModal open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} initialStep={signupInitialStep} />
    </>
  );
}
