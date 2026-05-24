
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // We triple the campaigns list to create a seamless infinite scroll experience
  const displayCampaigns = campaigns.length > 0 ? [...campaigns, ...campaigns, ...campaigns] : [];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isInteracting || campaigns.length === 0) return;

    let animationFrameId: number;
    const autoScroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += 0.8; // Slow smooth movement
        
        // Reset scroll position seamlessly when reaching the boundaries of the middle set
        const setWidth = scrollContainer.scrollWidth / 3;
        if (scrollContainer.scrollLeft >= setWidth * 2) {
          scrollContainer.scrollLeft -= setWidth;
        } else if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft += setWidth;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, campaigns.length]);

  // Set initial scroll position to the middle set for infinite effect
  useEffect(() => {
    if (scrollRef.current && campaigns.length > 0) {
      const setWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = setWidth;
    }
  }, [campaigns.length]);

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="bg-muted/50 rounded-3xl border-2 border-dashed">
        <CardContent className="p-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
          No featured visual highlights available yet.
        </CardContent>
      </Card>
    );
  }

  // Mouse drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setIsInteracting(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsInteracting(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    setIsInteracting(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full space-y-6">
      <div className="px-2">
        <div>
            <h3 className="font-headline text-2xl font-bold text-primary">From the Lens</h3>
            <p className="text-sm text-muted-foreground">Visual highlights from our top destinations. (Drag or swipe to explore)</p>
        </div>
      </div>
      
      {/* Film Strip Container */}
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-stone-950">
        {/* Top Perforation Strip */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-stone-950 z-20 flex items-center justify-around overflow-hidden border-b border-white/5">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-stone-900 rounded-sm border border-stone-800 flex-shrink-0" />
            ))}
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className={cn(
            "overflow-x-auto p-6 pt-12 pb-12 relative cursor-grab active:cursor-grabbing scrollbar-hide select-none",
            isDown && "cursor-grabbing"
          )}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setIsInteracting(false)}
        >
          <div className="flex gap-4 w-max">
            {displayCampaigns.map((campaign, idx) => (
              <Link 
                key={`${campaign.id}-${idx}`} 
                href={`/campaigns/${campaign.id}`}
                className="relative w-[280px] md:w-[400px] shrink-0 group/strip border-x-8 border-stone-900 bg-stone-900 overflow-hidden shadow-inner transition-all duration-500 hover:brightness-110"
              >
                <div className="aspect-[16/10] relative rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={campaign.imageUrl || placeholderImages.campaignDetailWildebeest.src}
                    alt={campaign.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-700 ease-in-out group-hover/strip:scale-110 pointer-events-none"
                    data-ai-hint={campaign.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full">
                    <h4 className="text-white font-headline text-lg font-bold truncate leading-none mb-1 whitespace-normal">{campaign.title}</h4>
                    <p className="text-white/60 text-[10px] line-clamp-1 mb-3 whitespace-normal">{campaign.shortDescription}</p>
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 h-7 text-[9px] font-black uppercase tracking-widest self-start rounded-full px-4 flex items-center transition-all">
                      Explore Tour
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Perforation Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-stone-950 z-20 flex items-center justify-around overflow-hidden border-t border-white/5">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-stone-900 rounded-sm border border-stone-800 flex-shrink-0" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignCarousel;
