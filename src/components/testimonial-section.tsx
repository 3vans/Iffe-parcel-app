
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

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

const colorClasses = [
    { bg: 'bg-primary/70', border: 'border-r-primary/70', text: 'text-primary-foreground' },
    { bg: 'bg-accent/70', border: 'border-r-accent/70', text: 'text-accent-foreground' },
    { bg: 'bg-secondary/70', border: 'border-r-secondary/70', text: 'text-secondary-foreground' },
];


export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, isSectionVisible] = useScrollAnimation({ triggerOnce: false });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    stopAnimation(); // Clear existing interval before starting a new one
    intervalRef.current = setInterval(() => {
      setIsVisible(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsVisible(true); // Start fade-in for new testimonial
      }, 500); // Wait for fade-out to complete
    }, 7000); // Change every 7 seconds
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isSectionVisible) {
      setIsVisible(true); // Initially visible when it scrolls into view
      startAnimation();
    } else {
      setIsVisible(false); // Fade out when it scrolls out of view
      stopAnimation();
    }

    // Cleanup on component unmount
    return () => stopAnimation();
  }, [isSectionVisible]);
  

  const currentTestimonial = testimonials[currentIndex];
  const currentColor = colorClasses[currentIndex % colorClasses.length];

  return (
    <section ref={ref} className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card
            className={cn(
            'relative rounded-xl border-none bg-transparent shadow-none transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
        >
            <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border-2 border-accent shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground shadow-lg">{currentTestimonial.initials}</AvatarFallback>
            </Avatar>
            <div className={cn("flex-1 rounded-lg p-3 shadow-2xl relative", currentColor.bg)}>
                <div className={cn("absolute -left-2 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8", currentColor.border)}></div>
                <p className={cn("text-sm font-semibold mb-1", currentColor.text)}>{currentTestimonial.name}</p>
                <p className={cn("text-sm", currentColor.text, "opacity-90")}>{currentTestimonial.text}</p>
                <div className="flex justify-end mt-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                        key={i}
                        className={cn(
                            'h-4 w-4',
                            i < currentTestimonial.rating ? cn(currentColor.text, 'fill-current') : 'text-current opacity-30'
                        )}
                        />
                    ))}
                </div>
            </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
