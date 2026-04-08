import { notFound } from 'next/navigation';
import CampaignDetailClientPage from './client-page';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { getCampaignById, fetchCampaigns, type Campaign } from '@/lib/services/cms-service';

export interface RelatedTour {
  id: string;
  title: string;
}

const defaultActivities = [
    { title: 'Wild Game Drives', description: 'Search for lions, elephants, and other plains game across open savannahs.', image: 'galleryLioness' },
    { title: 'Community Visits', description: 'Experience authentic local culture and support nearby communities.', image: 'ideaFamilySafari' },
    { title: 'Bird Watching', description: 'Explore habitats home to hundreds of endemic and migratory bird species.', image: 'blogShoebill' }
];

const defaultAccommodation = [
    { title: 'Eco-Lodges', description: 'Sustainable comfort set deep within nature.', image: 'pkgAdventurer' },
    { title: 'Mid-Range Tents', description: 'The perfect blend of adventure and convenience.', image: 'pkgUltimate' },
    { title: 'Premium Lodges', description: 'Exceptional service and views for a high-end experience.', image: 'pkgExplorer' }
];

const defaultMeals = [
    { title: 'Full Board', description: 'Gourmet breakfast, lunch, and dinner included.', image: 'videoThumbTestimonial' },
    { title: 'Bush Dining', description: 'Unique meals served under the open African sky.', image: 'ideaFamilySafari' }
];

async function getDetailedCampaign(id: string): Promise<{ campaign: Campaign | undefined; relatedTours: RelatedTour[] }> {
    // 1. Fetch the campaign from the campaigns_public collection
    const campaign = await getCampaignById(id);
    
    if (!campaign) return { campaign: undefined, relatedTours: [] };

    // 2. Enrich the data with defaults for missing CMS fields to ensure a rich UI
    const enrichedCampaign = {
        ...campaign,
        storyline: campaign.storyline || [
            "Experience the raw beauty of " + (campaign.region || "this region") + " Uganda.",
            "Our expert guides ensure an authentic and safe journey.",
            "Connect with nature and local communities in a meaningful way."
        ],
        organizer: campaign.organizer || 'iffe-travels',
        volunteersNeeded: campaign.volunteersNeeded || 10,
        volunteersSignedUp: campaign.volunteersSignedUp || 0,
        activities: campaign.activities || defaultActivities,
        accommodation: campaign.accommodation || defaultAccommodation,
        meals: campaign.meals || defaultMeals,
        imageWidth: 1200,
        imageHeight: 600,
    };

    // 3. Fetch related tours for the sidebar
    const allCampaigns = await fetchCampaigns();
    const related = allCampaigns
        .filter(c => c.id !== id && c.tags?.some(tag => campaign.tags?.includes(tag)))
        .slice(0, 3)
        .map(c => ({ id: c.id, title: c.title }));

    return { campaign: enrichedCampaign as any, relatedTours: related };
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { campaign, relatedTours } = await getDetailedCampaign(id);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetailClientPage campaign={campaign as any} relatedTours={relatedTours} />;
}
