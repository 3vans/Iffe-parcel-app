
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, DollarSign, HeartHandshake, Info, Map, Star, Sparkles, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from '@/components/animated-section';
import HeroSection from '@/components/layout/hero-section';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';

// Define the type for the detailed package data passed from the server component
type Tour = {
    id: string;
    title: string;
    shortDescription: string;
    imageUrl: string;
    dataAiHint?: string;
}

type ItinerarySection = {
    id: string;
    type: 'text' | 'image';
    content: string;
    imageLayout?: 'small' | 'full';
}

type ItineraryItem = {
    day: number;
    activity: string;
    sections: ItinerarySection[];
}

type PackageDetails = {
    id: string;
    slug: string;
    name: string;
    subtitle: string;
    price: string; 
    basePrice: number;
    priceDescription: string;
    durationText: string;
    description: string;
    features: string[];
    whatsIncluded?: string[];
    includedTours: Tour[];
    itineraryTitle?: string;
    sampleItinerary: ItineraryItem[];
    heroImage: {
      src: string;
      hint?: string;
    }
}

interface ComboPackageClientPageProps {
  packageDetails: PackageDetails;
}

export default function ComboPackageClientPage({ packageDetails }: ComboPackageClientPageProps) {
  const { toast } = useToast();

  const handleBooking = () => {
    toast({
      title: "Booking Request (Simulated)",
      description: `Your request for the ${packageDetails.name} has been noted. We'll contact you shortly!`,
    });
  };

  const defaultInclusions = [
    "Accommodation as per itinerary",
    "Meals as specified (B/L/D)",
    "Private 4x4 transport with a pop-up roof",
    "English-speaking professional driver/guide",
    "All park entry fees and activities mentioned",
    "Bottled water in the vehicle"
  ];

  const inclusions = packageDetails.whatsIncluded?.length ? packageDetails.whatsIncluded : defaultInclusions;

  return (
    <div className="space-y-12 pb-20">
      <HeroSection 
        title={packageDetails.name}
        subtitle={packageDetails.subtitle}
        imageUrl={packageDetails.heroImage.src}
        dataAiHint={packageDetails.heroImage.hint}
      />
      
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-8 hover:bg-primary/5">
          <Link href="/packages">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Packages
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatedSection>
              <h2 className="font-headline text-3xl font-black text-primary mb-6 uppercase tracking-tight flex items-center gap-3">
                 <div className="h-8 w-1.5 bg-accent rounded-full" />
                 About This Package
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                    {packageDetails.description}
                </p>
              </div>
            </AnimatedSection>
            
            {packageDetails.includedTours.length > 0 && (
              <AnimatedSection>
                 <h2 className="font-headline text-2xl font-black text-primary mb-6 uppercase tracking-tight flex items-center gap-3">
                    <Compass className="h-6 w-6 text-accent" />
                    Included Destinations
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {packageDetails.includedTours.map(tour => (
                    <Card key={tour.id} className="overflow-hidden group transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-primary/5">
                      <div className="relative h-40 w-full bg-muted">
                         <Image 
                            src={tour.imageUrl || placeholderImages.campaignDetailWildebeest.src} 
                            alt={tour.title} 
                            layout="fill" 
                            objectFit="cover" 
                            data-ai-hint={tour.dataAiHint} 
                            className="transition-transform duration-500 group-hover:scale-110" 
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <Badge className="absolute top-3 left-3 bg-accent text-stone-900 border-none">TOUR</Badge>
                      </div>
                      <CardHeader className="p-4">
                         <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{tour.title}</CardTitle>
                         <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{tour.shortDescription}</p>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                         <Button variant="link" asChild className="p-0 text-accent font-bold hover:text-primary">
                           <Link href={`/campaigns/${tour.id}`}>View Tour <ArrowRight className="ml-1 h-4 w-4"/></Link>
                         </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {packageDetails.sampleItinerary.length > 0 && (
              <AnimatedSection>
                <h2 className="font-headline text-3xl font-black text-primary mb-8 uppercase tracking-tight flex items-center gap-3">
                   <div className="h-8 w-1.5 bg-accent rounded-full" />
                   {packageDetails.itineraryTitle || 'The Journey'}
                </h2>
                 <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
                  {packageDetails.sampleItinerary.map((item, index) => (
                    <AccordionItem key={item.day} value={`item-${index}`} className="border-none">
                      <AccordionTrigger className="font-headline text-xl text-primary font-black hover:no-underline p-6 bg-card rounded-2xl shadow-sm border border-primary/5 hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-6">
                             <div className="bg-accent text-stone-900 rounded-xl h-10 w-10 flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-accent/20 group-data-[state=open]:scale-110 transition-transform">
                                {item.day}
                             </div>
                             <span className="text-left leading-tight">{item.activity}</span>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-2 p-4 sm:p-8 bg-muted/30 rounded-3xl border border-primary/5">
                        <div className="space-y-8">
                            {(item.sections || []).map((section, sIdx) => {
                                if (section.type === 'text') {
                                    return (
                                        <div key={section.id || sIdx} className="prose prose-stone dark:prose-invert max-w-none">
                                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg px-2">
                                                {section.content}
                                            </p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={section.id || sIdx} className={cn(
                                            "relative overflow-hidden rounded-2xl shadow-xl bg-muted group/img",
                                            section.imageLayout === 'full' ? "aspect-video w-full" : "w-full md:w-2/3 aspect-[4/3] mx-auto"
                                        )}>
                                            <Image 
                                                src={section.content || placeholderImages.campaignDetailWildebeest.src} 
                                                alt={`Itinerary visual ${sIdx}`} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover/img:scale-105" 
                                            />
                                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AnimatedSection>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8 h-fit">
                <AnimatedSection>
                   <Card className="bg-stone-950 text-white border-none shadow-2xl rounded-3xl overflow-hidden relative p-8">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="font-headline text-2xl text-accent font-black uppercase tracking-widest">Investment</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white tabular-nums tracking-tighter">${packageDetails.basePrice.toLocaleString()}</span>
                            <span className="text-xs font-bold uppercase text-stone-500 tracking-[0.2em]">{packageDetails.priceDescription}</span>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex items-center text-stone-400">
                                <Clock className="h-5 w-5 mr-4 text-accent"/>
                                <span className="font-bold text-sm uppercase tracking-widest">{packageDetails.durationText}</span>
                            </div>
                            <div className="flex items-center text-stone-400">
                                <Map className="h-5 w-5 mr-4 text-accent"/>
                                <span className="font-bold text-sm uppercase tracking-widest">{packageDetails.includedTours.length} Major Destinations</span>
                            </div>
                        </div>
                      </CardContent>
                       <CardFooter className="p-0 pt-8">
                          <Button className="w-full bg-accent text-stone-900 hover:bg-white font-black h-16 text-lg rounded-2xl transition-all shadow-lg shadow-accent/10" onClick={handleBooking}>
                            <HeartHandshake className="mr-3 h-6 w-6"/> INQUIRE NOW
                          </Button>
                       </CardFooter>
                    </Card>
                </AnimatedSection>

                 <AnimatedSection>
                   <Card className="rounded-3xl border-primary/5 shadow-xl bg-card/80 backdrop-blur-sm">
                      <CardHeader className="p-6 pb-2 border-b bg-muted/20 rounded-t-3xl">
                        <CardTitle className="font-headline text-xl text-primary font-black uppercase tracking-tight flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            What's Included?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {inclusions.map((item, idx) => (
                           <div key={idx} className="flex items-start gap-3 group">
                                <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-green-500 transition-colors">
                                    <Check className="h-3 w-3 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground leading-snug">{item}</span>
                           </div>
                        ))}
                      </CardContent>
                    </Card>
                </AnimatedSection>

                <div className="text-center p-6 space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Bespoke Options Available</p>
                    <p className="text-xs font-medium text-muted-foreground">Every iffe-travels foundation can be tailored to your specific pace and interests.</p>
                    <Button variant="link" className="text-accent font-bold" asChild>
                        <Link href="/contact">Talk to a Specialist</Link>
                    </Button>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
