
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed, Camera, Users, PlayCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { type RelatedTour } from './page';

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  storyline: string;
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: string[];
  accommodation: string;
  meals: string;
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

  const InfoSectionWithImage = ({ title, icon: Icon, text, imageUrl, imageHint, imagePosition = 'left' }: { title: string, icon: React.ElementType, text: string, imageUrl: string, imageHint?: string, imagePosition?: 'left' | 'right' }) => {
    return (
      <AnimatedSection>
        <div className={cn("grid md:grid-cols-2 gap-8 items-center")}>
          <div className={cn("relative aspect-video rounded-lg overflow-hidden shadow-lg group", imagePosition === 'right' && 'md:order-last')}>
            <Image src={imageUrl} alt={title} layout="fill" className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={imageHint} />
          </div>
          <div>
            <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-2">
              <Icon className="mr-2 h-5 w-5" />
              {title}
            </h3>
            {text.split(',').length > 1 && !['Accommodation', 'Meals'].includes(title) ? (
                 <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {text.split(',').map(item => <li key={item}>{item.trim()}</li>)}
                </ul>
            ) : (
                <p className="text-muted-foreground">{text}</p>
            )}
          </div>
        </div>
      </AnimatedSection>
    );
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
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-8">

              <AnimatedSection>
                <h2 className="font-headline text-2xl font-semibold text-primary">About this Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </AnimatedSection>

               <InfoSectionWithImage 
                title="The Experience"
                icon={Star}
                text={campaign.storyline}
                imageUrl={placeholderImages.gallerySafariGroup.src}
                imageHint={placeholderImages.gallerySafariGroup.hint}
                imagePosition="left"
              />
              
              <InfoSectionWithImage 
                title="Activities"
                icon={Activity}
                text={campaign.activities.join(', ')}
                imageUrl={placeholderImages.ideaWalkingSafari.src}
                imageHint={placeholderImages.ideaWalkingSafari.hint}
                imagePosition="right"
              />
              
              <InfoSectionWithImage 
                title="Accommodation"
                icon={BedDouble}
                text={campaign.accommodation}
                imageUrl={placeholderImages.pkgAdventurer.src}
                imageHint={placeholderImages.pkgAdventurer.hint}
                imagePosition="left"
              />

              <InfoSectionWithImage 
                title="Meals"
                icon={UtensilsCrossed}
                text={campaign.meals}
                imageUrl={placeholderImages.videoThumbTestimonial.src}
                imageHint={placeholderImages.videoThumbTestimonial.hint}
                imagePosition="right"
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
            <aside className="space-y-6 md:sticky md:top-24">
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
                  <p className="text-xs text-muted-foreground">We are committed to responsible and authentic travel experiences.</p>
                </CardContent>
              </Card>
              <RelatedToursCard tours={relatedTours} />
            </aside>
          </div>
          
          <Summarizer campaignDescription={campaign.description} campaignTitle={campaign.title} />

        </CardContent>
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
