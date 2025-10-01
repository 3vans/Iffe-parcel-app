
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import placeholderImages from '@/app/lib/placeholder-images.json';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  dataAiHint?: string;
  Icon?: LucideIcon;
  className?: string;
}

export default function HeroSection({ title, subtitle, imageUrl, dataAiHint, Icon, className }: HeroSectionProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} className={cn('relative text-center py-12 md:py-20 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 scroll-animate', isVisible && 'scroll-animate-in', className)}>
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="z-0 opacity-20"
            data-ai-hint={dataAiHint || 'background image'}
            priority
          />
          <div className="absolute inset-0 bg-background/50 z-0"></div>
        </>
      )}
      <div className="relative z-10 p-4">
        {Icon && (
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <Icon className="h-10 w-10 md:h-12 md:w-12 text-accent" />
          </div>
        )}
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
