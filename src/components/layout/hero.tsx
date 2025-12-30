
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import placeholderImages from '@/app/lib/placeholder-images.json';

const backgroundContent = [
  { image: placeholderImages.campaignDetailWildebeest, description: 'Witness the epic annual migration of over a million wildebeest across the Serengeti plains.' },
  { image: placeholderImages.campaignDetailGorilla, description: 'Experience a once-in-a-lifetime encounter with a family of majestic mountain gorillas in their natural habitat.' },
  { image: placeholderImages.campaignDetailMokoro, description: 'Glide silently through the crystal-clear waters of the Okavango Delta in a traditional mokoro canoe.' },
  { image: placeholderImages.galleryBalloon, description: 'Soar above the Maasai Mara at sunrise in a hot air balloon for a breathtaking perspective of the savanna.' },
  { image: placeholderImages.galleryGiraffe, description: 'Watch the silhouette of a graceful giraffe against a stunning African sunset.' },
];

const TornPaperSVG = () => (
  <svg
    className="absolute top-0 right-0 h-full w-[60px] text-old-paper/50 dark:text-background/50 backdrop-blur-md"
    viewBox="0 0 60 1000"
    preserveAspectRatio="none"
    style={{ transform: 'translateX(100%)' }}
  >
    <path
      d="M 50 0 L 40 15 C 60 25, 40 35, 50 50 L 35 60 C 55 70, 35 80, 45 95 L 55 105 C 35 115, 55 125, 50 140 L 40 155 C 60 165, 40 175, 50 190 L 35 200 C 55 210, 35 220, 45 235 L 55 245 C 35 255, 55 265, 50 280 L 40 295 C 60 305, 40 315, 50 330 L 35 340 C 55 350, 35 360, 45 375 L 55 385 C 35 395, 55 405, 50 420 L 40 435 C 60 445, 40 455, 50 470 L 35 480 C 55 490, 35 500, 45 515 L 55 525 C 35 535, 55 545, 50 560 L 40 575 C 60 585, 40 595, 50 610 L 35 620 C 55 630, 35 640, 45 655 L 55 665 C 35 675, 55 685, 50 700 L 40 715 C 60 725, 40 735, 50 750 L 35 760 C 55 770, 35 780, 45 795 L 55 805 C 35 815, 55 825, 50 840 L 40 855 C 60 865, 40 875, 50 890 L 35 900 C 55 910, 35 920, 45 935 L 55 945 C 35 955, 55 965, 50 980 L 40 995 L 50 1000 L 0 1000 L 0 0 Z"
      fill="currentColor"
    />
  </svg>
);


export default function Hero() {
  const [ref, isVisible] = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % backgroundContent.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  
  const currentBg = backgroundContent[currentIndex];

  return (
    <div 
        ref={ref} 
        className={cn(
            'relative w-full overflow-hidden shadow-2xl scroll-animate bg-background transition-all duration-700 ease-in-out',
            hasScrolled ? 'h-[60vh] min-h-[500px] rounded-b-lg' : 'h-screen min-h-[600px] rounded-none',
            isVisible && 'scroll-animate-in',
            '-mt-[68px]'
        )}
    >
      <div className="absolute inset-0 z-0">
          {backgroundContent.map((bg, index) => (
              <Image
                  key={bg.image.src}
                  src={bg.image.src}
                  alt={bg.description}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={bg.image.hint}
                  priority={index === 0}
                  className={cn(
                      "transition-opacity duration-1000 ease-in-out",
                      index === currentIndex ? "opacity-100" : "opacity-0"
                  )}
              />
          ))}
      </div>
      
      {/* Mobile Content Container */}
      <div className="relative h-full flex items-center justify-center z-10 p-4 md:hidden pt-[68px]">
        <div className="bg-black/20 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 text-center text-white">
            <p className={cn("font-semibold text-primary uppercase tracking-widest text-sm mb-2 transition-all duration-500", hasScrolled && "text-xs")}>Tour, Travel & Adventure Camping Across Uganda and East Africa</p>
            <h1
              className={cn("font-headline font-black mb-3 tracking-widest uppercase transition-all duration-500", hasScrolled ? "text-2xl" : "text-3xl")}
               style={{
                WebkitTextStroke: '0.5px white',
                color: 'transparent'
              }}
            >
              <span className="block">Explore the</span>
              <span className="block">PEARL</span>
            </h1>
            <p className={cn("text-white/90 text-sm max-w-md mb-6 transition-opacity duration-500", hasScrolled ? "h-12 line-clamp-2" : "h-16")} key={currentBg.description}>
                {currentBg.description}
            </p>
            <div className="space-y-4">
               <Button size={hasScrolled ? 'default' : 'lg'} asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full transition-all duration-500">
                <Link href="/contact">
                  LET'S GET STARTED
                </Link>
              </Button>
            </div>
        </div>
      </div>

      {/* Desktop Content Container */}
      <div className="relative h-full hidden md:flex items-center z-10 pt-[68px]">
        {/* Left Panel */}
        <div 
          className={cn(
            "relative w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center bg-old-paper/70 dark:bg-background/70 md:bg-old-paper/50 md:dark:bg-background/50 transition-all duration-500",
             hasScrolled ? 'p-6 md:p-8' : 'p-8 md:p-12'
          )}
          style={{backdropFilter: 'blur(8px)'}}
        >
          <div className="mix-blend-multiply dark:mix-blend-screen">
            <p className={cn("font-semibold text-primary uppercase tracking-widest text-sm mb-2 transition-all duration-500", hasScrolled && 'text-xs')}>Tour, Travel & Adventure Camping Across Uganda and East Africa</p>
            <h1
              className={cn("font-black mb-4 tracking-[3px] uppercase transition-all duration-500", hasScrolled ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl")}
              style={{
                color: 'hsl(var(--primary-foreground))',
                WebkitTextStroke: '1px hsl(var(--primary))',
              }}
            >
                <span className="block font-headline">Explore the</span>
                <span className="block font-headline">PEARL</span>
            </h1>
            <div className={cn("h-1 bg-accent mb-6 transition-all duration-500", hasScrolled ? "w-16" : "w-24")}></div>
             <p className={cn("text-muted-foreground max-w-md mb-8 h-20 transition-all duration-500", hasScrolled && 'text-sm h-16')} key={currentBg.description}>
                {currentBg.description}
            </p>
            <div className="flex items-center gap-4 mb-4">
               <Button size={hasScrolled ? 'default' : 'lg'} asChild className={cn("bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full transition-all duration-500", hasScrolled ? "py-5 px-6 text-sm" : "text-md py-6 px-8")}>
                <Link href="/contact">
                  LET'S GET STARTED
                </Link>
              </Button>
               <Button variant="outline" asChild className={cn("rounded-full border-primary/50 text-primary hover:bg-primary/5 hover:text-primary transition-all duration-500", hasScrolled ? "px-5 py-5 text-xs" : "px-6 py-6 text-sm")}>
                <Link href="/about">Who we are</Link>
              </Button>
            </div>
          </div>
          <TornPaperSVG />
        </div>
      </div>
    </div>
  );
}
