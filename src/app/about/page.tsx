
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Award, Compass, Briefcase } from "lucide-react";
import Image from 'next/image';
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import HeroSection from "@/components/layout/hero-section";
import placeholderImages from '@/app/lib/placeholder-images.json';

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & Lead Guide",
    description: "With over 15 years of experience guiding safaris, Jane's passion for wildlife is contagious. She founded iffe-travels to share the magic of Africa with the world.",
    avatar: placeholderImages.teamJane,
    stats: {
        rating: '98',
        tours: '300+',
        experience: '15 Yrs'
    }
  },
  {
    name: "John Smith",
    role: "Head of Operations",
    description: "John is the mastermind behind our seamless logistics. He ensures every aspect of your journey is perfectly planned, from touchdown to take-off.",
    avatar: placeholderImages.teamJohn,
     stats: {
        rating: '99',
        tours: '500+',
        experience: '10 Yrs'
    }
  },
  {
    name: "Alice Green",
    role: "Customer Relations",
    description: "Alice is your first point of contact and is dedicated to crafting your dream adventure. Her attention to detail and friendly support are second to none.",
    avatar: placeholderImages.teamAlice,
     stats: {
        rating: '99',
        tours: '450+',
        experience: '8 Yrs'
    }
  },
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
             <Card className="bg-card/80 backdrop-blur-sm">
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
       
        <section>
            <h2 className="font-headline text-3xl font-bold text-primary mb-8 text-center">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                    <AnimatedCard key={member.name}>
                        <div className="fifa-card-bg rounded-lg p-0.5 shadow-lg h-full">
                            <Card className="bg-card/90 backdrop-blur-sm text-card-foreground p-4 h-full flex flex-col">
                                <div className="relative h-40 w-full mb-4">
                                     <Image 
                                        src={member.avatar.src} 
                                        alt={member.name} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        className="rounded-t-md"
                                        data-ai-hint={member.avatar.hint}
                                    />
                                </div>
                                <CardHeader className="p-0 text-center">
                                    <CardTitle className="font-headline text-2xl text-primary">{member.name}</CardTitle>
                                    <CardDescription className="text-accent font-semibold">{member.role}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground text-center my-4 flex-grow">
                                    <p>{member.description}</p>
                                </CardContent>
                                <div className="mt-auto border-t border-border/50 pt-4 flex justify-around text-center text-sm font-semibold">
                                    <div className="w-1/3">
                                        <p className="text-xl font-bold text-accent">{member.stats.rating}</p>
                                        <p className="text-xs text-muted-foreground">Rating</p>
                                    </div>
                                    <div className="w-1/3 border-x border-border/50">
                                        <p className="text-xl font-bold text-accent">{member.stats.tours}</p>
                                        <p className="text-xs text-muted-foreground">Tours</p>
                                    </div>
                                    <div className="w-1/3">
                                        <p className="text-xl font-bold text-accent">{member.stats.experience}</p>
                                        <p className="text-xs text-muted-foreground">Experience</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </AnimatedCard>
                ))}
            </div>
        </section>

    </div>
  );
}
