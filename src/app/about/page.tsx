'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import placeholderImages from '@/app/lib/placeholder-images.json';
import FifaCardCarousel from "@/components/fifa-card-carousel";
import TestimonialSection from "@/components/testimonial-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: "team1",
    title: "Ian Mudembula",
    country: "Founder & Lead Guide",
    rating: "98",
    speed: "15 Yrs", 
    skill: "300+ Tours",
    image: "teamJane" as keyof typeof placeholderImages,
    dataAiHint: "safari guide portrait",
    link: "/profile/ian-mudembula"
  },
  {
    id: "team2",
    title: "Ben",
    country: "Head of Operations",
    rating: "99",
    speed: "10 Yrs",
    skill: "500+ Tours",
    image: "teamJohn" as keyof typeof placeholderImages,
    dataAiHint: "operations manager portrait",
    link: "/profile/ben"
  },
  {
    id: "team3",
    title: "Alice Green",
    country: "Customer Relations",
    rating: "99",
    speed: "8 Yrs",
    skill: "450+ Tours",
    image: "teamAlice" as keyof typeof placeholderImages,
    dataAiHint: "customer relations portrait",
    link: "/profile/alice-green"
  },
  {
    id: "team4",
    title: "David Lee",
    country: "Lead Photographer",
    rating: "97",
    speed: "7 Yrs",
    skill: "1000+ Photos",
    image: "teamDavid" as keyof typeof placeholderImages,
    dataAiHint: "photographer portrait",
    link: "/profile/david-lee"
  },
  {
    id: "team5",
    title: "Emily White",
    country: "Logistics Coordinator",
    rating: "96",
    speed: "5 Yrs",
    skill: "200+ Trips",
    image: "teamEmily" as keyof typeof placeholderImages,
    dataAiHint: "logistics coordinator portrait",
    link: "/profile/emily-white"
  }
];


export default function AboutPage() {
    const [headerRef, isHeaderVisible] = useScrollAnimation();
    const heroImage = placeholderImages.gallerySafariGroup;

    const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in', className)}>
                {children}
            </div>
        );
    };

  return (
    <div className="space-y-12">
        <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center justify-center', isHeaderVisible && 'scroll-animate-in')}>
            <Image
                src={heroImage.src}
                alt="Our Mission: Your Adventure"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint={heroImage.hint}
                priority
            />
            <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
            
            <div className="absolute inset-0 h-full flex items-center justify-center z-10 min-h-[400px] text-center p-4">
                <div className="relative w-full max-w-4xl flex flex-col justify-center bg-stone-900/70 text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
                    <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">About iffe-travels</p>
                    <h1
                        className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest"
                        style={{
                        color: 'hsl(var(--primary-foreground))',
                        WebkitTextStroke: '1px hsl(var(--primary))',
                        }}
                    >
                        Our Mission: Your Adventure
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                        We are a team of passionate explorers dedicated to crafting unforgettable and responsible travel experiences in the heart of Africa.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                        <Link href="/packages">
                            View Our Packages
                        </Link>
                        </Button>
                        <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <AnimatedCard>
             <Card className="bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl text-primary">Who We Are</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center text-muted-foreground max-w-3xl mx-auto">
                <p>
                  Welcome to iffe-travels! We believe that travel should be more than just a vacation; it should be an experience that connects you to the destination, its people, and its wildlife.
                </p>
                <p>
                  Our team is composed of seasoned guides, travel experts, and conservation advocates who share a deep love for Africa. We are committed to ethical tourism, supporting local communities, and providing our guests with adventures that are as authentic as they are breathtaking.
                </p>
              </CardContent>
            </Card>
        </AnimatedCard>
       
        <section className="carousel-background-container">
            <div 
                className="carousel-background-image"
                style={{ backgroundImage: `url(${placeholderImages.gallerySafariGroup.src})` }}
            />
            <div className="carousel-background-overlay" />
            <FifaCardCarousel cards={teamMembers} title="Meet The Team" />
        </section>

        <TestimonialSection />

    </div>
  );
}
