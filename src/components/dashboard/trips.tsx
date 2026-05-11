'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Mountain, Calendar, ArrowRight, Loader2, Compass } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchUserBookings } from '@/lib/services/cms-service';

export default function DashboardTrips() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await fetchUserBookings(user.uid);
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mountain className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-headline font-black text-primary uppercase">My Safari Adventures</h2>
      </div>

      <div className="space-y-4">
        {bookings.map(booking => {
          const progress = booking.status === 'confirmed' ? 100 : booking.status === 'pending' ? 50 : 20;
          return (
            <Card key={booking.id} className="transition-all duration-300 hover:shadow-md border-primary/5">
                <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                    <CardTitle className="text-xl font-bold text-primary mb-1">
                        {booking.basePackage || 'Custom Safari Package'}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs">
                        <Calendar className="w-3 h-3 mr-1" /> Requested on {booking.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                    </CardDescription>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={cn(
                    "uppercase text-[10px] px-2",
                    booking.status === 'confirmed' ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"
                    )}>
                    {booking.status || 'Processing'}
                    </Badge>
                </div>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                        <div className="bg-muted/30 p-2 rounded-lg">
                            <span className="text-stone-500 font-bold uppercase block mb-1">Group Size</span>
                            <span className="font-black text-primary">{booking.groupSize} People</span>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg">
                            <span className="text-stone-500 font-bold uppercase block mb-1">Price Tier</span>
                            <span className="font-black text-primary capitalize">{booking.pricing?.tier || 'Standard'}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>Planning Progress</span>
                        <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{booking.selectedAddons?.length || 0} Custom Add-ons</span>
                <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent font-bold">
                    <Link href="/contact">Inquire about Status <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
                </CardFooter>
            </Card>
          );
        })}

        {bookings.length === 0 && (
          <div className="p-12 text-center bg-muted/30 rounded-[2rem] border-2 border-dashed border-primary/5">
            <Compass className="h-12 w-12 mx-auto mb-4 text-primary/20" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-4">Your passport is empty!</p>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">Start planning your dream African safari today with our bespoke builder.</p>
            <Button className="bg-primary hover:bg-primary/90 px-8 rounded-full font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20" asChild>
              <Link href="/packages#custom-builder">Launch Safari Builder</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
