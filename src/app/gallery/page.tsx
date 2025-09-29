
import { generateImage } from '@/ai/flows/generate-image-flow';
import GalleryClientContent from '@/components/gallery/gallery-client-content';
import placeholderImages from '@/app/lib/placeholder-images.json';

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

async function processInitialImages(images: GalleryImage[]): Promise<GalleryImage[]> {
    const processedImages = await Promise.all(
      images.map(async (image) => {
        try {
          if (image.dataAiHint) {
            const { imageDataUri } = await generateImage({ prompt: image.dataAiHint });
            return { ...image, src: imageDataUri };
          }
        } catch (error) {
          console.error(`Failed to generate image for hint: "${image.dataAiHint}". Falling back to placeholder.`, error);
        }
        return image; // Return original image on error or if no hint
      })
    );
    return processedImages;
}

export default async function GalleryPage() {
  const processedGalleryImages = await processInitialImages(initialMockGalleryImages);

  return (
    <div className="animate-fade-in">
        <GalleryClientContent initialImages={processedGalleryImages} />
    </div>
  );
}
