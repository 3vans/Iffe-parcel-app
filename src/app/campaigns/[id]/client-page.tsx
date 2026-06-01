
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed, Camera, Users, PlayCircle, Star, ShieldCheck, HelpCircle, FilePen, Map, Info, Globe, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ItinerarySection {
    id: string;
    type: 'text' | 'image';
    content: string;
    imageLayout?: 'small' | 'full';
}

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  sections?: ItinerarySection[];
  storyline: any[]; 
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: any[];
  accommodation: any[];
  meals: any[];
  shortDescription?: string;
  bookingTips?: string[];
}

interface RelatedTour {
    id: string;
    title: string;
}

interface CampaignDetailClientPageProps {
  campaign: Campaign;
  relatedTours: RelatedTour[];
}

const RelatedToursCard: React.FC<{ tours: RelatedTour[] }> = ({ tours }) => {
    if (!tours || tours.length === 0) return null;

    return (
        <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <Users className="mr-2 h-5 w-5"/>Related Tours
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tours.map(tour => (
                    <Button key={tour.id} variant="link" asChild className="p-0 text-foreground hover:text-primary justify-start w-full">
                        <Link href={`/campaigns/${tour.id}`} className="truncate block">{tour.title}</Link>
                    </Button>
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

const NextStepsCard: React.FC = () => {
    return (
        <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <Compass className="mr-2 h-5 w-5"/>Next Steps
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                 <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/contact"><HelpCircle className="mr-2 h-4 w-4"/> Ask a Question</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/campaigns"><Map className="mr-2 h-4 w-4"/> View All Tours</Link>
                </Button>
            </CardContent>
        </Card>
    );
};

const AnimatedSection = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <section ref={ref} id={id} className={cn('scroll-animate space-y-4', isVisible && 'scroll-animate-in', className)}>
            {children}
        </section>
    );
};

const ScrollableImageGrid = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: any[]}) => {
    const validItems = items?.map(item => {
        if (typeof item === 'string') return { title: item, description: '', image: '' };
        return item;
    }).filter(item => item?.title || item?.description) || [];

    if (validItems.length === 0) return null;

    return (
        <AnimatedSection>
            <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-4">
                <Icon className="mr-2 h-5 w-5" />
                {title}
            </h3>
            <ScrollArea>
                <div className="flex space-x-6 pb-4">
                    {validItems.map((item, index) => {
                        const itemImage = placeholderImages[item.image as keyof typeof placeholderImages] || { src: item.image, hint: 'safari visual' };
                        return (
                            <Card key={index} className="overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group w-[280px] sm:w-[300px] flex-shrink-0">
                                <div className="relative w-full aspect-[16/9] bg-muted">
                                    <Image 
                                        src={itemImage.src || placeholderImages.campaignDetailWildebeest.src} 
                                        alt={item.title || title} 
                                        layout="fill" 
                                        style={{ objectFit: 'cover' }} 
                                        data-ai-hint={itemImage.hint} 
                                        className="transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                </CardHeader>
                                {item.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </AnimatedSection>
    );
};

const StaticImageGrid = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: any[] }) => {
    const validItems = items?.map(item => {
        if (typeof item === 'string') return { title: item, description: '', image: '' };
        return item;
    }).filter(item => item?.title || item?.description) || [];

    if (validItems.length === 0) return null;

    return (
        <AnimatedSection>
            <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-4">
                <Icon className="mr-2 h-5 w-5" />
                {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {validItems.map((item, index) => {
                    const itemImage = placeholderImages[item.image as keyof typeof placeholderImages] || { src: item.image, hint: 'safari visual' };
                    return (
                        <Card key={index} className="overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group">
                            <div className="relative w-full aspect-[16/9] bg-muted">
                                <Image 
                                    src={itemImage.src || placeholderImages.campaignDetailWildebeest.src} 
                                    alt={item.title || title} 
                                    layout="fill" 
                                    objectFit="cover" 
                                    data-ai-hint={itemImage.hint} 
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                            </CardHeader>
                            {item.description && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </AnimatedSection>
    );
};

const ExperienceSection = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: any[] }) => {
    if (!items || items.length === 0) return null;

    return (
        <AnimatedSection>
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold text-primary flex items-center mb-4">
                    <Icon className="mr-2 h-5 w-5" />
                    {title}
                </h3>
                <div className="space-y-8">
                  {items.map((item, index) => {
                      const text = typeof item === 'string' ? item : item?.text;
                      const image = typeof item === 'string' ? '' : item?.image;

                      if (!text) return null;
                      
                      const itemImage = placeholderImages[image as keyof typeof placeholderImages] || { src: image, hint: 'safari visual' };
                      
                      return (
                        <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className={cn("relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg group bg-muted", index % 2 !== 0 && "md:order-last")}>
                                <Image 
                                    src={itemImage.src || placeholderImages.campaignDetailWildebeest.src} 
                                    alt={`${title} view ${index+1}`} 
                                    fill
                                    style={{ objectFit: 'cover' }} 
                                    className="transition-transform duration-300 group-hover:scale-105" 
                                    data-ai-hint={itemImage.hint || 'safari moment'} 
                                />
                            </div>
                            <div>
                                <p className="text-muted-foreground leading-relaxed">{text}</p>
                            </div>
                        </div>
                      );
                  })}
                </div>
            </div>
        </AnimatedSection>
    )
};

export default function CampaignDetailClientPage({ campaign, relatedTours }: CampaignDetailClientPageProps) {
  const [ref, isVisible] = useScrollAnimation();
  const [endDate, setEndDate] = useState('');

  const [heroImgSrc, setHeroImgSrc] = useState(campaign.imageUrl || placeholderImages.campaignDetailWildebeest.src);

  useEffect(() => {
    if (campaign?.endDate) {
      try {
        setEndDate(new Date(campaign.endDate).toLocaleDateString());
      } catch (e) {
        setEndDate(campaign.endDate);
      }
    }
  }, [campaign?.endDate]);
  
  return (
    <div ref={ref} className={cn('space-y-8 scroll-animate container mx-auto px-0 sm:px-4 py-8', isVisible && 'scroll-animate-in')}>
      <div className="px-4 sm:px-0">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-x-0 sm:border-x rounded-none sm:rounded-2xl shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <div className="relative w-full h-[300px] md:h-[400px] bg-muted">
          <Image 
            src={heroImgSrc} 
            alt={campaign.title} 
            fill 
            style={{ objectFit: 'cover' }} 
            data-nimg="fill"
            data-ai-hint={campaign.dataAiHint}
            onError={() => setHeroImgSrc(placeholderImages.campaignDetailWildebeest.src)}
            priority 
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
           <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10">{campaign.title}</CardTitle>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-8">

              <AnimatedSection>
                <h2 className="font-headline text-2xl font-semibold text-primary">About this Tour</h2>
                <div className="space-y-6">
                    {(!campaign.sections || campaign.sections.length === 0) && (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{campaign.description}</p>
                    )}
                    
                    {(campaign.sections || []).map((section, idx) => (
                        <div key={section.id || idx}>
                            {section.type === 'text' ? (
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                            ) : (
                                <div className={cn(
                                    "relative overflow-hidden rounded-2xl shadow-xl bg-muted group/img",
                                    section.imageLayout === 'full' ? "aspect-video w-full" : "w-full md:w-2/3 aspect-[4/3] mx-auto"
                                )}>
                                    <Image 
                                        src={section.content || placeholderImages.campaignDetailWildebeest.src} 
                                        alt={`Tour visual ${idx}`} 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
              </AnimatedSection>

               <ExperienceSection
                title="The Experience"
                icon={Star}
                items={campaign.storyline || []}
              />
            </div>

            <aside className="space-y-6 md:sticky md:top-24 h-fit px-4 sm:px-0">
                <CampaignActionsCard
                    campaignTitle={campaign.title}
                    currentAmount={campaign.currentAmount}
                    goal={campaign.goal}
                    endDate={campaign.endDate}
                    volunteersSignedUp={campaign.volunteersSignedUp || 0}
                    volunteersNeeded={campaign.volunteersNeeded || 10}
                />
                <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Globe className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Operator</p>
                                <p className="text-foreground font-bold">{campaign.organizer || 'iffe-travels'}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardHeader className='pt-0'>
                        <CardTitle className="font-headline text-xl text-primary flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-accent"/>Authentic Travel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">We are committed to responsible tourism practices that protect wildlife, support conservation efforts, and benefit local communities.</p>
                    </CardContent>
                </Card>
                <RelatedToursCard tours={relatedTours} />
                <NextStepsCard />
            </aside>
          </div>

          <div className="mt-8 space-y-8 px-4 sm:px-0">
              <ScrollableImageGrid
                title="Activities"
                icon={Activity}
                items={campaign.activities || []}
              />
              
              <StaticImageGrid
                title="Accommodation"
                icon={BedDouble}
                items={campaign.accommodation || []}
              />

              <StaticImageGrid
                title="Meals"
                icon={UtensilsCrossed}
                items={campaign.meals || []}
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
          
          <div className="px-4 sm:px-0">
            <Summarizer 
              campaignDescription={campaign.description} 
              campaignTitle={campaign.title} 
              bookingTips={campaign.bookingTips} 
            />
          </div>
        </div>
        
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Reviews (32)</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={`/contact?interest=${campaign.id}`}>
              Inquire for Details <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
