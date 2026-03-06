import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import placeholderImages from "@/app/lib/placeholder-images.json";
import AnimatedSection from "@/components/animated-section";
import TestimonialSection from "@/components/testimonial-section";
import CustomSafariBuilder from "@/components/custom-safari-builder/custom-safari-builder";
import { fetchBasePackages, fetchAddons, type Package as BuilderPackage } from "@/lib/services/cms-service";
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
        id: 'explorer',
        title: 'Explorer Package',
        price: '$750',
        priceDescription: 'per person',
        features: ['4-Day Eastern Uganda Tour', 'Source of the Nile Visit', 'Sipi Falls Hike & Coffee Tour', 'Great for short trips'],
        buttonText: 'View Package',
        buttonLink: '/packages/explorer',
        imageUrl: placeholderImages.pkgExplorer.src,
        dataAiHint: placeholderImages.pkgExplorer.hint,
    },
    {
        id: 'adventurer',
        title: 'Adventurer Package',
        price: '$4,500',
        priceDescription: 'per person',
        features: ['7-Day Primate Focus Tour', 'Gorilla & Chimp Trekking', 'Expert Private Guide', 'Mid-range & Luxury Lodges'],
        buttonText: 'View Package',
        buttonLink: '/packages/adventurer',
        isFeatured: true,
        imageUrl: placeholderImages.pkgAdventurer.src,
        dataAiHint: placeholderImages.pkgAdventurer.hint,
    },
    {
        id: 'ultimate',
        title: 'Ultimate Safari',
        price: '$8,000',
        priceDescription: 'per person',
        features: ['10-Day Western Uganda Circuit', 'Savannah & Forest Parks', 'Murchison, Kibale & Queen Elizabeth', 'Diverse Wildlife Experiences'],
        buttonText: 'View Package',
        buttonLink: '/packages/ultimate',
        imageUrl: placeholderImages.pkgUltimate.src,
        dataAiHint: placeholderImages.pkgUltimate.hint,
    }
];

const superCombiPackage: PackageTier = {
    id: 'super-combi',
    title: 'Super Combo & Safari',
    price: '$12,000',
    priceDescription: 'per person',
    features: ['14-Day Grand Ugandan Tour', 'All Major Parks Included', 'Gorillas, Chimps, & Big Game', 'The Complete Experience'],
    buttonText: 'View Package',
    buttonLink: '/packages/super-combi',
    imageUrl: placeholderImages.campaignKidepo.src,
    dataAiHint: 'kidepo valley',
};

export default async function PackagesPage() {
    const allPackages = [...mockPackages, superCombiPackage];
    
    // Pre-fetch data on the server for instant builder loading
    const [builderPackages, builderAddons] = await Promise.all([
        fetchBasePackages(),
        fetchAddons()
    ]);

    const heroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    const heroDataAiHint = 'mountain valley landscape';

    return (
        <div className="space-y-12">
            <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg flex items-center">
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
                    <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-stone-900/70 text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
                        <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">Tour, Travel & Adventure Camping Across Uganda and East Africa</p>
                        <h1
                            className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest"
                            style={{
                                color: 'hsl(var(--primary-foreground))',
                                WebkitTextStroke: '1px hsl(var(--primary))',
                            }}
                        >
                            Our Safari Packages
                            <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md mb-8">
                            Choose the perfect adventure that suits your style and budget. Experience the wild like never before with our expertly crafted safari journeys.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                                <Link href="/campaigns">
                                    Explore All Tours
                                </Link>
                            </Button>
                            <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                                <Link href="#custom-builder">
                                    Customize Your Trip
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-8">
                    {allPackages.map(pkg => (
                        <Card key={pkg.id} className={cn(
                            "shadow-lg transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full bg-card/80 backdrop-blur-sm border-2 hover:border-accent",
                            pkg.isFeatured ? 'border-accent -translate-y-2' : 'border-transparent'
                        )}>
                            {pkg.imageUrl && (
                                <div className="relative w-full h-56">
                                    <Image 
                                        src={pkg.imageUrl} 
                                        alt={pkg.title} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        className="rounded-t-lg" 
                                        data-ai-hint={pkg.dataAiHint}
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
                    ))}
                </div>
            </section>

            <AnimatedSection id="custom-builder" className="container mx-auto px-4">
                <CustomSafariBuilder 
                    initialPackages={builderPackages} 
                    initialAddons={builderAddons} 
                />
            </AnimatedSection>
            
            <TestimonialSection />
        </div>
    );
}
