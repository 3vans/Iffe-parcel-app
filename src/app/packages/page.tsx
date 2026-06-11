'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, Loader2 } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import placeholderImages from "@/app/lib/placeholder-images.json";
import AnimatedSection from "@/components/animated-section";
import TestimonialSection from "@/components/testimonial-section";
import CustomSafariBuilder from "@/components/custom-safari-builder/custom-safari-builder";
import { fetchBasePackages, fetchAddons, type Package as BuilderPackage, type Addon } from "@/lib/services/cms-service";
import { cn } from "@/lib/utils";
import PageHero from '@/components/layout/page-hero';

export default function PackagesPage() {
    const [livePackages, setLivePackages] = useState<BuilderPackage[]>([]);
    const [builderAddons, setBuilderAddons] = useState<Addon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [pkgs, ads] = await Promise.all([
                    fetchBasePackages(),
                    fetchAddons()
                ]);
                setLivePackages(pkgs);
                setBuilderAddons(ads);
            } catch (err) {
                console.error("Load packages error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const heroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    const heroDataAiHint = 'mountain valley landscape';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Packages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <PageHero 
                title="Our Safari Packages"
                subtitle="Choose the perfect adventure that suits your style and budget. Experience the wild like never before with our expertly crafted safari journeys."
                imageUrl={heroImage}
                dataAiHint={heroDataAiHint}
                primaryAction={{ text: "Explore All Tours", link: "/campaigns" }}
                secondaryAction={{ text: "Customize Your Trip", link: "#custom-builder" }}
            />
            
            <section className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-8">
                    {livePackages.map(pkg => (
                        <Card key={pkg.id} className={cn(
                            "shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card/80 backdrop-blur-sm border-2 hover:border-accent",
                            pkg.isPopular ? 'border-accent -translate-y-2' : 'border-transparent'
                        )}>
                            {pkg.imageUrl && (
                                <div className="relative w-full h-56 bg-muted">
                                    <Image 
                                        src={pkg.imageUrl} 
                                        alt={pkg.name} 
                                        fill
                                        className="object-cover rounded-t-lg" 
                                        data-ai-hint={pkg.dataAiHint || "safari package"}
                                    />
                                    {pkg.isPopular && <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">Most Popular</div>}
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl text-primary">{pkg.name}</CardTitle>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-accent">${pkg.basePrice.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground ml-1">{pkg.priceDescription}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow font-body">
                                <ul className="space-y-2 text-sm">
                                    {pkg.features?.map(feature => (
                                        <li key={feature} className="flex items-center">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 shrink-0"/>
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className={`w-full ${pkg.isPopular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}>
                                    <Link href={`/packages/${pkg.slug}`}>
                                        View Package <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {livePackages.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
                            <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground font-bold uppercase tracking-widest">Our tour catalog is being updated.</p>
                        </div>
                    )}
                </div>
            </section>

            <AnimatedSection id="custom-builder" className="container mx-auto px-4">
                <CustomSafariBuilder 
                    initialPackages={livePackages} 
                    initialAddons={builderAddons} 
                />
            </AnimatedSection>
            
            <TestimonialSection />
        </div>
    );
}
