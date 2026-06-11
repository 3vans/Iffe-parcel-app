'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { type LucideIcon, icons } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  dataAiHint?: string;
  iconName?: keyof typeof icons;
  className?: string;
}

export default function HeroSection({ title, subtitle, imageUrl, dataAiHint, iconName, className }: HeroSectionProps) {
  const [ref, isVisible] = useScrollAnimation();
  const Icon = iconName ? icons[iconName] : null;

  return (
    <section ref={ref} className={cn('relative text-center py-16 md:py-24 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 scroll-animate', isVisible && 'scroll-animate-in', className)}>
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
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-6">
            <Icon className="h-10 w-10 md:h-12 md:w-12 text-accent" />
          </div>
        )}
        <h1 
          className="font-headline text-4xl md:text-6xl lg:text-7xl font-black mb-4 pb-4 relative uppercase tracking-widest leading-none inline-block"
          style={{
            WebkitTextStroke: '1px hsl(var(--primary))',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></span>
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-6 font-body leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
