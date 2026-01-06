
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed, Camera, Users, PlayCircle, Star, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { type RelatedTour } from './page';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  storyline: string[];
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: { title: string; description: string; image: keyof typeof placeholderImages }[];
  accommodation: { title: string; description: string; image: keyof typeof placeholderImages }[];
  meals: { title: string; description: string; image: keyof typeof placeholderImages }[];
  shortDescription?: string;
}

interface CampaignDetailClientPageProps {
  campaign: Campaign;
  relatedTours: RelatedTour[];
}

const RelatedToursCard: React.FC<{ tours: RelatedTour[] }> = ({ tours }) => {
    if (tours.length === 0) return null;

    return (
        <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <Users className="mr-2 h-5 w-5"/>Related Tours
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {tours.map(tour => (
                    <Link key={tour.id} href={`/campaigns/${tour.id}`} className="block group">
                        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-card/50 transition-colors">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                                <Image 
                                    src={tour.imageUrl} 
                                    alt={tour.title} 
                                    fill 
                                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                    data-ai-hint={tour.dataAiHint}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{tour.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
             <CardFooter>
                <Button variant="link" className="text-accent hover:text-accent/80 p-0 text-sm w-full justify-start" asChild>
                    <Link href="/campaigns">View All Tours <ExternalLink className="ml-1.5 h-3 w-3" /></Link>
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function CampaignDetailClientPage({ campaign, relatedTours }: CampaignDetailClientPageProps) {
  const [ref, isVisible] = useScrollAnimation();
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (campaign?.endDate) {
      setEndDate(new Date(campaign.endDate).toLocaleDateString())
    }
  }, [campaign?.endDate]);
  
  const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <section ref={ref} className={cn('scroll-animate space-y-4', isVisible && 'scroll-animate-in', className)}>
            {children}
        </section>
    );
  };
  
  const ImageGridInfoSection = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: {title: string, description: string, image: keyof typeof placeholderImages}[] }) => {
    const isScrollable = items.length > 3;
    return (
        <AnimatedSection>
            <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-4">
                <Icon className="mr-2 h-5 w-5" />
                {title}
            </h3>
            {isScrollable ? (
                 <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                    <div className="flex w-max space-x-4 pb-4">
                         {items.map((item, index) => {
                            const itemImage = placeholderImages[item.image];
                            return (
                                <Card key={index} className="overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group w-[300px] sm:w-[350px] whitespace-normal">
                                    <div className="relative w-full aspect-[16/9] bg-muted">
                                        <Image 
                                            src={itemImage.src} 
                                            alt={item.title} 
                                            layout="fill" 
                                            objectFit="cover" 
                                            data-ai-hint={itemImage.hint} 
                                            className="transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {items.map((item, index) => {
                        const itemImage = placeholderImages[item.image];
                        return (
                            <Card key={index} className="overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group">
                                <div className="relative w-full aspect-[16/9] bg-muted">
                                    <Image 
                                        src={itemImage.src} 
                                        alt={item.title} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        data-ai-hint={itemImage.hint} 
                                        className="transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </AnimatedSection>
    );
  };

  const ExperienceSection = ({ title, icon: Icon, texts, images }: { title: string, icon: React.ElementType, texts: string[], images: {src: string, hint?: string}[] }) => {
    return (
        <AnimatedSection>
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-4">
                    <Icon className="mr-2 h-5 w-5" />
                    {title}
                </h3>
                <div className="space-y-8">
                  {images.map((image, index) => (
                      <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
                          <div className={cn("relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg group", index % 2 !== 0 && "md:order-last")}>
                              <Image src={image.src} alt={`${title} view ${index+1}`} layout="fill" className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={image.hint} />
                          </div>
                          <div>
                              <p className="text-muted-foreground leading-relaxed">{texts[index] || ''}</p>
                          </div>
                      </div>
                  ))}
                </div>
            </div>
        </AnimatedSection>
    )
  };

  return (
    <div ref={ref} className={cn('space-y-8 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image 
            src={campaign.imageUrl} 
            alt={campaign.title} 
            fill 
            className="object-cover" 
            data-ai-hint={campaign.dataAiHint}
            priority 
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
           <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10">{campaign.title}</CardTitle>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-8">

              <AnimatedSection>
                <h2 className="font-headline text-2xl font-semibold text-primary">About this Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </AnimatedSection>

               <ExperienceSection
                title="The Experience"
                icon={Star}
                texts={campaign.storyline}
                images={[
                  { src: placeholderImages.gallerySafariGroup.src, hint: placeholderImages.gallerySafariGroup.hint },
                  { src: placeholderImages.blogLionPride.src, hint: placeholderImages.blogLionPride.hint },
                  { src: placeholderImages.fifaCardGorilla.src, hint: placeholderImages.fifaCardGorilla.hint },
                ]}
              />
            </div>

            <aside className="space-y-6 md:sticky md:top-24 h-fit">
                <CampaignActionsCard
                    campaignTitle={campaign.title}
                    currentAmount={campaign.currentAmount}
                    goal={campaign.goal}
                    endDate={endDate}
                    volunteersSignedUp={campaign.volunteersSignedUp}
                    volunteersNeeded={campaign.volunteersNeeded}
                />
                <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center"><Compass className="mr-2 h-5 w-5"/>Tour Operator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground font-semibold">{campaign.organizer}</p>
                    </CardContent>
                    <CardHeader className='pt-0'>
                        <CardTitle className="font-headline text-xl text-primary flex items-center"><ShieldCheck className="mr-2 h-5 w-5"/>Responsible &amp; Authentic Travel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">We are committed to responsible tourism practices that protect wildlife, support conservation efforts, and benefit local communities.</p>
                    </CardContent>
                </Card>
                <RelatedToursCard tours={relatedTours} />
            </aside>
          </div>

          <div className="mt-8 space-y-8">
              <ImageGridInfoSection
                title="Activities"
                icon={Activity}
                items={campaign.activities}
              />
              
              <ImageGridInfoSection
                title="Accommodation"
                icon={BedDouble}
                items={campaign.accommodation}
              />

              <ImageGridInfoSection
                title="Meals"
                icon={UtensilsCrossed}
                items={campaign.meals}
              />
              
              {campaign.tags && campaign.tags.length > 0 && (
                <section>
                   <h3 className="font-headline text-lg font-semibold text-primary mb-2">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="secondary"><Tag className="h-3 w-3 mr-1" />{tag.replace('#', '')}</Badge>
                    ))}
                  </div>
                </section>
              )}
          </div>
          
          <Summarizer campaignDescription={campaign.description} campaignTitle={campaign.title} />
        </div>
        
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Reviews (32)</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={`/campaigns/${campaign.id}/updates`}>
              View Full Itinerary <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    

    