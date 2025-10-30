
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, HeartHandshake, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CampaignActionsCardProps {
  campaignTitle: string;
  currentAmount: number;
  goal: number;
  endDate: string;
  volunteersSignedUp: number;
  volunteersNeeded: number;
}

export default function CampaignActionsCard({
  campaignTitle,
  currentAmount,
  goal,
  endDate,
  volunteersSignedUp,
  volunteersNeeded,
}: CampaignActionsCardProps) {
  const { toast } = useToast();
  const [formattedEndDate, setFormattedEndDate] = useState(endDate);

  useEffect(() => {
      if(endDate) {
          setFormattedEndDate(new Date(endDate).toLocaleDateString());
      }
  }, [endDate]);

  const progressPercentage = goal > 0 ? (currentAmount / goal) * 100 : 0;
  const spotsLeft = volunteersNeeded - volunteersSignedUp;

  const handleBookNow = () => {
    toast({
      title: "Booking Initiated (Simulated)",
      description: `Thank you for your interest in booking the "${campaignTitle}" tour! This feature is currently in development.`,
      variant: "default",
    });
  };

  const handleInquire = () => {
    toast({
      title: "Inquiry Sent (Simulated)",
      description: `Your inquiry about the "${campaignTitle}" tour has been noted. Our team will contact you shortly.`,
      variant: "default",
    });
  };

  return (
    <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Tour Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-400"/> {currentAmount / 10}/10 Rating</span>
        </div>
        <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% traveller rating`} />
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-accent" />
          <span>Tour Dates: {formattedEndDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-accent" />
          <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Tour Full'}</span>
        </div>
        <Button 
          className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleBookNow}
          disabled={spotsLeft <= 0}
        >
          <HeartHandshake className="mr-2 h-5 w-5" /> {spotsLeft > 0 ? 'Book Now' : 'Tour Full'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleInquire}
        >
          <Users className="mr-2 h-5 w-5" /> Inquire
        </Button>
      </CardContent>
    </Card>
  );
}
