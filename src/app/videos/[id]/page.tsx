'use client';

import { notFound, useParams } from 'next/navigation';
import { getMockVideoData, type VideoItem } from '../data';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export default function VideoPlayerPage() {
    const params = useParams();
    const { id } = params;
    
    const [video, setVideo] = useState<VideoItem | null>(null);
    const [otherVideos, setOtherVideos] = useState<VideoItem[]>([]);
    
    const [isPip, setIsPip] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile(1024);

    useEffect(() => {
        const allVideos = getMockVideoData();
        const currentVideo = allVideos.find(v => v.id === id);

        if (currentVideo) {
            setVideo(currentVideo);
            const relatedVideos = allVideos.filter(v => v.id !== id);
            setOtherVideos(relatedVideos);
            // Reset PiP state when video changes
            setIsPip(false);
            window.scrollTo(0, 0);
        } else {
            notFound();
        }
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            if (playerContainerRef.current) {
                const { bottom } = playerContainerRef.current.getBoundingClientRect();
                if (bottom < 0 && !isPip) {
                    setIsPip(true);
                } else if (bottom >= 0 && isPip) {
                    setIsPip(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isPip]);

    const [ref, isVisible] = useScrollAnimation();

    if (!video) {
        return null; // Or a loading spinner
    }

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1`;

    const handleClosePip = () => {
      setIsPip(false);
      // Optional: Scroll back to the top of the player when closing PiP
      if(playerContainerRef.current) {
        playerContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const VideoPlayer = ({ isPipMode }: { isPipMode: boolean }) => (
        <div
            className={cn(
                "aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black transition-all duration-500",
                isPipMode && "fixed bottom-4 right-4 z-50 w-[320px] animate-pip-in"
            )}
        >
            <iframe
                className="w-full h-full"
                src={youtubeEmbedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
            {isPipMode && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-3 -right-2 z-10 bg-background/80 hover:bg-background h-8 w-8 rounded-full text-foreground"
                onClick={handleClosePip}
                aria-label="Close Picture-in-Picture"
              >
                  <X className="h-5 w-5" />
              </Button>
            )}
        </div>
    );
    
    const RelatedVideosList = () => (
      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-bold text-primary">More Videos</h2>
        <div className="grid grid-cols-1 gap-4">
          {otherVideos.map(otherVideo => (
            <Card key={otherVideo.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow group flex items-center">
              <Link href={`/videos/${otherVideo.id}`} className="flex-shrink-0">
                <div className="relative w-32 h-20 bg-muted">
                  <Image src={otherVideo.thumbnailUrl} alt={otherVideo.title} className="object-cover" data-ai-hint={otherVideo.dataAiHint} layout="fill" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-8 w-8 text-white/80" />
                  </div>
                </div>
              </Link>
              <CardHeader className="p-3">
                <Link href={`/videos/${otherVideo.id}`}>
                  <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors h-10">{otherVideo.title}</CardTitle>
                </Link>
                <Badge variant="outline" className="w-fit mt-1 text-xs">{otherVideo.category}</Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    );

    return (
        <div ref={ref} className={cn('space-y-8 scroll-animate', isVisible && 'scroll-animate-in')}>
            <Button variant="ghost" asChild>
                <Link href="/videos">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Video Library
                </Link>
            </Button>
            
            <div ref={playerContainerRef} className={cn("transition-all duration-500", isPip && "h-0 mb-0")}>
                {!isPip && <VideoPlayer isPipMode={false} />}
            </div>
            {isPip && <VideoPlayer isPipMode={true} />}

            <div className={cn(
              "grid gap-8 transition-all duration-300",
              !isPip || isMobile ? "grid-cols-1" : "lg:grid-cols-3"
            )}>
              <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-primary">{video.title}</CardTitle>
                        <div className="flex gap-2 pt-2">
                            <Badge variant="outline">{video.category}</Badge>
                            {video.duration && <Badge variant="secondary">{video.duration}</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{video.description}</CardDescription>
                    </CardContent>
                </Card>
                 {/* Mobile-only view for related videos */}
                {isMobile && <RelatedVideosList />}
              </div>
              
              {/* Desktop-only sidebar for related videos */}
              {!isMobile && (
                <aside className={cn(
                  "transition-opacity duration-500",
                   isPip ? "opacity-100" : "opacity-0 hidden lg:block"
                )}>
                  <RelatedVideosList />
                </aside>
              )}
            </div>
        </div>
    );
}
