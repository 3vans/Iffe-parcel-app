'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import cardData from '@/app/lib/fifa-card-data.json';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useIsMobile } from '@/hooks/use-mobile';


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

const CardImage = ({ card }: { card: CardData }) => {
    const [imgSrc, setImgSrc] = useState(card.image);
    return (
        <Image 
            src={imgSrc} 
            alt={card.title} 
            layout="fill" 
            objectFit="cover" 
            onError={() => setImgSrc(placeholderImages.campaignDetailWildebeest.src)}
        />
    );
};

export default function FifaCardCarousel({ onActiveCardChange }: FifaCardCarouselProps) {
  const [cards] = useState<CardData[]>(cardData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

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
  
  const getCardPositionClass = (index: number): string => {
    const offset = index - currentIndex;
    const totalCards = cards.length;
    let diff = (offset + totalCards) % totalCards;
  
    if (diff > Math.floor(totalCards / 2)) {
      diff -= totalCards;
    }
  
    switch (diff) {
      case 0:
        return 'card-center';
      case 1:
        return 'card-right';
      case -1:
        return 'card-left';
      case 2:
        return 'card-far-right';
      case -2:
        return 'card-far-left';
      default:
        return 'card-hidden';
    }
  };


  return (
     <div className="carousel-container">
        <h1 className="font-headline text-4xl font-bold text-white mb-6 text-center">Featured Expeditions</h1>
        
        <div className="carousel">
            <div className="carousel-track">
                {cards.map((card, index) => (
                    <div 
                        key={card.id} 
                        className={cn("card", getCardPositionClass(index))}
                        onClick={() => {
                            if (index !== currentIndex) {
                                setCurrentIndex(index);
                            }
                        }}
                    >
                         <div className="h-[200px] relative">
                            <CardImage card={card} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex justify-between items-end p-4 text-white">
                                <div className="bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">{card.speed}</div>
                                <div className="bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">{card.skill}</div>
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
