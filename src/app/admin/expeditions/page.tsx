
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Plus, Trash2, Loader2, Map, Image as ImageIcon, Sparkles, CalendarClock, Globe } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchCampaigns, saveCampaign, deleteCampaign, fetchDepartures, saveDeparture, deleteDeparture, type Campaign, type Departure } from '@/lib/services/cms-service';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminExpeditionsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [editingDeparture, setEditingDeparture] = useState<Partial<Departure> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cData, dData] = await Promise.all([fetchCampaigns(), fetchDepartures()]);
      setCampaigns(cData);
      setDepartures(dData);
    } catch (err) {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    try {
      await saveCampaign(editingCampaign);
      toast({ title: editingCampaign.id ? "Expedition Updated" : "Expedition Added" });
      setEditingCampaign(null);
      loadData();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

  const handleDepartureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeparture) return;
    try {
      await saveDeparture(editingDeparture);
      toast({ title: editingDeparture.id ? "Departure Updated" : "Departure Added" });
      setEditingDeparture(null);
      loadData();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expedition itinerary?")) return;
    try {
      await deleteCampaign(id);
      toast({ title: "Expedition Deleted" });
      loadData();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const handleDeleteDeparture = async (id: string) => {
    if (!confirm("Are you sure? This will remove the scheduled departure from the website.")) return;
    try {
      await deleteDeparture(id);
      toast({ title: "Departure Removed" });
      loadData();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
          <Map className="mr-3 h-8 w-8 text-accent" />
          Expedition Management
        </h1>
      </div>

      <Tabs defaultValue="itineraries" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger value="itineraries">Tour Itineraries</TabsTrigger>
          <TabsTrigger value="departures">Scheduled Departures</TabsTrigger>
        </TabsList>

        <TabsContent value="itineraries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Public Expeditions</CardTitle>
                <CardDescription>Manage the foundational itineraries shown on the Tours page.</CardDescription>
              </div>
              <Button onClick={() => setEditingCampaign({ title: '', description: '', region: 'Western', goal: 100, currentAmount: 0, tags: [] })}>
                <Plus className="mr-2 h-4 w-4" /> New Itinerary
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((camp) => (
                      <TableRow key={camp.id}>
                        <TableCell>
                          <div className="relative h-10 w-16 rounded overflow-hidden bg-muted">
                            {camp.imageUrl ? (
                              <Image src={camp.imageUrl} alt={camp.title} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="h-full w-full p-2 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{camp.title}</TableCell>
                        <TableCell className="text-xs uppercase tracking-widest text-muted-foreground">{camp.region}</TableCell>
                        <TableCell>{camp.currentAmount}%</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingCampaign(camp)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCampaign(camp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departures">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Scheduled Group Departures</CardTitle>
                <CardDescription>Manage specific departure dates, webinars, and group events.</CardDescription>
              </div>
              <Button onClick={() => setEditingDeparture({ title: '', date: '', type: 'Offline', location: '', excerpt: '', fullDescription: '' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Departure
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departures.map((dep) => (
                      <TableRow key={dep.id}>
                        <TableCell className="font-bold">{dep.title}</TableCell>
                        <TableCell className="text-xs">{dep.date}</TableCell>
                        <TableCell>
                          <span className="text-[10px] bg-muted px-2 py-1 rounded-full font-black uppercase tracking-widest">{dep.type}</span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingDeparture(dep)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteDeparture(dep.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {departures.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">No departures scheduled.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Modal */}
      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {editingCampaign?.id ? 'Edit Itinerary' : 'Create Tour Itinerary'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCampaignSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Expedition Title</Label>
                    <Input 
                        value={editingCampaign?.title || ''} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Region</Label>
                    <select 
                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={editingCampaign?.region || 'Western'}
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, region: e.target.value as any }))}
                    >
                        <option value="Western">Western</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Northern">Northern</option>
                        <option value="Central">Central</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Teaser Description</Label>
              <Input 
                value={editingCampaign?.shortDescription || ''} 
                onChange={(e) => setEditingCampaign(prev => ({ ...prev, shortDescription: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Full Description</Label>
              <Textarea 
                value={editingCampaign?.description || ''} 
                onChange={(e) => setEditingCampaign(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Featured Image URL</Label>
                    <Input 
                        value={editingCampaign?.imageUrl || ''} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Traveller Rating (%)</Label>
                    <Input 
                        type="number"
                        value={editingCampaign?.currentAmount || 0} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, currentAmount: parseInt(e.target.value) }))}
                    />
                </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingCampaign(null)}>Cancel</Button>
              <Button type="submit">Save Itinerary</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Departure Modal */}
      <Dialog open={!!editingDeparture} onOpenChange={() => setEditingDeparture(null)}>
        <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-accent" />
              {editingDeparture?.id ? 'Edit Departure' : 'Schedule New Departure'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDepartureSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Event Title</Label>
                    <Input 
                        value={editingDeparture?.title || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Event Type</Label>
                    <select 
                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={editingDeparture?.type || 'Offline'}
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                        <option value="Offline">Offline (Trip)</option>
                        <option value="Online">Online (Webinar)</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Display Date</Label>
                    <Input 
                        value={editingDeparture?.date || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. July 15, 2024"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Duration/Time</Label>
                    <Input 
                        value={editingDeparture?.time || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="e.g. 7-Day Tour"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Location</Label>
                    <Input 
                        value={editingDeparture?.location || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Serengeti, Tanzania"
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Excerpt (Card Preview)</Label>
              <Input 
                value={editingDeparture?.excerpt || ''} 
                onChange={(e) => setEditingDeparture(prev => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Detailed Content</Label>
              <Textarea 
                value={editingDeparture?.fullDescription || ''} 
                onChange={(e) => setEditingDeparture(prev => ({ ...prev, fullDescription: e.target.value }))}
                rows={6}
              />
            </div>
            <div className="space-y-2">
                <Label className="font-bold uppercase text-[10px] tracking-widest">Image URL</Label>
                <Input 
                    value={editingDeparture?.imageUrl || ''} 
                    onChange={(e) => setEditingDeparture(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">RSVP / Booking Link</Label>
                    <Input 
                        value={editingDeparture?.rsvpLink || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, rsvpLink: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Add to Calendar Link</Label>
                    <Input 
                        value={editingDeparture?.calendarLink || ''} 
                        onChange={(e) => setEditingDeparture(prev => ({ ...prev, calendarLink: e.target.value }))}
                    />
                </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingDeparture(null)}>Cancel</Button>
              <Button type="submit">Schedule Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
