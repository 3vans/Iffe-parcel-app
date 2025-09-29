
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';

interface CardData {
  id: string;
  title: string;
  country: string;
  rating: string;
  speed: string;
  skill: string;
  imageUrl: string;
  dataAiHint: string;
}

const initialCards: CardData[] = [
  { id: '1', title: 'Serengeti Safari', country: 'Tanzania', rating: '94', speed: '90', skill: '92', imageUrl: placeholderImages.campaignDetailWildebeest.src, dataAiHint: placeholderImages.campaignDetailWildebeest.hint },
  { id: '2', title: 'Gorilla Trek', country: 'Uganda', rating: '92', speed: '85', skill: '95', imageUrl: placeholderImages.campaignDetailGorilla.src, dataAiHint: placeholderImages.campaignDetailGorilla.hint },
  { id: '3', title: 'Okavango Delta', country: 'Botswana', rating: '91', speed: '88', skill: '93', imageUrl: placeholderImages.campaignDetailMokoro.src, dataAiHint: placeholderImages.campaignDetailMokoro.hint },
  { id: '4', title: 'Masai Mara Visit', country: 'Kenya', rating: '93', speed: '91', skill: '90', imageUrl: placeholderImages.gallerySafariGroup.src, dataAiHint: placeholderImages.gallerySafariGroup.hint },
  { id: '5', title: 'Nile Cruise', country: 'Egypt', rating: '89', speed: '82', skill: '88', imageUrl: placeholderImages.eventDetailDefault.src, dataAiHint: placeholderImages.eventDetailDefault.hint },
];

export default function FifaCardCarousel() {
  const [cards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (index: number) => {
    const offset = (index - currentIndex + cards.length) % cards.length;
    let transform = '';
    let zIndex = 0;
    let opacity = 1;
    let filter = 'blur(0px)';

    if (offset === 0) { // Center card
      transform = 'translateX(0) scale(1)';
      zIndex = 30;
    } else if (offset === 1) { // Right card
      transform = 'translateX(35%) scale(0.8) rotateY(-30deg)';
      zIndex = 20;
      filter = 'blur(2px)';
    } else if (offset === cards.length - 1) { // Left card
      transform = 'translateX(-35%) scale(0.8) rotateY(30deg)';
      zIndex = 20;
      filter = 'blur(2px)';
    } else if (offset === 2) { // Far right card
      transform = 'translateX(60%) scale(0.6) rotateY(-45deg)';
      zIndex = 10;
      opacity = 0.5;
      filter = 'blur(4px)';
    } else if (offset === cards.length - 2) { // Far left card
      transform = 'translateX(-60%) scale(0.6) rotateY(45deg)';
      zIndex = 10;
      opacity = 0.5;
      filter = 'blur(4px)';
    } else { // Hidden cards
      transform = 'scale(0)';
      opacity = 0;
      zIndex = 0;
    }

    return {
      transform: `${transform}`,
      zIndex,
      opacity,
      filter,
      transition: 'transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease',
    };
  };

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
              className="w-[280px] h-[420px] bg-card rounded-2xl shadow-2xl p-4 flex flex-col justify-between fifa-card-bg"
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
              
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Select Package
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
