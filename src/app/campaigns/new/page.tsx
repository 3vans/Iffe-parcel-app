
'use client';

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
import { ArrowLeft, Map, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { saveCustomBooking } from '@/lib/services/cms-service';
import { useAuth } from '@/context/AuthContext';

const campaignSchema = z.object({
  title: z.string().min(5, 'Tour title must be at least 5 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.').max(150, 'Short description max 150 characters.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  goalAmount: z.coerce.number().min(1, 'Price must be at least 1.'),
  imageUrl: z.string().url('Must be a valid image URL.').optional().or(z.literal('')),
  tags: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit: SubmitHandler<CampaignFormValues> = async (data) => {
    setIsSubmitting(true);
    
    try {
      await saveCustomBooking({
        userId: user?.uid || 'guest',
        userName: user?.displayName || 'Anonymous Explorer',
        userEmail: user?.email || 'not-provided',
        basePackage: data.title,
        groupSize: 1, // Default for manual requests
        selectedAddons: [],
        pricing: { finalTotal: data.goalAmount },
        description: data.fullDescription,
        status: 'pending',
        requestType: 'Custom Tour Proposal',
        meta: {
            shortDescription: data.shortDescription,
            inspirationImage: data.imageUrl,
            tags: data.tags
        }
      });

      toast({
        title: "Request Received!",
        description: "Your custom tour proposal has been sent to our travel specialists.",
      });

      reset();
    } catch (err) {
      toast({ title: "Submission Failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={ref} className={cn('max-w-3xl mx-auto py-8 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
        </Link>
      </Button>
      <Card className="shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
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
              <Input id="title" {...register('title')} className="mt-1" placeholder="e.g., Family Safari in Queen Elizabeth Park" disabled={isSubmitting} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="shortDescription" className="font-semibold">Short Description (Teaser)</Label>
              <Input id="shortDescription" {...register('shortDescription')} className="mt-1" placeholder="A brief summary for our reference (max 150 chars)" disabled={isSubmitting} />
              {errors.shortDescription && <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <Label htmlFor="fullDescription" className="font-semibold">Detailed Itinerary / Desires</Label>
              <Textarea id="fullDescription" {...register('fullDescription')} rows={8} className="mt-1" placeholder="Tell us about your dream trip. What do you want to see? What's your travel style?" disabled={isSubmitting} />
              {errors.fullDescription && <p className="text-sm text-destructive mt-1">{errors.fullDescription.message}</p>}
            </div>

            <div>
              <Label htmlFor="goalAmount" className="font-semibold">Estimated Budget per Person ($)</Label>
              <Input id="goalAmount" type="number" {...register('goalAmount')} className="mt-1" placeholder="e.g., 5000" disabled={isSubmitting} />
              {errors.goalAmount && <p className="text-sm text-destructive mt-1">{errors.goalAmount.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="imageUrl" className="font-semibold">Inspiration Image URL (Optional)</Label>
              <Input id="imageUrl" type="url" {...register('imageUrl')} placeholder="https://example.com/inspiration-image.png" className="mt-1" disabled={isSubmitting} />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="tags" className="font-semibold">Keywords (comma-separated, e.g., #Luxury, #Birdwatching)</Label>
              <Input id="tags" {...register('tags')} className="mt-1" placeholder="#Family, #BigFive" disabled={isSubmitting} />
              {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg font-black uppercase tracking-widest shadow-lg shadow-accent/20" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> SENDING REQUEST...</> : 'Submit Custom Tour Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
