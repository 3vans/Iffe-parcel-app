'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import cardData from '@/app/lib/fifa-card-data.json';
import { cn } from '@/lib/utils';

interface CardData {
  id: string;
  title: string;
  country: string;
  rating: string;
  speed: string; // Represents days
  skill: string; // Represents activities
  image: string;
  dataAiHint: string;
  link: string;
}

interface FifaCardCarouselProps {
    onActiveCardChange?: (card: CardData | null) => void;
}

export default function FifaCardCarousel({ onActiveCardChange }: FifaCardCarouselProps) {
  const [cards] = useState<CardData[]>(() => cardData.map(c => ({ ...c, days: c.speed, activities: c.skill })));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  
  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (onActiveCardChange && cards.length > 0) {
        onActiveCardChange(cards[currentIndex]);
    }

    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, cards, handleNext, onActiveCardChange]);
  
  const getCardStyle = (cardIndex: number): React.CSSProperties => {
      const totalCards = cards.length;
      let diff = cardIndex - currentIndex;

      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;

      let transform = 'scale(0.5)';
      let zIndex = 5;
      let filter = 'brightness(0.5)';
      let pointerEvents: 'auto' | 'none' = 'none';

      switch (diff) {
          case 0: // Center
              transform = 'translateX(0) scale(1)';
              zIndex = 30;
              filter = 'brightness(1)';
              pointerEvents = 'auto';
              break;
          case 1: // Right
              transform = 'translateX(80%) scale(0.85)';
              zIndex = 20;
              filter = 'brightness(0.75)';
              break;
          case -1: // Left
              transform = 'translateX(-80%) scale(0.85)';
              zIndex = 20;
              filter = 'brightness(0.75)';
              break;
          case 2: // Far Right
              transform = 'translateX(160%) scale(0.7)';
              zIndex = 10;
              filter = 'brightness(0.5)';
              break;
          case -2: // Far Left
              transform = 'translateX(-160%) scale(0.7)';
              zIndex = 10;
              filter = 'brightness(0.5)';
              break;
          default: // Hidden
              transform = 'scale(0.5)';
              zIndex = 5;
              filter = 'brightness(0.5)';
              break;
      }
      
       if (Math.abs(diff) > 2) {
            return { display: 'none' };
       }

      return { transform, zIndex, filter, pointerEvents, transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' };
  };

  return (
     <div className="carousel-container">
        <h2 className="font-headline text-3xl font-bold text-white mb-6 text-center">Featured Expeditions</h2>
        
        <div className="carousel">
            <div className="carousel-track">
                {cards.map((card, index) => (
                    <div 
                        key={card.id} 
                        className="card"
                        style={getCardStyle(index)}
                        onClick={() => {
                            if (index !== currentIndex) {
                                setCurrentIndex(index);
                            }
                        }}
                    >
                         <div className="h-[200px] relative">
                            <Image src={card.image} alt={card.title} layout="fill" objectFit="cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex justify-between items-end p-4 text-white">
                                <div className="bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">{card.days}</div>
                                <div className="bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">{card.activities}</div>
                            </div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{card.title}</h3>
                            <div className="card-location">{card.country}</div>
                            <Button asChild className="card-button w-full">
                                <Link href={card.link}>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Select Package
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="carousel-nav">
            <Button variant="outline" size="icon" onClick={handlePrev} className="nav-button prev">
                <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="nav-button next">
                <ChevronRight />
            </Button>
        </div>
        
        <div className="card-indicators">
            {cards.map((_, index) => (
                <div 
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => handleIndicatorClick(index)}
                />
            ))}
        </div>
    </div>
  );
}