
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

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dataAiHint: string;
  youtubeVideoId?: string; // For actual embed
  category: string;
  duration?: string; // e.g., "12:34"
}

const mockVideoData: VideoItem[] = [
  { id: 'v1', title: 'Rotary International Convention Highlights', description: 'Relive the best moments from the annual convention.', thumbnailUrl: placeholderImages.videoThumbConference.src, dataAiHint: placeholderImages.videoThumbConference.hint, youtubeVideoId: 'dQw4w9WgXcQ', category: 'Events', duration: '5:20' },
  { id: 'v2', title: 'Leadership Training Workshop Part 1', description: 'Essential skills for aspiring leaders in our community.', thumbnailUrl: placeholderImages.videoThumbTraining.src, dataAiHint: placeholderImages.videoThumbTraining.hint, category: 'Trainings', duration: '45:12' },
  { id: 'v3', title: 'Clean Water Campaign Impact Story', description: 'See how your contributions are changing lives.', thumbnailUrl: placeholderImages.videoThumbWater.src, dataAiHint: placeholderImages.videoThumbWater.hint, youtubeVideoId: 'rokGy0huYEA', category: 'Campaigns', duration: '3:15' },
  { id: 'v4', title: 'A Rotaractor\'s Journey: Testimonial', description: 'Hear from a member about their experiences.', thumbnailUrl: placeholderImages.videoThumbTestimonial.src, dataAiHint: placeholderImages.videoThumbTestimonial.hint, category: 'Testimonials', duration: '7:45' },
  { id: 'v5', title: 'Youth Summit 2023 Recap', description: 'Highlights from the inspiring sessions at the Youth Summit.', thumbnailUrl: placeholderImages.videoThumbYouth.src, dataAiHint: placeholderImages.videoThumbYouth.hint, category: 'Events', duration: '8:03' },
  { id: 'v6', title: 'Project Management Basics', description: 'A quick guide to managing successful Rotary projects.', thumbnailUrl: placeholderImages.videoThumbPlanning.src, dataAiHint: placeholderImages.videoThumbPlanning.hint, category: 'Trainings', duration: '22:50' },
];

const availableCategories = ['Events', 'Trainings', 'Campaigns', 'Testimonials', 'All'];

export default function VideoLibraryPage() {
  const [headerRef, isHeaderVisible] = useScrollAnimation();
  const [filterRef, isFilterVisible] = useScrollAnimation();
  const heroImage = placeholderImages.videoPlaceholder.src;
  const heroDataAiHint = 'video library';


  const AnimatedVideoCard = ({ video }: { video: VideoItem }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
      <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
        <Card key={video.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
          <div className="relative w-full aspect-video bg-muted">
            <Image src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" data-ai-hint={video.dataAiHint} layout="fill" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
              <PlayCircle className="mr-2 h-5 w-5" /> Watch Video
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
                  <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">FROM THE HUB</p>
                  <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 pb-4 relative bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                    Video Library
                     <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-md mb-8">
                    Watch highlights, trainings, testimonials, and more.
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
          <UploadCloud className="mr-2 h-5 w-5" /> Upload Video (Admin/Community)
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
