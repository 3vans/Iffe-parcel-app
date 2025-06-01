
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tag, ArrowRight, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  { id: '1', title: 'Clean Water Initiative', imageUrl: 'https://placehold.co/600x350.png', dataAiHint: 'water community', shortDescription: 'Providing clean water to Kasese.', goal: 10000, currentAmount: 4500, tags: ['#CleanWater', '#Health'] },
  { id: '2', title: 'Youth Empowerment Workshops', imageUrl: 'https://placehold.co/600x350.png', dataAiHint: 'youth education training', shortDescription: 'Equipping youth with essential skills.', goal: 18000, currentAmount: 9200, tags: ['#Youth', '#Education'] },
  { id: '3', title: 'Reforestation "Green Future"', imageUrl: 'https://placehold.co/600x350.png', dataAiHint: 'forest trees environment', shortDescription: 'Planting 10,000 trees in Mpigi.', goal: 7500, currentAmount: 6100, tags: ['#Environment', '#ClimateAction'] },
  { id: '4', title: 'Tech Literacy for Seniors', imageUrl: 'https://placehold.co/600x350.png', dataAiHint: 'seniors technology', shortDescription: 'Bridging the digital divide for the elderly.', goal: 5000, currentAmount: 1200, tags: ['#DigitalInclusion', '#Seniors'] },
];


export default async function CampaignsPage() {
  const campaigns = mockCampaignsData; // In a real app, fetch this data

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">Our Campaigns</h1>
        <p className="text-lg text-muted-foreground">Discover and support initiatives making a difference.</p>
      </section>

      {/* Add filtering/sorting options here in the future */}

      {campaigns.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map(campaign => {
            const progressPercentage = campaign.goal > 0 ? (campaign.currentAmount / campaign.goal) * 100 : 0;
            return (
              <Card key={campaign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative w-full h-48">
                  <Image src={campaign.imageUrl} alt={campaign.title} layout="fill" objectFit="cover" data-ai-hint={campaign.dataAiHint} />
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
                      <span className="text-primary">${campaign.currentAmount.toLocaleString()} raised</span>
                      <span className="text-muted-foreground">of ${campaign.goal.toLocaleString()}</span>
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
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No campaigns found. Check back later or start your own!</p>
        </div>
      )}
       <div className="text-center mt-12">
        <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent whitespace-normal text-center h-auto" asChild>
          <Link href="/create?action=campaign" className="flex items-center justify-center">
            <PlusCircle className="mr-0 md:mr-2 h-5 w-5" />
            <span className="md:hidden">New Campaign</span>
            <span className="hidden md:inline">Start Your Own Campaign</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
