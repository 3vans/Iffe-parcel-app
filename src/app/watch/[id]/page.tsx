
import { notFound } from 'next/navigation';
import { getMockVideoData, type VideoItem } from '@/app/videos/data';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PlayCircle } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default function WatchPage({ params }: Props) {
  const videoId = params.id;
  const allVideos = getMockVideoData();

  const currentVideo = allVideos.find(v => v.youtubeVideoId === videoId);
  const otherVideos = allVideos.filter(v => v.youtubeVideoId !== videoId);

  if (!currentVideo) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Main Player */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={currentVideo.title}
        />
      </div>

      {/* Video Details */}
       <div className="max-w-5xl mx-auto">
         <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary">{currentVideo.title}</h1>
         <p className="text-muted-foreground mt-2">{currentVideo.description}</p>
       </div>


      {/* Scrollable List of Other Videos */}
      <div className="w-full">
        <h2 className="font-headline text-xl font-bold text-primary mb-4">More Videos</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {otherVideos.map((video) => (
              <Link key={video.id} href={`/watch/${video.youtubeVideoId}`} className="block w-64 shrink-0 group">
                <div className="overflow-hidden rounded-lg">
                  <div className="relative aspect-video bg-muted">
                     <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={video.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white/80" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground">{video.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  );
}
