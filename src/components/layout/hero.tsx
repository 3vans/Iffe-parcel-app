
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TornPaperSVG = () => (
  <svg
    className="absolute top-0 right-0 h-full w-16 text-background z-10"
    viewBox="0 0 100 1000"
    preserveAspectRatio="none"
    style={{ transform: 'translateX(50%)' }}
  >
    <path
      d="M 0,0 
         C 15,100 0,150 20,200 
         S 0,250 15,300 
           30,350 10,400
           0,450 25,500
           -5,550 20,600
           10,650 30,700
           5,750 20,800
           0,850 15,900
           30,950 0,1000 Z"
      fill="currentColor"
    />
  </svg>
);

export default function Hero() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className={cn('relative w-full h-[60vh] min-h-[400px] md:min-h-[500px] overflow-hidden rounded-lg shadow-2xl scroll-animate', isVisible && 'scroll-animate-in')}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={placeholderImages.campaignDetailWildebeest.src}
          alt="Wildebeest migration"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
          data-ai-hint={placeholderImages.campaignDetailWildebeest.hint}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center z-10">
        {/* Left Panel */}
        <div className="relative w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center bg-background/90 backdrop-blur-sm p-8 md:p-12">
          <div className="text-primary">
            <p className="font-semibold text-accent uppercase tracking-widest text-sm mb-2">TOUR TRAVEL & ADVENTURE CAMPING</p>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              Explore the world
            </h1>
            <div className="w-24 h-1 bg-accent mb-6"></div>
            <p className="text-muted-foreground max-w-md mb-8">
              Welcome to our iffe-travels website! We are a professional and reliable company that offers a wide range of unforgettable travel experiences.
            </p>
            <div className="space-y-4">
               <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-7 px-8">
                <Link href="/contact">
                  LET'S GET STARTED
                </Link>
              </Button>
               <p className="font-semibold text-primary hover:text-accent transition-colors">
                <Link href="/about">Who we are</Link>
              </p>
            </div>
          </div>
          <TornPaperSVG />
        </div>
      </div>
    </div>
  );
}
