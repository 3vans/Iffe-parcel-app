
'use client';

import { notFound, useParams } from 'next/navigation';
import CampaignDetailClientPage from './client-page';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { getCampaignById, fetchCampaigns } from '@/lib/services/cms-service';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ campaign: any, relatedTours: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const campaign = await getCampaignById(id as string);
        if (!campaign) {
            setData(null);
            return;
        }

        // Apply defaults only if data is explicitly missing to ensure Admin edits are respected
        const enrichedCampaign = {
            ...campaign,
            storyline: (campaign.storyline && campaign.storyline.length > 0) ? campaign.storyline : [
                "Experience the raw beauty of " + (campaign.region || "this region") + " Uganda.",
                "Our expert guides ensure an authentic and safe journey.",
                "Connect with nature and local communities in a meaningful way."
            ],
            organizer: campaign.organizer || 'iffe-travels',
            volunteersNeeded: campaign.volunteersNeeded || 10,
            volunteersSignedUp: campaign.volunteersSignedUp || 0,
            activities: (campaign.activities && campaign.activities.length > 0) ? campaign.activities : defaultActivities,
            accommodation: (campaign.accommodation && campaign.accommodation.length > 0) ? campaign.accommodation : defaultAccommodation,
            meals: (campaign.meals && campaign.meals.length > 0) ? campaign.meals : defaultMeals,
            imageWidth: 1200,
            imageHeight: 600,
        };

        const allCampaigns = await fetchCampaigns();
        const related = allCampaigns
            .filter(c => c.id !== id && c.tags?.some(tag => campaign.tags?.includes(tag)))
            .slice(0, 3)
            .map(c => ({ id: c.id, title: c.title }));

        setData({ campaign: enrichedCampaign, relatedTours: related });
      } catch (err) {
        console.error("Load campaign detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Opening Expedition...</p>
        </div>
    );
  }

  if (!data?.campaign) {
    notFound();
  }

  return <CampaignDetailClientPage campaign={data.campaign as any} relatedTours={data.relatedTours} />;
}
