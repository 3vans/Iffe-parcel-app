import Link from 'next/link';
import EventCard, { type EventCardProps } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

// Mock data
const mockEvents: EventCardProps[] = [
  { id: '1', title: 'Annual Rotary Youth Summit', date: 'Nov 15, 2023', time: '09:00 AM - 05:00 PM', location: 'Kampala Serena Hotel', type: 'Offline', excerpt: 'Join us for a day of inspiring talks, workshops, and networking opportunities for young leaders.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'rotary conference', rsvpLink: '#', calendarLink: '#' },
  { id: '2', title: 'Webinar: Sustainable Practices for SMEs', date: 'Nov 20, 2023', time: '02:00 PM - 03:30 PM', location: 'Online (Zoom)', type: 'Online', excerpt: 'Learn how small and medium enterprises can adopt sustainable practices for long-term success and environmental impact.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'online seminar', rsvpLink: '#', calendarLink: '#' },
  { id: '3', title: 'Community Cleanup Drive', date: 'Dec 02, 2023', time: '10:00 AM - 01:00 PM', location: 'Makerere Kivulu', type: 'Offline', excerpt: 'Volunteer with us to clean up and beautify our local community spaces. All materials provided.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'volunteer cleanup', rsvpLink: '#', calendarLink: '#' },
];

export default function EventsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground">Join our events, workshops, and live sessions. Get involved!</p>
      </section>

      {/* Placeholder for future "Suggest an Event" button if needed
      <div className="text-right">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/events/suggest">
            <CalendarPlus className="mr-2 h-5 w-5" /> Suggest an Event
          </Link>
        </Button>
      </div>
      */}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </section>

      {mockEvents.length === 0 && (
         <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No upcoming events scheduled yet. Check back soon!</p>
        </div>
      )}

      {/* Example of embedded content placeholder */}
      <section className="mt-12 p-6 bg-card rounded-lg shadow-lg">
        <h2 className="font-headline text-2xl font-bold text-primary mb-4">Past Event Highlight: Youth Summit Recap</h2>
        <p className="text-muted-foreground mb-4">Watch the highlights from our last Youth Summit.</p>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Zoom/YouTube Embed Placeholder</p>
        </div>
        <Button variant="link" className="mt-4 text-accent hover:text-accent/80 px-0" asChild>
          <Link href="/blog/youth-summit-recap">Read the full recap article</Link>
        </Button>
      </section>
    </div>
  );
}
