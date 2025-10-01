

'use client';
import Link from 'next/link';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CalendarClock } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import HeroSection from '@/components/layout/hero-section';

// Mock data
const mockEvents: EventCardProps[] = [
  { id: '1', title: 'Great Migration Peak Season Tour', date: 'July 15, 2024', time: '7-Day Tour', location: 'Serengeti, Tanzania', type: 'Offline', excerpt: 'Join our premier guided tour during the peak of the Great Migration. An all-inclusive, small-group experience.', imageUrl: placeholderImages.campaignDetailWildebeest.src, dataAiHint: 'safari jeep migration', rsvpLink: '#', calendarLink: '#' },
  { id: '2', title: 'Webinar: Planning Your First Safari', date: 'Nov 20, 2023', time: '07:00 PM - 08:30 PM', location: 'Online (Zoom)', type: 'Online', excerpt: 'Get expert tips on when to go, what to pack, and how to choose the perfect safari for your budget and style.', imageUrl: 'https://picsum.photos/seed/webinar/600/400', dataAiHint: 'online seminar map', rsvpLink: '#', calendarLink: '#' },
  { id: '3', title: 'Photographer\'s Dream Trip: Okavango Delta', date: 'Sep 05, 2024', time: '10-Day Expedition', location: 'Okavango Delta, Botswana', type: 'Offline', excerpt: 'A specialized tour for photography enthusiasts, led by a professional wildlife photographer. Capture the magic of the Delta.', imageUrl: placeholderImages.campaignDetailMokoro.src, dataAiHint: 'camera wildlife photography', rsvpLink: '#', calendarLink: '#' },
];

export default function EventsPage() {
    const [footerRef, isFooterVisible] = useScrollAnimation();

  return (
    <div className="space-y-8 animate-fade-in">
      <HeroSection
        title="Scheduled Departures"
        subtitle="Join our group tours, webinars, and special events. Your adventure awaits!"
        Icon={CalendarClock}
        imageUrl={placeholderImages.eventDetailDefault.src}
        dataAiHint={placeholderImages.eventDetailDefault.hint}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </section>

      {mockEvents.length === 0 && (
         <div ref={footerRef} className={cn("text-center py-12 scroll-animate", isFooterVisible && "scroll-animate-in")}>
          <p className="text-xl text-muted-foreground">No upcoming scheduled departures yet. Check back soon!</p>
        </div>
      )}

      <section ref={footerRef} className={cn('mt-12 p-6 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg scroll-animate', isFooterVisible && 'scroll-animate-in')}>
        <h2 className="font-headline text-2xl font-bold text-primary mb-4">Past Trip Highlight: Gorilla Trekking</h2>
        <p className="text-muted-foreground mb-4">Watch the highlights from our last gorilla trekking expedition.</p>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Vimeo/YouTube Embed Placeholder</p>
        </div>
        <Button variant="link" className="mt-4 text-accent hover:text-accent/80 px-0" asChild>
          <Link href="/blog/gorilla-trek-recap">Read the full journal entry</Link>
        </Button>
      </section>
    </div>
  );
}
