
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  dataAiHint?: string;
  primaryAction: {
    text: string;
    link: string;
  };
  secondaryAction: {
    text: string;
    link: string;
  };
}

const TornPaperSVG = () => (
  <svg
    className="absolute top-0 right-0 h-full w-[60px] text-old-paper/70 dark:text-background/70 z-20 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]"
    viewBox="0 0 60 1000"
    preserveAspectRatio="none"
    style={{ transform: 'translateX(50%)' }}
  >
    <path
      d="M 50 0 L 40 15 C 60 25, 40 35, 50 50 L 35 60 C 55 70, 35 80, 45 95 L 55 105 C 35 115, 55 125, 50 140 L 40 155 C 60 165, 40 175, 50 190 L 35 200 C 55 210, 35 220, 45 235 L 55 245 C 35 255, 55 265, 50 280 L 40 295 C 60 305, 40 315, 50 330 L 35 340 C 55 350, 35 360, 45 375 L 55 385 C 35 395, 55 405, 50 420 L 40 435 C 60 445, 40 455, 50 470 L 35 480 C 55 490, 35 500, 45 515 L 55 525 C 35 535, 55 545, 50 560 L 40 575 C 60 585, 40 595, 50 610 L 35 620 C 55 630, 35 640, 45 655 L 55 665 C 35 675, 55 685, 50 700 L 40 715 C 60 725, 40 735, 50 750 L 35 760 C 55 770, 35 780, 45 795 L 55 805 C 35 815, 55 825, 50 840 L 40 855 C 60 865, 40 875, 50 890 L 35 900 C 55 910, 35 920, 45 935 L 55 945 C 35 955, 55 965, 50 980 L 40 995 L 50 1000 L 0 1000 L 0 0 Z"
      fill="currentColor"
    />
  </svg>
);


export default function PageHero({ title, subtitle, imageUrl, dataAiHint, primaryAction, secondaryAction }: PageHeroProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isVisible && 'scroll-animate-in')}>
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={dataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
        
        <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
            <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
              <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">TOUR TRAVEL & ADVENTURE CAMPING</p>
              <h1
                className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest"
                style={{
                  color: 'hsl(var(--primary-foreground))',
                  WebkitTextStroke: '1px hsl(var(--primary))',
                }}
              >
                 {title}
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8">
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                   <Link href={primaryAction.link}>
                     {primaryAction.text}
                   </Link>
                 </Button>
                 <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                    <Link href={secondaryAction.link}>
                        {secondaryAction.text}
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
      </section>
  );
}
