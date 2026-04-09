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
import { UploadCloud, Video as VideoIcon, Film, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  uploadGalleryImage, 
  fetchGalleryImages, 
  deleteGalleryImage, 
  addVideo, 
  fetchVideos, 
  deleteVideo,
  type GalleryImage,
  type VideoItem 
} from '@/lib/services/cms-service';

const imageMediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(),
  imageUrl: z.string().optional(), // Used for preview
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters.').optional(),
});
type ImageMediaFormValues = z.infer<typeof imageMediaSchema>;

const youtubeUrlSchema = z.string().url().refine(
    (url) => {
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        ];
        return patterns.some((pattern) => pattern.test(url));
    },
    { message: "Please enter a valid YouTube video URL." }
);

const videoMediaSchema = z.object({
  youtubeUrl: youtubeUrlSchema,
  title: z.string().min(3, 'Title is required.').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(2, 'Category is required.'),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in mm:ss format.').optional(),
});
type VideoMediaFormValues = z.infer<typeof videoMediaSchema>;

function getYoutubeVideoId(url: string): string | null {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

export default function AdminMediaPage() {
  const [isUploadImageDialogOpen, setIsUploadImageDialogOpen] = useState(false);
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { toast } = useToast();
  const [adminGalleryImages, setAdminGalleryImages] = useState<GalleryImage[]>([]); 
  const [adminVideoItems, setAdminVideoItems] = useState<VideoItem[]>([]);

  const imageForm = useForm<ImageMediaFormValues>({ resolver: zodResolver(imageMediaSchema) });
  const videoForm = useForm<VideoMediaFormValues>({ resolver: zodResolver(videoMediaSchema), defaultValues: { category: 'Destination Highlights' } });

  const watchedImageUrl = imageForm.watch('imageUrl');

  useEffect(() => {
    const loadData = async () => {
      const [images, videos] = await Promise.all([fetchGalleryImages(), fetchVideos()]);
      setAdminGalleryImages(images);
      setAdminVideoItems(videos);
    };
    loadData();
  }, []);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        imageForm.setValue('imageUrl', reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitImageMedia: SubmitHandler<ImageMediaFormValues> = async (data) => {
    if (!imageFile) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setIsSubmittingImage(true);
    
    try {
      // Pre-flight Connection Check
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || url.includes('your-supabase-url') || !key || key.includes('your-supabase-anon-key')) {
        throw new Error("Supabase Connection Error: Your .env file still contains placeholder credentials. Replace them with actual values from your Supabase Dashboard to enable uploads.");
      }

      await uploadGalleryImage(imageFile, { 
        caption: data.caption, 
        tags: data.tags, 
        dataAiHint: data.dataAiHint 
      });
      
      const updatedImages = await fetchGalleryImages();
      setAdminGalleryImages(updatedImages);
      toast({ title: "Image Uploaded Successfully!" });
      setIsUploadImageDialogOpen(false);
      imageForm.reset();
      setImageFile(null);
    } catch (error: any) {
      console.error("Snag in Media Upload:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "An unexpected error occurred. Please check the console for details.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmittingImage(false);
    }
  };

  const onSubmitVideoMedia: SubmitHandler<VideoMediaFormValues> = async (data) => {
    setIsSubmittingVideo(true);
    const videoId = getYoutubeVideoId(data.youtubeUrl);

    if (!videoId) {
        toast({ title: "Invalid YouTube URL", variant: "destructive" });
        setIsSubmittingVideo(false);
        return;
    }

    try {
      await addVideo({
        title: data.title,
        description: data.description || '',
        category: data.category,
        duration: data.duration,
        youtubeVideoId: videoId,
        thumbnailUrl: `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        dataAiHint: 'youtube video',
      });
      const updatedVideos = await fetchVideos();
      setAdminVideoItems(updatedVideos);
      toast({ title: "Video Added!" });
      videoForm.reset();
      setIsAddVideoDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Check your Firestore settings.", variant: "destructive" });
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  const handleDeleteImage = async (id: string, storagePath?: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteGalleryImage(id, storagePath);
      setAdminGalleryImages(prev => prev.filter(img => img.id !== id));
      toast({ title: "Image Deleted" });
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const handleDeleteVideoItem = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteVideo(id);
      setAdminVideoItems(prev => prev.filter(v => v.id !== id));
      toast({ title: "Video Deleted" });
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Media Library Management</CardTitle>
          <CardDescription>Manage images and videos using Supabase and Firestore.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* IMAGE SECTION */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Image Gallery (Supabase)</h3>
              <Dialog open={isUploadImageDialogOpen} onOpenChange={setIsUploadImageDialogOpen}>
                <DialogTrigger asChild><Button><UploadCloud className="mr-2 h-4 w-4" /> Upload Image</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-primary">Upload Gallery Image</DialogTitle>
                    <DialogDescription>Add a new photo to the public gallery.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={imageForm.handleSubmit(onSubmitImageMedia)} className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="imageFile">Image File</Label>
                      <Input id="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} disabled={isSubmittingImage} />
                    </div>
                    {watchedImageUrl && (
                      <div className="relative w-full aspect-video border rounded-md overflow-hidden bg-muted">
                        <Image src={watchedImageUrl} alt="Preview" fill style={{ objectFit: 'contain' }} />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Input id="caption" {...imageForm.register('caption')} placeholder="Brief description..." disabled={isSubmittingImage} />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" {...imageForm.register('tags')} placeholder="#Safari, #Gorillas" disabled={isSubmittingImage} />
                    </div>
                    <div>
                      <Label htmlFor="dataAiHint">AI Search Keywords (max 2 words)</Label>
                      <Input id="dataAiHint" {...imageForm.register('dataAiHint')} placeholder="gorilla forest" disabled={isSubmittingImage} />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsUploadImageDialogOpen(false)} disabled={isSubmittingImage}>Cancel</Button>
                      <Button type="submit" disabled={isSubmittingImage} className="bg-primary hover:bg-primary/90">
                        {isSubmittingImage ? 'Uploading...' : 'Upload to Supabase'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {adminGalleryImages.map(img => (
                <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted border">
                  <Image src={img.src} alt={img.alt} fill objectFit="cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="destructive" onClick={() => handleDeleteImage(img.id, img.storagePath)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {adminGalleryImages.length === 0 && <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">No images in gallery.</p>}
          </div>

          <hr />

          {/* VIDEO SECTION */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Video Library</h3>
              <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
                <DialogTrigger asChild><Button><VideoIcon className="mr-2 h-4 w-4" /> Add YouTube Video</Button></DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-primary">Add Video from YouTube</DialogTitle>
                        <DialogDescription>Save video details to Firestore.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={videoForm.handleSubmit(onSubmitVideoMedia)} className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
                            <Input id="youtubeUrl" {...videoForm.register('youtubeUrl')} placeholder="https://www.youtube.com/watch?v=..." disabled={isSubmittingVideo} />
                        </div>
                        <div>
                            <Label htmlFor="video-title">Video Title</Label>
                            <Input id="video-title" {...videoForm.register('title')} disabled={isSubmittingVideo} />
                        </div>
                        <div>
                            <Label htmlFor="video-desc">Description</Label>
                            <Input id="video-desc" {...videoForm.register('description')} disabled={isSubmittingVideo} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="video-category">Category</Label>
                                <Input id="video-category" {...videoForm.register('category')} disabled={isSubmittingVideo} />
                            </div>
                            <div>
                                <Label htmlFor="video-duration">Duration (mm:ss)</Label>
                                <Input id="video-duration" {...videoForm.register('duration')} disabled={isSubmittingVideo} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddVideoDialogOpen(false)} disabled={isSubmittingVideo}>Cancel</Button>
                            <Button type="submit" disabled={isSubmittingVideo} className="bg-primary hover:bg-primary/90">
                                {isSubmittingVideo ? 'Saving...' : 'Add Video'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {adminVideoItems.map(video => (
                    <Card key={video.id} className="overflow-hidden group">
                        <div className="relative aspect-video bg-muted">
                            <Image src={video.thumbnailUrl} alt={video.title} fill objectFit="cover" />
                            <div className="absolute top-2 right-2">
                              <Button size="icon" variant="destructive" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteVideoItem(video.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-semibold truncate">{video.title}</p>
                            <Badge variant="outline" className="mt-1 text-[10px]">{video.category}</Badge>
                        </div>
                    </Card>
                ))}
            </div>
            {adminVideoItems.length === 0 && <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">No videos in library.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
