
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import placeholderImages from '@/app/lib/placeholder-images.json';
import DockTextEffect from '@/components/dock-text-effect';

const backgroundContent = [
  { image: placeholderImages.campaignDetailWildebeest, description: 'Witness the epic annual migration of over a million wildebeest across the Serengeti plains.' },
  { image: placeholderImages.campaignDetailGorilla, description: 'Experience a once-in-a-lifetime encounter with a family of majestic mountain gorillas in their natural habitat.' },
  { image: placeholderImages.campaignDetailMokoro, description: 'Glide silently through the crystal-clear waters of the Okavango Delta in a traditional mokoro canoe.' },
  { image: placeholderImages.galleryBalloon, description: 'Soar above the Maasai Mara at sunrise in a hot air balloon for a breathtaking perspective of the savanna.' },
  { image: placeholderImages.galleryGiraffe, description: 'Watch the silhouette of a graceful giraffe against a stunning African sunset.' },
];


export default function Hero() {
  const [ref, isVisible] = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState<'idle' | 'forward' | 'backward'>('idle');

  useEffect(() => {
    // Trigger animation on page load
    const loadTimer = setTimeout(() => {
        setAnimationTrigger('forward');
        // Reset to idle so scroll animations can take over later
        const resetTimer = setTimeout(() => setAnimationTrigger('idle'), 1600);
        return () => clearTimeout(resetTimer);
    }, 100);

    return () => clearTimeout(loadTimer);
  }, []);


  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 10 && lastScrollY <= 10) {
            setAnimationTrigger('forward');
        } else if (scrollY <= 10 && lastScrollY > 10) {
            setAnimationTrigger('backward');
        }
        
        setHasScrolled(scrollY > 10);
        lastScrollY = scrollY;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };


    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
                      'transition-all duration-1000 ease-in-out',
                      index === currentIndex ? 'opacity-100' : 'opacity-0',
                      !hasScrolled ? 'scale-105' : 'scale-100'
                  )}
              />
          ))}
      </div>
      
      {/* Mobile Content Container */}
      <div className="relative h-full flex items-center justify-center z-10 p-4 md:hidden pt-[68px]">
        <div className="bg-stone-900/85 backdrop-blur-xl rounded-[2rem] p-8 text-center text-white border border-white/10 shadow-2xl flex flex-col gap-6 w-full max-w-sm mx-auto">
            <p className={cn("font-semibold text-primary uppercase tracking-widest transition-all duration-500 leading-tight", hasScrolled ? 'text-[10px]' : 'text-xs')}>Tour, Travel & Adventure Camping Across Uganda and East Africa</p>
            <h1
              className={cn("font-headline font-black tracking-widest uppercase transition-all duration-500 leading-none", hasScrolled ? "text-xl" : "text-3xl")}
               style={{
                WebkitTextStroke: '0.5px white',
                color: 'transparent'
              }}
            >
              <span className="block">Explore the</span>
              <span className="block">PEARL</span>
            </h1>
            <div className="h-0.5 bg-accent/40 w-12 mx-auto rounded-full" />
            <p className={cn("text-stone-300 transition-opacity duration-500 leading-relaxed font-medium", hasScrolled ? "text-xs line-clamp-2" : "text-sm")} key={currentBg.description}>
                {currentBg.description}
            </p>
            <div className="pt-2">
               <Button size={hasScrolled ? 'sm' : 'lg'} asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-black rounded-full transition-all duration-500 uppercase tracking-widest w-full h-12">
                <Link href="/contact">
                  GET STARTED
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
            "relative w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center bg-gradient-to-r from-background/70 via-background/70 to-transparent transition-all duration-500",
             hasScrolled ? 'p-6 md:p-8' : 'p-8 md:p-12'
          )}
          style={{backdropFilter: 'blur(8px)'}}
        >
          <div>
            <p className={cn("font-semibold text-primary uppercase tracking-widest transition-all duration-500", hasScrolled ? 'text-xs mb-1' : 'text-sm mb-2')}>Tour, Travel & Adventure Camping Across Uganda and East Africa</p>
             <div className={cn("font-black mb-4 tracking-[3px] uppercase transition-all duration-500", hasScrolled ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl")}>
                <DockTextEffect text="Explore the" className="font-headline dock-text-container" animationTrigger={animationTrigger} />
                <DockTextEffect text="PEARL" className="font-headline dock-text-container" animationTrigger={animationTrigger} />
            </div>
            <div className={cn("h-1 bg-accent transition-all duration-500", hasScrolled ? "w-16 mb-4" : "w-24 mb-6")}></div>
             <p className={cn("text-muted-foreground max-w-md transition-all duration-500", hasScrolled ? 'text-sm h-16' : 'h-20 mb-8 text-base')} key={currentBg.description}>
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
        </div>
      </div>
    </div>
  );
}
