
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Alice',
    initials: 'A',
    text: "The Adventurer package was worth every penny! Our guide was incredibly knowledgeable. Unforgettable!",
    rating: 5,
  },
  {
    name: 'Bob',
    initials: 'B',
    text: "I never thought a group tour could feel so personal. The Explorer Package was perfectly organized.",
    rating: 5,
  },
  {
    name: 'Charlie',
    initials: 'C',
    text: "Planning a custom Ultimate Safari for our honeymoon was pure magic. The team listened to every detail.",
    rating: 5,
  },
  {
    name: 'Diana',
    initials: 'D',
    text: "An amazing experience from start to finish. The landscapes were breathtaking and the wildlife was abundant.",
    rating: 4,
  },
  {
    name: 'Edward',
    initials: 'E',
    text: "The best trip of my life! I highly recommend iffe-travels to anyone looking for a real adventure.",
    rating: 5,
  },
  {
    name: 'Fiona',
    initials: 'F',
    text: "A truly professional and well-executed tour. The attention to detail made all the difference.",
    rating: 5,
  },
];

export default function TestimonialPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial appearance
    const initialTimer = setTimeout(() => setIsVisible(true), 500); // Appear faster

    const cycleTestimonials = () => {
      setIsVisible(false); // Start exit animation

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsVisible(true); // Start entrance animation for the new card
      }, 1000); // Wait for the exit transition to complete (1s)
    };

    const interval = setInterval(cycleTestimonials, 8000); // 7s visible + 1s transition

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full flex justify-end p-4 md:p-6 pointer-events-none">
      <div
        className={cn(
          "w-80 transition-all duration-1000 pointer-events-auto",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        )}
      >
        <div className="flex items-start gap-3">
            <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {currentTestimonial.initials}
            </AvatarFallback>
            </Avatar>
            <div className="flex-1">
            <div className="bg-card p-4 rounded-3xl rounded-bl-lg shadow-2xl">
                <p className="text-sm text-card-foreground leading-snug">
                <span className="font-bold">{currentTestimonial.name}</span>
                <br />
                {currentTestimonial.text}
                </p>
            </div>
            <div className="flex justify-end items-center mt-1 pr-2">
                {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                    "h-4 w-4",
                    i < currentTestimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/50"
                    )}
                />
                ))}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
