

'use client';
import Link from 'next/link';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CalendarClock } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import Image from 'next/image';

// Mock data
const mockEvents: EventCardProps[] = [
  { id: '1', title: 'Great Migration Peak Season Tour', date: 'July 15, 2024', time: '7-Day Tour', location: 'Serengeti, Tanzania', type: 'Offline', excerpt: 'Join our premier guided tour during the peak of the Great Migration. An all-inclusive, small-group experience.', imageUrl: placeholderImages.campaignDetailWildebeest.src, dataAiHint: 'safari jeep migration', rsvpLink: '#', calendarLink: '#' },
  { id: '2', title: 'Webinar: Planning Your First Safari', date: 'Nov 20, 2023', time: '07:00 PM - 08:30 PM', location: 'Online (Zoom)', type: 'Online', excerpt: 'Get expert tips on when to go, what to pack, and how to choose the perfect safari for your budget and style.', imageUrl: 'https://picsum.photos/seed/webinar/600/400', dataAiHint: 'online seminar map', rsvpLink: '#', calendarLink: '#' },
  { id: '3', title: 'Photographer\'s Dream Trip: Okavango Delta', date: 'Sep 05, 2024', time: '10-Day Expedition', location: 'Okavango Delta, Botswana', type: 'Offline', excerpt: 'A specialized tour for photography enthusiasts, led by a professional wildlife photographer. Capture the magic of the Delta.', imageUrl: placeholderImages.campaignDetailMokoro.src, dataAiHint: 'camera wildlife photography', rsvpLink: '#', calendarLink: '#' },
];

export default function EventsPage() {
    const [headerRef, isHeaderVisible] = useScrollAnimation();
    const [footerRef, isFooterVisible] = useScrollAnimation();

  return (
    <div className="space-y-8 animate-fade-in">
        <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isHeaderVisible && 'scroll-animate-in')}>
            <Image
                src={placeholderImages.eventDetailDefault.src}
                alt="Scheduled Departures"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint={placeholderImages.eventDetailDefault.hint}
                priority
            />
            <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
            
            <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
                <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
                  <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">GROUP TOURS & SPECIAL EVENTS</p>
                  <h1
                    className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest"
                    style={{
                      color: 'hsl(var(--primary-foreground))',
                      WebkitTextStroke: '1px hsl(var(--primary))',
                    }}
                  >
                    Scheduled Departures
                     <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-md mb-8">
                    Join our group tours, webinars, and special events. Your adventure awaits!
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                     <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                       <Link href="/contact">
                         Inquire Now
                       </Link>
                     </Button>
                     <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                        <Link href="/campaigns/new">
                            Plan a Custom Trip
                        </Link>
                     </Button>
                  </div>
                </div>
              </div>
        </section>

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

      <section ref={footerRef} className={cn('mt-12 p-6 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg scroll-animate transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1', isFooterVisible && 'scroll-animate-in')}>
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
