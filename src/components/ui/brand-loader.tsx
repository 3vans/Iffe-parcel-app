
'use client';

import { cn } from '@/lib/utils';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[100] p-4">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div
          className={cn(
            "animate-spin rounded-full h-24 w-24 border-t-4 border-primary mb-6 md:h-32 md:w-32 md:border-t-[6px]" // Matched HTML, adjusted md border thickness slightly
          )}
          aria-label="Loading..."
        />
        
        {/* Text Container */}
        <div className="text-center animate-fade-in animate-pulse-slow">
          <div className="font-black uppercase text-foreground text-4xl sm:text-5xl md:text-6xl tracking-wider">
            ROTARACT
          </div>
          <div className="font-black uppercase text-foreground text-4xl sm:text-5xl md:text-6xl tracking-[0.2em] xxs:tracking-[0.22em] xs:tracking-[0.25em] sm:tracking-[0.28em] md:tracking-[0.3em] lg:tracking-[0.32em]">
            E HUB
          </div>
        </div>
      </div>
    </div>
  );
}

