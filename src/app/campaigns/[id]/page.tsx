
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Summarizer from '@/components/summarizer';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Tag, Compass, Activity, BedDouble, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignActionsCard from '@/components/campaign/campaign-actions-card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Mock data - replace with actual data fetching logic
interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  storyline: string;
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: string[];
  accommodation: string;
  meals: string;
  shortDescription?: string;
}

const mockCampaignsData: Campaign[] = [
    // Existing detailed campaigns
    {
        id: '1',
        title: 'Bwindi Gorilla Trekking',
        shortDescription: 'World-famous gorilla trekking in a UNESCO World Heritage site.',
        imageUrl: placeholderImages.campaignBwindi.src,
        imageWidth: placeholderImages.campaignBwindi.width,
        imageHeight: placeholderImages.campaignBwindi.height,
        dataAiHint: placeholderImages.campaignBwindi.hint,
        description: 'A once-in-a-lifetime opportunity to trek through the Bwindi Impenetrable Forest and spend time with a family of mountain gorillas. This 3-day package includes permits, expert local trackers, and comfortable lodging near the park. The trek can be challenging, but the reward is an unparalleled wildlife encounter that directly supports conservation efforts. We are committed to responsible tourism.',
        storyline: 'Our local guides have generations of experience in this forest. Your journey supports their families and the vital work of the park rangers protecting these magnificent creatures.',
        budget: 20000, goal: 100, currentAmount: 98, organizer: 'iffe-travels', tags: ['#Gorilla', '#UNESCO', '#Uganda'], startDate: '2024-09-01', endDate: '2024-09-04', volunteersNeeded: 8, volunteersSignedUp: 6,
        activities: ['Gorilla Trekking (permit included)', 'Community Walk', 'Bird Watching Tour'],
        accommodation: 'Comfortable eco-lodges with stunning forest views. Options range from budget to luxury.',
        meals: 'Full board. Includes breakfast, packed lunch for the trek, and dinner. Locally sourced ingredients.',
    },
    {
        id: '2',
        title: 'Queen Elizabeth National Park',
        shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.',
        imageUrl: placeholderImages.campaignQueenElizabeth.src,
        imageWidth: placeholderImages.campaignQueenElizabeth.width,
        imageHeight: placeholderImages.campaignQueenElizabeth.height,
        dataAiHint: placeholderImages.campaignQueenElizabeth.hint,
        description: 'Explore the diverse ecosystems of Queen Elizabeth National Park. Famous for its tree-climbing lions, this park also boasts a stunning boat safari on the Kazinga Channel where you can see elephants, hippos, crocodiles, and a huge variety of birdlife.',
        storyline: 'From the open savannah to the dense papyrus swamps, every game drive and boat cruise offers a new discovery. This is classic African safari at its best.',
        budget: 15000, goal: 100, currentAmount: 92, organizer: 'iffe-travels', tags: ['#Wildlife', '#Lions', '#Uganda'], startDate: '2024-07-15', endDate: '2024-07-22', volunteersNeeded: 12, volunteersSignedUp: 8,
        activities: ['Game Drives (Ishasha & Kasenyi)', 'Kazinga Channel Boat Cruise', 'Crater Lake Drive'],
        accommodation: 'Selection of safari lodges and camps overlooking the savannah or channel.',
        meals: 'All-inclusive options available. Enjoy meals with a view of the park.',
    },
    {
        id: '3',
        title: 'Murchison Falls Safari',
        shortDescription: 'See the powerful falls and diverse wildlife of Murchison.',
        imageUrl: placeholderImages.campaignMurchison.src,
        imageWidth: placeholderImages.campaignMurchison.width,
        imageHeight: placeholderImages.campaignMurchison.height,
        dataAiHint: placeholderImages.campaignMurchison.hint,
        description: 'Discover the dramatic Murchison Falls, where the Nile river explodes through a narrow gorge. The park is home to lions, giraffes, elephants, and vast herds of antelope. A boat trip to the base of the falls is a highlight.',
        storyline: 'Feel the power of nature at the world\'s most powerful waterfall and explore the vast savannah teeming with life.',
        budget: 8000, goal: 100, currentAmount: 88, organizer: 'iffe-travels', tags: ['#Wildlife', '#Waterfalls', '#Uganda'], startDate: '2024-10-05', endDate: '2024-10-10', volunteersNeeded: 10, volunteersSignedUp: 10,
        activities: ['Hike to top of the falls', 'Nile River Boat Safari', 'Game Drives'],
        accommodation: 'Riverside lodges and safari tents with stunning views.',
        meals: 'Full board available, with options for bush breakfasts.',
    },
    // Adding more campaigns from the main page
     {
        id: '4', title: 'Kibale Forest Chimpanzee Trekking',
        shortDescription: 'Trek chimpanzees in the primate capital of East Africa.',
        imageUrl: placeholderImages.campaignKibale.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'chimpanzee forest',
        description: 'Immerse yourself in Kibale Forest, home to the highest concentration of primates in Africa. The main attraction is trekking to find and observe chimpanzees in their natural habitat.',
        storyline: 'An intimate encounter with our closest relatives in the animal kingdom.',
        budget: 12000, goal: 100, currentAmount: 85, organizer: 'iffe-travels', tags: ['#Chimpanzee', '#Primates', '#Uganda'], startDate: '2024-08-10', endDate: '2024-08-13', volunteersNeeded: 6, volunteersSignedUp: 4,
        activities: ['Chimpanzee Trekking', 'Bigodi Wetland Sanctuary Walk', 'Bird Watching'],
        accommodation: 'Forest lodges and camps, some with views of the forest canopy.',
        meals: 'Packages typically include all meals during your stay.'
    },
    {
        id: '5', title: 'Rwenzori Mountains Hiking',
        shortDescription: 'Hike the snow-capped "Mountains of the Moon".',
        imageUrl: placeholderImages.campaignRwenzori.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'rwenzori mountains',
        description: 'Challenge yourself with a trek into the legendary Rwenzori Mountains, a UNESCO World Heritage site. These mist-shrouded peaks offer stunning scenery, unique flora, and a true high-altitude adventure.',
        storyline: 'A journey through different vegetation zones, from tropical rainforest to alpine meadows, culminating in views of equatorial glaciers.',
        budget: 25000, goal: 100, currentAmount: 75, organizer: 'iffe-travels', tags: ['#Hiking', '#Mountains', '#Uganda'], startDate: '2025-01-10', endDate: '2025-01-20', volunteersNeeded: 8, volunteersSignedUp: 2,
        activities: ['Multi-day trekking circuits', 'Acclimatization hikes', 'Summit attempts'],
        accommodation: 'Basic but comfortable mountain huts along the trekking routes.',
        meals: 'All meals on the mountain are prepared by a dedicated trek cook.'
    },
    {
        id: '6', title: 'Relax at Lake Bunyonyi',
        shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.',
        imageUrl: placeholderImages.campaignBunyonyi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'lake bunyonyi',
        description: 'Unwind at the beautiful Lake Bunyonyi, known for its 29 islands and terraced hillsides. It\'s a perfect place to relax after a gorilla trek, with activities like canoeing, swimming, and hiking.',
        storyline: 'A tranquil escape into one of Uganda\'s most picturesque landscapes.',
        budget: 5000, goal: 100, currentAmount: 95, organizer: 'iffe-travels', tags: ['#Relaxation', '#Scenery', '#Uganda'], startDate: '2024-09-05', endDate: '2024-09-08', volunteersNeeded: 15, volunteersSignedUp: 15,
        activities: ['Canoeing', 'Island hopping', 'Swimming', 'Community visits'],
        accommodation: 'A range of lakeside resorts, cottages, and campsites.',
        meals: 'Freshly prepared meals, including local crayfish, a specialty of the lake.'
    },
     {
        id: '7', title: 'Lake Mburo Cycling Safari',
        shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.',
        imageUrl: placeholderImages.campaignMburo.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'zebra safari',
        description: 'Experience a unique cycling safari in Lake Mburo National Park. Ride alongside herds of zebras, impalas, and other wildlife in this beautiful and accessible park.',
        storyline: 'A thrilling and active way to get closer to nature.',
        budget: 6000, goal: 100, currentAmount: 82, organizer: 'iffe-travels', tags: ['#Cycling', '#Zebras', '#Uganda'], startDate: '2024-11-01', endDate: '2024-11-03', volunteersNeeded: 20, volunteersSignedUp: 18,
        activities: ['Guided cycling safaris', 'Walking safaris', 'Boat trips on the lake'],
        accommodation: 'Safari lodges and luxury tented camps.',
        meals: 'All-inclusive packages available.'
    },
    {
        id: '8', title: 'Jinja - Source of the Nile',
        shortDescription: 'Discover the legendary source of the world\'s longest river.',
        imageUrl: placeholderImages.campaignSourceNile.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'source of nile',
        description: 'Visit Jinja, the historic town famous as the source of the River Nile. Take a boat trip to the exact spot where the river begins its long journey to the Mediterranean.',
        storyline: 'Stand at the beginning of one of the world\'s great rivers.',
        budget: 3000, goal: 100, currentAmount: 90, organizer: 'iffe-travels', tags: ['#Jinja', '#RiverNile', '#Uganda'], startDate: '2024-12-01', endDate: '2024-12-02', volunteersNeeded: 30, volunteersSignedUp: 25,
        activities: ['Boat trip to the Source of the Nile', 'Visit local craft markets', 'Explore Jinja town'],
        accommodation: 'Hotels and guesthouses in Jinja.',
        meals: 'Enjoy fresh fish from Lake Victoria.'
    },
    {
        id: '9', title: 'White-Water Rafting in Jinja',
        shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.',
        imageUrl: placeholderImages.campaignRafting.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'white water rafting',
        description: 'Get your adrenaline pumping with a white-water rafting adventure on the powerful rapids of the Nile River near Jinja. Full-day and half-day trips are available for all experience levels.',
        storyline: 'An action-packed day of adventure on one of the world\'s most famous rivers.',
        budget: 4000, goal: 100, currentAmount: 95, organizer: 'iffe-travels', tags: ['#Adventure', '#Jinja', '#Uganda'], startDate: '2024-12-03', endDate: '2024-12-03', volunteersNeeded: 40, volunteersSignedUp: 40,
        activities: ['White-water rafting', 'Kayaking', 'River bugging'],
        accommodation: 'Riverside camps and lodges.',
        meals: 'Includes a BBQ lunch and celebratory drinks after the rafting.'
    },
    {
        id: '10', title: 'Mount Elgon National Park',
        shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.',
        imageUrl: placeholderImages.campaignElgon.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'mount elgon',
        description: 'Hike the slopes of Mount Elgon, an extinct shield volcano. The park offers varied trekking options, from day hikes to multi-day expeditions to the caldera.',
        storyline: 'Explore a unique ecosystem on the slopes of one of Africa\'s largest volcanic bases.',
        budget: 9000, goal: 100, currentAmount: 78, organizer: 'iffe-travels', tags: ['#Hiking', '#Volcano', '#Uganda'], startDate: '2025-02-01', endDate: '2025-02-05', volunteersNeeded: 12, volunteersSignedUp: 7,
        activities: ['Hiking', 'Cave exploration', 'Bird watching'],
        accommodation: 'Guesthouses and campsites near the park entrance.',
        meals: 'Meals provided on multi-day treks.'
    },
    {
        id: '11', title: 'Sipi Falls Adventure',
        shortDescription: 'Explore a series of beautiful waterfalls with coffee tours and hikes.',
        imageUrl: placeholderImages.campaignSipi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'sipi falls',
        description: 'Discover the beauty of Sipi Falls, a series of three stunning waterfalls in eastern Uganda. Enjoy guided hikes, abseiling, and a fascinating tour of a local coffee plantation.',
        storyline: 'A journey into the heart of coffee country, with spectacular waterfall views.',
        budget: 4500, goal: 100, currentAmount: 88, organizer: 'iffe-travels', tags: ['#Waterfalls', '#Coffee', '#Uganda'], startDate: '2024-11-20', endDate: '2024-11-22', volunteersNeeded: 15, volunteersSignedUp: 11,
        activities: ['Waterfall hikes', 'Abseiling', 'Coffee tours'],
        accommodation: 'Lodges and community-run guesthouses with incredible views.',
        meals: 'Taste local dishes and freshly brewed coffee.'
    },
    {
        id: '12', title: 'Busoga Kingdom Cultural Tour',
        shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.',
        imageUrl: placeholderImages.campaignBusoga.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'cultural kingdom',
        description: 'Experience the rich culture of the Busoga Kingdom. Visit royal sites, learn about local traditions, and enjoy cultural performances. A unique insight into the heritage of eastern Uganda.',
        storyline: 'A deep dive into the history and living culture of the Basoga people.',
        budget: 2500, goal: 100, currentAmount: 65, organizer: 'iffe-travels', tags: ['#Culture', '#History', '#Uganda'], startDate: '2024-12-05', endDate: '2024-12-06', volunteersNeeded: 25, volunteersSignedUp: 10,
        activities: ['Visit to the Kyabazinga\'s palace', 'Cultural performances', 'Local craft workshops'],
        accommodation: 'Hotels in Jinja or nearby towns.',
        meals: 'Try traditional Busoga cuisine.'
    },
    {
        id: '13', title: 'Kidepo Valley National Park',
        shortDescription: 'Explore remote, rugged landscapes with unique wildlife.',
        imageUrl: placeholderImages.campaignKidepo.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'kidepo valley',
        description: 'Venture to the remote and wild Kidepo Valley National Park in the far north of Uganda. This park offers a true wilderness experience, with wildlife you won\'t see anywhere else in the country, like cheetahs and ostriches.',
        storyline: 'A journey to one of Africa\'s last great wildernesses.',
        budget: 18000, goal: 100, currentAmount: 70, organizer: 'iffe-travels', tags: ['#Remote', '#Wilderness', '#Uganda'], startDate: '2025-03-10', endDate: '2025-03-15', volunteersNeeded: 8, volunteersSignedUp: 3,
        activities: ['Game drives', 'Cultural visits to Karamojong communities', 'Hiking'],
        accommodation: 'Luxury lodges and basic campsites within the park.',
        meals: 'All-inclusive packages available.'
    },
    {
        id: '14', title: 'Karuma Falls Wildlife Tour',
        shortDescription: 'Spot wildlife near the stunning Karuma Falls on the Nile.',
        imageUrl: placeholderImages.campaignKaruma.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'karuma falls',
        description: 'Visit the impressive Karuma Falls, a cascade of roaring rapids on the Victoria Nile. The area is part of Murchison Falls National Park and is a great place to spot wildlife.',
        storyline: 'Witness the Nile\'s power and the wildlife it attracts.',
        budget: 5500, goal: 100, currentAmount: 85, organizer: 'iffe-travels', tags: ['#Wildlife', '#NationalPark', '#Uganda'], startDate: '2024-10-15', endDate: '2024-10-17', volunteersNeeded: 15, volunteersSignedUp: 10,
        activities: ['Wildlife viewing', 'Visiting the falls', 'Bird watching'],
        accommodation: 'Lodges near the falls.',
        meals: 'Provided by the lodges.'
    },
    {
        id: '15', title: 'Pian Upe Wildlife Reserve',
        shortDescription: 'Discover rare wildlife species in a semi-arid savannah.',
        imageUrl: placeholderImages.campaignPianUpe.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'savannah reserve',
        description: 'Explore one of Uganda\'s lesser-known gems, the Pian Upe Wildlife Reserve. This vast savannah is home to rare species like the roan antelope and offers a secluded safari experience.',
        storyline: 'An off-the-beaten-path adventure for the intrepid traveler.',
        budget: 13000, goal: 100, currentAmount: 60, organizer: 'iffe-travels', tags: ['#RareWildlife', '#Savannah', '#Uganda'], startDate: '2025-04-01', endDate: '2025-04-05', volunteersNeeded: 10, volunteersSignedUp: 2,
        activities: ['Game drives', 'Nature walks', 'Cultural encounters'],
        accommodation: 'Basic camping facilities and nearby guesthouses.',
        meals: 'Basic meals provided on camping trips.'
    },
    {
        id: '16', title: 'Kampala City Tour',
        shortDescription: 'Explore museums, mosques, and cultural centres in Uganda\'s capital.',
        imageUrl: placeholderImages.campaignKampala.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'kampala city',
        description: 'Discover the vibrant capital city of Kampala. Visit historic sites like the Kasubi Tombs, the Gaddafi National Mosque, and the Uganda Museum. Experience the bustling markets and the lively culture of the city.',
        storyline: 'A day in the heart of Uganda.',
        budget: 2000, goal: 100, currentAmount: 91, organizer: 'iffe-travels', tags: ['#CityTour', '#Culture', '#Uganda'], startDate: '2024-11-15', endDate: '2024-11-15', volunteersNeeded: 50, volunteersSignedUp: 45,
        activities: ['Visiting historical sites', 'Shopping in craft markets', 'Trying local street food'],
        accommodation: 'N/A (Day tour)',
        meals: 'Includes a traditional Ugandan lunch.'
    },
    {
        id: '17', title: 'Entebbe Botanical Gardens',
        shortDescription: 'Visit the Wildlife Centre and relax by Lake Victoria.',
        imageUrl: placeholderImages.campaignEntebbe.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'entebbe botanical',
        description: 'Enjoy a relaxing day in Entebbe. Explore the lush Botanical Gardens, visit the Uganda Wildlife Education Centre, and enjoy the shores of Lake Victoria.',
        storyline: 'A peaceful introduction to Uganda\'s nature and wildlife.',
        budget: 1500, goal: 100, currentAmount: 89, organizer: 'iffe-travels', tags: ['#Gardens', '#Relaxation', '#Uganda'], startDate: '2024-11-14', endDate: '2024-11-14', volunteersNeeded: 40, volunteersSignedUp: 30,
        activities: ['Botanical Gardens tour', 'UWEC visit', 'Lunch by Lake Victoria'],
        accommodation: 'N/A (Day tour)',
        meals: 'Includes lunch.'
    },
    {
        id: '18', title: 'Ngamba Island Chimpanzee Sanctuary',
        shortDescription: 'Visit a sanctuary for orphaned chimpanzees on Lake Victoria.',
        imageUrl: placeholderImages.campaignNgamba.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'chimpanzee sanctuary',
        description: 'Take a boat trip on Lake Victoria to Ngamba Island, a sanctuary for rescued and orphaned chimpanzees. Learn about their conservation and watch them during their feeding time.',
        storyline: 'A heartwarming and educational experience supporting chimp conservation.',
        budget: 3500, goal: 100, currentAmount: 94, organizer: 'iffe-travels', tags: ['#Conservation', '#Chimpanzee', '#Uganda'], startDate: '2024-11-16', endDate: '2024-11-16', volunteersNeeded: 20, volunteersSignedUp: 19,
        activities: ['Boat trip on Lake Victoria', 'Chimpanzee viewing', 'Educational talks'],
        accommodation: 'N/A (Day trip)',
        meals: 'Lunch is included.'
    },
    {
        id: '19', title: 'Mabira Forest Zip-Lining',
        shortDescription: 'Experience the thrill of zip-lining through a lush rainforest.',
        imageUrl: placeholderImages.campaignMabira.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'rainforest zip',
        description: 'Soar through the canopy of the ancient Mabira Forest on a thrilling zip-lining adventure. A great day trip from Kampala or Jinja for adventure seekers.',
        storyline: 'See the rainforest from a unique, bird\'s-eye perspective.',
        budget: 2800, goal: 100, currentAmount: 86, organizer: 'iffe-travels', tags: ['#Adventure', '#Forest', '#Uganda'], startDate: '2024-11-17', endDate: '2024-11-17', volunteersNeeded: 25, volunteersSignedUp: 20,
        activities: ['Zip-lining', 'Forest walks', 'Bird watching'],
        accommodation: 'N/A (Day trip)',
        meals: 'Lunch included.'
    },
    {
        id: '20', title: 'Ssese Islands Relaxation',
        shortDescription: 'Unwind on the beautiful beaches of the Ssese Islands.',
        imageUrl: placeholderImages.campaignSsese.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'lake victoria island',
        description: 'Escape to the tranquil Ssese Islands in Lake Victoria. This archipelago of 84 islands is perfect for relaxing on sandy beaches, taking nature walks, and enjoying stunning sunsets.',
        storyline: 'A tropical paradise in the heart of Africa.',
        budget: 6500, goal: 100, currentAmount: 93, organizer: 'iffe-travels', tags: ['#Beach', '#Relaxation', '#Uganda'], startDate: '2024-12-10', endDate: '2024-12-13', volunteersNeeded: 15, volunteersSignedUp: 14,
        activities: ['Beach relaxation', 'Canoeing', 'Fishing', 'Nature walks'],
        accommodation: 'Beachfront resorts and hotels.',
        meals: 'Fresh fish is a specialty.'
    },
    {
        id: '21', title: 'Semuliki National Park',
        shortDescription: 'Discover unique bird species and boiling hot springs.',
        imageUrl: placeholderImages.campaignSemuliki.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'semuliki hot springs',
        description: 'Explore the unique lowland tropical rainforest of Semuliki National Park. It\'s a birdwatcher\'s paradise and home to the amazing Sempaya Hot Springs.',
        storyline: 'A taste of Central African jungle in Uganda.',
        budget: 7500, goal: 100, currentAmount: 77, organizer: 'iffe-travels', tags: ['#BirdWatching', '#HotSprings', '#Uganda'], startDate: '2025-03-01', endDate: '2025-03-04', volunteersNeeded: 10, volunteersSignedUp: 6,
        activities: ['Bird watching', 'Visiting the hot springs', 'Nature walks'],
        accommodation: 'Lodges and campsites near the park.',
        meals: 'Provided by accommodation.'
    },
    {
        id: '22', title: 'Toro Kingdom & Fort Portal',
        shortDescription: 'Explore stunning crater lakes and rich cultural experiences.',
        imageUrl: placeholderImages.campaignFortPortal.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'crater lake',
        description: 'Visit the picturesque town of Fort Portal, the seat of the Toro Kingdom. The area is famous for its stunning crater lakes, offering beautiful scenery and opportunities for hiking and swimming.',
        storyline: 'A blend of natural beauty and cultural heritage.',
        budget: 5000, goal: 100, currentAmount: 81, organizer: 'iffe-travels', tags: ['#Culture', '#Scenery', '#Uganda'], startDate: '2024-11-25', endDate: '2024-11-27', volunteersNeeded: 20, volunteersSignedUp: 15,
        activities: ['Crater lake hikes', 'Visit to the Toro Kingdom palace', 'Amabere ga Nyina Mwiru caves'],
        accommodation: 'A wide range of hotels and lodges in and around Fort Portal.',
        meals: 'Explore local and international cuisine in Fort Portal.'
    },
];

