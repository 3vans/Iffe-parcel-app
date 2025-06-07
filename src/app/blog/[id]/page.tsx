
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch blog post data based on params.id
  const mockPost = {
    id: params.id,
    title: `Blog Post Title for ID: ${params.id}`,
    author: "Mock Author",
    date: new Date().toLocaleDateString(),
    content: `This is placeholder content for blog post with ID ${params.id}. Replace this with actual fetched data. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    imageUrl: `https://placehold.co/800x400.png`,
    dataAiHint: "Rotary blog",
    tags: ["#Placeholder", `#Post${params.id}`]
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Button variant="ghost" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{mockPost.title}</CardTitle>
          <CardDescription>
            By {mockPost.author} on {mockPost.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPost.imageUrl && (
            <div className="relative w-full mb-6 rounded-lg overflow-hidden">
              <img src={mockPost.imageUrl} alt={mockPost.title} className="w-full h-auto max-h-[500px] object-cover" data-ai-hint={mockPost.dataAiHint} />
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
