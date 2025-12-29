
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3, Lightbulb, MessageCircle, ArrowRight, MountainSnow, ShieldCheck } from 'lucide-react';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import FifaCardCarousel from '@/components/fifa-card-carousel';
import Hero from '@/components/layout/hero';
import ERotaractSignupTrigger from '@/components/auth/erotaract-signup-trigger';
import fifaCardData from '@/app/lib/fifa-card-data.json';


interface FeedItemBase {
  id: string;
  type: 'creator' | 'room' | 'blog' | 'event';
}

interface CreatorFeedItem extends FeedItemBase {
  type: 'creator';
  name: string;
  avatarUrl: string;
  avatarWidth: number;
  avatarHeight: number;
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

const initialFeedItems: FeedItem[] = [
  {
    id: 'creator-1',
    type: 'creator',
    name: 'Ian Ivan',
    avatarUrl: placeholderImages.homeCreatorJane.src,
    avatarWidth: placeholderImages.homeCreatorJane.width,
    avatarHeight: placeholderImages.homeCreatorJane.height,
    dataAiHint: placeholderImages.homeCreatorJane.hint,
    specialty: 'Expert Guide & Wildlife Photographer',
    profileLink: '/profile/ian-ivan',
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
      imageUrl: 'https://picsum.photos/seed/lionPride/600/400',
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
      imageUrl: 'https://picsum.photos/seed/safariJeep/600/400',
      dataAiHint: 'safari jeep',
      rsvpLink: '#',
      calendarLink: '#',
    }
  },
  {
    id: 'creator-2',
    type: 'creator',
    name: 'Ranger Ben',
    avatarUrl: placeholderImages.homeCreatorTom.src,
    avatarWidth: placeholderImages.homeCreatorTom.width,
    avatarHeight: placeholderImages.homeCreatorTom.height,
    dataAiHint: placeholderImages.homeCreatorTom.hint,
    specialty: 'Conservation & Tracking Specialist',
    profileLink: '/profile/ranger-ben', 
  },
];

export default function Home() {
    const [feedItems] = useState<FeedItem[]>(initialFeedItems);
    const [activeCarouselImage, setActiveCarouselImage] = useState<string | null>(null);

    const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in', className)}>
                <Card className={cn("overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full", className)}>
                    {children}
                </Card>
            </div>
        );
    };
  

  return (
    
      <div className="relative z-10 space-y-12 animate-fade-in">
        <section>
          <Hero />
        </section>

        <section>
          <AnimatedCard>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
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
                <Link href="/create">
                  <Edit3 className="mr-2 h-5 w-5" /> Share & Create
                </Link>
              </Button>
               <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
                 <Link href="/ideas">
                  <Lightbulb className="mr-2 h-5 w-5" /> Suggest a Destination
                </Link>
              </Button>
              <ERotaractSignupTrigger />
            </CardContent>
          </Card>
          </AnimatedCard>
        </section>
        
        <section>
          <h2 className="font-headline text-3xl font-bold text-primary mb-6">From the Wild</h2>
          <div className="space-y-8">
            {feedItems.map((item) => {
              if (item.type === 'creator') {
                return (
                  <AnimatedCard key={item.id}>
                  <Card className="shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage asChild src={item.avatarUrl} alt={item.name}>
                            <Image src={item.avatarUrl} alt={item.name} width={item.avatarWidth} height={item.avatarHeight} data-ai-hint={item.dataAiHint} />
                          </AvatarImage>
                          <AvatarFallback>{item.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="font-headline text-lg text-primary">{item.name}</CardTitle>
                          <CardDescription className="text-xs">{item.specialty}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Learn more about our expert guides and their experiences in the wild. Check out their profile for stories, photos, and upcoming tours.</p>
                       <Button variant="outline" asChild size="sm">
                         <Link href={item.profileLink}>
                           View Profile <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                       </Button>
                    </CardContent>
                  </Card>
                  </AnimatedCard>
                );
              }
              if (item.type === 'room') {
                return (
                  <AnimatedCard key={item.id}>
                  <Card className="shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
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
                  </AnimatedCard>
                );
              }
              if (item.type === 'blog') {
                return (
                    <AnimatedCard key={item.id}>
                        <BlogCard {...item.post} />
                    </AnimatedCard>
                );
              }
              if (item.type === 'event') {
                 return (
                    <AnimatedCard key={item.id}>
                        <EventCard {...item.event} />
                    </AnimatedCard>
                );
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

        <section className="carousel-background-container">
            <div 
                className="carousel-background-image"
                style={{ backgroundImage: activeCarouselImage ? `url(${activeCarouselImage})` : 'none' }}
            />
            <div className="carousel-background-overlay" />
            <FifaCardCarousel 
                cards={fifaCardData as any}
                onActiveCardChange={(card) => {
                    if (card) {
                        const imageData = placeholderImages[card.image as keyof typeof placeholderImages];
                        if (imageData) {
                            setActiveCarouselImage(imageData.src);
                        }
                    }
                }} 
            />
        </section>
      </div>
    
  );
}
