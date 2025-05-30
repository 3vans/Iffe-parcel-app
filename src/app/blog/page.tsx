import Link from 'next/link';
import BlogCard, { type BlogCardProps } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, ListFilter } from 'lucide-react';

// Mock data
const mockBlogPosts: BlogCardProps[] = [
  { id: '1', title: 'The Future of Waste Management in Urban Areas', author: 'Jane Doe', date: 'Oct 26, 2023', excerpt: 'Exploring innovative solutions for sustainable waste management in growing cities. We delve into community initiatives and technological advancements that promise a cleaner tomorrow for everyone involved.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'city waste', tags: ['#WasteSolutions', '#UrbanDevelopment'], commentCount: 12 },
  { id: '2', title: 'Youth Voices: Leading Environmental Change', author: 'John Smith', date: 'Oct 22, 2023', excerpt: 'Highlighting the impactful roles young individuals are playing in environmental conservation and advocacy. Their passion and innovative ideas are crucial for a sustainable future.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'youth environment', tags: ['#YouthVoices', '#Environment'], commentCount: 8 },
  { id: '3', title: 'Community-Led Water Projects: A Success Story', author: 'Alice Green', date: 'Oct 18, 2023', excerpt: 'A case study on how a small community transformed their access to clean water through collaboration and determination. Learn about the challenges faced and overcome.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'community water', tags: ['#CommunityImpact', '#Water'], commentCount: 25 },
];

const availableTags = ['#WasteSolutions', '#UrbanDevelopment', '#YouthVoices', '#Environment', '#CommunityImpact', '#Water', '#TechForGood', '#Sustainability'];

export default function BlogPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">Our Blog</h1>
        <p className="text-lg text-muted-foreground">Insights, stories, and updates from the e-Rotary Hub community.</p>
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
              <PlusCircle className="mr-2 h-5 w-5" /> Submit Post
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
          <p className="text-xl text-muted-foreground">No blog posts yet. Be the first to contribute!</p>
        </div>
      )}
    </div>
  );
}
