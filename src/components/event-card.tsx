import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MapPin, Users, Tv, CalendarPlus } from 'lucide-react';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Online' | 'Offline' | 'Hybrid';
  excerpt: string;
  imageUrl?: string;
  dataAiHint?: string;
  rsvpLink?: string;
  calendarLink?: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, date, time, location, type, excerpt, imageUrl, dataAiHint, rsvpLink, calendarLink }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" data-ai-hint={dataAiHint} />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
          <Link href={`/events/${id}`}>{title}</Link>
        </CardTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
          <span className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1.5 text-accent" /> {date}</span>
          <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-accent" /> {time}</span>
          <span className="flex items-center">
            {type === 'Online' ? <Tv className="h-3.5 w-3.5 mr-1.5 text-accent" /> : <MapPin className="h-3.5 w-3.5 mr-1.5 text-accent" />}
            {location} ({type})
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
        {rsvpLink ? (
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href={rsvpLink} target="_blank" rel="noopener noreferrer">
              <Users className="h-4 w-4 mr-2" /> RSVP Now
            </Link>
          </Button>
        ) : (
          <Button disabled className="w-full"><Users className="h-4 w-4 mr-2" /> RSVP Closed</Button>
        )}
        {calendarLink ? (
           <Button variant="outline" asChild className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent">
            <Link href={calendarLink} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-4 w-4 mr-2" /> Add to Calendar
            </Link>
          </Button>
        ): (
          <Button variant="outline" disabled className="w-full"><CalendarPlus className="h-4 w-4 mr-2" /> Add to Calendar</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
