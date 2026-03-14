'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Edit3, Lightbulb, MessageCircle, ArrowRight, MountainSnow, ShieldCheck, Package, Loader2, Users, MapPin, Award, Calendar, Send, Globe, CheckCircle2, HeartHandshake } from 'lucide-react';
import BlogCard from '@/components/blog-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import FifaCardCarousel from '@/components/fifa-card-carousel';
import Hero from '@/components/layout/hero';
import ERotaractSignupTrigger from '@/components/auth/erotaract-signup-trigger';
import fifaCardData from '@/app/lib/fifa-card-data.json';
import { fetchBlogPosts, fetchGalleryImages, type BlogPost, type GalleryImage } from '@/lib/services/cms-service';
import TestimonialSection from '@/components/testimonial-section';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface FeedItemBase {
  id: string;
  type: 'creator' | 'blog' | 'gallery';
}

interface CreatorFeedItem extends FeedItemBase {
  type: 'creator';
  name: string;
  avatarUrl: string;
  specialty: string;
  profileLink: string;
}

interface BlogFeedItem extends FeedItemBase {
  type: 'blog';
  post: BlogPost;
}

interface GalleryFeedItem extends FeedItemBase {
  type: 'gallery';
  image: GalleryImage;
}

type FeedItem = CreatorFeedItem | BlogFeedItem | GalleryFeedItem;

