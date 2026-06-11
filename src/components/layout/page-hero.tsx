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
  tagline?: string;
  primaryAction?: {
    text: string;
    link: string;
  };
  secondaryAction?: {
    text: string;
    link: string;
  };
}

/**
 * Standard Page Hero component.
 * Uses Montserrat (font-headline) for titles with a 1px primary stroke.
 * Uses Lora (font-body) for content.
 * Character centers are translucent (transparent fill) to contrast with solid body text.
 */
export default function PageHero({ 
  title, 
  subtitle, 
  imageUrl, 
  dataAiHint, 
  tagline = "Tour, Travel & Adventure Camping Across Uganda and East Africa",
  primaryAction, 
  secondaryAction 
}: PageHeroProps) {
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
            <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-stone-900/70 text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
              <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">{tagline}</p>
              <h1
                className="font-headline text-4xl md:text-5xl lg:text-7xl font-black mb-4 pb-4 relative uppercase tracking-widest leading-tight"
                style={{
                  WebkitTextStroke: '1px hsl(var(--primary))',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                 {title}
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8 font-body">
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 {primaryAction && (
                    <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105 rounded-full px-8">
                        <Link href={primaryAction.link}>
                            {primaryAction.text}
                        </Link>
                    </Button>
                 )}
                 {secondaryAction && (
                    <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300 font-bold">
                        <Link href={secondaryAction.link}>
                            {secondaryAction.text}
                        </Link>
                    </Button>
                 )}
              </div>
            </div>
          </div>
      </section>
  );
}
