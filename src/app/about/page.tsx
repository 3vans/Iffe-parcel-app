
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Award, Compass, Briefcase } from "lucide-react";
import Image from 'next/image';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import HeroSection from "@/components/layout/hero-section";
import placeholderImages from '@/app/lib/placeholder-images.json';
import FifaCardCarousel from "@/components/fifa-card-carousel";
import TestimonialSection from "@/components/testimonial-section";

const teamMembers = [
  {
    id: "team1",
    title: "Jane Doe",
    country: "Founder & Lead Guide",
    rating: "98",
    speed: "15 Yrs", 
    skill: "300+ Tours",
    image: "teamJane" as keyof typeof placeholderImages,
    dataAiHint: "safari guide portrait",
    link: "/about"
  },
  {
    id: "team2",
    title: "John Smith",
    country: "Head of Operations",
    rating: "99",
    speed: "10 Yrs",
    skill: "500+ Tours",
    image: "teamJohn" as keyof typeof placeholderImages,
    dataAiHint: "operations manager portrait",
    link: "/about"
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
    link: "/about"
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
    link: "/about"
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
    link: "/about"
  }
];


export default function AboutPage() {
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
        <HeroSection
            title="Our Mission: Your Adventure"
            subtitle="We are a team of passionate explorers dedicated to crafting unforgettable and responsible travel experiences in the heart of Africa."
            iconName="Globe"
            imageUrl={placeholderImages.gallerySafariGroup.src}
            dataAiHint={placeholderImages.gallerySafariGroup.hint}
        />

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
