
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

    if (offset > totalCards / 2) {
      offset -= totalCards;
    } else if (offset < -totalCards / 2) {
      offset += totalCards;
    }

    let transform = 'scale(0)';
    let zIndex = 0;
    let opacity = 0;
    
    // Position definitions based on offset from currentIndex
    // 0: foreground
    // 1: right middle ground
    // -1: left middle ground
    // 2: right background
    // -2: left background

    // Apply styles based on the strict rotation rules
    // Rule: Right Middle (offset 1) moves to Foreground (offset 0)
    // Rule: Foreground (offset 0) moves to Left Background (offset -2)
    // Rule: Left Middle (offset -1) moves to Right Background (offset 2)
    // Rule: Left Background (offset -2) moves to Left Middle (offset -1)
    // Rule: Right Background (offset 2) moves to Right Middle (offset 1)

    // Simplified direct mapping based on final desired visual positions
    switch (offset) {
      case 0: // Foreground
        transform = 'translateX(0%) scale(1)';
        zIndex = 5;
        opacity = 1;
        break;
      case 1: // Right Middle Ground
        transform = 'translateX(50%) scale(0.5)';
        zIndex = 4;
        opacity = 0.6;
        break;
      case -1: // Left Middle Ground
        transform = 'translateX(-50%) scale(0.5)';
        zIndex = 4;
        opacity = 0.6;
        break;
      case 2: // Right Background
        transform = 'translateX(75%) scale(0.25)';
        zIndex = 3;
        opacity = 0.3;
        break;
      case -2: // Left Background
        transform = 'translateX(-75%) scale(0.25)';
        zIndex = 3;
        opacity = 0.3;
        break;
      default:
        transform = 'scale(0)';
        opacity = 0;
        zIndex = 0;
        break;
    }

    return {
      transform,
      zIndex,
      opacity,
      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
    };
  };
  
  const currentCard = cards[currentIndex];


  return (
    <div className="relative w-full h-[550px] flex flex-col items-center justify-center overflow-hidden">
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

      <div className="flex items-center justify-center gap-4 mt-8">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full h-12 w-12 bg-card/80">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full h-12 w-12 bg-card/80">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
