'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, DollarSign, HeartHandshake, Info, Map, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from '@/components/animated-section';
import HeroSection from '@/components/layout/hero-section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

// Define the type for the detailed package data passed from the server component
type Tour = {
    id: string;
    title: string;
    shortDescription: string;
    imageUrl: string;
    dataAiHint?: string;
}

type ItineraryItem = {
    day: number;
    activity: string;
    description: string;
}

type PackageDetails = {
    slug: string;
    title: string;
    subtitle: string;
    price: string;
    priceDescription: string;
    duration: string;
    description: string;
    includedTours: Tour[];
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
      description: `Your request for the ${packageDetails.title} has been noted. We'll contact you shortly!`,
    });
  };

  return (
    <div className="space-y-12">
      <HeroSection 
        title={packageDetails.title}
        subtitle={packageDetails.subtitle}
        imageUrl={packageDetails.heroImage.src}
        dataAiHint={packageDetails.heroImage.hint}
      />
      
      <div className="container mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/packages">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Packages
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection>
              <h2 className="font-headline text-2xl font-bold text-primary mb-4">About This Package</h2>
              <p className="text-muted-foreground leading-relaxed">{packageDetails.description}</p>
            </AnimatedSection>
            
            <AnimatedSection>
              <h2 className="font-headline text-2xl font-bold text-primary mb-4">Included Tours</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {packageDetails.includedTours.map(tour => (
                  <Card key={tour.id} className="overflow-hidden group transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full">
                       <Image src={tour.imageUrl} alt={tour.title} layout="fill" objectFit="cover" data-ai-hint={tour.dataAiHint} className="transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <CardHeader>
                       <CardTitle className="text-lg font-semibold">{tour.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground line-clamp-2">{tour.shortDescription}</p>
                    </CardContent>
                    <CardFooter>
                       <Button variant="link" asChild className="p-0 text-accent">
                         <Link href={`/campaigns/${tour.id}`}>View Tour Details <ArrowRight className="ml-1 h-4 w-4"/></Link>
                       </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AnimatedSection>

             <AnimatedSection>
              <h2 className="font-headline text-2xl font-bold text-primary mb-4">Sample Itinerary</h2>
               <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {packageDetails.sampleItinerary.map((item, index) => (
                  <AccordionItem key={item.day} value={`item-${index}`}>
                    <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                           <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">{item.day}</div>
                            {item.activity}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11 border-l-2 border-primary/20 ml-4">
                      <p className="text-muted-foreground">{item.description}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-6">
            <AnimatedSection>
               <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Package Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex items-center text-foreground">
                        <DollarSign className="h-5 w-5 mr-3 text-accent"/>
                        <span className="font-bold text-2xl">{`$${packageDetails.price}`}</span>
                        <span className="text-sm text-muted-foreground ml-1.5">{packageDetails.priceDescription}</span>
                    </div>
                     <div className="flex items-center text-muted-foreground">
                        <Clock className="h-5 w-5 mr-3 text-accent"/>
                        <span>{packageDetails.duration}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Map className="h-5 w-5 mr-3 text-accent"/>
                        <span>{packageDetails.includedTours.length} destinations</span>
                    </div>
                  </CardContent>
                   <CardFooter>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={handleBooking}>
                        <HeartHandshake className="mr-2 h-5 w-5"/> Inquire Now
                      </Button>
                   </CardFooter>
                </Card>
            </AnimatedSection>
             <AnimatedSection>
               <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">What's Included?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>Accommodation as per itinerary</p>
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>Meals as specified (B/L/D)</p>
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>Private 4x4 transport with a pop-up roof</p>
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>English-speaking professional driver/guide</p>
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>All park entry fees and activities mentioned</p>
                    <p className="flex items-start"><Check className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0"/>Bottled water in the vehicle</p>
                  </CardContent>
                </Card>
            </AnimatedSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
