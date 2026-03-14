
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3, Lightbulb, MessageCircle, ArrowRight, MountainSnow, ShieldCheck, Package, Loader2 } from 'lucide-react';
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

          // Shuffle or sort by relevance (here we just mix them)
          setFeedItems(items.sort(() => Math.random() - 0.5));
        } catch (err) {
          console.error("Feed load error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadFeed();
    }, []);

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
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
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
