
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, CheckCircle2, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import placeholderImages from "@/app/lib/placeholder-images.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PackageTier {
    id: string;
    title: string;
    price: string;
    priceDescription: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    isFeatured?: boolean;
    imageUrl?: string;
    dataAiHint?: string;
}

const mockPackages: PackageTier[] = [
    {
        id: 'pkg_starter',
        title: 'Explorer Package',
        price: '$2,500',
        priceDescription: 'per person',
        features: ['5-Day Group Tour', 'Standard Accommodations', 'Key Highlight Visits', 'Community Support'],
        buttonText: 'Learn More',
        buttonLink: '/campaigns/1',
        imageUrl: placeholderImages.pkgExplorer.src,
        dataAiHint: placeholderImages.pkgExplorer.hint,
    },
    {
        id: 'pkg_adventurer',
        title: 'Adventurer Package',
        price: '$4,500',
        priceDescription: 'per person',
        features: ['7-Day Private Tour', 'Luxury Tented Camps', 'All-Inclusive Meals', 'Off-the-beaten-path locations', 'Expert Private Guide'],
        buttonText: 'Book Now',
        buttonLink: '/campaigns/2',
        isFeatured: true,
        imageUrl: placeholderImages.pkgAdventurer.src,
        dataAiHint: placeholderImages.pkgAdventurer.hint,
    },
    {
        id: 'pkg_ultimate',
        title: 'Ultimate Safari',
        price: '$8,000',
        priceDescription: 'per person',
        features: ['10-Day Custom Itinerary', 'Fly-in Safari Options', 'Premium Lodges & Camps', 'Conservation Experiences', 'Private Photographer'],
        buttonText: 'Plan Your Trip',
        buttonLink: '/campaigns/new',
        imageUrl: placeholderImages.pkgUltimate.src,
        dataAiHint: placeholderImages.pkgUltimate.hint,
    }
];

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

export default function PackagesPage() {
    const AnimatedPackageCard = ({ pkg }: { pkg: PackageTier }) => {
        const [ref, isVisible] = useScrollAnimation();
        const [imgSrc, setImgSrc] = useState(pkg.imageUrl || placeholderImages.eventDetailDefault.src);

        return (
            <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in')}>
                <Card key={pkg.id} className={cn(
                    "shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-card/80 backdrop-blur-sm",
                     pkg.isFeatured ? 'border-accent border-2 -translate-y-2' : ''
                     )}>
                    {pkg.imageUrl && (
                        <div className="relative w-full h-56">
                            <Image 
                                src={imgSrc} 
                                alt={pkg.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-t-lg" 
                                data-ai-hint={pkg.dataAiHint}
                                onError={() => setImgSrc(placeholderImages.eventDetailDefault.src)}
                             />
                            {pkg.isFeatured && <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">Most Popular</div>}
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">{pkg.title}</CardTitle>
                        <div className="flex items-baseline">
                            <p className="text-3xl font-bold text-accent">{pkg.price}</p>
                            <p className="text-sm text-muted-foreground ml-1">{pkg.priceDescription}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2 text-sm">
                            {pkg.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 shrink-0"/>
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className={`w-full ${pkg.isFeatured ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}>
                            <Link href={pkg.buttonLink}>
                                {pkg.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    };

    const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <section ref={ref} className={cn('scroll-animate py-8', isVisible && 'scroll-animate-in', className)}>
                {children}
            </section>
        );
    };

    const [headerRef, isHeaderVisible] = useScrollAnimation();
    const [footerRef, isFooterVisible] = useScrollAnimation();
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const heroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    const heroDataAiHint = 'mountain valley landscape';

    useEffect(() => {
        const timer = setInterval(() => {
            setTestimonialIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        }, 7000); // Change testimonial every 7 seconds

        return () => clearInterval(timer);
    }, []);

    const currentTestimonial = testimonials[testimonialIndex];

  return (
    <div className="space-y-8 animate-fade-in">
       <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isHeaderVisible && 'scroll-animate-in')}>
        <Image
          src={heroImage}
          alt="Safari Packages"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={heroDataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
        
        <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
            <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
              <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">Tour Travel & Adventure Camping</p>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 pb-4 relative bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                Our Safari Packages
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8">
                Choose the perfect adventure that suits your style and budget. Experience the wild like never before with our expertly crafted safari journeys.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                   <Link href="/campaigns">
                     Explore Packages
                   </Link>
                 </Button>
                 <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                    <Link href="/campaigns/new">
                        Customize Your Trip
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-8">
        {mockPackages.map(pkg => (
            <AnimatedPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

      <AnimatedSection className="h-48 flex items-center">
        <Card className="bg-card/80 backdrop-blur-sm w-full">
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
      </AnimatedSection>

       <section ref={footerRef} className={cn('text-center mt-12 p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-inner scroll-animate', isFooterVisible && 'scroll-animate-in')}>
          <h2 className="font-headline text-2xl font-bold text-primary mb-4">Can't find the perfect package?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Let us create a bespoke journey just for you. From family adventures to photographic expeditions, we can tailor every detail to your desires.</p>
          <Button size="lg" asChild>
            <Link href="/campaigns/new">
                Plan a Custom Tour
            </Link>
          </Button>
      </section>

    </div>
  );
}

    
