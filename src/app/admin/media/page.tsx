
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Link as LinkIcon, Video } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mock data structure for gallery items
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

// Mock data structure for video items
interface AdminVideoItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  submittedDate: string;
  thumbnailUrl?: string; // Optional: for displaying a preview
  dataAiHint?: string; // Optional: for AI image search for thumbnail
}

const imageMediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(), // Comma-separated
  imageUrl: z.string().min(1, 'Image is required. Please upload an image or provide a URL.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters (max 2 words).').optional(),
});
type ImageMediaFormValues = z.infer<typeof imageMediaSchema>;

const videoMediaSchema = z.object({
  videoUrl: z.string().url('Please enter a valid video URL.'),
  title: z.string().min(3, 'Title must be at least 3 characters.').max(100, 'Title cannot exceed 100 characters.'),
  description: z.string().max(500, "Description cannot exceed 500 characters.").optional(),
  tags: z.string().optional(), // Comma-separated
});
type VideoMediaFormValues = z.infer<typeof videoMediaSchema>;


export default function AdminMediaPage() {
  const [isUploadImageDialogOpen, setIsUploadImageDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);
  
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  const { toast } = useToast();

  const [adminGalleryImages, setAdminGalleryImages] = useState<GalleryImage[]>([]); 
  const [adminVideoItems, setAdminVideoItems] = useState<AdminVideoItem[]>([]);

  const imageForm = useForm<ImageMediaFormValues>({
    resolver: zodResolver(imageMediaSchema),
    defaultValues: {
      caption: '',
      tags: '',
      imageUrl: '',
      dataAiHint: '',
    }
  });
  
  const videoForm = useForm<VideoMediaFormValues>({
    resolver: zodResolver(videoMediaSchema),
    defaultValues: {
      videoUrl: '',
      title: '',
      description: '',
      tags: '',
    }
  });

  const currentImageUrlValue = imageForm.watch('imageUrl');

  useEffect(() => {
    if (!isUploadImageDialogOpen || (currentImageUrlValue && !currentImageUrlValue.startsWith('data:image') && imagePreviewUrl?.startsWith('data:image') )) {
      setImagePreviewUrl(null);
    }
  }, [isUploadImageDialogOpen, currentImageUrlValue, imagePreviewUrl]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result); 
        imageForm.setValue('imageUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    } else {
      if (imageForm.watch('imageUrl').startsWith('data:image')) {
        imageForm.setValue('imageUrl', '', { shouldValidate: true });
      }
      setImagePreviewUrl(null);
    }
  };

  const onSubmitImageMedia: SubmitHandler<ImageMediaFormValues> = async (data) => {
    setIsSubmittingImage(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Admin submitted image:", data);
    const newMedia: GalleryImage = {
      id: `admin-img-${Date.now()}`,
      src: data.imageUrl, 
      alt: data.caption || 'Admin uploaded image',
      dataAiHint: data.dataAiHint || 'uploaded image',
      caption: data.caption,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(tag => tag.length > 1) : [],
    };
    setAdminGalleryImages(prev => [newMedia, ...prev]);
    toast({ title: "Image Uploaded!", description: "The image has been added to the gallery (simulated)." });
    imageForm.reset();
    setImagePreviewUrl(null);
    setIsSubmittingImage(false);
    setIsUploadImageDialogOpen(false);
  };

  const onSubmitVideoMedia: SubmitHandler<VideoMediaFormValues> = async (data) => {
    setIsSubmittingVideo(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Admin submitted video:", data);
    
    // Basic YouTube thumbnail extraction (can be expanded for other platforms or made more robust)
    let thumbnailUrl = 'https://placehold.co/320x180.png';
    let dataAiHint = 'video placeholder';
    if (data.videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = data.videoUrl.split('v=')[1]?.split('&')[0];
        if (videoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            dataAiHint = 'youtube video';
        }
    } else if (data.videoUrl.includes('youtu.be/')) {
        const videoId = data.videoUrl.split('youtu.be/')[1]?.split('?')[0];
         if (videoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            dataAiHint = 'youtube video';
        }
    }

    const newVideo: AdminVideoItem = {
      id: `admin-vid-${Date.now()}`,
      url: data.videoUrl,
      title: data.title,
      description: data.description,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(tag => tag.length > 1) : [],
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      thumbnailUrl: thumbnailUrl,
      dataAiHint: dataAiHint,
    };
    setAdminVideoItems(prev => [newVideo, ...prev]);
    toast({ title: "Video Added!", description: "The video has been added to the library (simulated)." });
    videoForm.reset();
    setIsSubmittingVideo(false);
    setIsAddVideoDialogOpen(false);
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
            
            <Dialog open={isUploadImageDialogOpen} onOpenChange={(isOpen) => {
              setIsUploadImageDialogOpen(isOpen);
              if (!isOpen) {
                imageForm.reset();
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
                <form onSubmit={imageForm.handleSubmit(onSubmitImageMedia)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
                     {imageForm.formState.errors.imageUrl && !imageForm.watch('imageUrl') && <p className="text-sm text-destructive mt-1">{imageForm.formState.errors.imageUrl.message}</p>}
                  </div>

                  {(imagePreviewUrl || (imageForm.watch('imageUrl') && imageForm.watch('imageUrl').startsWith('data:image'))) && (
                    <div className="mt-2 col-span-3">
                      <Label className="font-semibold">Image Preview:</Label>
                      <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                        <Image src={imagePreviewUrl || imageForm.watch('imageUrl') || ''} alt="Image preview" layout="fill" objectFit="contain" />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="imageUrlAdmin" className="text-right font-semibold">Or Paste Image URL</Label>
                    <Input 
                        id="imageUrlAdmin" 
                        {...imageForm.register('imageUrl')} 
                        className="col-span-3 mt-1" 
                        placeholder="https://example.com/image.png"
                        onFocus={() => { 
                            if (imagePreviewUrl && imageForm.watch('imageUrl').startsWith('data:image')) {
                                setImagePreviewUrl(null);
                            }
                        }}
                    />
                    {imageForm.formState.errors.imageUrl && <p className="text-sm text-destructive mt-1">{imageForm.formState.errors.imageUrl.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="captionAdmin" className="text-right font-semibold">Caption (Optional)</Label>
                    <Input id="captionAdmin" {...imageForm.register('caption')} className="col-span-3 mt-1" placeholder="Brief description" />
                    {imageForm.formState.errors.caption && <p className="text-sm text-destructive mt-1">{imageForm.formState.errors.caption.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tagsAdmin" className="text-right font-semibold">Tags (Optional, comma-separated)</Label>
                    <Input id="tagsAdmin" {...imageForm.register('tags')} className="col-span-3 mt-1" placeholder="e.g., #Events, #Community" />
                    {imageForm.formState.errors.tags && <p className="text-sm text-destructive mt-1">{imageForm.formState.errors.tags.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dataAiHintAdmin" className="text-right font-semibold">Image Keywords (Max 2 words)</Label>
                    <Input id="dataAiHintAdmin" {...imageForm.register('dataAiHint')} className="col-span-3 mt-1" placeholder="e.g., nature community" />
                    {imageForm.formState.errors.dataAiHint && <p className="text-sm text-destructive mt-1">{imageForm.formState.errors.dataAiHint.message}</p>}
                  </div>
                  <DialogFooter className="mt-2 sticky bottom-0 bg-background py-3 -mx-2 px-2 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsUploadImageDialogOpen(false)} disabled={isSubmittingImage}>Cancel</Button>
                    <Button type="submit" disabled={isSubmittingImage} className="bg-primary hover:bg-primary/90">
                      {isSubmittingImage ? 'Uploading...' : 'Add to Gallery'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
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
             {adminGalleryImages.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">No images uploaded by admin yet.</p>
            )}
          </div>
          <hr className="my-6"/>
          <div>
            <h3 className="font-semibold text-lg mb-2">Video Library</h3>
            <p className="text-muted-foreground mb-3">Add video links (e.g., YouTube, Rumble), manage video details, categories, and visibility.</p>
            
            <Dialog open={isAddVideoDialogOpen} onOpenChange={(isOpen) => {
              setIsAddVideoDialogOpen(isOpen);
              if (!isOpen) {
                videoForm.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button><LinkIcon className="mr-2 h-4 w-4" /> Add Video Link</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl text-primary">Add Video to Library</DialogTitle>
                  <DialogDescription>
                    Provide a video URL and details for the library.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={videoForm.handleSubmit(onSubmitVideoMedia)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div>
                    <Label htmlFor="videoUrlAdmin" className="text-right font-semibold">Video URL</Label>
                    <Input id="videoUrlAdmin" {...videoForm.register('videoUrl')} className="col-span-3 mt-1" placeholder="https://youtube.com/watch?v=..." />
                    {videoForm.formState.errors.videoUrl && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.videoUrl.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="videoTitleAdmin" className="text-right font-semibold">Video Title</Label>
                    <Input id="videoTitleAdmin" {...videoForm.register('title')} className="col-span-3 mt-1" placeholder="Catchy title for the video" />
                    {videoForm.formState.errors.title && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.title.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="videoDescriptionAdmin" className="text-right font-semibold">Description (Optional)</Label>
                    <Textarea id="videoDescriptionAdmin" {...videoForm.register('description')} className="col-span-3 mt-1" placeholder="Brief summary of the video content" rows={3}/>
                    {videoForm.formState.errors.description && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.description.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="videoTagsAdmin" className="text-right font-semibold">Tags (Optional, comma-separated)</Label>
                    <Input id="videoTagsAdmin" {...videoForm.register('tags')} className="col-span-3 mt-1" placeholder="e.g., #Training, #Events" />
                    {videoForm.formState.errors.tags && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.tags.message}</p>}
                  </div>
                  <DialogFooter className="mt-2 sticky bottom-0 bg-background py-3 -mx-2 px-2 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsAddVideoDialogOpen(false)} disabled={isSubmittingVideo}>Cancel</Button>
                    <Button type="submit" disabled={isSubmittingVideo} className="bg-primary hover:bg-primary/90">
                      {isSubmittingVideo ? 'Adding...' : 'Add Video to Library'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {adminVideoItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold text-md mb-3">Added Videos:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {adminVideoItems.map(video => (
                            <Card key={video.id} className="overflow-hidden">
                                <div className="relative w-full aspect-video bg-muted">
                                    <Image src={video.thumbnailUrl || 'https://placehold.co/320x180.png'} alt={video.title} layout="fill" objectFit="cover" data-ai-hint={video.dataAiHint || 'video placeholder'} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-2">
                                      <Video className="h-5 w-5 text-white/80 mr-1" />
                                      <p className="text-white text-xs font-medium truncate" title={video.title}>{video.title}</p>
                                    </div>
                                </div>
                                <CardContent className="p-3 text-xs">
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block" title={video.url}>{video.url}</a>
                                    <p className="text-muted-foreground mt-1 line-clamp-2" title={video.description}>{video.description || 'No description.'}</p>
                                    {video.tags.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1">
                                        {video.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">{tag}</Badge>)}
                                      </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {adminVideoItems.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">No videos added by admin yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    