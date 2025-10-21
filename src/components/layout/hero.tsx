
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeroProps {
  description: string;
  imageUrl?: string;
  imageHint?: string;
}

const TornPaperSVG = () => (
  <svg
    className="absolute top-0 right-0 h-full w-[60px] text-old-paper/70 dark:text-background/70 z-20"
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


export default function Hero({ description, imageUrl, imageHint }: HeroProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className={cn('relative w-full h-[60vh] min-h-[400px] md:min-h-[500px] overflow-hidden rounded-lg shadow-2xl scroll-animate bg-background', isVisible && 'scroll-animate-in')}>
        {imageUrl && (
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt={description}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={imageHint}
                    priority
                    style={{
                        maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
                        filter: 'blur(8px)',
                    }}
                />
                 <Image
                    src={imageUrl}
                    alt={description}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={imageHint}
                    priority
                    style={{
                        clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                    }}
                />
            </div>
        )}
      {/* Content Container */}
      <div className="relative h-full flex items-center z-10">
        {/* Left Panel */}
        <div className="relative w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center bg-gradient-to-r from-old-paper/30 to-old-paper/70 dark:from-background/30 dark:to-background/70 backdrop-blur-md p-8 md:p-12">
          <div className="text-primary">
            <p className="font-semibold text-accent uppercase tracking-widest text-sm mb-2">TOUR TRAVEL & ADVENTURE CAMPING</p>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              Explore the world
            </h1>
            <div className="w-24 h-1 bg-accent mb-6"></div>
             <p className="text-muted-foreground max-w-md mb-8 h-20 transition-opacity duration-500" key={description}>
                {description}
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
