
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Mountain, Coffee, PersonStanding, Building, Fish, Users } from 'lucide-react';
import PageHero from '@/components/layout/page-hero';
import placeholderImages from '@/app/lib/placeholder-images.json';
import AnimatedSection from '@/components/animated-section';
import BookingForm from '@/components/booking-form';
import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

const sipiHeroImage = { src: 'https://picsum.photos/seed/sipi-falls-hero/1920/1080', hint: 'sipi falls uganda' };
const hikingImage = { src: 'https://picsum.photos/seed/sipi-hiking/600/400', hint: 'hiking mount elgon' };
const abseilingImage = { src: 'https://picsum.photos/seed/sipi-abseiling/600/400', hint: 'abseiling waterfall' };
const coffeeImage = { src: 'https://picsum.photos/seed/sipi-coffee/600/400', hint: 'coffee beans uganda' };

const mainActivities = [
  { icon: Mountain, title: 'Scenic Hiking', description: 'Explore beautiful trails with opportunities for wildlife and bird viewing.', image: hikingImage },
  { icon: PersonStanding, title: 'Abseiling Adventure', description: 'Descend down steep cliffs alongside the waterfalls with professional guides.', image: abseilingImage },
  { icon: Coffee, title: 'Coffee Making Experience', description: 'From farm to cup, learn traditional coffee harvesting, roasting, and brewing.', image: coffeeImage },
];

const otherActivities = [
  { icon: Building, name: "High Altitude Training Centre" },
  { icon: Fish, name: "Trout Fishing" },
  { icon: Users, name: "Local Cultural Experiences" },
];

const packages = [
  { id: 'sipi-1-day', title: '1 Day Trip', priceForeigner: '$300', priceCitizen: '$200' },
  { id: 'sipi-2-day', title: '2 Day Trip', priceForeigner: '$320', priceCitizen: '$220' },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Sipi Falls, Uganda",
  "description": "Discover Uganda’s Sipi Falls – a series of three breathtaking waterfalls on the slopes of Mt. Elgon, offering hiking, abseiling, coffee tours, and affordable packages.",
  "url": "https://www.iffe-travels.com/sipi-falls",
  "image": sipiHeroImage.src,
  "hasMap": "https://www.google.com/maps/place/Sipi+Falls,+Uganda",
  "event": [
    {
      "@type": "Event",
      "name": "Sipi Falls - 1 Day Trip",
      "description": "A full-day adventure to experience the beauty and activities of Sipi Falls.",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "location": {
        "@type": "Place",
        "name": "Sipi Falls",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kapchorwa",
          "addressCountry": "UG"
        }
      },
       "offers": {
        "@type": "Offer",
        "price": "300",
        "priceCurrency": "USD",
        "name": "Foreigner Price"
      }
    },
    {
      "@type": "Event",
      "name": "Sipi Falls - 2 Day Trip",
      "description": "An immersive two-day trip to Sipi Falls with overnight accommodation.",
       "startDate": "2024-01-01",
      "endDate": "2024-12-31",
       "location": {
        "@type": "Place",
        "name": "Sipi Falls",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kapchorwa",
          "addressCountry": "UG"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "320",
        "priceCurrency": "USD",
        "name": "Foreigner Price"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: 'Sipi Falls Experience | Iffe.Travels.Ltd',
  description: 'Discover Uganda’s Sipi Falls – three waterfalls with hiking, abseiling, coffee tours, and affordable packages.',
};

export default function SipiFallsPage() {
  const whatsappLink = `https://wa.me/256705398510`;
  return (
    <div className="space-y-12">
       <Script id="json-ld-sipi" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <PageHero
        title="Sipi Falls – Adventure on the Slopes of Mt. Elgon"
        subtitle="Three waterfalls, endless adventure."
        imageUrl={sipiHeroImage.src}
        dataAiHint={sipiHeroImage.hint}
        primaryAction={{ text: 'Plan Your Trip', link: '#booking' }}
        secondaryAction={{ text: 'View Packages', link: '#packages' }}
      />

      <AnimatedSection className="container mx-auto max-w-5xl">
        <Card className="bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">About Sipi Falls</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground max-w-3xl mx-auto">
            <p>
              Sipi Falls is a breathtaking series of three waterfalls on the northwestern slopes of Mount Elgon, near the Kenyan border. Surrounded by lush vegetation, the falls include Ngasire Falls (85m), Simba Falls (74–85m), and the Main Sipi Falls (95–100m).
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
      
      <AnimatedSection className="container mx-auto max-w-6xl">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Main Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainActivities.map((activity) => (
            <Card key={activity.title} className="overflow-hidden group transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 w-full">
                <Image src={activity.image.src} alt={activity.title} layout="fill" objectFit="cover" data-ai-hint={activity.image.hint} className="transition-transform duration-300 group-hover:scale-105"/>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><activity.icon className="h-6 w-6 mr-3 text-accent"/>{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto max-w-5xl">
          <h3 className="font-headline text-2xl font-bold text-primary mb-4 text-center">Other Experiences</h3>
          <Card className="bg-muted/50 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {otherActivities.map(activity => (
                  <li key={activity.name} className="flex flex-col items-center gap-2">
                    <div className="bg-accent/20 p-3 rounded-full">
                      <activity.icon className="h-8 w-8 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">{activity.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
      </AnimatedSection>
      
      <AnimatedSection id="packages" className="container mx-auto max-w-5xl">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Sipi Falls Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map(pkg => (
                <Card key={pkg.id} className="text-center transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-accent">{pkg.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-4xl font-bold text-primary">{pkg.priceForeigner}</p>
                            <p className="text-sm text-muted-foreground">For Foreigners</p>
                        </div>
                        <div className="py-2">
                            <p className="text-3xl font-bold text-primary">{pkg.priceCitizen}</p>
                            <p className="text-sm text-muted-foreground">For East African Citizens</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <Button asChild className="w-full"><Link href="#booking">Book Sipi Adventure</Link></Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">Packages include transport from our offices and accommodation (camping by default, with upgrade options available).</p>
      </AnimatedSection>

      <AnimatedSection id="booking" className="container mx-auto max-w-2xl">
        <BookingForm destination="Sipi Falls" />
      </AnimatedSection>

       <AnimatedSection className="container mx-auto max-w-2xl text-center">
        <h3 className="font-headline text-2xl font-bold text-primary mb-2">Ready to Go?</h3>
        <p className="text-muted-foreground mb-4">Contact us directly to customize your trip or get more details.</p>
        <Button asChild size="lg">
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
             <i className="fa-brands fa-whatsapp h-6 w-6 mr-2"></i>
             Call / WhatsApp Us
          </Link>
        </Button>
      </AnimatedSection>

    </div>
  );
}
