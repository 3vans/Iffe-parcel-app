

import GalleryClientContent from '@/components/gallery/gallery-client-content';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define the type here for server-side processing
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

const initialMockGalleryImages: GalleryImage[] = [
  { id: 'g1', ...placeholderImages.gallerySafariGroup, alt: 'Safari group photo', caption: 'Sundowners in the Maasai Mara', date: 'Oct 20, 2023', tags: ['#Sunsets', '#Kenya'] },
  { id: 'g2', ...placeholderImages.galleryElephant, alt: 'Elephant by a river', caption: 'Gentle Giant at Chobe River', date: 'Nov 05, 2023', tags: ['#Elephants', '#Botswana'] },
  { id: 'g3', ...placeholderImages.galleryLioness, alt: 'Lioness with cubs', caption: 'A Mother\'s Pride', date: 'Sep 15, 2023', tags: ['#BigCats', '#Tanzania', '#Cute'] },
  { id: 'g4', ...placeholderImages.galleryBalloon, alt: 'Hot air balloon over plains', caption: 'Sunrise over the Serengeti', date: 'Nov 10, 2023', tags: ['#Balloons', '#UniqueView'] },
  { id: 'g5', ...placeholderImages.galleryGiraffe, alt: 'Giraffe silhouetted at sunset', caption: 'Long Goodbye to the Day', date: 'Aug 01, 2023', tags: ['#Sunsets', '#Giraffes'] },
  { id: 'g6', ...placeholderImages.galleryGorilla, alt: 'Gorilla in the mist', caption: 'Encounter in Bwindi', date: 'Oct 28, 2023', tags: ['#Gorillas', '#Uganda'] },
];

export default async function GalleryPage() {
  // Directly use initial images without server-side processing
  const processedGalleryImages = initialMockGalleryImages;
  const heroImage = placeholderImages.gallerySafariGroup.src;
  const heroDataAiHint = placeholderImages.gallerySafariGroup.hint;

  return (
    <div className="space-y-8 animate-fade-in">
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg flex items-center">
            <img
                src={heroImage}
                alt="Safari Gallery"
                className="absolute inset-0 w-full h-full object-cover z-0"
                data-ai-hint={heroDataAiHint}
            />
            <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
            
            <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
                <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
                  <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">FROM THE WILD</p>
                  <h1 className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest" style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>
                    Safari Gallery
                     <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-md mb-8">
                    Moments from our tours, captured by guides and travelers.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                     <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                       <Link href="/gallery#upload">
                         Share Your Photos
                       </Link>
                     </Button>
                     <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
                        <Link href="/contact">
                            Contact Us
                        </Link>
                     </Button>
                  </div>
                </div>
            </div>
        </section>
        <GalleryClientContent initialImages={processedGalleryImages} />
    </div>
  );
}
