
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import HeroSection from "@/components/layout/hero-section";
import placeholderImages from '@/app/lib/placeholder-images.json';

export default function AboutPage() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div className="space-y-8">
       <HeroSection
        title="About iffe-travels"
        subtitle="Your adventure into the wild begins with a story."
        iconName="Info"
        imageUrl={placeholderImages.gallerySafariGroup.src}
        dataAiHint={placeholderImages.gallerySafariGroup.hint}
      />
      <div ref={ref} className={cn('container mx-auto max-w-3xl py-8 px-4 scroll-animate', isVisible && 'scroll-animate-in')}>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
             <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
              <Globe className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to iffe-travels! This is a placeholder page for your "About Us" content.
            </p>
            <p>
              Here, you can share your story, your mission, and what makes your travel company unique. Talk about your commitment to ethical tourism, your experienced guides, and the unforgettable adventures you offer.
            </p>
            <p>
              You can easily edit this content by opening the file at <code className="font-code bg-muted px-1 py-0.5 rounded text-sm">src/app/about/page.tsx</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
