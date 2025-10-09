

'use client';
import Link from 'next/link';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, ListFilter, Edit } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import Image from 'next/image';

// Mock data
const mockBlogPosts: BlogCardProps[] = [
  { id: '1', title: 'The Thrill of the Hunt: Spotting Leopards in the Wild', author: 'Safari Jane', date: 'Oct 26, 2023', excerpt: 'Patience is key when tracking the elusive leopard. A story of a week-long pursuit that ended in a magical sighting.', imageUrl: placeholderImages.galleryLioness.src, dataAiHint: 'leopard tree', tags: ['#BigCats', '#Leopard'], commentCount: 12 },
  { id: '2', title: 'Birdwatcher\'s Paradise: The Shoebill of Mabamba Swamp', author: 'Ranger Tom', date: 'Oct 22, 2023', excerpt: 'Journey into the swamps of Uganda to find one of the world\'s most prehistoric and sought-after birds.', imageUrl: placeholderImages.blogShoebill.src, dataAiHint: 'shoebill stork', tags: ['#Birdwatching', '#Uganda'], commentCount: 8 },
  { id: '3', title: 'A Guide to Ethical Wildlife Photography', author: 'Ethical Explorer', date: 'Oct 18, 2023', excerpt: 'Learn how to capture stunning wildlife photos without disturbing the animals or their habitats. Our top tips for responsible photography.', imageUrl: placeholderImages.blogPhotographer.src, dataAiHint: 'camera wildlife', tags: ['#Photography', '#Conservation'], commentCount: 25 },
];

const availableTags = ['#BigCats', '#Leopard', '#Birdwatching', '#Uganda', '#Photography', '#Conservation', '#Serengeti', '#Okavango'];

function AnimatedSection({ children }: { children: React.ReactNode }) {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <section ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
            {children}
        </section>
    );
}

export default function BlogPage() {
  const [headerRef, isHeaderVisible] = useScrollAnimation();
  const heroImage = placeholderImages.blogPostDefault.src;
  const heroDataAiHint = placeholderImages.blogPostDefault.hint;
  return (
    <div className="space-y-8 animate-fade-in">
       <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isHeaderVisible && 'scroll-animate-in')}>
        <Image
          src={heroImage}
          alt="Travel Journal"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={heroDataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
        
        <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
            <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
              <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">FROM THE WILD</p>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 pb-4 relative bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                Travel Journal
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8">
                Stories, tips, and updates from our adventures in the wild.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                   <Link href="/blog/submit">
                     Share a Story
                   </Link>
                 </Button>
                 <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                    <Link href="/contact">
                        Contact Us
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
      </section>

      <AnimatedSection>
        <Card className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card/80 backdrop-blur-sm rounded-lg shadow">
            <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search articles..." className="pl-10 w-full" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
            <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag.toLowerCase().replace('#', '')}>{tag}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                <Link href="/blog/submit">
                <PlusCircle className="mr-2 h-5 w-5" /> Share a Story
                </Link>
            </Button>
            </div>
        </Card>
      </AnimatedSection>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogPosts.map(post => (
          <BlogCard key={post.id} {...post} />
        ))}
      </section>

      {mockBlogPosts.length === 0 && (
        <AnimatedSection>
            <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No stories yet. Be the first to contribute!</p>
            </div>
        </AnimatedSection>
      )}
    </div>
  );
}
