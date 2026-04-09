
import { notFound } from 'next/navigation';
import ComboPackageClientPage from './client-page';
import { getPackageBySlug, getCampaignById, type Package, type Campaign } from '@/lib/services/cms-service';

async function getDetailedPackage(slug: string) {
    // Fetch live package data from Firestore
    const pkg = await getPackageBySlug(slug);
    if (!pkg) return null;

    // Fetch details for included tours if IDs exist
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

    return {
        ...pkg,
        includedTours: includedTours.filter(t => t !== null),
        heroImage: {
            src: pkg.imageUrl,
            hint: pkg.dataAiHint
        }
    };
}

export default async function ComboPackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const packageDetails = await getDetailedPackage(slug);

  if (!packageDetails) {
    notFound();
  }

  return <ComboPackageClientPage packageDetails={packageDetails as any} />;
}
