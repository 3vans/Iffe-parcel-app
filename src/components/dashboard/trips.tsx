'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Mountain, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const joinedCampaigns = [
  { id: '1', title: 'Serengeti Great Migration', status: 'Booked', progress: 100, role: 'Upcoming Traveler', date: 'July 15, 2024' },
  { id: '3', title: 'Okavango Delta Mokoro Trip', status: 'Completed', progress: 100, role: 'Past Traveler', date: 'Dec 10, 2023' },
];

export default function DashboardTrips() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mountain className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-headline font-black text-primary uppercase">My Safari Adventures</h2>
      </div>

      <div className="space-y-4">
        {joinedCampaigns.map(campaign => (
          <Card key={campaign.id} className="transition-all duration-300 hover:shadow-md border-primary/5">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-primary mb-1">
                    {campaign.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Calendar className="w-3 h-3 mr-1" /> Planned for {campaign.date}
                  </CardDescription>
                </div>
                <Badge variant={campaign.status === 'Completed' ? 'secondary' : 'default'} className={cn(
                  "uppercase text-[10px] px-2",
                  campaign.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Itinerary Progress</span>
                  <span>{campaign.progress}%</span>
                </div>
                <Progress value={campaign.progress} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{campaign.role}</span>
              <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent font-bold">
                <Link href={`/campaigns/${campaign.id}`}>View Full Details <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {joinedCampaigns.length === 0 && (
          <div className="p-12 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground font-medium">Your passport is empty! Time to plan a new journey.</p>
            <Button className="mt-4 bg-primary" asChild>
              <Link href="/campaigns">Explore All Tours</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
