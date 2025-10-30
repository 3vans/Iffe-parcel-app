
'use client';

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Layers, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Badge } from '@/components/ui/badge';
import Lightbox from './lightbox';

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
  tags: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required. Please upload an image or provide a URL.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;

interface GalleryClientContentProps {
  initialImages: GalleryImage[];
}

const CategoryCard = ({ category, images, onSelectCategory }: { category: string; images: GalleryImage[]; onSelectCategory: (category: string) => void; }) => {
    const [ref, isVisible] = useScrollAnimation();
    const previewImages = images.slice(0, 4);

    const categoryTags = useMemo(() => {
        const tags = new Set<string>();
        images.forEach(img => {
            img.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).slice(0, 6);
    }, [images]);

    return (
        <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
            <Card className="group overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1" onClick={() => onSelectCategory(category)}>
                <CardHeader>
                    <CardTitle className="flex items-center text-xl font-headline text-primary">
                        <Layers className="mr-2 h-5 w-5 text-accent"/>
                        {category.replace('#','')}
                    </CardTitle>
                    <CardDescription>{images.length} photos</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                        {previewImages.map(img => (
                            <div key={img.id} className="relative aspect-square w-full">
                                <Image src={img.src} alt={img.alt} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={img.dataAiHint}/>
                            </div>
                        ))}
                         {previewImages.length < 4 && Array.from({ length: 4 - previewImages.length }).map((_, i) => (
                            <div key={`placeholder-${i}`} className="relative aspect-square w-full bg-muted"></div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4 border-t flex flex-col items-start gap-3">
                     <div className="flex flex-wrap gap-1.5">
                        {categoryTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" /> {tag.replace('#', '')}
                            </Badge>
                        ))}
                    </div>
                    <div className="self-end text-accent hover:text-accent/80 p-0 h-auto text-sm font-semibold flex items-center">
                        View More <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
};

export default function GalleryClientContent({ initialImages }: GalleryClientContentProps) {
  const [clientRendered, setClientRendered] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [filterRef, isFilterVisible] = useScrollAnimation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
  });

  const watchedImageUrl = watch('imageUrl');

  const imageCategories = useMemo(() => {
    const categories: Record<string, GalleryImage[]> = { '#All': galleryImages };
    galleryImages.forEach(image => {
        (image.tags || []).forEach(tag => {
            if (!categories[tag]) {
                categories[tag] = [];
            }
            categories[tag].push(image);
        });
    });
    return categories;
  }, [galleryImages]);
  
  const sortedCategories = useMemo(() => {
    return Object.keys(imageCategories).filter(cat => cat !== '#All' && imageCategories[cat].length > 0).sort((a, b) => a.localeCompare(b));
  }, [imageCategories]);


  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('imageUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
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
  
  const imagesToShow = selectedCategory ? imageCategories[selectedCategory] : [];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };
  
  if (!clientRendered) {
    return null; // or a loading skeleton
  }
  
  if (isLightboxOpen) {
    return (
      <Lightbox
        images={imagesToShow}
        startIndex={selectedImageIndex}
        onClose={() => setIsLightboxOpen(false)}
      />
    )
  }

  return (
    <>
      <section ref={filterRef} className={cn('flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow scroll-animate transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1', isFilterVisible && 'scroll-animate-in')}>
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
                    <DialogDescription>Share your best photos with the community. Please provide descriptive tags.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitMedia)} className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="imageUpload" className="font-semibold flex items-center mb-1"><UploadCloud className="h-4 w-4 mr-2 text-muted-foreground"/>Upload an Image</Label>
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    {watchedImageUrl && (
                        <div>
                            <Label>Image Preview:</Label>
                            <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                                <Image src={watchedImageUrl} alt="Image preview" fill style={{ objectFit: 'contain' }} />
                            </div>
                        </div>
                    )}
                    <div>
                        <Label htmlFor="imageUrl" className="font-semibold">Or Paste Image URL</Label>
                        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://example.com/image.png" />
                        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="caption" className="font-semibold">Caption</Label>
                        <Input id="caption" {...register('caption')} placeholder="e.g., A beautiful sunset over the Serengeti" />
                        {errors.caption && <p className="text-sm text-destructive mt-1">{errors.caption.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="tags" className="font-semibold">Tags (comma-separated)</Label>
                        <Input id="tags" {...register('tags')} placeholder="e.g., #Sunset, #Serengeti, #BigFive" />
                        {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="dataAiHint" className="font-semibold">Image Keywords for AI (max 2 words)</Label>
                        <Input id="dataAiHint" {...register('dataAiHint')} placeholder="e.g., sunset serengeti" />
                        {errors.dataAiHint && <p className="text-sm text-destructive mt-1">{errors.dataAiHint.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                          {isSubmitting ? 'Uploading...' : 'Add to Gallery'}
                        </Button>
                    </DialogFooter>
                </form>
              </DialogContent>
          </Dialog>
          {selectedCategory && (
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Categories
            </Button>
          )}
      </section>

      {selectedCategory ? (
        // Expanded Grid View
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {imagesToShow.map((image, index) => (
                <div key={image.id} className="relative aspect-square w-full rounded-md overflow-hidden group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1" onClick={() => openLightbox(index)}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={image.dataAiHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                    {image.caption && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-white text-xs line-clamp-2">{image.caption}</p>
                    </div>}
                </div>
            ))}
        </section>
      ) : (
        // Category Selection View
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedCategories.map(category => (
                <CategoryCard 
                    key={category} 
                    category={category}
                    images={imageCategories[category]}
                    onSelectCategory={setSelectedCategory}
                />
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