export default function Home() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCarouselImage, setActiveCarouselImage] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
      const loadFeed = async () => {
        setIsLoading(true);
        try {
          const [posts, images] = await Promise.all([
            fetchBlogPosts('Published', 3),
            fetchGalleryImages(2)
          ]);

          const items: FeedItem[] = [];
          
          posts.forEach(p => items.push({ id: p.id, type: 'blog', post: p }));
          images.forEach(img => items.push({ id: img.id, type: 'gallery', image: img }));
          
          // Add a few static guides for flavor
          items.push({
            id: 'guide-1',
            type: 'creator',
            name: 'Ian Ivan',
            avatarUrl: placeholderImages.homeCreatorJane.src,
            specialty: 'Expert Guide & Wildlife Photographer',
            profileLink: '/profile/ian-ivan',
          });

          // Shuffle or sort by relevance
          setFeedItems(items.sort(() => Math.random() - 0.5));
        } catch (err) {
          console.error("Feed load error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadFeed();
    }, []);

    const handleQuickInquiry = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Inquiry Sent!",
            description: "We've received your quick inquiry. Our team will reach out shortly.",
        });
    };

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
  

  return (
    <>
      <Hero />
      <div className="relative z-10 space-y-12 animate-fade-in pt-12">
        <section>
          <AnimatedCard>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Your Adventure Starts Here</CardTitle>
              <CardDescription>Ready to explore the wild? Let's get started:</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
                <Link href="/campaigns">
                  <MountainSnow className="mr-2 h-5 w-5" /> Browse All Tours
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/packages">
                  <Package className="mr-2 h-5 w-5" /> Browse All Packages
                </Link>
              </Button>
               <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
                 <Link href="/ideas">
                  <Lightbulb className="mr-2 h-5 w-5" /> Suggest a Destination
                </Link>
              </Button>
              <ERotaractSignupTrigger />
            </CardContent>
          </Card>
          </AnimatedCard>
        </section>

        {/* Trust & Booking Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Inquiry - Left Side */}
            <AnimatedCard>
                <Card className="h-full bg-card/80 backdrop-blur-sm border-primary/10 flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary flex items-center">
                            <Calendar className="mr-3 h-6 w-6 text-accent" />
                            Quick Safari Inquiry
                        </CardTitle>
                        <CardDescription>Get a personalized itinerary started in seconds.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <form onSubmit={handleQuickInquiry} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <Input placeholder="John Doe" required className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <Input type="email" placeholder="john@example.com" required className="bg-background/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Where would you like to go?</label>
                                <Input placeholder="e.g. Bwindi Gorilla Trekking" className="bg-background/50" />
                            </div>
                            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2 font-bold py-6">
                                <Send className="mr-2 h-5 w-5" /> Send Inquiry
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 text-center">
                        <p className="text-xs text-muted-foreground w-full">We typically respond within 2-4 business hours.</p>
                    </CardFooter>
                </Card>
            </AnimatedCard>

            {/* Trust & Authority - Right Side */}
            <AnimatedCard>
                <Card className="h-full bg-primary text-primary-foreground border-none relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center">
                            <ShieldCheck className="mr-3 h-6 w-6 text-accent" />
                            Why Choose Iffe-Travels?
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/70">Building trust through thousands of successful African adventures.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                    <Users className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-none">2,000+</p>
                                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Happy Travelers</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                    <Calendar className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-none">10+ Yrs</p>
                                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Safari Experience</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                    <MapPin className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-none">500+</p>
                                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Tours Completed</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                    <Award className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-none">Certified</p>
                                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Safety & Quality</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our Global Partnerships</p>
                            <div className="flex flex-wrap gap-4 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <Globe className="h-3 w-3" />
                                    <span className="text-[10px] font-black tracking-widest">UTB CERTIFIED</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="text-[10px] font-black tracking-widest">AUTO MEMBER</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-sm font-medium text-white/80 leading-relaxed italic">
                                "Our mission is to provide authentic, responsible, and safe travel experiences that leave you with memories for a lifetime."
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button variant="link" className="text-accent hover:text-white p-0" asChild>
                            <Link href="/about">Learn more about our heritage <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </AnimatedCard>
        </section>
        
        <section>
          <h2 className="font-headline text-3xl font-bold text-primary mb-6">From the Wild</h2>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-8">
              {feedItems.map((item) => {
                if (item.type === 'creator') {
                  return (
                    <AnimatedCard key={item.id}>
                    <Card className="shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={item.avatarUrl} alt={item.name} />
                            <AvatarFallback>{item.name.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="font-headline text-lg text-primary">{item.name}</CardTitle>
                            <CardDescription className="text-xs">{item.specialty}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">Learn more about our expert guides and their experiences in the wild.</p>
                         <Button variant="outline" asChild size="sm">
                           <Link href={item.profileLink}>
                             View Profile <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                         </Button>
                      </CardContent>
                    </Card>
                    </AnimatedCard>
                  );
                }
                if (item.type === 'blog') {
                  return (
                      <AnimatedCard key={item.id}>
                          <BlogCard {...item.post} />
                      </AnimatedCard>
                  );
                }
                if (item.type === 'gallery') {
                  return (
                    <AnimatedCard key={item.id}>
                      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm">
                        <div className="relative aspect-video">
                          <Image src={item.image.src} alt={item.image.alt} fill objectFit="cover" data-ai-hint={item.image.dataAiHint} />
                          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">Recent Photo</div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg font-headline">{item.image.caption || "A moment from the wild"}</CardTitle>
                          <CardDescription>{item.image.date}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                           <Button variant="link" asChild className="p-0 text-accent">
                             <Link href="/gallery">Explore Gallery <ArrowRight className="ml-1 h-4 w-4"/></Link>
                           </Button>
                        </CardFooter>
                      </Card>
                    </AnimatedCard>
                  )
                }
                return null;
              })}
            </div>
          )}
          {!isLoading && feedItems.length === 0 && (
              <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">The feed is quiet right now... Why not start something?</p>
              </div>
          )}
        </section>

        <section className="carousel-background-container">
            <div 
                className="carousel-background-image"
                style={{ backgroundImage: activeCarouselImage ? `url(${activeCarouselImage})` : 'none' }}
            />
            <div className="carousel-background-overlay" />
            <FifaCardCarousel 
                cards={fifaCardData as any}
                onActiveCardChange={(card) => {
                    if (card) {
                        const imageData = placeholderImages[card.image as keyof typeof placeholderImages];
                        if (imageData) {
                            setActiveCarouselImage(imageData.src);
                        }
                    }
                }} 
            />
        </section>

        <TestimonialSection />
      </div>
    </>
  );
}
