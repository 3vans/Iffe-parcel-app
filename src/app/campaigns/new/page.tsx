
'use client'; // For form handling

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Map } from 'lucide-react';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

const campaignSchema = z.object({
  title: z.string().min(5, 'Tour title must be at least 5 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.').max(150, 'Short description max 150 characters.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  goalAmount: z.coerce.number().min(1, 'Price must be at least 1.'),
  imageUrl: z.string().url('Must be a valid image URL.').optional().or(z.literal('')),
  tags: z.string().optional(), // Comma-separated tags
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit: SubmitHandler<CampaignFormValues> = (data) => {
    setIsSubmitting(true);
    
    const recipient = 'info@iffe-travels.com';
    const subject = `Custom Tour Request: ${data.title}`;
    const body = `
      New Custom Tour Request
      --------------------------
      Title: ${data.title}
      Short Description: ${data.shortDescription}
      Detailed Itinerary/Desires:
      ${data.fullDescription}

      Estimated Budget per Person: $${data.goalAmount}
      Inspiration Image URL: ${data.imageUrl || 'Not provided'}
      Keywords: ${data.tags || 'Not provided'}
    `;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the user's email client
    window.location.href = mailtoLink;

    toast({
      title: "Opening Email Client",
      description: "Please complete sending the request from your email app.",
      variant: "default",
    });

    // We reset the form and state, though the user has now been navigated away.
    // This is useful if they come back to the page without a full reload.
    setTimeout(() => {
        reset();
        setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div ref={ref} className={cn('max-w-3xl mx-auto py-8 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <Map className="mr-3 h-7 w-7 text-accent" /> Plan a Custom Tour
          </CardTitle>
          <CardDescription>
            Have a special trip in mind? Fill out the details below and our team will help you plan your dream safari.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title" className="font-semibold">Tour Title</Label>
              <Input id="title" {...register('title')} className="mt-1" placeholder="e.g., Family Safari in Queen Elizabeth Park" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="shortDescription" className="font-semibold">Short Description (Teaser)</Label>
              <Input id="shortDescription" {...register('shortDescription')} className="mt-1" placeholder="A brief summary for our reference (max 150 chars)" />
              {errors.shortDescription && <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <Label htmlFor="fullDescription" className="font-semibold">Detailed Itinerary / Desires</Label>
              <Textarea id="fullDescription" {...register('fullDescription')} rows={8} className="mt-1" placeholder="Tell us about your dream trip. What do you want to see? What's your travel style?" />
              {errors.fullDescription && <p className="text-sm text-destructive mt-1">{errors.fullDescription.message}</p>}
            </div>

            <div>
              <Label htmlFor="goalAmount" className="font-semibold">Estimated Budget per Person ($)</Label>
              <Input id="goalAmount" type="number" {...register('goalAmount')} className="mt-1" placeholder="e.g., 5000" />
              {errors.goalAmount && <p className="text-sm text-destructive mt-1">{errors.goalAmount.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="imageUrl" className="font-semibold">Inspiration Image URL (Optional)</Label>
              <Input id="imageUrl" type="url" {...register('imageUrl')} placeholder="https://example.com/inspiration-image.png" className="mt-1" />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="tags" className="font-semibold">Keywords (comma-separated, e.g., #Luxury, #Birdwatching)</Label>
              <Input id="tags" {...register('tags')} className="mt-1" placeholder="#Family, #BigFive" />
              {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-base" disabled={isSubmitting}>
              {isSubmitting ? 'Preparing Email...' : 'Submit Custom Tour Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
