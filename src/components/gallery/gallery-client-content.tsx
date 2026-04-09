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
import { UploadCloud, Layers, ArrowLeft, ArrowRight, Tag, Camera, Grid, Filter, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Badge } from '@/components/ui/badge';
import Lightbox from './lightbox';
import { type GalleryImage, uploadGalleryImage } from '@/lib/services/cms-service';

const mediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(),
  imageFile: z.any().optional(), // Used for local preview logic
  imageUrl: z.string().optional(), // Used for display
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;

interface GalleryClientContentProps {
  initialImages: GalleryImage[];
}

export default function GalleryClientContent({ initialImages }: GalleryClientContentProps) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('#All');
  const { toast } = useToast();
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
  });

  const watchedImageUrl = watch('imageUrl');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('#All');
    galleryImages.forEach(img => {
      img.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [galleryImages]);

  const filteredImages = useMemo(() => {
    if (selectedTag === '#All') return galleryImages;
    return galleryImages.filter(img => img.tags?.includes(selectedTag));
  }, [galleryImages, selectedTag]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imageUrl', reader.result as string, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitMedia: SubmitHandler<MediaFormValues> = async (data) => {
    if (!imageFile) {
        toast({ title: "Image Required", description: "Please select a photo to upload.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
      const result = await uploadGalleryImage(imageFile, {
        caption: data.caption,
        tags: data.tags,
        dataAiHint: data.dataAiHint
      });

      const newMedia: GalleryImage = {
        id: result.id || `g-${Date.now()}`,
        src: result.src,
        alt: data.caption || 'User uploaded image',
        dataAiHint: data.dataAiHint || 'uploaded image',
        caption: data.caption,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(tag => tag.length > 1) : [],
      };

      setGalleryImages(prev => [newMedia, ...prev]);
      toast({ title: "Moments Shared!", description: "Your photo has been added to the community gallery." });
      reset();
      setImageFile(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Upload snagged", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  if (isLightboxOpen) {
    return (
      <Lightbox
        images={filteredImages}
        startIndex={selectedImageIndex}
        onClose={() => setIsLightboxOpen(false)}
      />
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Controls & Filters */}
      <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-card/80 backdrop-blur-md rounded-2xl shadow-lg border border-primary/5">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <h3 className="font-headline text-lg font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Filter className="h-4 w-4 text-accent" /> Filter Stories
            </h3>
            <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                    <Button 
                        key={tag} 
                        variant={selectedTag === tag ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                            "rounded-full px-4 text-xs font-bold uppercase tracking-widest transition-all",
                            selectedTag === tag ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary hover:border-primary/30"
                        )}
                    >
                        {tag.replace('#', '')}
                    </Button>
                ))}
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
              setIsDialogOpen(isOpen);
              if (!isOpen) { reset(); setImageFile(null); }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-12 px-8 rounded-full shadow-lg shadow-accent/20 font-black uppercase tracking-widest">
                  <UploadCloud className="mr-2 h-5 w-5" /> Share A Moment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-white/10">
                 <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-primary uppercase font-black">Post to Gallery</DialogTitle>
                    <DialogDescription>Your adventures inspire others. Share your best shots here.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitMedia)} className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="imageUpload" className="font-bold uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Select Photo</Label>
                        <div className="relative group cursor-pointer">
                            <Input 
                                id="imageUpload" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageFileChange} 
                                className="hidden" 
                            />
                            <Label 
                                htmlFor="imageUpload" 
                                className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-2xl p-8 hover:bg-primary/5 transition-all cursor-pointer group-hover:border-accent/50"
                            >
                                {watchedImageUrl ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                                        <Image src={watchedImageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Badge className="bg-white text-black">Change Image</Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Camera className="h-12 w-12 text-primary/30 mb-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold text-muted-foreground">Drop a photo or click to browse</span>
                                    </>
                                )}
                            </Label>
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="caption" className="font-bold uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Short Caption</Label>
                            <Input id="caption" {...register('caption')} placeholder="e.g. Sunrise over the valley..." className="bg-muted/30 border-none rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="font-bold uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Tags (Comma Separated)</Label>
                            <Input id="tags" {...register('tags')} placeholder="Safari, Wildlife, Sunset" className="bg-muted/30 border-none rounded-xl h-12" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UploadCloud className="h-5 w-5 mr-2" />}
                          {isSubmitting ? 'Posting...' : 'Post Image'}
                        </Button>
                    </DialogFooter>
                </form>
              </DialogContent>
          </Dialog>
      </section>

      {/* Main Grid View */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
          {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className="relative aspect-square w-full rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-primary/5 bg-muted" 
                onClick={() => openLightbox(index)}
              >
                  <Image
                      src={image.src}
                      alt={image.alt}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={image.dataAiHint}
                      className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      {image.caption && <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-2">{image.caption}</p>}
                      <div className="flex flex-wrap gap-1">
                        {image.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[8px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full uppercase font-black tracking-widest">
                                {tag.replace('#', '')}
                            </span>
                        ))}
                      </div>
                  </div>
              </div>
          ))}
      </section>

      {filteredImages.length === 0 && (
        <div className="text-center py-32 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-primary/5">
          <Grid className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground uppercase tracking-tighter">No media found in this channel</p>
          <Button variant="link" onClick={() => setSelectedTag('#All')} className="text-accent mt-2 font-bold">Clear all filters</Button>
        </div>
      )}
    </div>
  );
}
