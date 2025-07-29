
'use client';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(50, 'Story must be at least 50 characters long'),
  tags: z.string().optional(), // Comma-separated tags
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function SubmitBlogPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
  });

  const onSubmit: SubmitHandler<BlogPostFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Blog post submitted:', data);
    toast({
      title: "Story Submitted!",
      description: "Your travel story has been sent for review.",
      variant: "default",
    });
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-slide-up">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Travel Journal
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Share a Travel Story</CardTitle>
          <CardDescription>Share your adventures and photos with the community. Stories will be reviewed before publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title" className="font-semibold">Title</Label>
              <Input id="title" {...register('title')} className="mt-1" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content" className="font-semibold">Your Story</Label>
              <Textarea id="content" {...register('content')} rows={10} className="mt-1" placeholder="Write your story here... Supports Markdown." />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
            </div>

            <div>
              <Label htmlFor="tags" className="font-semibold">Tags (comma-separated)</Label>
              <Input id="tags" {...register('tags')} placeholder="e.g., #Serengeti, #BigFive" className="mt-1" />
              {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="imageUrl" className="font-semibold">Cover Image URL (Optional)</Label>
              <Input id="imageUrl" type="url" {...register('imageUrl')} placeholder="https://example.com/image.png" className="mt-1" />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-base" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
