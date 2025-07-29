
import { generateImage } from '@/ai/flows/generate-image-flow';
import GalleryClientContent from '@/components/gallery/gallery-client-content';

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
  { id: 'g1', src: 'https://placehold.co/600x400.png', alt: 'Safari group photo', dataAiHint: 'safari group sunset', caption: 'Sundowners in the Maasai Mara', date: 'Oct 20, 2023', tags: ['#Sunsets', '#Kenya'] },
  { id: 'g2', src: 'https://placehold.co/400x600.png', alt: 'Elephant by a river', dataAiHint: 'elephant river', caption: 'Gentle Giant at Chobe River', date: 'Nov 05, 2023', tags: ['#Elephants', '#Botswana'] },
  { id: 'g3', src: 'https://placehold.co/600x600.png', alt: 'Lioness with cubs', dataAiHint: 'lioness cubs', caption: 'A Mother\'s Pride', date: 'Sep 15, 2023', tags: ['#BigCats', '#Tanzania', '#Cute'] },
  { id: 'g4', src: 'https://placehold.co/600x450.png', alt: 'Hot air balloon over plains', dataAiHint: 'safari balloon', caption: 'Sunrise over the Serengeti', date: 'Nov 10, 2023', tags: ['#Balloons', '#UniqueView'] },
  { id: 'g5', src: 'https://placehold.co/450x600.png', alt: 'Giraffe silhouetted at sunset', dataAiHint: 'giraffe sunset', caption: 'Long Goodbye to the Day', date: 'Aug 01, 2023', tags: ['#Sunsets', '#Giraffes'] },
  { id: 'g6', src: 'https://placehold.co/600x400.png', alt: 'Gorilla in the mist', dataAiHint: 'gorilla mist', caption: 'Encounter in Bwindi', date: 'Oct 28, 2023', tags: ['#Gorillas', '#Uganda'] },
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

  return <GalleryClientContent initialImages={processedGalleryImages} />;
}
