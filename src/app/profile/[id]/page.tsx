'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, MessageCircle, ArrowLeft, Briefcase, Star, TrendingUp } from 'lucide-react';
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
      { label: 'Tours Guided', value: '79+' },
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
      { label: 'Specialty', 'Ground Operations' },
    ],
    isVerified: true,
    blogPosts: [],
    guidedTours: [],
  },
];

const statIcons = {
  'Experience': Star,
  'Tours Guided': Briefcase,
  'Specialties': TrendingUp,
  'Tours Managed': Briefcase,
  'Specialty': TrendingUp,
  'Clients Assisted': UserPlus,
  'Photos Taken': TrendingUp,
  'Trips Coordinated': Briefcase,
}

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <section ref={ref} className={cn('scroll-animate space-y-4', isVisible && 'scroll-animate-in', className)}>
            {children}
        </section>
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
            <Link href="/about">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team Page
            </Link>
        </Button>
        
        {/* Profile Header */}
        <section ref={headerRef} className={cn('scroll-animate', isHeaderVisible && 'scroll-animate-in')}>
            <Card className="overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 w-full bg-muted">
                    <Image src={placeholderImages.gallerySafariGroup.src} alt="Safari landscape" layout="fill" objectFit="cover" data-ai-hint="safari landscape" className="opacity-50" />
                </div>
                <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left -mt-16 z-10 relative">
                  <Avatar className="h-32 w-32 border-4 border-card shadow-xl shrink-0">
                    <AvatarImage asChild src={profileAvatar.src} alt={profileData.name}>
                      <Image src={profileAvatar.src} alt={profileData.name} width={profileAvatar.width} height={profileAvatar.height} data-ai-hint={profileAvatar.hint} />
                    </AvatarImage>
                    <AvatarFallback>{profileData.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow pt-16 sm:pt-0">
                    <h1 className="font-headline text-3xl font-bold text-primary flex items-center justify-center sm:justify-start">
                      {profileData.name} {profileData.isVerified && <VerifiedBadge className="ml-2" size={24} />}
                    </h1>
                    <p className="text-muted-foreground">{profileData.title}</p>
                    <div className="mt-4 flex gap-2 flex-wrap justify-center sm:justify-start">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><UserPlus className="w-4 h-4 mr-2" /> Follow</Button>
                        <Button variant="outline" asChild>
                            <Link href="https://wa.me/256705398510" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-whatsapp h-4 w-4 mr-2"></i> Message on WhatsApp
                            </Link>
                        </Button>
                    </div>
                  </div>
                </div>
            </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                  <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">About {profileData.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{profileData.bio}</p>
                      </CardContent>
                  </Card>
              </AnimatedSection>
              
              <AnimatedSection>
                  <h2 className="font-headline text-2xl font-bold text-primary mb-4">Travel Journal</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                      {profileData.blogPosts.map(post => <BlogCard key={post.id} {...post} />)}
                       {profileData.blogPosts.length === 0 && <p className="text-muted-foreground col-span-full">No journal entries from {profileData.name} yet.</p>}
                  </div>
              </AnimatedSection>
          </div>
          
          {/* Sidebar Column */}
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24 h-fit">
              <AnimatedSection>
                  <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">At a Glance</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ul className="space-y-4">
                              {profileData.stats.map(stat => {
                                const Icon = statIcons[stat.label as keyof typeof statIcons] || Star;
                                return (
                                  <li key={stat.label} className="flex items-center">
                                      <Icon className="h-5 w-5 mr-3 text-accent" />
                                      <div>
                                          <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                                          <p className="font-bold text-primary">{stat.value}</p>
                                      </div>
                                  </li>
                                );
                              })}
                          </ul>
                      </CardContent>
                  </Card>
              </AnimatedSection>

              <AnimatedSection>
                  <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">Guided Tours</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          {profileData.guidedTours.map(tour => {
                              const tourImage = placeholderImages[tour.image];
                              return (
                                  <Link key={tour.id} href={`/campaigns/${tour.id}`} className="flex items-center gap-4 group p-2 rounded-md hover:bg-muted/50">
                                      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                                          <Image src={tourImage.src} alt={tour.title} layout="fill" objectFit="cover" data-ai-hint={tourImage.hint} className="transition-transform duration-300 group-hover:scale-105" />
                                      </div>
                                      <div>
                                          <p className="font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">{tour.title}</p>
                                          <p className="text-xs text-muted-foreground line-clamp-1">{tour.shortDescription}</p>
                                      </div>
                                  </Link>
                              );
                          })}
                           {profileData.guidedTours.length === 0 && <p className="text-muted-foreground text-sm">No specific tours listed for {profileData.name} at this time.</p>}
                      </CardContent>
                  </Card>
              </AnimatedSection>
          </aside>
        </div>
    </div>
  );
}
