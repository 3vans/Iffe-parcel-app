
'use client';
import Link from 'next/link';
import Image from 'next/image';
import CampaignCarousel from '@/components/campaign-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Edit3, Lightbulb, MessageCircle, UserPlus, ArrowRight, ExternalLink, ShieldCheck, MountainSnow, Binoculars } from 'lucide-react';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import SignupModal from '@/components/auth/signup-modal';


const mockCarouselCampaigns = [
  { id: 'c1', title: 'Serengeti Great Migration Safari', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'wildebeest migration', shortDescription: 'Witness the breathtaking Great Migration in the vast plains of the Serengeti.' },
  { id: 'c2', title: 'Gorilla Trekking in Bwindi', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'mountain gorilla', shortDescription: 'An intimate and unforgettable encounter with the majestic mountain gorillas of Uganda.' },
  { id: 'c3', title: 'Okavango Delta Mokoro Expedition', imageUrl: 'https://placehold.co/1200x500.png', dataAiHint: 'mokoro canoe delta', shortDescription: 'Explore the serene waterways of the Okavango Delta by traditional mokoro canoe.' },
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
    name: 'Safari Jane',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'safari guide',
    specialty: 'Expert Guide & Wildlife Photographer',
    profileLink: '/dashboard',
  },
  {
    id: 'blog-1',
    type: 'blog',
    post: {
      id: 'b1', 
      title: 'A Lion\'s Tale: A Close Encounter',
      author: 'David Attenborough',
      date: 'Nov 05, 2023',
      excerpt: 'The story of a thrilling and humbling afternoon spent observing a pride of lions in their natural habitat.',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'lion pride',
      tags: ['#BigCats', '#Serengeti'],
      commentCount: 18,
    }
  },
  {
    id: 'room-1',
    type: 'room',
    name: 'Photography Tips & Tricks',
    topic: 'Share your best wildlife shots and get advice from fellow photographers.',
    chatLink: '/chat', 
  },
  {
    id: 'event-1',
    type: 'event',
    event: {
      id: 'e1', 
      title: 'Kenya Big Five Safari - Group Departure',
      date: 'Feb 15, 2025',
      time: 'All Day Event',
      location: 'Nairobi, Kenya',
      type: 'Offline',
      excerpt: 'Join our special group departure to track the Big Five in the Maasai Mara. Limited spots available!',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'safari jeep',
      rsvpLink: '#',
      calendarLink: '#',
    }
  },
  {
    id: 'creator-2',
    type: 'creator',
    name: 'Ranger Tom',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'park ranger',
    specialty: 'Conservation & Tracking Specialist',
    profileLink: '/dashboard', 
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
            <CardTitle className="font-headline text-2xl text-primary">Your Adventure Starts Here</CardTitle>
            <CardDescription>Ready to explore the wild? Let's get started:</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
              <Link href="/campaigns">
                <MountainSnow className="mr-2 h-5 w-5" /> Browse All Tours
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/blog">
                <Edit3 className="mr-2 h-5 w-5" /> Read Travel Stories
              </Link>
            </Button>
             <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
               <Link href="/ideas">
                <Lightbulb className="mr-2 h-5 w-5" /> Suggest a Destination
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full py-6 text-base border-accent text-accent hover:bg-accent/10 hover:text-accent" onClick={openSignupModalForERotaract}>
              <UserPlus className="mr-2 h-5 w-5" /> Join Explorer's Club
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">From the Wild</h2>
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
                    <p className="text-sm text-muted-foreground mb-3">Discover stories and photos from {item.name}.</p>
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
                         Join Discussion <ArrowRight className="ml-2 h-4 w-4" />
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
