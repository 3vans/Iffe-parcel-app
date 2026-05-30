'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ListPlus, Trash2, SettingsIcon, Bell, Megaphone, Loader2 } from 'lucide-react';
import { fetchAnnouncements, saveAnnouncement, deleteAnnouncement, type Announcement } from '@/lib/services/cms-service';
import StatCard from '@/components/stat-card';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as Announcement['priority']
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      toast({ title: "Load Failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    setIsSubmitting(true);
    try {
      await saveAnnouncement(newAnnouncement);
      toast({ title: "Announcement Published", description: "All traveler dashboards have been updated." });
      setNewAnnouncement({ title: '', content: '', priority: 'medium' });
      loadAnnouncements();
    } catch (err) {
      toast({ title: "Failed to publish", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Remove this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      toast({ title: "Announcement Removed" });
      loadAnnouncements();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="font-headline text-3xl flex items-center"><SettingsIcon className="mr-3 h-8 w-8 text-primary"/>Agency Platform Control</CardTitle>
          <CardDescription>Configure global settings and traveler communication.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Announcement Creator */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Megaphone className="h-5 w-5 text-accent" />
                Push Announcement
            </CardTitle>
            <CardDescription>Broadcast news to all traveler dashboards.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePushAnnouncement} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</label>
                 <Input 
                    placeholder="e.g. Seasonal Discount Applied!" 
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({...prev, title: e.target.value}))}
                    required
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</label>
                 <Select 
                    value={newAnnouncement.priority} 
                    onValueChange={(val: any) => setNewAnnouncement(prev => ({...prev, priority: val}))}
                 >
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low (Normal)</SelectItem>
                        <SelectItem value="medium">Medium (Updates)</SelectItem>
                        <SelectItem value="high">High (Alert)</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Content</label>
                 <Textarea 
                    placeholder="Tell your travelers what's happening..." 
                    rows={4}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({...prev, content: e.target.value}))}
                    required
                 />
               </div>
               <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                 Post Announcement
               </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Active Announcements</CardTitle>
            <CardDescription>Manage current public notices.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className="p-4 border rounded-xl flex justify-between items-start group hover:bg-muted/10 transition-colors">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-primary">{ann.title}</h4>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border",
                                        ann.priority === 'high' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                                    )}>
                                        {ann.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed rounded-3xl opacity-50">
                            <Megaphone className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-bold uppercase tracking-tighter">No active announcements</p>
                        </div>
                    )}
                </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
