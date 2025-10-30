
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
import RotarySpinner from '@/components/ui/rotary-spinner';

export default function VideoPlayerPage() {
    const params = useParams();
    const { id } = params;
    
    const [video, setVideo] = useState<VideoItem | null>(null);
    const [otherVideos, setOtherVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlayerActive, setIsPlayerActive] = useState(false);
    
    const [showPip, setShowPip] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile(1024);

    useEffect(() => {
        setIsLoading(true);
        setIsPlayerActive(false); // Reset player state on video change
        const allVideos = getMockVideoData();
        const currentVideo = allVideos.find(v => v.id === id);

        if (currentVideo) {
            setVideo(currentVideo);
            const relatedVideos = allVideos.filter(v => v.id !== id);
            setOtherVideos(relatedVideos);
            setShowPip(false);
            if (typeof window !== 'undefined') {
              window.scrollTo(0, 0);
            }
        } else {
            notFound();
        }
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            if (playerContainerRef.current) {
                const { bottom } = playerContainerRef.current.getBoundingClientRect();
                if (bottom < 0 && !showPip && isPlayerActive) {
                    setShowPip(true);
                } else if (bottom >= 0 && showPip) {
                    setShowPip(false);
                }
            }
        };

        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', handleScroll, { passive: true });
          return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [showPip, isPlayerActive]);

    const [ref, isVisible] = useScrollAnimation();

    if (isLoading || !video) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <RotarySpinner size={48} />
                <p className="ml-4 text-muted-foreground">Loading video...</p>
            </div>
        );
    }
    
    const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0`;

    const handleClosePip = () => {
      setShowPip(false);
      if(playerContainerRef.current) {
        playerContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const VideoPlayer = () => (
      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black relative">
        {!isPlayerActive ? (
          <>
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              layout="fill"
              objectFit="cover"
              className="cursor-pointer"
              data-ai-hint={video.dataAiHint}
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-20 w-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsPlayerActive(true)}
                aria-label={`Play video: ${video.title}`}
              >
                <PlayCircle className="h-full w-full" />
              </Button>
            </div>
          </>
        ) : (
          <iframe
            className="w-full h-full"
            src={youtubeEmbedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>
    );


     const PipPlayer = () => (
        <div className="fixed bottom-4 right-4 z-50 w-[320px] aspect-video rounded-lg overflow-hidden shadow-2xl bg-black animate-pip-in">
            <iframe
                className="w-full h-full"
                src={youtubeEmbedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
            <Button
                variant="ghost"
                size="icon"
                className="absolute -top-3 -right-2 z-10 bg-background/80 hover:bg-background h-8 w-8 rounded-full text-foreground"
                onClick={handleClosePip}
                aria-label="Close Picture-in-Picture"
            >
                <X className="h-5 w-5" />
            </Button>
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
            
            <div ref={playerContainerRef}>
                <VideoPlayer />
            </div>

            {showPip && <PipPlayer />}

            <div className={cn(
              "grid gap-8 transition-all duration-300",
              "grid-cols-1 lg:grid-cols-3"
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
                {isMobile && <RelatedVideosList />}
              </div>
              
              {!isMobile && (
                <aside>
                  <RelatedVideosList />
                </aside>
              )}
            </div>
        </div>
    );
}
