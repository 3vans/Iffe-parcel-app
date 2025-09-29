
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

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

export default function PackagesPage() {
    const AnimatedPackageCard = ({ pkg }: { pkg: PackageTier }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <div ref={ref} className={cn('scroll-animate h-full', isVisible && 'scroll-animate-in')}>
                <Card key={pkg.id} className={`shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full ${pkg.isFeatured ? 'border-accent border-2 -translate-y-2' : ''}`}>
                    {pkg.imageUrl && (
                        <div className="relative w-full h-56">
                            <Image src={pkg.imageUrl} alt={pkg.title} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={pkg.dataAiHint} />
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

  return (
    <div className="space-y-8 animate-fade-in">
      <section ref={headerRef} className={cn('text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg scroll-animate', isHeaderVisible && 'scroll-animate-in')}>
        <h1 className="font-headline text-4xl font-bold text-primary mb-2 flex items-center justify-center">
          <Package className="mr-3 h-10 w-10" />
          Our Safari Packages
        </h1>
        <p className="text-lg text-muted-foreground">Choose the perfect adventure that suits your style and budget.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {mockPackages.map(pkg => (
            <AnimatedPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

       <section ref={footerRef} className={cn('text-center mt-12 p-8 bg-card rounded-lg shadow-inner scroll-animate', isFooterVisible && 'scroll-animate-in')}>
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
