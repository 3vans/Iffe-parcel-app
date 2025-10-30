
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [formattedDate, setFormattedDate] = useState('');
  
  // In a real app, you would fetch blog post data based on params.id
  const mockPost = {
    id: params.id,
    title: `Amazing Safari Story for ID: ${params.id}`,
    author: "Mock Explorer",
    date: new Date(),
    content: `This is placeholder content for the travel journal entry with ID ${params.id}. Replace this with actual fetched data. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    imageUrl: placeholderImages.blogPostDefault.src,
    imageWidth: placeholderImages.blogPostDefault.width,
    imageHeight: placeholderImages.blogPostDefault.height,
    dataAiHint: placeholderImages.blogPostDefault.hint,
    tags: ["#Adventure", `#Trip${params.id}`]
  };

  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    // This runs only on the client, after hydration
    if (mockPost.date) {
      setFormattedDate(new Date(mockPost.date).toLocaleDateString());
    }
  }, [mockPost.date]);

  return (
    <div ref={ref} className={cn('space-y-6 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
        </Link>
      </Button>
      <Card className="shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{mockPost.title}</CardTitle>
          <CardDescription>
            By {mockPost.author} on {formattedDate || '...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPost.imageUrl && (
            <div className="relative w-full mb-6 rounded-lg overflow-hidden aspect-[2/1]">
              <Image 
                src={mockPost.imageUrl} 
                alt={mockPost.title} 
                className="object-cover" 
                fill
                data-ai-hint={mockPost.dataAiHint} 
                priority
              />
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p>{mockPost.content}</p>
          </div>
          {mockPost.tags && mockPost.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {mockPost.tags.map(tag => (
                  <Link key={tag} href={`/blog?tag=${tag.replace('#', '')}`}>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full hover:bg-secondary/80 transition-colors">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
