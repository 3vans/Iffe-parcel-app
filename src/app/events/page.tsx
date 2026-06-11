'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EventCard from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CalendarClock, Compass } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import PageHero from '@/components/layout/page-hero';
import { fetchDepartures, type Departure } from '@/lib/services/cms-service';

export default function EventsPage() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [footerRef, isFooterVisible] = useScrollAnimation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDepartures();
        setDepartures(data);
      } catch (err) {
        console.error("Failed to load departures:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
        <PageHero 
          title="Scheduled Departures"
          subtitle="Join our group tours, webinars, and special events. Your adventure awaits!"
          imageUrl={placeholderImages.eventDetailDefault.src}
          dataAiHint={placeholderImages.eventDetailDefault.hint}
          primaryAction={{ text: "Inquire Now", link: "/contact" }}
          secondaryAction={{ text: "Plan a Custom Trip", link: "/campaigns/new" }}
        />

      <div className="container mx-auto px-4 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Checking Calendar...</p>
          </div>
        ) : departures.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departures.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </section>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
            <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-bold text-muted-foreground uppercase tracking-tighter">No upcoming departures scheduled yet.</p>
            <Button variant="link" asChild className="text-accent mt-2 font-bold">
              <Link href="/campaigns/new">Plan a Custom Journey</Link>
            </Button>
          </div>
        )}

        <section ref={footerRef} className={cn('mt-12 p-10 bg-card/80 backdrop-blur-sm rounded-[2rem] shadow-xl scroll-animate transition-all duration-300 ease-out hover:shadow-2xl border border-primary/5', isFooterVisible && 'scroll-animate-in')}>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <Badge className="bg-accent text-accent-foreground font-black px-3 py-1">SPOTLIGHT</Badge>
              <h2 className="font-headline text-3xl font-black text-primary uppercase tracking-tighter">Past Expedition: Gorilla Trekking</h2>
              <p className="text-muted-foreground leading-relaxed">Watch the highlights from our last gorilla trekking expedition in Bwindi. Experience the raw emotion and majesty of these gentle giants through our lens.</p>
              <Button variant="link" className="p-0 text-accent font-bold hover:text-primary transition-colors" asChild>
                <Link href="/blog">Read the full journal recap <Compass className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-stone-900 rounded-2xl overflow-hidden shadow-2xl relative group">
              <Image 
                src={placeholderImages.campaignDetailGorilla.src} 
                alt="Past tour highlight" 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
