'use client';

import GalleryClientContent from '@/components/gallery/gallery-client-content';
import placeholderImages from '@/app/lib/placeholder-images.json';
import PageHero from '@/components/layout/page-hero';
import { fetchGalleryImages } from '@/lib/services/cms-service';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const [liveImages, setLiveImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const images = await fetchGalleryImages();
        setLiveImages(images);
      } catch (err) {
        console.error("Load gallery error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);
  
  const heroImage = placeholderImages.gallerySafariGroup.src;
  const heroDataAiHint = placeholderImages.gallerySafariGroup.hint;

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Gallery...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <PageHero 
          title="Safari Gallery"
          subtitle="Moments from our tours, captured by guides and travelers."
          imageUrl={heroImage}
          dataAiHint={heroDataAiHint}
          primaryAction={{ text: "Share Your Photos", link: "/gallery#upload" }}
          secondaryAction={{ text: "Contact Us", link: "/contact" }}
        />
        <div className="container mx-auto px-4">
          <GalleryClientContent initialImages={liveImages} />
        </div>
    </div>
  );
}
