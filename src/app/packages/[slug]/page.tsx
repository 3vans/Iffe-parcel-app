
import { notFound } from 'next/navigation';
import packagesData from '@/app/lib/packages-data.json';
import ComboPackageClientPage from './client-page';
import placeholderImages from '@/app/lib/placeholder-images.json';

// Duplicating this data structure for server-side fetching.
// In a real app, this would come from a shared lib/service.
const mockCampaignsData = [
  // Western Uganda
  { id: '1', title: 'Bwindi Gorilla Trekking', imageUrl: placeholderImages.campaignBwindi.src, dataAiHint: 'bwindi forest', shortDescription: 'World-famous gorilla trekking in a UNESCO World Heritage site.', tags: ['#Gorilla', '#UNESCO'], region: 'Western' },
  { id: '2', title: 'Queen Elizabeth National Park', imageUrl: placeholderImages.campaignQueenElizabeth.src, dataAiHint: 'tree climbing lion', shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.', tags: ['#Wildlife', '#Lions'], region: 'Western' },
  { id: '3', title: 'Murchison Falls Safari', imageUrl: placeholderImages.campaignMurchison.src, dataAiHint: 'murchison falls', shortDescription: 'See the powerful falls and diverse wildlife of Murchison.', tags: ['#Wildlife', '#Waterfalls'], region: 'Western' },
  { id: '4', title: 'Kibale Forest Chimpanzee Trekking', imageUrl: placeholderImages.campaignKibale.src, dataAiHint: 'chimpanzee forest', shortDescription: 'Trek chimpanzees in the primate capital of East Africa.', tags: ['#Chimpanzee', '#Primates'], region: 'Western' },
  { id: '5', title: 'Rwenzori Mountains Hiking', imageUrl: placeholderImages.campaignRwenzori.src, dataAiHint: 'rwenzori mountains', shortDescription: 'Hike the snow-capped "Mountains of the Moon".', tags: ['#Hiking', '#Mountains'], region: 'Western' },
  { id: '6', title: 'Relax at Lake Bunyonyi', imageUrl: placeholderImages.campaignBunyonyi.src, dataAiHint: 'lake bunyonyi', shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.', tags: ['#Relaxation', '#Scenery'], region: 'Western' },
  { id: '7', title: 'Lake Mburo Cycling Safari', imageUrl: placeholderImages.campaignMburo.src, dataAiHint: 'zebra safari', shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.', tags: ['#Cycling', '#Zebras'], region: 'Western' },
  // Eastern Uganda
  { id: '8', title: 'Jinja - Source of the Nile', imageUrl: placeholderImages.campaignSourceNile.src, dataAiHint: 'source of nile', shortDescription: 'Discover the legendary source of the world\'s longest river.', tags: ['#Jinja', '#RiverNile'], region: 'Eastern' },
  { id: '9', title: 'White-Water Rafting in Jinja', imageUrl: placeholderImages.campaignRafting.src, dataAiHint: 'white water rafting', shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.', tags: ['#Adventure', '#Jinja'], region: 'Eastern' },
  { id: '10', title: 'Mount Elgon National Park', imageUrl: placeholderImages.campaignElgon.src, dataAiHint: 'mount elgon', shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.', tags: ['#Hiking', '#Volcano'], region: 'Eastern' },
  { id: '11', title: 'Sipi Falls Adventure', imageUrl: placeholderImages.campaignSipi.src, dataAiHint: 'sipi falls', shortDescription: 'Explore a series of beautiful waterfalls with coffee tours and hikes.', tags: ['#Waterfalls', '#Coffee'], region: 'Eastern' },
  { id: '12', title: 'Busoga Kingdom Cultural Tour', imageUrl: placeholderImages.campaignBusoga.src, dataAiHint: 'cultural kingdom', shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.', tags: ['#Culture', '#History'], region: 'Eastern' },
  // Northern Uganda
  { id: '13', title: 'Kidepo Valley National Park', imageUrl: placeholderImages.campaignKidepo.src, dataAiHint: 'kidepo valley', shortDescription: 'Explore remote, rugged landscapes with unique wildlife.', tags: ['#Remote', '#Wilderness'], region: 'Northern' },
  { id: '14', title: 'Karuma Falls Wildlife Tour', imageUrl: placeholderImages.campaignKaruma.src, dataAiHint: 'karuma falls', shortDescription: 'Spot wildlife near the stunning Karuma Falls on the Nile.', tags: ['#Wildlife', '#NationalPark'], region: 'Northern' },
  { id: '15', title: 'Pian Upe Wildlife Reserve', imageUrl: placeholderImages.campaignPianUpe.src, dataAiHint: 'savannah reserve', shortDescription: 'Discover rare wildlife species in a semi-arid savannah.', tags: ['#RareWildlife', '#Savannah'], region: 'Northern' },
  // Central Uganda
  { id: '16', title: 'Kampala City Tour', imageUrl: placeholderImages.campaignKampala.src, dataAiHint: 'kampala city', shortDescription: 'Explore museums, mosques, and cultural centres in Uganda\'s capital.', tags: ['#CityTour', '#Culture'], region: 'Central' },
  { id: '17', title: 'Entebbe Botanical Gardens', imageUrl: placeholderImages.campaignEntebbe.src, dataAiHint: 'entebbe botanical', shortDescription: 'Visit the Wildlife Centre and relax by Lake Victoria.', tags: ['#Gardens', '#Relaxation'], region: 'Central' },
  { id: '18', title: 'Ngamba Island Chimpanzee Sanctuary', imageUrl: placeholderImages.campaignNgamba.src, dataAiHint: 'chimpanzee sanctuary', shortDescription: 'Visit a sanctuary for orphaned chimpanzees on Lake Victoria.', tags: ['#Conservation', '#Chimpanzee'], region: 'Central' },
  { id: '19', title: 'Mabira Forest Zip-Lining', imageUrl: placeholderImages.campaignMabira.src, dataAiHint: 'rainforest zip', shortDescription: 'Experience the thrill of zip-lining through a lush rainforest.', tags: ['#Adventure', '#Forest'], region: 'Central' },
  { id: '20', title: 'Ssese Islands Relaxation', imageUrl: placeholderImages.campaignSsese.src, dataAiHint: 'lake victoria island', shortDescription: 'Unwind on the beautiful beaches of the Ssese Islands.', tags: ['#Beach', '#Relaxation'], region: 'Central' },
  // Other Areas
  { id: '21', title: 'Semuliki National Park', imageUrl: placeholderImages.campaignSemuliki.src, dataAiHint: 'semuliki hot springs', shortDescription: 'Discover unique bird species and boiling hot springs.', tags: ['#BirdWatching', '#HotSprings'], region: 'Other' },
  { id: '22', title: 'Toro Kingdom & Fort Portal', imageUrl: placeholderImages.campaignFortPortal.src, dataAiHint: 'crater lake', shortDescription: 'Explore stunning crater lakes and rich cultural experiences.', tags: ['#Culture', '#Scenery'], region: 'Other' },
];


interface CampaignTeaser {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  shortDescription: string;
}

async function getPackageDetails(slug: string) {
    const pkg = packagesData.find(p => p.slug === slug);
    if (!pkg) {
        return null;
    }

    const includedTours = pkg.includedTours
        .map(tourId => {
            const tour = mockCampaignsData.find(t => t.id === tourId);
            if (!tour) return null;
            return {
                id: tour.id,
                title: tour.title,
                shortDescription: tour.shortDescription,
                imageUrl: placeholderImages[tour.imageUrl as keyof typeof placeholderImages]?.src || '',
                dataAiHint: placeholderImages[tour.imageUrl as keyof typeof placeholderImages]?.hint || '',
            };
        })
        .filter((tour): tour is NonNullable<typeof tour> => tour !== null);

    const heroImage = placeholderImages[pkg.imageUrl as keyof typeof placeholderImages];

    return { ...pkg, includedTours, heroImage };
}


export default async function ComboPackagePage({ params }: { params: { slug: string } }) {
  const packageDetails = await getPackageDetails(params.slug);

  if (!packageDetails) {
    notFound();
  }

  return <ComboPackageClientPage packageDetails={packageDetails} />;
}
