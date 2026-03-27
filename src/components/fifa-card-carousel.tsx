'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, UserCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import cardDataFromFile from '@/app/lib/fifa-card-data.json';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useIsMobile } from '@/hooks/use-mobile';


export interface CardData {
  id: string;
  title: string;
  country: string;
  description?: string;
  rating: string;
  speed: string; // Represents days for trips, experience for people
  skill: string; // Represents activities for trips, tour count for people
  image: keyof typeof placeholderImages;
  dataAiHint: string;
  link: string;
}

interface FifaCardCarouselProps {
    cards?: CardData[];
    title?: string;
    onActiveCardChange?: (card: CardData | null) => void;
}

const CardImage = ({ card }: { card: CardData }) => {
    const imageData = placeholderImages[card.image] || placeholderImages.campaignDetailWildebeest;
    const [imgSrc, setImgSrc] = useState(imageData.src);

    useEffect(() => {
        const newImageData = placeholderImages[card.image] || placeholderImages.campaignDetailWildebeest;
        setImgSrc(newImageData.src);
    }, [card.image]);

    return (
        <Image 
            src={imgSrc} 
            alt={card.title} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={card.dataAiHint}
            onError={() => setImgSrc(placeholderImages.campaignDetailWildebeest.src)}
            key={card.id}
        />
    );
};

export default function FifaCardCarousel({ cards: cardsProp, title = "Featured Expeditions", onActiveCardChange }: FifaCardCarouselProps) {
  const [cards] = useState<CardData[]>(cardsProp || (cardDataFromFile as CardData[]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [clientRendered, setClientRendered] = useState(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  const minSwipeDistance = 50;

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  
  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe) {
          handleNext();
      } else if (isRightSwipe) {
          handlePrev();
      }
      setTouchStart(null);
      setTouchEnd(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        
        if (wheelTimeoutRef.current) {
            clearTimeout(wheelTimeoutRef.current);
        }

        wheelTimeoutRef.current = setTimeout(() => {
            if (e.deltaX > 0) {
                handleNext();
            } else if (e.deltaX < 0) {
                handlePrev();
            }
        }, 50); // Throttle wheel events
    }
  };

  useEffect(() => {
    if (onActiveCardChange && cards.length > 0) {
        const activeCard = cards[currentIndex];
        const activeImageData = placeholderImages[activeCard.image];
        onActiveCardChange({ ...activeCard, image: activeImageData.src as any });
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
    
    // On mobile, only show the center card clearly
    if (clientRendered && isMobile) {
        return diff === 0 ? 'card-center' : 'card-hidden';
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
     <div 
        className="carousel-container" 
        onTouchStart={onTouchStart} 
        onTouchMove={onTouchMove} 
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        <h1 className="font-headline text-2xl md:text-4xl font-bold text-white mb-6 text-center">{title}</h1>
        
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
                            <div className="card-location"><MapPin className="mr-1 h-4 w-4" />{card.country}</div>
                            {card.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{card.description}</p>}
                            <Button asChild className="card-button w-full">
                                <Link href={card.link}>
                                  <UserCircle className="mr-2 h-4 w-4" />
                                  View More
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