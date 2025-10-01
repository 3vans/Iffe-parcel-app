
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';

const backgroundImages = [
  placeholderImages.campaignDetailWildebeest,
  placeholderImages.campaignDetailGorilla,
  placeholderImages.campaignDetailMokoro,
  placeholderImages.galleryElephant,
  placeholderImages.galleryGiraffe,
];

export default function AnimatedBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {backgroundImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt="Travel background"
          layout="fill"
          objectFit="cover"
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-30' : 'opacity-0'
          )}
          data-ai-hint={image.hint}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-background/50 pointer-events-none"></div>
    </div>
  );
}
