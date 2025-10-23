
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Video as VideoIcon, Film } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { getMockVideoData, type VideoItem } from '../videos/data';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

const imageMediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required.'),
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

  const { toast } = useToast();
  const [adminGalleryImages, setAdminGalleryImages] = useState<GalleryImage[]>([]); 
  const [adminVideoItems, setAdminVideoItems] = useState<VideoItem[]>(getMockVideoData());

  const imageForm = useForm<ImageMediaFormValues>({ resolver: zodResolver(imageMediaSchema), defaultValues: { caption: '', tags: '', imageUrl: '', dataAiHint: '' } });
  const videoForm = useForm<VideoMediaFormValues>({ resolver: zodResolver(videoMediaSchema), defaultValues: { youtubeUrl: '', title: '', description: '', category: 'Destination Highlights' } });

  const watchedImageUrl = imageForm.watch('imageUrl');

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageForm.setValue('imageUrl', reader.result as string, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitImageMedia: SubmitHandler<ImageMediaFormValues> = async (data) => {
    setIsSubmittingImage(true);
    // ... submission logic
    setIsSubmittingImage(false);
    setIsUploadImageDialogOpen(false);
  };

  const onSubmitVideoMedia: SubmitHandler<VideoMediaFormValues> = async (data) => {
    setIsSubmittingVideo(true);
    const videoId = getYoutubeVideoId(data.youtubeUrl);

    if (!videoId) {
        toast({ title: "Invalid YouTube URL", description: "Could not extract video ID.", variant: "destructive" });
        setIsSubmittingVideo(false);
        return;
    }

    const newVideo: VideoItem = {
      id: `admin-vid-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      category: data.category,
      duration: data.duration,
      youtubeVideoId: videoId,
      thumbnailUrl: `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      dataAiHint: 'youtube video',
    };
    
    setAdminVideoItems(prev => [newVideo, ...prev]);
    toast({ title: "Video Added!", description: `"${data.title}" has been added to your library.` });
    videoForm.reset();
    setIsSubmittingVideo(false);
    setIsAddVideoDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Media Library Management</CardTitle>
          <CardDescription>Manage images and videos for your website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* IMAGE SECTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Image Gallery</h3>
            <div className="flex gap-2">
              <Dialog open={isUploadImageDialogOpen} onOpenChange={setIsUploadImageDialogOpen}>
                <DialogTrigger asChild><Button><UploadCloud className="mr-2 h-4 w-4" /> Upload Image</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  {/* Image Upload Form */}
                </DialogContent>
              </Dialog>
            </div>
            {adminGalleryImages.length > 0 && <div className="mt-6 border-t pt-4">...</div>}
          </div>

          <hr className="my-6"/>

          {/* VIDEO SECTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Video Library</h3>
            <div className="flex gap-2">
              <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
                <DialogTrigger asChild><Button><VideoIcon className="mr-2 h-4 w-4" /> Add YouTube Video</Button></DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-primary">Add Video from YouTube</DialogTitle>
                        <DialogDescription>Paste a YouTube video link to add it to your library.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={videoForm.handleSubmit(onSubmitVideoMedia)} className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="youtubeUrl" className="font-semibold">YouTube Video URL</Label>
                            <Input id="youtubeUrl" {...videoForm.register('youtubeUrl')} placeholder="https://www.youtube.com/watch?v=..." disabled={isSubmittingVideo} />
                            {videoForm.formState.errors.youtubeUrl && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.youtubeUrl.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="video-title" className="font-semibold">Video Title</Label>
                            <Input id="video-title" {...videoForm.register('title')} placeholder="e.g., Sunrise Over the Serengeti" disabled={isSubmittingVideo} />
                            {videoForm.formState.errors.title && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.title.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="video-desc" className="font-semibold">Description (Optional)</Label>
                            <Input id="video-desc" {...videoForm.register('description')} placeholder="A brief summary of the video" disabled={isSubmittingVideo} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="video-category" className="font-semibold">Category</Label>
                                <Input id="video-category" {...videoForm.register('category')} placeholder="e.g., Destination Highlight" disabled={isSubmittingVideo} />
                                {videoForm.formState.errors.category && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.category.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="video-duration" className="font-semibold">Duration (mm:ss)</Label>
                                <Input id="video-duration" {...videoForm.register('duration')} placeholder="e.g., 04:30" disabled={isSubmittingVideo} />
                                {videoForm.formState.errors.duration && <p className="text-sm text-destructive mt-1">{videoForm.formState.errors.duration.message}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddVideoDialogOpen(false)} disabled={isSubmittingVideo}>Cancel</Button>
                            <Button type="submit" disabled={isSubmittingVideo} className="bg-primary hover:bg-primary/90">
                                {isSubmittingVideo ? 'Adding...' : <><VideoIcon className="mr-2 h-4 w-4"/>Add Video</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {adminVideoItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold text-md mb-3">Video Library:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {adminVideoItems.map(video => (
                            <Card key={video.id} className="overflow-hidden">
                                <div className="relative w-full aspect-video bg-muted">
                                    <Image src={video.thumbnailUrl} alt={video.title} fill objectFit="cover" data-ai-hint={video.dataAiHint || 'video content'} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-2 pointer-events-none">
                                      <Film className="h-5 w-5 text-white/80 mr-1" />
                                      <p className="text-white text-xs font-medium truncate" title={video.title}>{video.title}</p>
                                    </div>
                                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs capitalize">YouTube</Badge>
                                </div>
                                <CardContent className="p-3 text-xs">
                                    <Link href={`/videos/${video.id}`} className="text-primary hover:underline truncate block" title={video.title}>{video.title}</Link>
                                    <p className="text-muted-foreground mt-1 line-clamp-2" title={video.description}>{video.description || 'No description.'}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {adminVideoItems.length === 0 && <p className="text-sm text-muted-foreground mt-4">No videos added yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
