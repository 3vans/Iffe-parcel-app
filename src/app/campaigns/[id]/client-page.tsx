
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';

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
}

export default function CampaignDetailClientPage({ campaign }: CampaignDetailClientPageProps) {
  const [ref, isVisible] = useScrollAnimation();
  const [formattedEndDate, setFormattedEndDate] = useState('');

  useEffect(() => {
    if (campaign?.endDate) {
      // This runs only on the client, after hydration
      setFormattedEndDate(new Date(campaign.endDate).toLocaleDateString())
    }
  }, [campaign?.endDate]);

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
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </section>
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">The Experience</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.storyline}</p>
              </section>

              <div className="grid sm:grid-cols-2 gap-6">
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><Activity className="mr-2 h-5 w-5"/>Activities</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {campaign.activities.map(activity => <li key={activity}>{activity}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><BedDouble className="mr-2 h-5 w-5"/>Accommodation</h3>
                  <p className="text-muted-foreground">{campaign.accommodation}</p>
                </section>
              </div>

               <section>
                <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><UtensilsCrossed className="mr-2 h-5 w-5"/>Meals</h3>
                <p className="text-muted-foreground">{campaign.meals}</p>
              </section>
              
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
                endDate={formattedEndDate}
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
