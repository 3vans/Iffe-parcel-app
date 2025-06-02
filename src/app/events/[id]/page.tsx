
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Tv, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch event data based on params.id
  const mockEvent = {
    id: params.id,
    title: `Event Title for ID: ${params.id}`,
    date: 'Dec 31, 2024',
    time: '10:00 AM - 02:00 PM',
    location: params.id === 'e1' ? 'Online (Zoom)' : 'Placeholder Venue',
    type: params.id === 'e1' ? 'Online' as const : 'Offline' as const,
    excerpt: `This is a placeholder description for event ID ${params.id}. Join us for an exciting time! More details will be available soon.`,
    fullDescription: `This is the detailed placeholder content for event with ID ${params.id}. We are planning an amazing event that you won't want to miss. Stay tuned for updates on speakers, agenda, and specific activities. This event aims to bring together community members for learning, networking, and fun.`,
    imageUrl: `https://placehold.co/800x400.png`,
    dataAiHint: "event placeholder",
    organizer: "e-Rotary Hub Team",
    rsvpLink: "#",
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Button variant="ghost" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
      </Button>
      <Card className="shadow-xl overflow-hidden">
        {mockEvent.imageUrl && (
          <div className="relative w-full bg-muted rounded-lg overflow-hidden">
            <img src={mockEvent.imageUrl} alt={mockEvent.title} className="w-full h-auto max-h-[500px] object-cover" data-ai-hint={mockEvent.dataAiHint} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10 p-2 bg-black/30 rounded">{mockEvent.title}</CardTitle>
          </div>
        )}
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Event</h2>
                <p className="text-muted-foreground leading-relaxed">{mockEvent.fullDescription}</p>
              </section>
              <section>
                 <h3 className="font-headline text-lg font-semibold text-primary mb-2">Organized by</h3>
                 <p className="text-muted-foreground">{mockEvent.organizer}</p>
              </section>
            </div>
            <aside className="space-y-4 md:pt-8">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center"><Info className="mr-2 h-5 w-5 text-accent" />Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-accent" /> {mockEvent.date}</p>
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-accent" /> {mockEvent.time}</p>
                  <p className="flex items-center">
                    {mockEvent.type === 'Online' ? <Tv className="h-4 w-4 mr-2 text-accent" /> : <MapPin className="h-4 w-4 mr-2 text-accent" />}
                    {mockEvent.location} <Badge variant="outline" className="ml-2">{mockEvent.type}</Badge>
                  </p>
                </CardContent>
                <CardFooter>
                   <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href={mockEvent.rsvpLink || '#'} target={mockEvent.rsvpLink !== '#' ? '_blank' : undefined}>
                        <Users className="mr-2 h-4 w-4" /> RSVP / Register
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

