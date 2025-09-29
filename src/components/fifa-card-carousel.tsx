
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import Link from 'next/link';

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

const initialCards: CardData[] = [
  { id: '1', title: 'Serengeti Safari', country: 'Tanzania', rating: '94', speed: '90', skill: '92', imageUrl: placeholderImages.campaignDetailWildebeest.src, dataAiHint: placeholderImages.campaignDetailWildebeest.hint, link: '/campaigns/1' },
  { id: '2', title: 'Gorilla Trek', country: 'Uganda', rating: '92', speed: '85', skill: '95', imageUrl: placeholderImages.campaignDetailGorilla.src, dataAiHint: placeholderImages.campaignDetailGorilla.hint, link: '/campaigns/2' },
  { id: '3', title: 'Okavango Delta', country: 'Botswana', rating: '91', speed: '88', skill: '93', imageUrl: placeholderImages.campaignDetailMokoro.src, dataAiHint: placeholderImages.campaignDetailMokoro.hint, link: '/campaigns/3' },
  { id: '4', title: 'Masai Mara Visit', country: 'Kenya', rating: '93', speed: '91', skill: '90', imageUrl: placeholderImages.gallerySafariGroup.src, dataAiHint: placeholderImages.gallerySafariGroup.hint, link: '/campaigns/1' },
  { id: '5', title: 'Nile Cruise', country: 'Egypt', rating: '89', speed: '82', skill: '88', imageUrl: placeholderImages.eventDetailDefault.src, dataAiHint: placeholderImages.eventDetailDefault.hint, link: '/campaigns/2' },
];

export default function FifaCardCarousel() {
  const [cards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  }, [isAnimating, cards.length]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500); // Duration of the transition
    return () => clearTimeout(timer);
  }, [currentIndex]);


  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const getCardStyle = (index: number) => {
    const totalCards = cards.length;
    let offset = index - currentIndex;

    // Handle wrapping around
    if (offset > Math.floor(totalCards / 2)) {
      offset -= totalCards;
    } else if (offset < -Math.floor(totalCards / 2)) {
      offset += totalCards;
    }

    let transform = 'scale(0)';
    let zIndex = 0;
    let opacity = 0;
    let filter = 'grayscale(50%)';

    switch (offset) {
      case 0: // Foreground
        transform = 'translateX(0) scale(1)';
        zIndex = 5;
        opacity = 1;
        filter = 'grayscale(0%)';
        break;
      case 1: // Right Middle
        transform = 'translateX(30%) scale(0.7)';
        zIndex = 2;
        opacity = 0.6;
        break;
      case -1: // Left Middle
        transform = 'translateX(-30%) scale(0.7)';
        zIndex = 2;
        opacity = 0.6;
        break;
      case 2: // Right Background
        transform = 'translateX(50%) scale(0.5)';
        zIndex = 1;
        opacity = 0.3;
        break;
      case -2: // Left Background
        transform = 'translateX(-50%) scale(0.5)';
        zIndex = 1;
        opacity = 0.3;
        break;
      default:
        // Hide other cards that are further away
        transform = `translateX(${offset > 0 ? 100 : -100}%) scale(0)`;
        opacity = 0;
        zIndex = 0;
        break;
    }
    
    // Ensure that for setups with less than 5 cards, we don't have empty spots.
    // This logic can be simplified if we always assume 5+ cards.
    if (totalCards < 5) {
      if (Math.abs(offset) > 1) { // For 3 cards, only show foreground and middle
          if (totalCards === 3) {
             transform = 'scale(0)';
             opacity = 0;
          }
      }
    }


    return {
      transform,
      zIndex,
      opacity,
      filter,
      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out, filter 0.5s ease-in-out',
    };
  };
  
  const currentCard = cards[currentIndex];


  return (
    <div className="relative w-full h-[550px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
            {cards.map((card, index) => (
                <div
                    key={`bg-${card.id}`}
                    className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
                    style={{ opacity: index === currentIndex ? 1 : 0 }}
                >
                    <Image
                        src={card.imageUrl}
                        alt={`${card.title} background`}
                        layout="fill"
                        objectFit="cover"
                        className="transform scale-125 blur-lg"
                        data-ai-hint={card.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            ))}
        </div>
      <div className="relative w-full h-[450px]" style={{ perspective: '1000px' }}>
        {cards.map((card, index) => (
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
        ))}
      </div>

        <Button variant="outline" size="icon" onClick={handlePrev} className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-card/80 z-10">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-card/80 z-10">
          <ChevronRight />
        </Button>
    </div>
  );
}
