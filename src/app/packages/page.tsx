
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import placeholderImages from "@/app/lib/placeholder-images.json";

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
        imageUrl: 'https://picsum.photos/seed/pkg1/600/400',
        dataAiHint: 'safari group happy',
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
        imageUrl: 'https://picsum.photos/seed/pkg2/600/400',
        dataAiHint: 'luxury safari tent',
    },
    {
        id: 'pkg_ultimate',
        title: 'Ultimate Safari',
        price: '$8,000',
        priceDescription: 'per person',
        features: ['10-Day Custom Itinerary', 'Fly-in Safari Options', 'Premium Lodges & Camps', 'Conservation Experiences', 'Private Photographer'],
        buttonText: 'Plan Your Trip',
        buttonLink: '/campaigns/new',
        imageUrl: 'https://picsum.photos/seed/pkg3/600/400',
        dataAiHint: 'safari sunset view',
    }
];

const PaintBrushSeparatorSVG = () => (
  <svg
    className="absolute top-0 right-0 h-full w-[100px] text-background/80 backdrop-blur-sm z-20"
    viewBox="0 0 100 800"
    preserveAspectRatio="none"
    style={{ transform: 'translateX(50%)' }}
    filter="url(#brush-shadow)"
  >
    <defs>
      <filter id="brush-shadow" x="-20%" y="-5%" width="140%" height="110%">
        <feDropShadow dx="5" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
      </filter>
      <linearGradient id="brushstroke-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="50%" stopColor="white" stopOpacity="0.9" />
        <stop offset="100%" stopColor="white" stopOpacity="0.5" />
      </linearGradient>
      <mask id="brushstroke-mask">
        <path
          d="M 50 0 
             C 40 50, 60 80, 50 120
             S 45 180, 52 220
             C 60 270, 40 300, 50 350
             S 55 420, 48 480
             C 40 550, 60 580, 50 630
             S 45 700, 53 750
             L 53 800
             L 100 800
             L 100 0
             Z"
          fill="url(#brushstroke-gradient)"
        />
        <path
          d="M 50 50 
             C 55 100, 45 130, 50 180 
             M 50 250 
             C 45 300, 55 330, 50 380
             M 50 450 
             C 55 500, 45 530, 50 580
             M 50 650
             C 45 700, 55 730, 50 780"
          fill="black"
          stroke="black"
          strokeWidth="5"
        />
      </mask>
    </defs>
    <path
      d="M 50 0 
         C 40 50, 60 80, 50 120
         S 45 180, 52 220
         C 60 270, 40 300, 50 350
         S 55 420, 48 480
         C 40 550, 60 580, 50 630
         S 45 700, 53 750
         L 53 800
         L 0 800
         L 0 0
         Z"
      fill="currentColor"
      mask="url(#brushstroke-mask)"
    />
  </svg>
);


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

    const [headerRef, isHeaderVisible] = useScrollAnimation();
    const [footerRef, isFooterVisible] = useScrollAnimation();
    const heroImage = 'https://picsum.photos/seed/pkg2/1200/400';
    const heroDataAiHint = 'luxury safari tent';

  return (
    <div className="space-y-8 animate-fade-in">
       <section ref={headerRef} className={cn('relative w-full min-h-[400px] overflow-hidden rounded-lg shadow-lg scroll-animate', isHeaderVisible && 'scroll-animate-in')}>
        <Image
          src={heroImage}
          alt="Safari Packages"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={heroDataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="relative h-full flex items-center z-10 min-h-[400px]">
          <div className="relative w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center bg-background/80 backdrop-blur-sm p-8 md:p-12 min-h-[400px]">
            <div className="text-left">
               <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
                  <Package className="h-10 w-10 md:h-12 md:w-12 text-accent" />
                </div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">Our Safari Packages</h1>
              <p className="text-lg text-muted-foreground max-w-md">Choose the perfect adventure that suits your style and budget.</p>
            </div>
            <PaintBrushSeparatorSVG />
          </div>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-8">
        {mockPackages.map(pkg => (
            <AnimatedPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

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

    