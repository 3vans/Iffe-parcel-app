
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Waves, Zap, Bike, Tent, Ship, LandPlot, Bot, Mountain, Sailboat, Fish, Building2 } from 'lucide-react';
import PageHero from '@/components/layout/page-hero';
import placeholderImages from '@/app/lib/placeholder-images.json';
import AnimatedSection from '@/components/animated-section';
import BookingForm from '@/components/booking-form';
import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

const jinjaHeroImage = { src: 'https://picsum.photos/seed/jinja-nile/1920/1080', hint: 'river nile jinja' };
const sourceOfTheNileImage = { src: 'https://picsum.photos/seed/source-nile/600/400', hint: 'source of nile' };
const monumentsImage = { src: 'https://picsum.photos/seed/jinja-monument/600/400', hint: 'gandhi monument' };
const palaceImage = { src: 'https://picsum.photos/seed/bugembe-palace/600/400', hint: 'royal palace' };
const museumImage = { src: 'https://picsum.photos/seed/jinja-museum/600/400', hint: 'railway museum' };
const waterfallsImage = { src: 'https://picsum.photos/seed/itanda-falls/600/400', hint: 'itanda falls' };
const marketImage = { src: 'https://picsum.photos/seed/jinja-market/600/400', hint: 'central market' };
const raftingImage = { src: 'https://picsum.photos/seed/water-rafting/600/400', hint: 'white water rafting' };
const tubingImage = { src: 'https://picsum.photos/seed/nile-tubing/600/400', hint: 'river tubing' };
const quadBikingImage = { src: 'https://picsum.photos/seed/quad-biking/600/400', hint: 'quad biking safari' };
const cyclingImage = { src: 'https://picsum.photos/seed/jinja-cycling/600/400', hint: 'bicycle tour' };

const attractions = [
  { icon: Waves, title: 'Source of the Nile', description: 'Visit the birthplace of the Nile, the world’s longest river.', image: sourceOfTheNileImage },
  { icon: Building2, title: 'Gandhi & Speke Monuments', description: 'Historic sites honoring Gandhi and John Hanning Speke.', image: monumentsImage },
  { icon: LandPlot, title: 'Royal Palace, Bugembe', description: 'Seat of the King of Busoga and cultural heritage hub.', image: palaceImage },
  { icon: Bot, title: 'Jinja Railway Museum', description: 'Explore the history of Uganda’s railway.', image: museumImage },
  { icon: Mountain, title: 'Waterfalls', description: 'Adventure sports: rafting, kayaking, tubing at Kalagala, Busowoko, and Itanda.', image: waterfallsImage },
  { icon: Ship, title: 'Jinja Town & Central Market', description: 'Bustling streets, local art, and fresh markets.', image: marketImage },
];

