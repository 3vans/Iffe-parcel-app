
'use client';

import { notFound, useParams } from 'next/navigation';
import ComboPackageClientPage from './client-page';
import { getPackageBySlug, getCampaignById } from '@/lib/services/cms-service';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ComboPackagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const pkg = await getPackageBySlug(slug);
        if (!pkg) {
            setPackageDetails(null);
            return;
        }

        const includedTours = await Promise.all(
            (pkg.includedTours || []).map(async (tourId) => {
                const tour = await getCampaignById(tourId);
                if (!tour) return null;
                return {
                    id: tour.id,
                    title: tour.title,
                    shortDescription: tour.shortDescription,
                    imageUrl: tour.imageUrl,
                    dataAiHint: tour.dataAiHint,
                };
            })
        );

        setPackageDetails({
            ...pkg,
            includedTours: includedTours.filter(t => t !== null),
            heroImage: {
                src: pkg.imageUrl,
                hint: pkg.dataAiHint
            }
        });
      } catch (err) {
        console.error("Load package detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Opening Package...</p>
        </div>
    );
  }

  if (!packageDetails) {
    notFound();
  }

  return <ComboPackageClientPage packageDetails={packageDetails as any} />;
}
