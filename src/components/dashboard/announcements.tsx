'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Loader2, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchAnnouncements, type Announcement } from '@/lib/services/cms-service';

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-headline font-black text-primary uppercase">Announcements</h2>
      </div>
      
      {announcements.length > 0 ? (
        announcements.map((item) => (
          <Card key={item.id} className={cn(
            "transition-all duration-300 border-l-4 hover:shadow-md rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm",
            item.priority === 'high' ? "border-l-red-500" : "border-l-accent"
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-primary font-headline uppercase tracking-tight">{item.title}</CardTitle>
                <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="uppercase text-[10px] font-black tracking-widest px-2">
                  {item.priority || 'Medium'} Priority
                </Badge>
              </div>
              <CardDescription className="flex items-center text-[10px] uppercase font-bold text-stone-500 mt-1">
                <Calendar className="w-3 h-3 mr-1" /> Posted on {item.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">{item.content}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-muted/30 border-dashed border-2 rounded-[2rem] border-primary/5">
          <CardContent className="p-16 text-center">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-stone-300" />
            <p className="text-stone-400 font-bold uppercase tracking-widest text-sm">No announcements at this time.</p>
            <p className="text-xs text-stone-400 mt-2">We'll notify you here about new tours and special offers.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
