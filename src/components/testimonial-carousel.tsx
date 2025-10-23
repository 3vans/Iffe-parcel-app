
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

const testimonials = [
    {
        name: 'Alice',
        avatarSrc: placeholderImages.userAlice.src,
        avatarHint: 'happy traveler',
        rating: 5,
        message: "The adventurer package was worth every penny! Our guide was incredibly knowledgeable, and seeing the 'Big Five' was a dream come true. The luxury tents were surprisingly comfortable. Unforgettable!"
    },
    {
        name: 'Bob',
        avatarSrc: placeholderImages.userBob.src,
        avatarHint: 'smiling man',
        rating: 5,
        message: "I never thought a group tour could feel so personal. The Explorer Package was perfectly organized, and I met some amazing people. Can't wait for my next trip with iffe-travels!"
    },
    {
        name: 'Charlie',
        avatarSrc: placeholderImages.userCharlie.src,
        avatarHint: 'adventurous person',
        rating: 4,
        message: "We planned a custom Ultimate Safari for our honeymoon, and it exceeded all expectations. The team listened to every detail and crafted a trip that was pure magic. Thank you!"
    }
];

export default function TestimonialCarousel() {
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [clientReady, setClientReady] = useState(false);
    const [ref, isVisible] = useScrollAnimation();

    useEffect(() => {
        setClientReady(true);
    }, []);

    useEffect(() => {
        if (!clientReady) return;
        const timer = setInterval(() => {
            setTestimonialIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        }, 7000); // Change testimonial every 7 seconds

        return () => clearInterval(timer);
    }, [clientReady]);
    
    if (!clientReady) {
        return null; // Prevent hydration mismatch
    }

    const currentTestimonial = testimonials[testimonialIndex];

    return (
        <Card ref={ref} className={cn('scroll-animate bg-transparent w-full border-none shadow-none py-8', isVisible && 'scroll-animate-in')}>
            <CardHeader className="text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-accent mb-2"/>
                <CardTitle className="font-headline text-2xl text-primary">From Our Travelers</CardTitle>
            </CardHeader>
            <CardContent>
                <div key={testimonialIndex} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl mx-auto animate-slide-up">
                    <div className="text-center shrink-0">
                        <Avatar className="h-20 w-20 mx-auto" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'}}>
                            <AvatarImage src={currentTestimonial.avatarSrc} alt={currentTestimonial.name} data-ai-hint={currentTestimonial.avatarHint} />
                            <AvatarFallback>{currentTestimonial.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <p className="mt-2 text-sm font-semibold text-primary">{currentTestimonial.name}</p>
                        <div className="flex justify-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
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
                    <div className="relative w-full">
                        <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-card hidden sm:block" style={{filter: 'drop-shadow(-3px 2px 2px rgba(0,0,0,0.1))'}}></div>
                        <div className="bg-card p-4 rounded-lg" style={{filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))'}}>
                            <p className="text-muted-foreground italic">"{currentTestimonial.message}"</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
