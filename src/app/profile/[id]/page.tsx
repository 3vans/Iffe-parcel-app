
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, MessageSquare, ArrowLeft } from 'lucide-react';
import VerifiedBadge from '@/components/verified-badge'; 
import placeholderImages from '@/app/lib/placeholder-images.json';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { notFound, useParams } from 'next/navigation';

interface Ranger {
  id: string;
  name: string;
  title: string;
  avatar: keyof typeof placeholderImages;
  bio: string;
  stats: { label: string; value: string }[];
  isVerified: boolean;
  blogPosts: BlogCardProps[];
  guidedTours: { id: string; title: string; shortDescription: string; image: keyof typeof placeholderImages }[];
}

const rangersData: Ranger[] = [
  {
    id: 'ranger-ben',
    name: 'Ranger Ben',
    title: 'Conservation & Tracking Specialist',
    avatar: 'homeCreatorTom',
    bio: `With over 15 years of experience in the African bush, Ranger Ben is a master tracker and a passionate conservationist. His deep understanding of animal behavior and the delicate balance of the ecosystem provides a safari experience that is both thrilling and educational. Ben specializes in walking safaris and has a keen eye for spotting the most elusive wildlife. He believes that true conservation comes from a place of respect and understanding, a philosophy he shares with every traveler he guides.`,
    stats: [
      { label: 'Experience', value: '15+ Years' },
      { label: 'Tours Guided', value: '400+' },
      { label: 'Specialties', value: 'Tracking, Conservation' },
    ],
    isVerified: true,
    blogPosts: [
      { id: '2', title: 'Birdwatcher\'s Paradise: The Shoebill of Mabamba Swamp', author: 'Ranger Ben', date: 'Oct 22, 2023', excerpt: 'Journey into the swamps of Uganda to find one of the world\'s most prehistoric and sought-after birds.', imageUrl: placeholderImages.blogShoebill.src, dataAiHint: 'shoebill stork', tags: ['#Birdwatching', '#Uganda'], commentCount: 8 },
    ],
    guidedTours: [
      { id: '2', title: 'Queen Elizabeth National Park', shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.', image: 'campaignQueenElizabeth' },
      { id: '4', title: 'Kibale Forest Chimpanzee Trekking', shortDescription: 'Trek chimpanzees in the primate capital of East Africa.', image: 'campaignKibale' },
    ],
  },
  {
    id: 'ian-ivan',
    name: 'Ian Ivan',
    title: 'Expert Guide & Wildlife Photographer',
    avatar: 'homeCreatorJane',
    bio: `Ian combines his love for adventure with his passion for photography. With a decade of experience leading tours across East Africa, he knows all the best spots to get that perfect shot. Ian's tours are not just about seeing animals, but about capturing their spirit and the beauty of their environment. He offers workshops on the go, helping travelers improve their photography skills while creating lasting memories.`,
    stats: [
      { label: 'Experience', value: '10+ Years' },
      { label: 'Tours Guided', value: '300+' },
      { label: 'Specialties', value: 'Photography, Big Cats' },
    ],
    isVerified: true,
    blogPosts: [
      { id: 'b1', title: 'A Lion\'s Tale: A Close Encounter', author: 'Ian Ivan', date: 'Nov 05, 2023', excerpt: 'The story of a thrilling and humbling afternoon spent observing a pride of lions in their natural habitat.', imageUrl: 'https://picsum.photos/seed/lionPride/600/400', dataAiHint: 'lion pride', tags: ['#BigCats', '#Serengeti'], commentCount: 18 },
    ],
    guidedTours: [
      { id: '1', title: 'Serengeti Great Migration', shortDescription: 'Witness the epic annual migration of over a million wildebeest across the Serengeti plains.', image: 'campaignDetailWildebeest' },
    ],
  },
];


const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in', className)}>
            <Card className={cn("overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full", className)}>
                {children}
            </Card>
        </div>
    );
};


export default function RangerProfilePage() {
    const params = useParams();
    const rangerId = params.id as string;
    const rangerData = rangersData.find(r => r.id === rangerId);
    
    const [headerRef, isHeaderVisible] = useScrollAnimation();

    if (!rangerData) {
        return notFound();
    }
    
    const rangerAvatar = placeholderImages[rangerData.avatar];

  return (
    <div className="space-y-8 animate-fade-in">
        <Button variant="ghost" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
        </Button>
        <section ref={headerRef} className={cn('scroll-animate bg-card p-6 rounded-lg shadow-lg', isHeaderVisible && 'scroll-animate-in')}>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <Avatar className="h-24 w-24 border-4 border-accent">
                <AvatarImage asChild src={rangerAvatar.src} alt={rangerData.name}>
                  <Image src={rangerAvatar.src} alt={rangerData.name} width={rangerAvatar.width} height={rangerAvatar.height} data-ai-hint={rangerAvatar.hint} />
                </AvatarImage>
                <AvatarFallback>{rangerData.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="font-headline text-3xl font-bold text-primary flex items-center justify-center sm:justify-start">
                  {rangerData.name} {rangerData.isVerified && <VerifiedBadge className="ml-2" size={24} />}
                </h1>
                <p className="text-muted-foreground">{rangerData.title}</p>
                <div className="mt-3 flex gap-2 flex-wrap justify-center sm:justify-start">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><UserPlus className="w-4 h-4 mr-2" /> Follow</Button>
                    <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
                </div>
              </div>
            </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
            {rangerData.stats.map(stat => (
                <AnimatedCard key={stat.label}>
                    <CardHeader className="text-center p-4">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.label}</CardTitle>
                        <CardDescription className="text-2xl font-bold text-primary">{stat.value}</CardDescription>
                    </CardHeader>
                </AnimatedCard>
            ))}
        </div>

        <AnimatedCard>
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">About {rangerData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{rangerData.bio}</p>
            </CardContent>
        </AnimatedCard>

        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Travel Journal</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {rangerData.blogPosts.map(post => <BlogCard key={post.id} {...post} />)}
                 {rangerData.blogPosts.length === 0 && <p className="text-muted-foreground">No journal entries yet.</p>}
            </div>
        </section>
        
        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Guided Tours</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rangerData.guidedTours.map(tour => {
                    const tourImage = placeholderImages[tour.image];
                    return (
                        <AnimatedCard key={tour.id}>
                            <div className="relative w-full h-48">
                                <Image src={tourImage.src} alt={tour.title} layout="fill" objectFit="cover" data-ai-hint={tourImage.hint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg text-primary hover:text-accent transition-colors">
                                    <Link href={`/campaigns/${tour.id}`}>{tour.title}</Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                 <p className="text-sm text-muted-foreground">{tour.shortDescription}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="link" className="p-0 text-accent">
                                    <Link href={`/campaigns/${tour.id}`}>View Itinerary &rarr;</Link>
                                </Button>
                            </CardFooter>
                        </AnimatedCard>
                    );
                })}
            </div>
             {rangerData.guidedTours.length === 0 && <p className="text-muted-foreground">No guided tours listed currently.</p>}
        </section>

    </div>
  );
}
