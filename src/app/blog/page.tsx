'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, ListFilter, Loader2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import PageHero from '@/components/layout/page-hero';
import { fetchBlogPosts, type BlogPost } from '@/lib/services/cms-service';

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBlogPosts('Published');
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'all' || post.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  return (
    <div className="space-y-8 animate-fade-in">
       <PageHero 
         title="Travel Journal"
         subtitle="Stories, tips, and updates from our adventures in the wild."
         imageUrl={placeholderImages.blogPostDefault.src}
         dataAiHint={placeholderImages.blogPostDefault.hint}
         primaryAction={{ text: "Share a Story", link: "/blog/submit" }}
         secondaryAction={{ text: "Contact Us", link: "/contact" }}
       />

      <AnimatedSection className="container mx-auto px-4">
        <Card className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card/80 backdrop-blur-sm rounded-lg shadow">
            <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search articles..." 
              className="pl-10 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full md:w-[180px]">
                <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
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

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4">
          {filteredPosts.map(post => (
            <BlogCard key={post.id} {...post} />
          ))}
        </section>
      )}

      {!isLoading && filteredPosts.length === 0 && (
        <AnimatedSection>
            <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No stories found matching your criteria.</p>
            </div>
        </AnimatedSection>
      )}
    </div>
  );
}
