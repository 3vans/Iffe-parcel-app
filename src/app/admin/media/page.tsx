
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Link as LinkIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Mock data structure for gallery items - in a real app, this would come from a DB
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
  // Require either a file upload (represented as a data URL string after selection) or a valid external URL
  imageUrl: z.string().min(1, 'Image is required. Please upload an image or provide a URL.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;


export default function AdminMediaPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // In a real app, you'd fetch and manage adminGalleryImages from your backend
  const [adminGalleryImages, setAdminGalleryImages] = useState<GalleryImage[]>([]); 

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      caption: '',
      tags: '',
      imageUrl: '',
      dataAiHint: '',
    }
  });
  
  const currentImageUrlValue = watch('imageUrl');

  useEffect(() => {
    // Reset preview when dialog closes or if URL field is manually cleared after a file was selected
    if (!isUploadDialogOpen || (currentImageUrlValue && !currentImageUrlValue.startsWith('data:image') && imagePreviewUrl?.startsWith('data:image') )) {
      setImagePreviewUrl(null);
    }
  }, [isUploadDialogOpen, currentImageUrlValue, imagePreviewUrl]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result); // Show preview for selected file
        setValue('imageUrl', result, { shouldValidate: true }); // Set data URL as the value for imageUrl
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., user cancels file dialog), clear preview and field if it was a data URL
      if (watch('imageUrl').startsWith('data:image')) {
        setValue('imageUrl', '', { shouldValidate: true });
      }
      setImagePreviewUrl(null);
    }
  };

  const onSubmitMedia: SubmitHandler<MediaFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Admin submitted media:", data);

    // In a real app, you'd send 'data' to your backend to store the image (if data.imageUrl is a data URL)
    // or just store the metadata if it's an external URL.
    // Then you'd update the 'adminGalleryImages' state with the new item from the DB.
    const newMedia: GalleryImage = {
      id: `admin-img-${Date.now()}`,
      src: data.imageUrl, // This will be a data URL if uploaded, or external URL if pasted
      alt: data.caption || 'Admin uploaded image',
      dataAiHint: data.dataAiHint || 'uploaded image',
      caption: data.caption,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(tag => tag.length > 1) : [],
    };
    setAdminGalleryImages(prev => [newMedia, ...prev]); // Add to local state for demo

    toast({ title: "Media Uploaded!", description: "The image has been added to the gallery (simulated)." });
    reset();
    setImagePreviewUrl(null);
    setIsSubmitting(false);
    setIsUploadDialogOpen(false);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Media Library Management</CardTitle>
          <CardDescription>Manage images in the gallery and videos in the library.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Image Gallery</h3>
            <p className="text-muted-foreground mb-3">Upload new images, edit captions/tags, or delete existing gallery items.</p>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={(isOpen) => {
              setIsUploadDialogOpen(isOpen);
              if (!isOpen) {
                reset();
                setImagePreviewUrl(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button><UploadCloud className="mr-2 h-4 w-4" /> Upload to Gallery</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl text-primary">Upload Image to Gallery</DialogTitle>
                  <DialogDescription>
                    Select an image file or provide a URL. Add optional details.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitMedia)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div>
                    <Label htmlFor="imageUploadAdmin" className="text-right font-semibold flex items-center">
                      <UploadCloud className="h-4 w-4 mr-2 text-muted-foreground"/> Upload Image File
                    </Label>
                    <Input 
                      id="imageUploadAdmin" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange} 
                      className="col-span-3 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                     {errors.imageUrl && !watch('imageUrl') && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
                  </div>

                  {(imagePreviewUrl || (watch('imageUrl') && watch('imageUrl').startsWith('data:image'))) && (
                    <div className="mt-2 col-span-3">
                      <Label className="font-semibold">Image Preview:</Label>
                      <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                        <Image src={imagePreviewUrl || watch('imageUrl') || ''} alt="Image preview" layout="fill" objectFit="contain" />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="imageUrlAdmin" className="text-right font-semibold">Or Paste Image URL</Label>
                    <Input 
                        id="imageUrlAdmin" 
                        {...register('imageUrl')} 
                        className="col-span-3 mt-1" 
                        placeholder="https://example.com/image.png"
                        onFocus={() => { // Clear file preview if user focuses on URL input after selecting a file
                            if (imagePreviewUrl && watch('imageUrl').startsWith('data:image')) {
                                setImagePreviewUrl(null);
                            }
                        }}
                    />
                    {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="captionAdmin" className="text-right font-semibold">Caption (Optional)</Label>
                    <Input id="captionAdmin" {...register('caption')} className="col-span-3 mt-1" placeholder="Brief description" />
                    {errors.caption && <p className="text-sm text-destructive mt-1">{errors.caption.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tagsAdmin" className="text-right font-semibold">Tags (Optional, comma-separated)</Label>
                    <Input id="tagsAdmin" {...register('tags')} className="col-span-3 mt-1" placeholder="e.g., #Events, #Community" />
                    {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dataAiHintAdmin" className="text-right font-semibold">Image Keywords (Max 2 words)</Label>
                    <Input id="dataAiHintAdmin" {...register('dataAiHint')} className="col-span-3 mt-1" placeholder="e.g., nature community" />
                    {errors.dataAiHint && <p className="text-sm text-destructive mt-1">{errors.dataAiHint.message}</p>}
                  </div>
                  <DialogFooter className="mt-2 sticky bottom-0 bg-background py-3 -mx-2 px-2 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                      {isSubmitting ? 'Uploading...' : 'Add to Gallery'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Placeholder for gallery management table/grid - map over adminGalleryImages here */}
            {adminGalleryImages.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold text-md mb-3">Uploaded Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {adminGalleryImages.map(img => (
                            <Card key={img.id} className="overflow-hidden">
                                <div className="relative w-full aspect-square bg-muted">
                                    <Image src={img.src} alt={img.caption || 'Uploaded image'} layout="fill" objectFit="cover" data-ai-hint={img.dataAiHint} />
                                </div>
                                <CardContent className="p-2 text-xs">
                                    <p className="font-medium truncate" title={img.caption}>{img.caption || 'No caption'}</p>
                                    <p className="text-muted-foreground">{img.date}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
          </div>
          <hr className="my-6"/>
          <div>
            <h3 className="font-semibold text-lg mb-2">Video Library</h3>
            <p className="text-muted-foreground mb-3">Add YouTube video links, manage video details, categories, and visibility.</p>
            <Button><LinkIcon className="mr-2 h-4 w-4" /> Add YouTube Video</Button>
            {/* Placeholder for video management table/grid */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

