
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

interface Profile {
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

const profilesData: Profile[] = [
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
    bio: `About Ivan Ian Ivan seamlessly blends his technical photography skills with a deep, ancestral connection to the Pearl of Africa. With over four years of professional experience navigating Uganda’s diverse landscapes, he specializes in guiding travelers through the rhythmic pulse of our cities and the serenity of our wild spaces.  Whether you are exploring the source of the Nile in Jinja, trekking the highlands of Kapchorwa, or navigating the vibrant streets of Kampala, Ivan ensures you don't just see the sights—you capture them perfectly. His tours are defined by a "storyteller’s lens," combining vast knowledge of Ugandan wildlife with intimate insights into the local cultures that make this country unique. From technical photography workshops in the field to expert navigation of Uganda’s hidden gems, Ivan is dedicated to creating an immersive, safe, and visually stunning journey for every traveler.`,
    stats: [
      { label: 'Experience', value: '4+ Years' },
      { label: 'Tours Guided', value: '79' },
      { label: 'Specialties', value: 'Photography, Big Cats' },
    ],
    isVerified: true,
    blogPosts: [
      { id: 'b1', title: 'A Lion\'s Tale: A Close Encounter', author: 'Ian Ivan', date: 'Nov 05, 2023', excerpt: 'The story of a thrilling and humbling afternoon spent observing a pride of lions in their natural habitat.', imageUrl: 'https://images.unsplash.com/photo-1549429355-2070c1b4122d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', dataAiHint: 'lion pride', tags: ['#BigCats', '#Serengeti'], commentCount: 18 },
    ],
    guidedTours: [
      { id: '1', title: 'Serengeti Great Migration', shortDescription: 'Witness the epic annual migration of over a million wildebeest across the Serengeti plains.', image: 'campaignDetailWildebeest' },
    ],
  },
  {
    id: 'ian-mudembula',
    name: 'Ian Mudembula',
    title: 'Founder & Lead Guide',
    avatar: 'teamJane',
    bio: `Ian founded iffe-travels with a singular vision: to share the magic of Africa with the world in a responsible and authentic way. With 15 years of guiding experience, his knowledge of the continent's ecosystems is unparalleled. He is passionate about community-based tourism and works tirelessly to ensure that local communities benefit from every tour.`,
    stats: [
      { label: 'Experience', value: '15 Yrs' },
      { label: 'Tours Guided', value: '300+' },
      { label: 'Specialty', value: 'Community Tourism' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
  },
  {
    id: 'ben',
    name: 'Ben',
    title: 'Head of Operations',
    avatar: 'teamJohn',
    bio: `Ben is the logistical mastermind behind every seamless iffe-travels journey. With a decade in operations, he ensures that every detail, from airport transfers to lodge bookings, is perfectly coordinated. His dedication to excellence allows our guests to relax and immerse themselves fully in their adventure.`,
    stats: [
      { label: 'Experience', value: '10 Yrs' },
      { label: 'Tours Managed', value: '500+' },
      { label: 'Specialty', value: 'Logistics' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
  },
  {
    id: 'alice-green',
    name: 'Alice Green',
    title: 'Customer Relations',
    avatar: 'teamAlice',
    bio: `Alice is the friendly voice and first point of contact for many of our travelers. She excels at understanding our clients' dreams and helping them choose the perfect safari. Her warmth and dedication ensure that every traveler feels supported from their first inquiry to their return home.`,
    stats: [
      { label: 'Experience', value: '8 Yrs' },
      { label: 'Clients Assisted', value: '1000+' },
      { label: 'Specialty', value: 'Customer Happiness' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
  },
  {
    id: 'david-lee',
    name: 'David Lee',
    title: 'Lead Photographer',
    avatar: 'teamDavid',
    bio: `David is our resident photography guru. He not only captures stunning images for our gallery but also leads specialized photographic tours. His patience and artistic eye help aspiring photographers capture the moments of a lifetime.`,
    stats: [
      { label: 'Experience', value: '7 Yrs' },
      { label: 'Photos Taken', value: '10,000+' },
      { label: 'Specialty', value: 'Wildlife Photography' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
  },
  {
    id: 'emily-white',
    name: 'Emily White',
    title: 'Logistics Coordinator',
    avatar: 'teamEmily',
    bio: `Emily is a key part of our operations team, specializing in coordinating ground transport and local accommodations. Her meticulous planning ensures that every part of the journey is smooth, safe, and comfortable for our guests.`,
    stats: [
      { label: 'Experience', value: '5 Yrs' },
      { label: 'Trips Coordinated', value: '200+' },
      { label: 'Specialty', value: 'Ground Operations' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
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
    const profileId = params.id as string;
    const profileData = profilesData.find(r => r.id === profileId);
    
    const [headerRef, isHeaderVisible] = useScrollAnimation();

    if (!profileData) {
        return notFound();
    }
    
    const profileAvatar = placeholderImages[profileData.avatar];

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
                <AvatarImage asChild src={profileAvatar.src} alt={profileData.name}>
                  <Image src={profileAvatar.src} alt={profileData.name} width={profileAvatar.width} height={profileAvatar.height} data-ai-hint={profileAvatar.hint} />
                </AvatarImage>
                <AvatarFallback>{profileData.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="font-headline text-3xl font-bold text-primary flex items-center justify-center sm:justify-start">
                  {profileData.name} {profileData.isVerified && <VerifiedBadge className="ml-2" size={24} />}
                </h1>
                <p className="text-muted-foreground">{profileData.title}</p>
                <div className="mt-3 flex gap-2 flex-wrap justify-center sm:justify-start">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><UserPlus className="w-4 h-4 mr-2" /> Follow</Button>
                    <Button variant="outline" asChild>
                        <Link href="https://wa.me/256705398510" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-whatsapp h-4 w-4 mr-2"></i> Message on WhatsApp
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
            {profileData.stats.map(stat => (
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
                <CardTitle className="font-headline text-xl text-primary">About {profileData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{profileData.bio}</p>
            </CardContent>
        </AnimatedCard>

        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Travel Journal</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {profileData.blogPosts.map(post => <BlogCard key={post.id} {...post} />)}
                 {profileData.blogPosts.length === 0 && <p className="text-muted-foreground">No journal entries yet.</p>}
            </div>
        </section>
        
        <section>
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">Guided Tours</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profileData.guidedTours.map(tour => {
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
             {profileData.guidedTours.length === 0 && <p className="text-muted-foreground">No guided tours listed currently.</p>}
        </section>

    </div>
  );
}

    