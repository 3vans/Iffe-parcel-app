

'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tag, ArrowRight, PlusCircle, MountainSnow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useState } from 'react';
import HeroSection from '@/components/layout/hero-section';

interface CampaignTeaser {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  shortDescription: string;
  goal: number;
  currentAmount: number;
  tags: string[];
}

const mockCampaignsData: CampaignTeaser[] = [
  { id: '1', title: 'Serengeti Great Migration', imageUrl: placeholderImages.campaignDetailWildebeest.src, dataAiHint: 'wildebeest serengeti', shortDescription: 'Witness the epic annual migration of wildebeest.', goal: 100, currentAmount: 85, tags: ['#BigFive', '#Tanzania'] },
  { id: '2', title: 'Gorilla Trekking Adventure', imageUrl: placeholderImages.campaignDetailGorilla.src, dataAiHint: 'mountain gorilla jungle', shortDescription: 'An unforgettable encounter with mountain gorillas.', goal: 100, currentAmount: 92, tags: ['#Primates', '#Uganda'] },
  { id: '3', title: 'Okavango Delta Mokoro Trip', imageUrl: placeholderImages.campaignDetailMokoro.src, dataAiHint: 'mokoro canoe delta', shortDescription: 'Explore the serene waterways of Botswana.', goal: 100, currentAmount: 61, tags: ['#Wetlands', '#Botswana'] },
  { id: '4', title: 'Luxury Safari in Kruger Park', imageUrl: 'https://picsum.photos/seed/kruger/600/350', dataAiHint: 'safari lodge sunset', shortDescription: 'Experience the wild in comfort and style.', goal: 100, currentAmount: 45, tags: ['#Luxury', '#SouthAfrica'] },
];


export default function CampaignsPage() {
  const campaigns: CampaignTeaser[] = mockCampaignsData;

  const AnimatedCard = ({ campaign }: { campaign: CampaignTeaser }) => {
    const [ref, isVisible] = useScrollAnimation();
    const progressPercentage = campaign.goal > 0 ? (campaign.currentAmount / campaign.goal) * 100 : 0;
    const [imgSrc, setImgSrc] = useState(campaign.imageUrl);

    return (
        <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
            <Card key={campaign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card/80 backdrop-blur-sm">
            <div className="relative w-full h-48">
                <Image 
                    src={imgSrc} 
                    alt={campaign.title} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={campaign.dataAiHint} 
                    onError={() => setImgSrc(placeholderImages.campaignDetailWildebeest.src)}
                />
            </div>
            <CardHeader>
                <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
                <Link href={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 h-8">{campaign.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-primary">{campaign.currentAmount.toLocaleString()}% Traveller Rating</span>
                    <span className="text-muted-foreground">based on {campaign.goal.toLocaleString()} reviews</span>
                </div>
                <Progress value={progressPercentage} className="h-2" aria-label={`${progressPercentage}% funded`} />
                </div>
                {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {campaign.tags.slice(0, 2).map(tag => ( // Show max 2 tags
                    <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" /> {tag.replace('#', '')}
                    </Badge>
                    ))}
                </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 whitespace-normal h-auto text-center">
                <Link href={`/campaigns/${campaign.id}`}>
                    View Itinerary <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            </CardFooter>
            </Card>
        </div>
    );
    };
    
  return (
    <div className="space-y-8 animate-fade-in">
      <HeroSection 
        title="Our Safari Tours"
        subtitle="Discover and book adventures that make a difference."
        Icon={MountainSnow}
        imageUrl={placeholderImages.campaignDetailWildebeest.src}
        dataAiHint={placeholderImages.campaignDetailWildebeest.hint}
      />

      {campaigns.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map(campaign => (
            <AnimatedCard key={campaign.id} campaign={campaign} />
          ))}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No tours found. Check back later or suggest a new one!</p>
        </div>
      )}
       <div className="text-center mt-12">
        <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent whitespace-normal text-center h-auto" asChild>
          <Link href="/campaigns/new" className="flex items-center justify-center">
            <PlusCircle className="mr-0 md:mr-2 h-5 w-5" />
            <span className="md:hidden">New Tour</span>
            <span className="hidden md:inline">Plan a Custom Tour</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
