
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, HeartHandshake, Star, Info, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
          try {
            setFormattedEndDate(new Date(endDate).toLocaleDateString());
          } catch (e) {
            setFormattedEndDate(endDate);
          }
      }
  }, [endDate]);

  const rating = currentAmount || 0;
  const totalNeeded = volunteersNeeded || 10;
  const currentJoined = volunteersSignedUp || 0;
  const spotsLeft = Math.max(0, totalNeeded - currentJoined);
  const availabilityPercent = Math.min(100, (currentJoined / totalNeeded) * 100);

  const handleBookNow = () => {
    toast({
      title: "Interest Noted!",
      description: `We've recorded your interest in the "${campaignTitle}" tour. Our team will contact you.`,
      variant: "default",
    });
  };

  return (
    <Card className="bg-muted/30 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Expedition Status</CardTitle>
        <CardDescription>Real-time availability and logistics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Traveller Rating</p>
                    <div className="flex items-center gap-1 text-2xl font-black text-primary">
                        <Star className="h-5 w-5 text-accent fill-accent" />
                        {rating}%
                    </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase text-stone-400">Verified</Badge>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Group Capacity</span>
                    <span>{currentJoined} / {totalNeeded} Joined</span>
                </div>
                <Progress value={availabilityPercent} className="h-2" />
                <p className="text-xs font-bold text-accent text-right">
                    {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Expedition Full'}
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white">
                <CalendarDays className="h-5 w-5 text-accent shrink-0" />
                <div>
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">Target Date</p>
                    <p className="text-xs font-bold text-primary">{formattedEndDate || 'TBD'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white">
                <LayoutList className="h-5 w-5 text-accent shrink-0" />
                <div>
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-xs font-bold text-primary">Booking Open</p>
                </div>
            </div>
        </div>

        <Button 
            className="w-full h-14 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-widest shadow-lg shadow-accent/20"
            onClick={handleBookNow}
        >
            <HeartHandshake className="mr-2 h-5 w-5" /> Reserve My Spot
        </Button>
      </CardContent>
       <CardFooter className="bg-muted/20 py-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed text-center w-full italic">
            * Final itinerary and logistics are confirmed 30 days prior to departure.
          </p>
      </CardFooter>
    </Card>
  );
}
