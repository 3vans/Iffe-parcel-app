import Link from 'next/link';
import Image from 'next/image';
import { getMockVideoData } from './data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import PageHero from '@/components/layout/page-hero';
import placeholderImages from '@/app/lib/placeholder-images.json';

export default async function VideoLibraryPage() {
  const videos = getMockVideoData();

  return (
    <div className="space-y-8 animate-fade-in">
        <PageHero
          title="Travel Video Library"
          subtitle="Watch highlights from our expeditions, travel tips from guides, and stories from fellow adventurers."
          imageUrl={placeholderImages.videoPlaceholder.src}
          dataAiHint="video library"
        />

      {videos && videos.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4 py-8">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group">
                <Link href={`/watch/${video.youtubeVideoId}`} className="block">
                  <div className="relative w-full aspect-video bg-muted">
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={video.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                </Link>
                <CardHeader className="p-4">
                  <CardTitle className="font-headline text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors h-14">
                    <Link href={`/watch/${video.youtubeVideoId}`}>{video.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-sm line-clamp-3 h-[60px]">{video.description}</CardDescription>
                </CardContent>
                 <CardFooter className="p-4">
                    <Button variant="default" asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href={`/watch/${video.youtubeVideoId}`}>
                        <PlayCircle className="mr-2 h-5 w-5" /> Watch Video
                      </Link>
                    </Button>
                </CardFooter>
            </Card>
          ))}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The video library is empty. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
