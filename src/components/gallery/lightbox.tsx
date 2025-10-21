
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import RotarySpinner from '@/components/ui/rotary-spinner';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prevImage = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextImage, prevImage, onClose]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.touches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) { // Swipe left
      nextImage();
      setTouchStart(null);
    } else if (distance < -50) { // Swipe right
      prevImage();
      setTouchStart(null);
    }
  };


  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-in fade-in-0"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-[52] text-foreground hover:bg-muted/50 hover:text-foreground h-12 w-12 rounded-full"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Main Image and Info */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-5xl h-full max-h-[80vh]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RotarySpinner size={48} className="text-foreground" />
            </div>
          )}
          {currentImage && (
            <Image
              key={currentImage.id}
              src={currentImage.src}
              alt={currentImage.alt}
              layout="fill"
              objectFit="contain"
              className={cn("transition-opacity duration-300", isLoading ? 'opacity-0' : 'opacity-100')}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
        </div>
        {currentImage?.caption && !isLoading && (
            <div className="text-center text-foreground mt-4 p-2 bg-muted/30 rounded-md">
                <p>{currentImage.caption}</p>
            </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[52] text-foreground hover:bg-muted/50 hover:text-foreground h-12 w-12 rounded-full"
        onClick={(e) => { e.stopPropagation(); prevImage(); }}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[52] text-foreground hover:bg-muted/50 hover:text-foreground h-12 w-12 rounded-full"
        onClick={(e) => { e.stopPropagation(); nextImage(); }}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default Lightbox;
