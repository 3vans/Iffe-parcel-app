
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, UploadCloud, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dataAiHint: string;
  youtubeVideoId?: string; 
  category: string;
  duration?: string;
  previewVideoUrl?: string; 
}

const mockVideoData: VideoItem[] = [
  { id: 'v1', title: 'Sunrise Over the Serengeti', description: 'Witness the breathtaking beauty of a sunrise casting its golden hues over the vast plains of the Serengeti.', thumbnailUrl: placeholderImages.videoThumbConference.src, dataAiHint: 'Serengeti sunrise', youtubeVideoId: 'LXb3EKWsInQ', category: 'Destination Highlights', duration: '2:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 'v2', title: 'Gorilla Trekking in Bwindi', description: 'An up-close and personal look at a family of mountain gorillas in Uganda\'s Bwindi Impenetrable Forest.', thumbnailUrl: placeholderImages.videoThumbTraining.src, dataAiHint: 'gorilla family', category: 'Expeditions', youtubeVideoId: 'LXb3EKWsInQ', duration: '5:45', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'v3', title: 'The Great Wildebeest Migration', description: 'Experience the thunderous river crossings of the Great Migration, a true wonder of the natural world.', thumbnailUrl: placeholderImages.videoThumbWater.src, dataAiHint: 'wildebeest river', youtubeVideoId: 'LXb3EKWsInQ', category: 'Nature & Wildlife', duration: '4:10', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: 'v4', title: 'Traveler Stories: My First Safari', description: 'Hear from a recent traveler about their unforgettable first safari experience with iffe-travels.', thumbnailUrl: placeholderImages.videoThumbTestimonial.src, dataAiHint: 'tourist testimonial', category: 'Testimonials', youtubeVideoId: 'LXb3EKWsInQ', duration: '6:22', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  { id: 'v5', title: 'Packing for a Safari: Pro Tips', description: 'Our expert guides share their top tips on what to pack for the ultimate safari adventure.', thumbnailUrl: placeholderImages.videoThumbYouth.src, dataAiHint: 'safari packing', category: 'Travel Tips', youtubeVideoId: 'LXb3EKWsInQ', duration: '3:50', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'v6', title: 'Okavango Delta Mokoro Trip', description: 'A serene journey through the waterways of the Okavango Delta in a traditional dugout canoe.', thumbnailUrl: placeholderImages.videoThumbPlanning.src, dataAiHint: 'mokoro canoe safari', category: 'Expeditions', youtubeVideoId: 'LXb3EKWsInQ', duration: '4:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
];

export function getMockVideoData() {
    return mockVideoData;
}

const availableCategories = ['Destination Highlights', 'Expeditions', 'Nature & Wildlife', 'Travel Tips', 'Testimonials', 'All'];

export default function VideoLibraryPage() {
  const [headerRef, isHeaderVisible] = useScrollAnimation();
  const [filterRef, isFilterVisible] = useScrollAnimation();
  const heroImage = placeholderImages.videoPlaceholder.src;
  const heroDataAiHint = 'video library';


  const AnimatedVideoCard = ({ video }: { video: VideoItem }) => {
    const [ref, isVisible] = useScrollAnimation();
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div 
        ref={ref} 
        className={cn('scroll-animate', isVisible && 'scroll-animate-in')}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Card key={video.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
          <div className="relative w-full aspect-video bg-muted">
            {isHovering && video.previewVideoUrl ? (
                <video
                    src={video.previewVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <Image src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" data-ai-hint={video.dataAiHint} layout="fill" />
            )}
            <div className={cn(
              "absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity",
              isHovering ? "opacity-0" : "opacity-0 group-hover:opacity-100"
            )}>
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
            {video.duration && (
              <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs bg-black/70 text-white border-none">{video.duration}</Badge>
            )}
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors h-14">{video.title}</CardTitle>
            <Badge variant="outline" className="w-fit mt-1">{video.category}</Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <CardDescription className="text-sm line-clamp-3 h-[60px]">{video.description}</CardDescription>
          </CardContent>
          <CardFooter className="p-4">
            <Button variant="default" asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href={`/videos/${video.id}`}>
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Video
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isHeaderVisible && 'scroll-animate-in')}>
            <Image
                src={heroImage}
                alt="Video Library"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint={heroDataAiHint}
                priority
            />
            <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
            
            <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
                <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
                  <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">FROM THE WILD</p>
                  <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 pb-4 relative bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                    Travel Video Library
                     <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-md mb-8">
                    Watch highlights from our expeditions, travel tips from guides, and stories from fellow adventurers.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                     <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                       <Link href="/contact">
                         Contact Us
                       </Link>
                     </Button>
                  </div>
                </div>
            </div>
        </section>

      <section ref={filterRef} className={cn('flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow scroll-animate', isFilterVisible && 'scroll-animate-in')}>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2 self-center">Filter by Category:</span>
          {availableCategories.map(category => (
            <Button key={category} variant="outline" size="sm" className="hover:bg-accent/10 hover:border-accent hover:text-accent">
              <ListFilter className="h-3 w-3 mr-1.5" /> {category}
            </Button>
          ))}
        </div>
        <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
          <UploadCloud className="mr-2 h-5 w-5" /> Share Your Video
        </Button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideoData.map(video => (
          <AnimatedVideoCard key={video.id} video={video} />
        ))}
      </section>

      {mockVideoData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The video library is empty. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
