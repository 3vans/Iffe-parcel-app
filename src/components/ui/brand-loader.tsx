
'use client';

import { Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[100] p-4">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        {/* Spinner */}
        <Cog
          className={cn(
            "absolute inset-0 h-full w-full animate-spin text-[hsl(var(--primary))]"
          )}
          strokeWidth={1.5} 
          aria-label="Loading..."
        />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none animate-fade-in">
          <div className="animate-pulse-slow flex flex-col justify-around h-3/4 w-full">
            {/* Adjusted h-3/4 to give text more space and prevent overlap with spinner edges if font is very large */}
            <div className="font-black uppercase text-[hsl(var(--foreground))] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider">
              ROTARACT
            </div>
            <div className="font-black uppercase text-[hsl(var(--foreground))] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] xxs:tracking-[0.22em] xs:tracking-[0.25em] sm:tracking-[0.28em] md:tracking-[0.3em] lg:tracking-[0.32em]">
              E HUB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
