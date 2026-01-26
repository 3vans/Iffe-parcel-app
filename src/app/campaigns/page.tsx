
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tag, ArrowRight, PlusCircle, Loader2, Search, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useState, useMemo, useEffect } from 'react';
import HeroSection from '@/components/layout/hero-section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from '@/components/animated-section';

interface CampaignTeaser {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  shortDescription: string;
  goal: number;
  currentAmount: number;
  tags: string[];
  region: 'Western' | 'Eastern' | 'Northern' | 'Central' | 'Other';
}

const mockCampaignsData: CampaignTeaser[] = [
  // Western Uganda
  { id: '1', title: 'Bwindi Gorilla Trekking', imageUrl: placeholderImages.campaignBwindi.src, dataAiHint: 'bwindi forest', shortDescription: 'World-famous gorilla trekking in a UNESCO World Heritage site.', goal: 100, currentAmount: 98, tags: ['#Gorilla', '#UNESCO'], region: 'Western' },
  { id: '2', title: 'Queen Elizabeth National Park', imageUrl: placeholderImages.campaignQueenElizabeth.src, dataAiHint: 'tree climbing lion', shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.', goal: 100, currentAmount: 92, tags: ['#Wildlife', '#Lions'], region: 'Western' },
  { id: '3', title: 'Murchison Falls Safari', imageUrl: placeholderImages.campaignMurchison.src, dataAiHint: 'murchison falls', shortDescription: 'See the powerful falls and diverse wildlife of Murchison.', goal: 100, currentAmount: 88, tags: ['#Wildlife', '#Waterfalls'], region: 'Western' },
  { id: '4', title: 'Kibale Forest Chimpanzee Trekking', imageUrl: placeholderImages.campaignKibale.src, dataAiHint: 'chimpanzee forest', shortDescription: 'Trek chimpanzees in the primate capital of East Africa.', goal: 100, currentAmount: 85, tags: ['#Chimpanzee', '#Primates'], region: 'Western' },
  { id: '5', title: 'Rwenzori Mountains Hiking', imageUrl: placeholderImages.campaignRwenzori.src, dataAiHint: 'rwenzori mountains', shortDescription: 'Hike the snow-capped "Mountains of the Moon".', goal: 100, currentAmount: 75, tags: ['#Hiking', '#Mountains'], region: 'Western' },
  { id: '6', title: 'Relax at Lake Bunyonyi', imageUrl: placeholderImages.campaignBunyonyi.src, dataAiHint: 'lake bunyonyi', shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.', goal: 100, currentAmount: 95, tags: ['#Relaxation', '#Scenery'], region: 'Western' },
  { id: '7', title: 'Lake Mburo Cycling Safari', imageUrl: placeholderImages.campaignMburo.src, dataAiHint: 'zebra safari', shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.', goal: 100, currentAmount: 82, tags: ['#Cycling', '#Zebras'], region: 'Western' },
  // Eastern Uganda
  { id: '8', title: 'Jinja - Source of the Nile', imageUrl: placeholderImages.campaignSourceNile.src, dataAiHint: 'source of nile', shortDescription: 'Discover the legendary source of the world\'s longest river.', goal: 100, currentAmount: 90, tags: ['#Jinja', '#RiverNile'], region: 'Eastern' },
  { id: '9', title: 'White-Water Rafting in Jinja', imageUrl: placeholderImages.campaignRafting.src, dataAiHint: 'white water rafting', shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.', goal: 100, currentAmount: 95, tags: ['#Adventure', '#Jinja'], region: 'Eastern' },
  { id: '10', title: 'Mount Elgon National Park', imageUrl: placeholderImages.campaignElgon.src, dataAiHint: 'mount elgon', shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.', goal: 100, currentAmount: 78, tags: ['#Hiking', '#Volcano'], region: 'Eastern' },
  { id: '11', title: 'Sipi Falls Adventure', imageUrl: placeholderImages.campaignSipi.src, dataAiHint: 'sipi falls', shortDescription: 'Explore a series of beautiful waterfalls with coffee tours and hikes.', goal: 100, currentAmount: 88, tags: ['#Waterfalls', '#Coffee'], region: 'Eastern' },
  { id: '12', title: 'Busoga Kingdom Cultural Tour', imageUrl: placeholderImages.campaignBusoga.src, dataAiHint: 'cultural kingdom', shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.', goal: 100, currentAmount: 65, tags: ['#Culture', '#History'], region: 'Eastern' },
  // Northern Uganda
  { id: '13', title: 'Kidepo Valley National Park', imageUrl: placeholderImages.campaignKidepo.src, dataAiHint: 'kidepo valley', shortDescription: 'Explore remote, rugged landscapes with unique wildlife.', goal: 100, currentAmount: 70, tags: ['#Remote', '#Wilderness'], region: 'Northern' },
  { id: '14', title: 'Karuma Falls Wildlife Tour', imageUrl: placeholderImages.campaignKaruma.src, dataAiHint: 'karuma falls', shortDescription: 'Spot wildlife near the stunning Karuma Falls on the Nile.', goal: 100, currentAmount: 85, tags: ['#Wildlife', '#NationalPark'], region: 'Northern' },
  { id: '15', title: 'Pian Upe Wildlife Reserve', imageUrl: placeholderImages.campaignPianUpe.src, dataAiHint: 'savannah reserve', shortDescription: 'Discover rare wildlife species in a semi-arid savannah.', goal: 100, currentAmount: 60, tags: ['#RareWildlife', '#Savannah'], region: 'Northern' },
  // Central Uganda
  { id: '16', title: 'Kampala City Tour', imageUrl: placeholderImages.campaignKampala.src, dataAiHint: 'kampala city', shortDescription: 'Explore museums, mosques, and cultural centres in Uganda\'s capital.', goal: 100, currentAmount: 91, tags: ['#CityTour', '#Culture'], region: 'Central' },
  { id: '17', title: 'Entebbe Botanical Gardens', imageUrl: placeholderImages.campaignEntebbe.src, dataAiHint: 'entebbe botanical', shortDescription: 'Visit the Wildlife Centre and relax by Lake Victoria.', goal: 100, currentAmount: 89, tags: ['#Gardens', '#Relaxation'], region: 'Central' },
  { id: '18', title: 'Ngamba Island Chimpanzee Sanctuary', imageUrl: placeholderImages.campaignNgamba.src, dataAiHint: 'chimpanzee sanctuary', shortDescription: 'Visit a sanctuary for orphaned chimpanzees on Lake Victoria.', goal: 100, currentAmount: 94, tags: ['#Conservation', '#Chimpanzee'], region: 'Central' },
  { id: '19', title: 'Mabira Forest Zip-Lining', imageUrl: placeholderImages.campaignMabira.src, dataAiHint: 'rainforest zip', shortDescription: 'Experience the thrill of zip-lining through a lush rainforest.', goal: 100, currentAmount: 86, tags: ['#Adventure', '#Forest'], region: 'Central' },
  { id: '20', title: 'Ssese Islands Relaxation', imageUrl: placeholderImages.campaignSsese.src, dataAiHint: 'lake victoria island', shortDescription: 'Unwind on the beautiful beaches of the Ssese Islands.', goal: 100, currentAmount: 93, tags: ['#Beach', '#Relaxation'], region: 'Central' },
  // Other Areas
  { id: '21', title: 'Semuliki National Park', imageUrl: placeholderImages.campaignSemuliki.src, dataAiHint: 'semuliki hot springs', shortDescription: 'Discover unique bird species and boiling hot springs.', goal: 100, currentAmount: 77, tags: ['#BirdWatching', '#HotSprings'], region: 'Other' },
  { id: '22', title: 'Toro Kingdom & Fort Portal', imageUrl: placeholderImages.campaignFortPortal.src, dataAiHint: 'crater lake', shortDescription: 'Explore stunning crater lakes and rich cultural experiences.', goal: 100, currentAmount: 81, tags: ['#Culture', '#Scenery'], region: 'Other' },
];

const ITEMS_PER_PAGE = 6;
const regions = ['All Regions', 'Western', 'Eastern', 'Northern', 'Central', 'Other'];

export default function CampaignsPage() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  const filteredCampaigns = useMemo(() => {
    return mockCampaignsData.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.tags.some(tag => tag.toLowerCase().replace('#', '').includes(searchTerm.toLowerCase()));
      
      const matchesRegion = regionFilter === 'All Regions' || campaign.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, regionFilter]);
  
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, regionFilter]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500); // Simulate network delay
  };

  const campaignsToShow = filteredCampaigns.slice(0, visibleCount);

  const AnimatedCard = ({ campaign }: { campaign: CampaignTeaser }) => {
    const [ref, isVisible] = useScrollAnimation();
    const progressPercentage = campaign.goal > 0 ? (campaign.currentAmount / campaign.goal) * 100 : 0;
    const [imgSrc, setImgSrc] = useState(campaign.imageUrl);

    return (
        <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in')}>
            <Card key={campaign.id} className="overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card/80 backdrop-blur-sm">
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
        iconName="MountainSnow"
        imageUrl={placeholderImages.campaignDetailWildebeest.src}
        dataAiHint={placeholderImages.campaignDetailWildebeest.hint}
      />

      <AnimatedSection>
        <div className="text-center">
            <h2 className="font-headline text-xl font-bold text-primary mb-2">Search & Filter Tours</h2>
            <p className="text-sm text-muted-foreground mb-4">Find your next adventure using a keyword or region.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="relative flex items-center w-full max-w-md">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search by keyword or tag..." 
                        className="w-full h-12 text-base rounded-full border pl-12 focus-visible:ring-2 focus-visible:ring-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-full sm:w-auto h-12 rounded-full border text-base focus-visible:ring-2 focus-visible:ring-accent">
                    <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
        </div>
      </AnimatedSection>

      {campaignsToShow.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignsToShow.map(campaign => (
            <AnimatedCard key={campaign.id} campaign={campaign} />
          ))}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            {searchTerm || regionFilter !== 'All Regions' ? `No tours found for your criteria.` : "No tours found. Check back later!"}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-12">
        {visibleCount < filteredCampaigns.length && (
            <Button size="lg" variant="secondary" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                    </>
                ) : "Load More Tours"}
            </Button>
        )}
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
