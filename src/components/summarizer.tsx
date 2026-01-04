
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface SummarizerProps {
  campaignDescription: string;
  campaignTitle: string;
}

const Summarizer: React.FC<SummarizerProps> = ({ campaignDescription, campaignTitle }) => {

  const bookingTips = [
    "Book permits well in advance, especially for gorilla and chimp trekking, as they sell out months ahead.",
    "Consider the season. The dry seasons (June-August and December-February) are best for wildlife viewing.",
    "Pack light, versatile clothing. Include layers for cool mornings and evenings.",
    "Don't forget essentials like sunscreen, insect repellent, a good hat, and comfortable walking shoes.",
    "Talk to us about your interests! We can customize any itinerary to match your dream adventure."
  ];

  return (
    <Card className="mt-8 shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Info className="mr-2 h-6 w-6 text-accent" />
          Tips for Booking
        </CardTitle>
        <CardDescription>Essential advice for planning your perfect trip.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/50 rounded-md border border-border">
            <ul className="space-y-3 text-sm text-foreground">
                {bookingTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                        <Info className="h-4 w-4 mr-3 mt-0.5 text-accent shrink-0" />
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summarizer;
