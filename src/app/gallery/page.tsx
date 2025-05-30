
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

const mockGalleryImages: GalleryImage[] = [
  { id: 'g1', src: 'https://placehold.co/600x400.png', alt: 'Rotary event attendees', dataAiHint: 'community event', caption: 'Annual Community Gala 2023', date: 'Oct 20, 2023', tags: ['#Events', '#Community'] },
  { id: 'g2', src: 'https://placehold.co/400x600.png', alt: 'Volunteers planting trees', dataAiHint: 'volunteers nature', caption: 'Reforestation Drive Day 1', date: 'Nov 05, 2023', tags: ['#Campaigns', '#Environment'] },
  { id: 'g3', src: 'https://placehold.co/600x600.png', alt: 'Children receiving books', dataAiHint: 'children education', caption: 'Literacy Campaign Success', date: 'Sep 15, 2023', tags: ['#Campaigns', '#Education', '#Community'] },
  { id: 'g4', src: 'https://placehold.co/600x450.png', alt: 'Rotaract members meeting', dataAiHint: 'meeting discussion', caption: 'Club Planning Session', date: 'Nov 10, 2023', tags: ['#Events', '#Internal'] },
  { id: 'g5', src: 'https://placehold.co/450x600.png', alt: 'Water project inauguration', dataAiHint: 'water project', caption: 'Clean Water Project Launch', date: 'Aug 01, 2023', tags: ['#Campaigns', '#Health'] },
  { id: 'g6', src: 'https://placehold.co/600x400.png', alt: 'Youth leadership workshop', dataAiHint: 'youth workshop', caption: 'Youth Leadership Training', date: 'Oct 28, 2023', tags: ['#Events', '#Training'] },
];

const availableTags = ['#Events', '#Campaigns', '#Community', '#Environment', '#Education', '#Health', '#Internal', '#Training'];

export default function GalleryPage() {
  // TODO: Implement actual filtering logic
  // TODO: Implement actual upload logic (admin/community members only)

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">Image Gallery</h1>
        <p className="text-lg text-muted-foreground">Moments from our campaigns, events, and community activities.</p>
      </section>

      <section className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2 self-center">Filter by Tag:</span>
          {availableTags.map(tag => (
            <Button key={tag} variant="outline" size="sm" className="hover:bg-accent/10 hover:border-accent hover:text-accent">
              <Tag className="h-3 w-3 mr-1.5" /> {tag.replace('#','')}
            </Button>
          ))}
        </div>
        <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
          <UploadCloud className="mr-2 h-5 w-5" /> Upload Media (Admin/Community)
        </Button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockGalleryImages.map(image => (
          <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
            <div className="relative w-full aspect-[3/2] group-hover:opacity-90 transition-opacity">
              <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" data-ai-hint={image.dataAiHint} />
            </div>
            <CardHeader className="p-4">
              {image.caption && <CardTitle className="text-base font-semibold line-clamp-1">{image.caption}</CardTitle>}
              {image.date && <CardDescription className="text-xs">{image.date}</CardDescription>}
            </CardHeader>
            {image.tags.length > 0 && (
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                       {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </section>

      {mockGalleryImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The gallery is empty. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