const activities = [
  { icon: Waves, title: 'White Water Rafting', description: 'Tackle Grades 3–5 rapids. Adrenaline guaranteed!', price: '$150', image: raftingImage },
  { icon: Sailboat, title: 'Flat Water Tubing', description: 'Enjoy a calm and scenic float down the majestic Nile.', price: 'Varies', image: tubingImage },
  { icon: Bike, title: 'Quad Biking', description: 'Explore the off-road trails and local villages on an ATV.', price: 'Varies', image: quadBikingImage },
  { icon: Zap, title: 'Cycling Tours', description: 'Embark on a scenic and cultural cycling adventure.', price: 'Varies', image: cyclingImage },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Jinja, Uganda",
  "description": "Explore Jinja – Uganda’s Stone City. Famous as the source of the Nile River, Jinja is East Africa’s adventure tourism capital, offering white-water rafting, cultural sites, and vibrant local life.",
  "url": "https://www.iffe-travels.com/discover-jinja",
  "image": jinjaHeroImage.src,
  "hasMap": "https://www.google.com/maps/place/Jinja,+Uganda",
  "event": [
    {
      "@type": "Event",
      "name": "Discover Jinja - 2 Days Package",
      "description": "A 2-day adventure package to discover the highlights of Jinja, including transport, meals, and accommodation.",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "location": {
        "@type": "Place",
        "name": "Jinja",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jinja",
          "addressCountry": "UG"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "500",
        "priceCurrency": "USD",
        "name": "Foreigner Price"
      }
    },
    {
      "@type": "Event",
      "name": "Discover Jinja - 5 Days VIP Package",
      "description": "A 5-day VIP experience in Jinja with premium services.",
       "startDate": "2024-01-01",
      "endDate": "2024-12-31",
       "location": {
        "@type": "Place",
        "name": "Jinja",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jinja",
          "addressCountry": "UG"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "950",
        "priceCurrency": "USD",
        "name": "VIP Price"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: 'Discover Jinja | Iffe.Travels.Ltd',
  description: 'Explore Jinja – Uganda’s Stone City. Source of the Nile, waterfalls, rafting, and cultural sites.',
};

export default function DiscoverJinjaPage() {
  return (
    <div className="space-y-12">
      <Script id="json-ld-jinja" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <PageHero
        title="Discover Jinja – The Stone City of Adventure"
        subtitle="Home of the Source of the Nile, Culture, and Thrilling Experiences"
        imageUrl={jinjaHeroImage.src}
        dataAiHint={jinjaHeroImage.hint}
        primaryAction={{ text: 'Book a Package', link: '#booking' }}
        secondaryAction={{ text: 'Explore Activities', link: '#activities' }}
      />

      <AnimatedSection className="container mx-auto max-w-5xl">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">About Jinja</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground max-w-3xl mx-auto">
            <p>
              "Idindha" in the local language means 'Rock' or 'Stone.' Located in Eastern Uganda on the shores of Lake Victoria, Jinja is famous as the source of the Nile River. Founded in 1901, Jinja covers 767.7 sq km and has a population of 292,386 (UBOS 2024). Once Uganda’s industrial hub, it is now East Africa’s adventure tourism capital.
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
      
      <AnimatedSection className="container mx-auto max-w-6xl">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Main Attractions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Card key={attraction.title} className="overflow-hidden group">
              <div className="relative h-48 w-full">
                <Image src={attraction.image.src} alt={attraction.title} layout="fill" objectFit="cover" data-ai-hint={attraction.image.hint} className="transition-transform duration-300 group-hover:scale-105"/>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><attraction.icon className="h-6 w-6 mr-3 text-accent"/>{attraction.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{attraction.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>
      
      <AnimatedSection id="activities" className="container mx-auto max-w-6xl">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Popular Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <Card key={activity.title} className="overflow-hidden group">
                <div className="relative h-40 w-full">
                    <Image src={activity.image.src} alt={activity.title} layout="fill" objectFit="cover" data-ai-hint={activity.image.hint} className="transition-transform duration-300 group-hover:scale-105"/>
                </div>
                <CardHeader>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground h-16">{activity.description}</p>
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="p-0 text-accent">Learn More <ArrowRight className="h-4 w-4 ml-1"/></Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        <Card className="mt-8 bg-muted/50">
            <CardHeader>
                <CardTitle className="text-xl">And So Much More...</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                <p>Jinja offers a wide array of other experiences including serene **boat cruises**, challenging **kayaking**, thrilling **zip-lining**, relaxed **paddle boating**, and competitive **fishing competitions**. As night falls, dive into the local **nightlife** and cultural scenes at various clubs, Misoli Beach, or enjoy team-building exercises. For nature lovers, **bird watching** at the nearby Mabira forest is a must.</p>
            </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection id="packages" className="container mx-auto max-w-5xl">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Our Jinja Packages</h2>
        <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-4 font-semibold">Package</th>
                            <th className="p-4 font-semibold">Price (Foreigners)</th>
                            <th className="p-4 font-semibold">Price (EA Citizens)</th>
                            <th className="p-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-4 font-medium">2 Days Package</td>
                            <td className="p-4">$500</td>
                            <td className="p-4">$350</td>
                            <td className="p-4 text-right"><Button asChild><Link href="#booking">Book Now</Link></Button></td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-medium">5 Days VIP Package</td>
                            <td className="p-4">$950</td>
                            <td className="p-4">$950</td>
                            <td className="p-4 text-right"><Button asChild><Link href="#booking">Book Now</Link></Button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <CardFooter className="bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">All packages include transport, meals, and accommodation (camping, cottages, or hotels depending on package).</p>
            </CardFooter>
        </Card>
      </AnimatedSection>

      <AnimatedSection id="booking" className="container mx-auto max-w-2xl">
        <BookingForm destination="Jinja" />
      </AnimatedSection>

    </div>
  );
}
