
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  shortDescription: string;
}

interface CampaignCarouselProps {
  campaigns: Campaign[];
}

const CampaignCarousel: React.FC<CampaignCarouselProps> = ({ campaigns }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === campaigns.length - 1 ? 0 : prevIndex + 1));
  }, [campaigns.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? campaigns.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, [campaigns.length, nextSlide]);

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center text-muted-foreground">
          No featured tours at the moment.
        </CardContent>
      </Card>
    );
  }
  
  const currentCampaign = campaigns[currentIndex];

  return (
    <Card className="relative w-full overflow-hidden shadow-lg group">
      <CardContent className="p-0">
        <div className="aspect-[16/7] relative">
          <Image
            src={currentCampaign.imageUrl}
            alt={currentCampaign.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={currentCampaign.dataAiHint}
          />
          <div className="absolute inset-0 bg-primary/70 flex flex-col justify-end p-6 md:p-10">
            <h3 className="font-headline text-2xl md:text-4xl font-bold text-primary-foreground mb-2">
              {currentCampaign.title}
            </h3>
            <p className="text-sm md:text-lg text-primary-foreground/90 mb-4 max-w-3xl">
              {currentCampaign.shortDescription}
            </p>
            <Button variant="secondary" size="lg" asChild className="self-start bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={`/campaigns/${currentCampaign.id}`}>Explore Tour</Link>
            </Button>
          </div>
        </div>
      </CardContent>
      
      {campaigns.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 hover:bg-card text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
            aria-label="Previous tour"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 hover:bg-card text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
            aria-label="Next tour"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {campaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-accent p-1' : 'bg-primary-foreground/50 hover:bg-primary-foreground/80'
                }`}
                aria-label={`Go to tour ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default CampaignCarousel;
