import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, CalendarDays, DollarSign, ExternalLink, HeartHandshake, MessageSquare, Share2, Users, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual data fetching logic
interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
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
}

const mockCampaignsData: Campaign[] = [
  {
    id: '1',
    title: 'Clean Water Initiative',
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'water community',
    description: 'This initiative aims to provide access to clean and safe drinking water for over 5,000 people in the rural community of Kasese. By drilling new boreholes and installing water purification systems, we can significantly reduce waterborne diseases and improve overall health. The project also includes hygiene education workshops to ensure sustainable practices. We believe that access to clean water is a fundamental human right, and with your support, we can make a tangible difference in the lives of many families. This long description serves as a good test for the AI summarizer feature, which will provide a concise overview of these key points.',
    storyline: 'For years, the Kasese community has struggled with contaminated water sources. Our project directly addresses this by building infrastructure and empowering locals with knowledge. We will work hand-in-hand with community leaders.',
    budget: 15000,
    goal: 10000,
    currentAmount: 4500,
    organizer: 'e-Rotary Club Kampala',
    tags: ['#CleanWater', '#Health', '#CommunityDevelopment', '#Uganda'],
    startDate: '2023-09-01',
    endDate: '2024-03-31',
    volunteersNeeded: 50,
    volunteersSignedUp: 22,
  },
   { id: '2', title: 'Youth Empowerment Workshops', imageUrl: 'https://placehold.co/1200x600.png', dataAiHint: 'youth education training', shortDescription: 'Equipping young people with skills for a brighter future through interactive workshops.', description: 'Our Youth Empowerment Workshops are designed to equip young individuals aged 16-25 with essential life and vocational skills. The program covers financial literacy, digital skills, entrepreneurship, and leadership development. By investing in our youth, we are investing in the future of our nation. These workshops will be conducted across various regions, ensuring wide accessibility. Participants will receive certificates upon completion and mentorship opportunities to guide their career paths. This initiative is vital for addressing youth unemployment and fostering innovation.', storyline: 'Many young Ugandans lack access to quality skills training. These workshops bridge that gap.', budget: 20000, goal: 18000, currentAmount: 9200, organizer: 'Rotaract Club of Makerere', tags: ['#YouthEmpowerment', '#SkillsDevelopment', '#Education', '#FutureLeaders'], startDate: '2023-10-15', endDate: '2024-06-30', volunteersNeeded: 30, volunteersSignedUp: 15, },
  { id: '3', title: 'Reforestation Project "Green Future"', imageUrl: 'https://placehold.co/1200x600.png', dataAiHint: 'forest trees environment', shortDescription: 'Planting 10,000 trees to combat climate change and restore local ecosystems.', description: 'The "Green Future" Reforestation Project is a response to the alarming rate of deforestation in the Mpigi district. We aim to plant 10,000 indigenous trees, restoring vital ecosystems, improving biodiversity, and combating climate change. This community-driven project will involve local schools and volunteers in tree planting and maintenance. Educational sessions on environmental conservation will also be part of the initiative. A greener future is possible with collective effort.', storyline: 'Deforestation threatens our environment. We are taking action by planting trees and educating communities.', budget: 8000, goal: 7500, currentAmount: 6100, organizer: 'Obutonde Initiative', tags: ['#Reforestation', '#ClimateAction', '#Environment', '#Sustainability'], startDate: '2023-11-01', endDate: '2024-05-31', volunteersNeeded: 100, volunteersSignedUp: 45, },
];

async function getCampaign(id: string): Promise<Campaign | undefined> {
  // Simulate API call
  return mockCampaignsData.find(campaign => campaign.id === id);
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaign(params.id);

  if (!campaign) {
    notFound();
  }

  const progressPercentage = campaign.goal > 0 ? (campaign.currentAmount / campaign.goal) * 100 : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image src={campaign.imageUrl} alt={campaign.title} layout="fill" objectFit="cover" data-ai-hint={campaign.dataAiHint} />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
           <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10">{campaign.title}</CardTitle>
        </div>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Campaign</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </section>
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.storyline}</p>
              </section>
              {campaign.tags && campaign.tags.length > 0 && (
                <section>
                   <h3 className="font-headline text-lg font-semibold text-primary mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="secondary"><Tag className="h-3 w-3 mr-1" />{tag.replace('#', '')}</Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <aside className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">Campaign Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary">${campaign.currentAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground">raised of ${campaign.goal.toLocaleString()} goal</span>
                  </div>
                  <Progress value={progressPercentage} aria-label={`${progressPercentage}% funded`} />
                   <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2 text-accent" />
                    <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-accent" />
                    <span>{campaign.volunteersSignedUp} / {campaign.volunteersNeeded} Volunteers</span>
                  </div>
                  <Button className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                    <HeartHandshake className="mr-2 h-5 w-5" /> Donate Now
                  </Button>
                   <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-5 w-5" /> Volunteer
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{campaign.organizer}</p>
                  {/* Add link to organizer profile if available */}
                </CardContent>
              </Card>
            </aside>
          </div>
          
          <Summarizer campaignDescription={campaign.description} campaignTitle={campaign.title} />

        </CardContent>
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Comments (0)</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={`/campaigns/${campaign.id}/updates`}>
              View Timeline Updates <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