async function getCampaign(id: string): Promise<Campaign | undefined> {
  // Simulate API call
  return mockCampaignsData.find(campaign => campaign.id === id);
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [ref, isVisible] = useScrollAnimation();
  const [formattedEndDate, setFormattedEndDate] = useState('');

  useEffect(() => {
    getCampaign(params.id).then(data => {
        if(data) {
            setCampaign(data);
        } else {
            notFound();
        }
    });
  }, [params.id]);

  useEffect(() => {
    if (campaign?.endDate) {
      // This runs only on the client, after hydration
      setFormattedEndDate(new Date(campaign.endDate).toLocaleDateString())
    }
  }, [campaign?.endDate]);

  if (!campaign) {
    // You might want to show a loader here
    return null;
  }

  return (
    <div ref={ref} className={cn('space-y-8 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tours
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image 
            src={campaign.imageUrl} 
            alt={campaign.title} 
            fill 
            className="object-cover" 
            data-ai-hint={campaign.dataAiHint}
            priority 
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
           <CardTitle className="font-headline text-3xl md:text-4xl text-white absolute bottom-6 left-6 z-10">{campaign.title}</CardTitle>
        </div>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">About this Tour</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.description}</p>
              </section>
              <section>
                <h2 className="font-headline text-2xl font-semibold text-primary mb-2">The Experience</h2>
                <p className="text-muted-foreground leading-relaxed">{campaign.storyline}</p>
              </section>

              <div className="grid sm:grid-cols-2 gap-6">
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><Activity className="mr-2 h-5 w-5"/>Activities</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {campaign.activities.map(activity => <li key={activity}>{activity}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><BedDouble className="mr-2 h-5 w-5"/>Accommodation</h3>
                  <p className="text-muted-foreground">{campaign.accommodation}</p>
                </section>
              </div>

               <section>
                <h3 className="font-headline text-xl font-semibold text-primary mb-3 flex items-center"><UtensilsCrossed className="mr-2 h-5 w-5"/>Meals</h3>
                <p className="text-muted-foreground">{campaign.meals}</p>
              </section>
              
              {campaign.tags && campaign.tags.length > 0 && (
                <section>
                   <h3 className="font-headline text-lg font-semibold text-primary mb-2">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="secondary"><Tag className="h-3 w-3 mr-1" />{tag.replace('#', '')}</Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <aside className="space-y-6 md:sticky md:top-24">
              <CampaignActionsCard
                campaignTitle={campaign.title}
                currentAmount={campaign.currentAmount}
                goal={campaign.goal}
                endDate={formattedEndDate}
                volunteersSignedUp={campaign.volunteersSignedUp}
                volunteersNeeded={campaign.volunteersNeeded}
              />
              <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center"><Compass className="mr-2 h-5 w-5"/>Tour Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-semibold">{campaign.organizer}</p>
                  <p className="text-xs text-muted-foreground">We are committed to responsible and authentic travel experiences.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
          
          <Summarizer campaignDescription={campaign.description} campaignTitle={campaign.title} />

        </CardContent>
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Reviews (32)</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={`/campaigns/${campaign.id}/updates`}>
              View Full Itinerary <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
