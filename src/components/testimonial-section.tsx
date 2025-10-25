
'use client';

import { useState, useEffect } from 'react';
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

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, isSectionVisible] = useScrollAnimation();

  useEffect(() => {
    if (!isSectionVisible) return;

    // Initial fade-in
    const initialTimer = setTimeout(() => setIsVisible(true), 100);

    const cycleTestimonials = () => {
      setIsVisible(false); // Start fade-out

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsVisible(true); // Start fade-in for new testimonial
      }, 1000); // Wait for fade-out to complete
    };

    const interval = setInterval(cycleTestimonials, 8000); // 7s visible + 1s transition

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isSectionVisible]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={ref}>
        <div className="py-8">
            <div className="mx-auto max-w-2xl">
                <Card
                    className={cn(
                    'relative rounded-xl transition-all duration-1000 border-none bg-transparent shadow-none',
                    isSectionVisible && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    )}
                >
                    <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-accent">
                        <AvatarFallback className="bg-primary text-primary-foreground">{currentTestimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-card rounded-lg p-3 shadow-2xl relative">
                        <div className="absolute -left-2 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-card"></div>
                        <p className="text-sm text-foreground font-semibold mb-1">{currentTestimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{currentTestimonial.text}</p>
                        <div className="flex justify-end mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                key={i}
                                className={cn(
                                    'h-4 w-4',
                                    i < currentTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
                                )}
                                />
                            ))}
                        </div>
                    </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
  );
}
