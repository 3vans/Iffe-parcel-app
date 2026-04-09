
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Tv, Info, Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { getDepartureById, type Departure } from '@/lib/services/cms-service';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Departure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const data = await getDepartureById(id as string);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Opening Itinerary...</p>
    </div>;
  }

  if (!event) {
    notFound();
  }

  return (
    <div ref={ref} className={cn('space-y-6 scroll-animate max-w-6xl mx-auto pb-20', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-2 hover:bg-primary/5 hover:text-primary">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Departures
        </Link>
      </Button>

      <Card className="shadow-2xl overflow-hidden border-none bg-card/80 backdrop-blur-sm">
        {event.imageUrl && (
          <div className="relative w-full aspect-[21/9] bg-muted overflow-hidden">
            <Image 
              src={event.imageUrl} 
              alt={event.title} 
              className="object-cover" 
              fill
              data-ai-hint={event.dataAiHint || "safari landscape"}
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
             <div className="absolute bottom-8 left-8 right-8">
                <Badge className="bg-accent text-stone-900 font-black mb-3 px-3 py-1 uppercase tracking-widest">{event.type}</Badge>
                <CardTitle className="font-headline text-4xl md:text-6xl text-white font-black uppercase tracking-tighter leading-none">{event.title}</CardTitle>
             </div>
          </div>
        )}
        <CardContent className="p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
              <section className="space-y-4">
                <h2 className="font-headline text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-accent rounded-full" />
                    About this Departure
                </h2>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
                </div>
              </section>
              
              <section className="p-8 bg-muted/30 rounded-3xl border border-primary/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-primary leading-none mb-1">Official Agency Event</h3>
                        <p className="text-xs text-muted-foreground">Verified and Guided by iffe-travels</p>
                    </div>
                 </div>
                 <Button variant="outline" className="rounded-full font-bold border-primary/20" asChild>
                    <Link href="/about">Learn More</Link>
                 </Button>
              </section>
            </div>

            <aside className="space-y-6">
              <Card className="bg-stone-950 text-white border-none shadow-2xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="font-headline text-2xl text-accent flex items-center gap-2">
                    <Info className="h-6 w-6" /> Itinerary Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <CalendarDays className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Departure Date</p>
                            <p className="font-bold">{event.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Clock className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Duration / Time</p>
                            <p className="font-bold">{event.time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            {event.type === 'Online' ? <Tv className="h-5 w-5 text-accent" /> : <MapPin className="h-5 w-5 text-accent" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Location</p>
                            <p className="font-bold">{event.location}</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <Button className="w-full h-14 rounded-2xl bg-accent text-stone-900 hover:bg-white font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all active:scale-95" asChild>
                        <Link href={event.rsvpLink || '/contact'} target={event.rsvpLink ? '_blank' : undefined}>
                            {event.type === 'Online' ? 'REGISTER NOW' : 'BOOK YOUR SPOT'}
                        </Link>
                    </Button>
                    {event.calendarLink && (
                        <Button variant="ghost" className="w-full text-stone-400 hover:text-white hover:bg-white/5 font-bold text-xs" asChild>
                            <Link href={event.calendarLink} target="_blank">ADD TO CALENDAR</Link>
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center p-6 space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Questions?</p>
                <p className="text-sm font-medium text-muted-foreground">Our adventure specialists are available 24/7 to help you prepare.</p>
                <Button variant="link" className="text-accent font-bold" asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
