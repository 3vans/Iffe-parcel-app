
'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Tag, Layers, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useIsMobile } from '@/hooks/use-mobile';

// This type must match the one in `gallery/page.tsx`
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

const mediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(), // Comma-separated
  imageUrl: z.string().min(1, 'Image is required. Please upload an image or provide a URL.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;

interface GalleryClientContentProps {
  initialImages: GalleryImage[];
}

const GalleryImageCard = ({ image }: { image: GalleryImage }) => {
    const [imgSrc, setImgSrc] = useState(image.src);
    const [ref, isVisible] = useScrollAnimation();

    return (
      <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
        <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
          <div className="relative w-full aspect-[3/2] group-hover:opacity-90 transition-opacity">
            <Image 
                src={imgSrc} 
                alt={image.alt} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={image.dataAiHint} 
                onError={() => setImgSrc(placeholderImages.gallerySafariGroup.src)}
            />
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
      </div>
    );
};

interface GalleryCategoryProps {
  category: string;
  images: GalleryImage[];
}

const GalleryCategory = ({ category, images }: GalleryCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const displayedImages = isMobile && !isExpanded ? images.slice(0, 4) : images;
  const showViewMoreButton = isMobile && images.length > 4 && !isExpanded;
  const [ref, isVisible] = useScrollAnimation();

  if (!isMobile) {
    return (
      <>
        {images.map(image => (
          <GalleryImageCard key={image.id} image={image} />
        ))}
      </>
    );
  }

  return (
    <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline text-primary">
            <Layers className="mr-2 h-5 w-5 text-accent"/>
            {category.replace('#','')}
          </CardTitle>
          <CardDescription>A collection of moments from {category.replace('#','').toLowerCase()}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {displayedImages.map(image => (
              <div key={image.id} className="relative aspect-square w-full rounded-md overflow-hidden group">
                  <Image
                      src={image.src}
                      alt={image.alt}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={image.dataAiHint}
                      className="transition-transform duration-300 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs line-clamp-2">{image.caption}</p>
                   </div>
              </div>
            ))}
          </div>
        </CardContent>
        {showViewMoreButton && (
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsExpanded(true)}>
              View More <ChevronDown className="ml-2 h-4 w-4"/>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}


export default function GalleryClientContent({ initialImages }: GalleryClientContentProps) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [filterRef, isFilterVisible] = useScrollAnimation();
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      caption: '',
      tags: '',
      imageUrl: '',
      dataAiHint: '',
    }
  });

  const watchedImageUrl = watch('imageUrl');

  useEffect(() => {
    if (!isDialogOpen) {
       setValue('imageUrl', '', { shouldValidate: false });
    }
  }, [isDialogOpen, setValue]);
  
  const imageCategories = useMemo(() => {
    const categories: Record<string, GalleryImage[]> = {};
    galleryImages.forEach(image => {
        image.tags.forEach(tag => {
            if (!categories[tag]) {
                categories[tag] = [];
            }
            categories[tag].push(image);
        });
    });
    return categories;
  }, [galleryImages]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('imageUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    } else {
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const onSubmitMedia: SubmitHandler<MediaFormValues> = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <>
      <section ref={filterRef} className={cn('flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow scroll-animate', isFilterVisible && 'scroll-animate-in')}>
        <div className="flex flex-wrap gap-2">
           <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
              setIsDialogOpen(isOpen);
              if (!isOpen) {
                reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                  <UploadCloud className="mr-2 h-5 w-5" /> Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl text-primary">Upload to Gallery</DialogTitle>
                  <DialogDescription>
                    Share a photo from your device or by pasting a URL. Add a caption and tags.
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
                    {errors.imageUrl && !watchedImageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
                  </div>

                  {watchedImageUrl && (
                    <div className="mt-2 col-span-3">
                      <Label className="font-semibold">Image Preview:</Label>
                      <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                        <Image src={watchedImageUrl} alt="Image preview" layout="fill" objectFit="contain" />
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
                    <Input id="tags" {...register('tags')} className="col-span-3 mt-1" placeholder="e.g., #Sunsets, #BigCats" />
                    {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dataAiHint" className="text-right font-semibold">Image Keywords (Max 2 words for AI)</Label>
                    <Input id="dataAiHint" {...register('dataAiHint')} className="col-span-3 mt-1" placeholder="e.g., lioness cubs" />
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
        </div>
      </section>

      {isMobile ? (
        <section className="space-y-6">
          {Object.entries(imageCategories).map(([category, images]) => (
            <GalleryCategory key={category} category={category} images={images} />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map(image => (
            <GalleryImageCard key={image.id} image={image} />
          ))}
        </section>
      )}

      {galleryImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            The gallery is empty. Check back soon or upload new media!
          </p>
        </div>
      )}
    </>
  );
}
