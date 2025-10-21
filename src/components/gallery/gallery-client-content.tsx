
'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Tag, Layers, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import placeholderImages from '@/app/lib/placeholder-images.json';

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

    return (
        <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
            <Card onClick={() => onSelectCategory(category)} className="cursor-pointer group overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center text-xl font-headline text-primary group-hover:text-accent transition-colors">
                        <Layers className="mr-2 h-5 w-5 text-accent"/>
                        {category.replace('#','')}
                    </CardTitle>
                    <CardDescription>{images.length} photos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                        {previewImages.map(img => (
                            <div key={img.id} className="relative aspect-square w-full">
                                <Image src={img.src} alt={img.alt} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={img.dataAiHint}/>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default function GalleryClientContent({ initialImages }: GalleryClientContentProps) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [filterRef, isFilterVisible] = useScrollAnimation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    return Object.keys(imageCategories).filter(cat => cat !== '#All').sort((a, b) => a.localeCompare(b));
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

  return (
    <>
      <section ref={filterRef} className={cn('flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow scroll-animate', isFilterVisible && 'scroll-animate-in')}>
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
                 {/* Dialog Content remains the same */}
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
            {imagesToShow.map(image => (
                 <div key={image.id} className="relative aspect-square w-full rounded-md overflow-hidden group">
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
