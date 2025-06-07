
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

const initialMockGalleryImages: GalleryImage[] = [
  { id: 'g1', src: 'https://placehold.co/600x400.png', alt: 'Rotary event attendees', dataAiHint: 'community event', caption: 'Annual Community Gala 2023', date: 'Oct 20, 2023', tags: ['#Events', '#Community'] },
  { id: 'g2', src: 'https://placehold.co/400x600.png', alt: 'Volunteers planting trees', dataAiHint: 'volunteers nature', caption: 'Reforestation Drive Day 1', date: 'Nov 05, 2023', tags: ['#Campaigns', '#Environment'] },
  { id: 'g3', src: 'https://placehold.co/600x600.png', alt: 'Children receiving books', dataAiHint: 'children education', caption: 'Literacy Campaign Success', date: 'Sep 15, 2023', tags: ['#Campaigns', '#Education', '#Community'] },
  { id: 'g4', src: 'https://placehold.co/600x450.png', alt: 'Rotaract members meeting', dataAiHint: 'meeting discussion', caption: 'Club Planning Session', date: 'Nov 10, 2023', tags: ['#Events', '#Internal'] },
  { id: 'g5', src: 'https://placehold.co/450x600.png', alt: 'Water project inauguration', dataAiHint: 'water project', caption: 'Clean Water Project Launch', date: 'Aug 01, 2023', tags: ['#Campaigns', '#Health'] },
  { id: 'g6', src: 'https://placehold.co/600x400.png', alt: 'Youth leadership workshop', dataAiHint: 'youth workshop', caption: 'Youth Leadership Training', date: 'Oct 28, 2023', tags: ['#Events', '#Training'] },
];

const availableTags = ['#Events', '#Campaigns', '#Community', '#Environment', '#Education', '#Health', '#Internal', '#Training'];

const mediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(), // Comma-separated
  imageUrl: z.string().min(1, 'Image is required. Please upload an image or provide a URL.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialMockGalleryImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      caption: '',
      tags: '',
      imageUrl: '',
      dataAiHint: '',
    }
  });
  
  const currentImageUrl = watch('imageUrl');

  useEffect(() => {
    if (!isDialogOpen) {
      setImagePreviewUrl(null);
    }
  }, [isDialogOpen]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result);
        setValue('imageUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const onSubmitMedia: SubmitHandler<MediaFormValues> = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const newMedia: GalleryImage = {
      id: `g${galleryImages.length + 1}-${Date.now()}`,
      src: data.imageUrl,
      alt: data.caption || 'User uploaded image',
      dataAiHint: data.dataAiHint || 'uploaded image',
      caption: data.caption,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(tag => tag.length > 1) : [],
    };

    setGalleryImages(prevImages => [newMedia, ...prevImages]);
    toast({ title: "Media Submitted!", description: "Your image has been added to the gallery." });
    reset();
    setImagePreviewUrl(null);
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null); // Clear filter if the same tag is clicked again
    } else {
      setActiveTag(tag);
    }
  };

  const filteredImages = activeTag
    ? galleryImages.filter(image => image.tags.includes(activeTag))
    : galleryImages;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">Image Gallery</h1>
        <p className="text-lg text-muted-foreground">Moments from our campaigns, events, and community activities.</p>
      </section>

      <section className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2 self-center">Filter by Tag:</span>
          {availableTags.map(tag => (
            <Button 
              key={tag} 
              variant={activeTag === tag ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleTagClick(tag)}
              className={cn(
                activeTag !== tag && "hover:bg-accent/10 hover:border-accent hover:text-accent",
                activeTag === tag && "bg-primary text-primary-foreground"
              )}
            >
              <Tag className="h-3 w-3 mr-1.5" /> {tag.replace('#','')}
            </Button>
          ))}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            reset();
            setImagePreviewUrl(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
              <UploadCloud className="mr-2 h-5 w-5" /> Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">Upload Media to Gallery</DialogTitle>
              <DialogDescription>
                Share an image from your device or by pasting a URL. Add a caption and tags.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitMedia)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="imageUpload" className="text-right font-semibold flex items-center">
                  <UploadCloud className="h-4 w-4 mr-2 text-muted-foreground"/> Upload Image File
                </Label>
                <Input 
                  id="imageUpload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  className="col-span-3 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {errors.imageUrl && !currentImageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
              </div>

              {(imagePreviewUrl || (currentImageUrl && currentImageUrl.startsWith('data:image'))) && (
                <div className="mt-2 col-span-3">
                  <Label className="font-semibold">Image Preview:</Label>
                  <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                    <Image src={imagePreviewUrl || currentImageUrl || ''} alt="Image preview" layout="fill" objectFit="contain" />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="imageUrl" className="text-right font-semibold">Or Paste Image URL</Label>
                <Input 
                    id="imageUrl" 
                    {...register('imageUrl')} 
                    className="col-span-3 mt-1" 
                    placeholder="https://example.com/image.png"
                />
                {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <Label htmlFor="caption" className="text-right font-semibold">Caption (Optional)</Label>
                <Input id="caption" {...register('caption')} className="col-span-3 mt-1" placeholder="Brief description of the image" />
                {errors.caption && <p className="text-sm text-destructive mt-1">{errors.caption.message}</p>}
              </div>

              <div>
                <Label htmlFor="tags" className="text-right font-semibold">Tags (Optional, comma-separated)</Label>
                <Input id="tags" {...register('tags')} className="col-span-3 mt-1" placeholder="e.g., #Events, #CommunityAction" />
                {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
              </div>

              <div>
                <Label htmlFor="dataAiHint" className="text-right font-semibold">Image Keywords (Max 2 words for AI)</Label>
                <Input id="dataAiHint" {...register('dataAiHint')} className="col-span-3 mt-1" placeholder="e.g., nature community" />
                {errors.dataAiHint && <p className="text-sm text-destructive mt-1">{errors.dataAiHint.message}</p>}
              </div>
              <DialogFooter className="mt-2 sticky bottom-0 bg-background py-3 -mx-2 px-2 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                  {isSubmitting ? 'Submitting...' : 'Add to Gallery'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map(image => (
          <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
            <div className="relative w-full aspect-[3/2] group-hover:opacity-90 transition-opacity">
              <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" data-ai-hint={image.dataAiHint} />
            </div>
            <CardHeader className="p-4">
              {image.caption && <CardTitle className="text-base font-semibold line-clamp-1">{image.caption}</CardTitle>}
              {image.date && <CardDescription className="text-xs">{image.date}</CardDescription>}
            </CardHeader>
            {image.tags.length > 0 && (
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                       {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </section>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            {activeTag ? `No images found for tag "${activeTag}".` : "The gallery is empty. Check back soon or upload new media!"}
          </p>
        </div>
      )}
    </div>
  );
}
