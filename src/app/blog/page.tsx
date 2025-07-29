
import Link from 'next/link';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, ListFilter, Edit } from 'lucide-react';

// Mock data
const mockBlogPosts: BlogCardProps[] = [
  { id: '1', title: 'The Thrill of the Hunt: Spotting Leopards in the Wild', author: 'Safari Jane', date: 'Oct 26, 2023', excerpt: 'Patience is key when tracking the elusive leopard. A story of a week-long pursuit that ended in a magical sighting.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'leopard tree', tags: ['#BigCats', '#Leopard'], commentCount: 12 },
  { id: '2', title: 'Birdwatcher\'s Paradise: The Shoebill of Mabamba Swamp', author: 'Ranger Tom', date: 'Oct 22, 2023', excerpt: 'Journey into the swamps of Uganda to find one of the world\'s most prehistoric and sought-after birds.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'shoebill stork', tags: ['#Birdwatching', '#Uganda'], commentCount: 8 },
  { id: '3', title: 'A Guide to Ethical Wildlife Photography', author: 'Ethical Explorer', date: 'Oct 18, 2023', excerpt: 'Learn how to capture stunning wildlife photos without disturbing the animals or their habitats. Our top tips for responsible photography.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'camera wildlife', tags: ['#Photography', '#Conservation'], commentCount: 25 },
];

const availableTags = ['#BigCats', '#Leopard', '#Birdwatching', '#Uganda', '#Photography', '#Conservation', '#Serengeti', '#Okavango'];

export default function BlogPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2 flex items-center justify-center"><Edit className="mr-3 h-10 w-10"/>Travel Journal</h1>
        <p className="text-lg text-muted-foreground">Stories, tips, and updates from our adventures in the wild.</p>
      </section>

      <section className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow">
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
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogPosts.map(post => (
          <BlogCard key={post.id} {...post} />
        ))}
      </section>

      {mockBlogPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No stories yet. Be the first to contribute!</p>
        </div>
      )}
    </div>
  );
}
