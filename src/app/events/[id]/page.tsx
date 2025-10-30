
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Tv, Info, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch event data based on params.id
  const mockEvent = {
    id: params.id,
    title: `Scheduled Departure: Tour ${params.id}`,
    date: 'Dec 31, 2024',
    time: 'All Day Event',
    location: params.id === 'e1' ? 'Online (Zoom)' : 'Nairobi, Kenya',
    type: params.id === 'e1' ? 'Online' as const : 'Offline' as const,
    excerpt: `This is a placeholder description for the scheduled departure with ID ${params.id}. Join us for an exciting time!`,
    fullDescription: `This is the detailed placeholder content for the tour with ID ${params.id}. We are planning an amazing trip that you won't want to miss. Stay tuned for updates on the detailed itinerary, accommodation, and specific activities. This tour aims to bring together like-minded adventurers for an unforgettable experience.`,
    imageUrl: placeholderImages.eventDetailDefault.src,
    imageWidth: placeholderImages.eventDetailDefault.width,
    imageHeight: placeholderImages.eventDetailDefault.height,
    dataAiHint: placeholderImages.eventDetailDefault.hint,
    organizer: "iffe-travels",
    rsvpLink: "#",
  };

  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className={cn('space-y-6 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Departures
        </Link>
      </Button>
      <Card className="shadow-xl overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        {mockEvent.imageUrl && (
          <div className="relative w-full bg-muted rounded-t-lg overflow-hidden aspect-[2/1]">
            <Image 
              src={mockEvent.imageUrl} 
              alt={mockEvent.title} 
              className="object-cover" 
              fill
              data-ai-hint={mockEvent.dataAiHint}
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10 p-2 bg-black/30 rounded">{mockEvent.title}</CardTitle>
          </div>
        )}
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Departure</h2>
                <p className="text-muted-foreground leading-relaxed">{mockEvent.fullDescription}</p>
              </section>
              <section>
                 <h3 className="font-headline text-lg font-semibold text-primary mb-2">Hosted by</h3>
                 <p className="text-muted-foreground">{mockEvent.organizer}</p>
              </section>
            </div>
            <aside className="space-y-4 md:pt-8">
              <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center"><Info className="mr-2 h-5 w-5 text-accent" />Trip Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-accent" /> {mockEvent.date}</p>
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-accent" /> {mockEvent.time}</p>
                  <p className="flex items-center">
                    {mockEvent.type === 'Online' ? <Tv className="h-4 w-4 mr-2 text-accent" /> : <Globe className="h-4 w-4 mr-2 text-accent" />}
                    {mockEvent.location} <Badge variant="outline" className="ml-2">{mockEvent.type}</Badge>
                  </p>
                </CardContent>
                <CardFooter>
                   <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href={mockEvent.rsvpLink || '#'} target={mockEvent.rsvpLink !== '#' ? '_blank' : undefined}>
                        <Users className="mr-2 h-4 w-4" /> Book Your Spot
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
