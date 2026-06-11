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
import PageHero from '@/components/layout/page-hero';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from '@/components/animated-section';
import { fetchCampaigns, type Campaign } from '@/lib/services/cms-service';

const ITEMS_PER_PAGE = 6;
const regions = ['All Regions', 'Western', 'Eastern', 'Northern', 'Central', 'Other'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.tags?.some(tag => tag.toLowerCase().replace('#', '').includes(searchTerm.toLowerCase()));
      
      const matchesRegion = regionFilter === 'All Regions' || campaign.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [campaigns, searchTerm, regionFilter]);
  
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, regionFilter]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const campaignsToShow = filteredCampaigns.slice(0, visibleCount);

  const AnimatedCard = ({ campaign }: { campaign: Campaign }) => {
    const [ref, isVisible] = useScrollAnimation();
    const progressPercentage = campaign.currentAmount || 0;
    const [imgSrc, setImgSrc] = useState(campaign.imageUrl || placeholderImages.campaignDetailWildebeest.src);

    return (
        <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in')}>
            <Card key={campaign.id} className="overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card/80 backdrop-blur-sm border-primary/5">
            <div className="relative w-full h-48 bg-muted">
                <Image 
                    src={imgSrc} 
                    alt={campaign.title} 
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={campaign.dataAiHint || "safari adventure"} 
                    onError={() => setImgSrc(placeholderImages.campaignDetailWildebeest.src)}
                />
            </div>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl hover:text-primary transition-colors leading-tight">
                        <Link href={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider shrink-0 ml-2">{campaign.region}</Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 h-8 mt-1">{campaign.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                    <span className="text-primary">{campaign.currentAmount}% Traveller Rating</span>
                    <span className="text-muted-foreground">Verified</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" aria-label={`${progressPercentage}% rating`} />
                </div>
                {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {campaign.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] bg-secondary/50 text-secondary-foreground font-medium border-none">
                        <Tag className="h-2.5 w-2.5 mr-1" /> {tag.replace('#', '')}
                    </Badge>
                    ))}
                </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4 bg-muted/5">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-sm font-bold tracking-wide">
                <Link href={`/campaigns/${campaign.id}`}>
                    EXPLORE ITINERARY <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            </CardFooter>
            </Card>
        </div>
    );
    };
    
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <PageHero 
        title="Bespoke Safari Tours"
        subtitle="Unforgettable wildlife encounters and cultural journeys across the Pearl of Africa."
        imageUrl={placeholderImages.campaignDetailWildebeest.src}
        dataAiHint={placeholderImages.campaignDetailWildebeest.hint}
      />

      <div className="container mx-auto px-4 space-y-12">
        <AnimatedSection>
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div>
                    <h2 className="font-headline text-3xl font-black text-primary uppercase tracking-tighter mb-2">Find Your Adventure</h2>
                    <p className="text-sm text-muted-foreground font-medium">Filter by region or search for specific experiences like "Gorilla" or "Rafting".</p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="relative flex items-center w-full">
                        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search tours or tags..." 
                            className="w-full h-12 text-base rounded-2xl border-primary/10 pl-12 bg-white/50 focus-visible:ring-accent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-full sm:w-[220px] h-12 rounded-2xl border-primary/10 text-base bg-white/50 focus-visible:ring-accent">
                        <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {regions.map(region => (
                        <SelectItem key={region} value={region} className="rounded-lg">{region}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>
        </AnimatedSection>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tracking Tours...</p>
            </div>
        ) : campaignsToShow.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaignsToShow.map(campaign => (
                <AnimatedCard key={campaign.id} campaign={campaign} />
            ))}
            </section>
        ) : (
            <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-primary/5">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-bold text-muted-foreground">
                    {searchTerm || regionFilter !== 'All Regions' ? `No tours match your current criteria.` : "Our tour calendar is currently being updated."}
                </p>
                <Button variant="link" onClick={() => {setSearchTerm(''); setRegionFilter('All Regions');}} className="text-accent mt-2">Clear all filters</Button>
            </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            {visibleCount < filteredCampaigns.length && (
                <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleLoadMore} 
                    disabled={isLoadingMore}
                    className="rounded-full px-10 border-primary/20 hover:bg-primary/5 h-14 font-bold text-primary"
                >
                    {isLoadingMore ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            LOADING...
                        </>
                    ) : "LOAD MORE ADVENTURES"}
                </Button>
            )}
            <Button size="lg" className="rounded-full px-10 h-14 bg-accent text-accent-foreground hover:bg-accent/90 font-black shadow-lg shadow-accent/20" asChild>
            <Link href="/campaigns/new" className="flex items-center justify-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                PLAN A CUSTOM TOUR
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
