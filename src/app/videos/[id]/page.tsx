
'use client';

import { notFound, useParams } from 'next/navigation';
import { getMockVideoData, type VideoItem } from '../page';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

export default function VideoPlayerPage() {
    const params = useParams();
    const { id } = params;
    const allVideos = getMockVideoData();
    const [video, setVideo] = useState<VideoItem | null>(null);
    const [otherVideos, setOtherVideos] = useState<VideoItem[]>([]);

    useEffect(() => {
        const currentVideo = allVideos.find(v => v.id === id);
        if (currentVideo) {
            setVideo(currentVideo);
            const relatedVideos = allVideos.filter(v => v.id !== id);
            setOtherVideos(relatedVideos);
        } else {
            notFound();
        }
    }, [id, allVideos]);

    const [ref, isVisible] = useScrollAnimation();

    if (!video) {
        return null; // Or a loading spinner
    }

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeVideoId}`;

    return (
        <div ref={ref} className={cn('space-y-8 scroll-animate', isVisible && 'scroll-animate-in')}>
            <Button variant="ghost" asChild>
                <Link href="/videos">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Video Library
                </Link>
            </Button>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-primary">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                    <div className="flex gap-2 pt-2">
                        <Badge variant="outline">{video.category}</Badge>
                        <Badge variant="secondary">{video.duration}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black">
                        <iframe
                            className="w-full h-full"
                            src={youtubeEmbedUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </CardContent>
            </Card>

            <section className="space-y-6">
                <h2 className="font-headline text-2xl font-bold text-primary">More Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherVideos.map(otherVideo => (
                        <Card key={otherVideo.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                           <Link href={`/videos/${otherVideo.id}`}>
                                <div className="relative w-full aspect-video bg-muted">
                                    <Image src={otherVideo.thumbnailUrl} alt={otherVideo.title} className="w-full h-full object-cover" data-ai-hint={otherVideo.dataAiHint} layout="fill" />
                                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <PlayCircle className="h-16 w-16 text-white/80" />
                                    </div>
                                    {otherVideo.duration && (
                                      <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs bg-black/70 text-white border-none">{otherVideo.duration}</Badge>
                                    )}
                                </div>
                            </Link>
                            <CardHeader className="p-4">
                               <Link href={`/videos/${otherVideo.id}`}>
                                <CardTitle className="text-md font-semibold line-clamp-2 group-hover:text-primary transition-colors h-12">{otherVideo.title}</CardTitle>
                               </Link>
                                <Badge variant="outline" className="w-fit mt-1 text-xs">{otherVideo.category}</Badge>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
