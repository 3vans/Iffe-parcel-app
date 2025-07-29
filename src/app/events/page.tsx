
import Link from 'next/link';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CalendarClock } from 'lucide-react';

// Mock data
const mockEvents: EventCardProps[] = [
  { id: '1', title: 'Great Migration Peak Season Tour', date: 'July 15, 2024', time: '7-Day Tour', location: 'Serengeti, Tanzania', type: 'Offline', excerpt: 'Join our premier guided tour during the peak of the Great Migration. An all-inclusive, small-group experience.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'safari jeep migration', rsvpLink: '#', calendarLink: '#' },
  { id: '2', title: 'Webinar: Planning Your First Safari', date: 'Nov 20, 2023', time: '07:00 PM - 08:30 PM', location: 'Online (Zoom)', type: 'Online', excerpt: 'Get expert tips on when to go, what to pack, and how to choose the perfect safari for your budget and style.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'online seminar map', rsvpLink: '#', calendarLink: '#' },
  { id: '3', title: 'Photographer\'s Dream Trip: Okavango Delta', date: 'Sep 05, 2024', time: '10-Day Expedition', location: 'Okavango Delta, Botswana', type: 'Offline', excerpt: 'A specialized tour for photography enthusiasts, led by a professional wildlife photographer. Capture the magic of the Delta.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'camera wildlife photography', rsvpLink: '#', calendarLink: '#' },
];

export default function EventsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2 flex items-center justify-center"><CalendarClock className="mr-3 h-10 w-10"/>Scheduled Departures</h1>
        <p className="text-lg text-muted-foreground">Join our group tours, webinars, and special events. Your adventure awaits!</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </section>

      {mockEvents.length === 0 && (
         <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No upcoming scheduled departures yet. Check back soon!</p>
        </div>
      )}

      <section className="mt-12 p-6 bg-card rounded-lg shadow-lg">
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
