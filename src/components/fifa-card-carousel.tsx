
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import cardData from '@/app/lib/fifa-card-data.json';

interface CardData {
  id: string;
  title: string;
  country: string;
  rating: string;
  speed: string;
  skill: string;
  imageUrl: string;
  dataAiHint: string;
  link: string;
}

export default function FifaCardCarousel() {
  const [cards, setCards] = useState<CardData[]>(cardData);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  }, [isAnimating]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const last = newCards.pop();
      if (last) newCards.unshift(last);
      return newCards;
    });
  };
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500); // Animation duration
    return () => clearTimeout(timer);
  }, [cards]);


  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const getCardStyle = (index: number) => {
    let transform = '';
    let zIndex = 0;
    let opacity = 0;
    let pointerEvents: 'auto' | 'none' = 'none';

    switch (index) {
      case 0: // Foreground
        transform = 'translateX(0) scale(1)';
        zIndex = 5;
        opacity = 1;
        pointerEvents = 'auto';
        break;
      case 1: // Middle-right
        transform = 'translateX(30%) scale(0.8)';
        zIndex = 4;
        opacity = 0.6;
        break;
      case 2: // Background-right
        transform = 'translateX(45%) scale(0.6)';
        zIndex = 3;
        opacity = 0.3;
        break;
      case (cards.length - 1): // Middle-left
        transform = 'translateX(-30%) scale(0.8)';
        zIndex = 4;
        opacity = 0.6;
        break;
      case (cards.length - 2): // Background-left
        transform = 'translateX(-45%) scale(0.6)';
        zIndex = 2;
        opacity = 0.3;
        break;
      default: // Hidden cards
        transform = `translateX(${index > cards.length / 2 ? '-100%' : '100%'}) scale(0)`;
        opacity = 0;
        zIndex = 1;
        break;
    }
    
    return {
      transform,
      zIndex,
      opacity,
      pointerEvents,
      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
    };
  };

  const currentForegroundCard = cards[0];

  return (
    <div className="relative w-full h-[550px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
            {currentForegroundCard && (
                <div
                    key={`bg-${currentForegroundCard.id}`}
                    className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
                    style={{ opacity: 1 }}
                >
                    <Image
                        src={currentForegroundCard.imageUrl}
                        alt={`${currentForegroundCard.title} background`}
                        layout="fill"
                        objectFit="cover"
                        className="transform scale-125 blur-lg"
                        data-ai-hint={currentForegroundCard.dataAiHint}
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            )}
        </div>
      <div className="relative w-full h-[450px]" style={{ perspective: '1000px' }}>
        {cards.map((card, index) => {
           return (
              <div
                key={card.id}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="w-[280px] h-[420px] bg-card rounded-2xl shadow-2xl p-4 flex flex-col justify-between fifa-card-bg cursor-pointer"
                  style={getCardStyle(index)}
                >
                  <div className="text-white">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <p className="font-black text-3xl">{card.rating}</p>
                        <p className="font-bold text-lg">{card.title}</p>
                      </div>
                      <div className="w-12 h-12">
                        <Image src="https://picsum.photos/seed/flag/48/48" alt={`${card.country} flag`} width={48} height={48} className="rounded-full" />
                      </div>
                    </div>
                    <p className="text-sm font-light text-left mt-1">{card.country}</p>
                  </div>
    
                  <div className="relative h-48 w-full">
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      layout="fill"
                      objectFit="contain"
                      className="drop-shadow-lg"
                      data-ai-hint={card.dataAiHint}
                    />
                  </div>
    
                  <div className="text-white text-center border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-around text-lg">
                      <div>
                        <p className="font-bold">{card.speed}</p>
                        <p className="text-xs">DAYS</p>
                      </div>
                      <div>
                        <p className="font-bold">{card.skill}</p>
                        <p className="text-xs">ACTIVITIES</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                    <Link href={card.link}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Select Package
                    </Link>
                  </Button>
                </div>
              </div>
            );
        })}
      </div>

        <Button variant="outline" size="icon" onClick={handlePrev} className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-card/80 z-20">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-card/80 z-20">
          <ChevronRight />
        </Button>
    </div>
  );
}
