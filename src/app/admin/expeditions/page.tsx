
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Plus, Trash2, Loader2, Map, Image as ImageIcon, Sparkles, CalendarClock, Globe, ChevronUp, ChevronDown, Type, X, Layout, RectangleHorizontal, ListChecks, UploadCloud, DatabaseBackup } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchCampaigns, saveCampaign, deleteCampaign, fetchDepartures, saveDeparture, deleteDeparture, uploadFile, type Campaign, type Departure, type ItinerarySection } from '@/lib/services/cms-service';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminExpeditionsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsSubmittingImport] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
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

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return;
    setIsSubmittingImport(true);
    try {
      const data = JSON.parse(bulkJson);
      const expeditions = Array.isArray(data) ? data : [data];
      
      let successCount = 0;
      for (const exp of expeditions) {
        // Strip existing ID to force fresh creation if needed
        const { id, ...rest } = exp;
        await saveCampaign(rest);
        successCount++;
      }
      
      toast({ title: "Import Successful", description: `Added ${successCount} tour expeditions.` });
      setBulkJson('');
      setShowImportDialog(false);
      loadData();
    } catch (err: any) {
      toast({ title: "Import Failed", description: "Invalid JSON format. Check template.", variant: "destructive" });
    } finally {
      setIsSubmittingImport(false);
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

  // --- Image Upload Helpers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'blobs', 'expeditions');
      callback(url);
      toast({ title: "Image Uploaded Successfully" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Campaign Sub-Editor Helpers ---

  const addStoryline = () => {
    setEditingCampaign(prev => prev ? { ...prev, storyline: [...(prev.storyline || []), { text: '', image: '' }] } : null);
  };
  const updateStoryline = (index: number, key: string, value: string) => {
    const newStory = [...(editingCampaign?.storyline || [])];
    newStory[index] = { ...(newStory[index] || { text: '', image: '' }), [key]: value };
    setEditingCampaign(prev => prev ? { ...prev, storyline: newStory } : null);
  };
  const removeStoryline = (index: number) => {
    const newStory = [...(editingCampaign?.storyline || [])];
    newStory.splice(index, 1);
    setEditingCampaign(prev => prev ? { ...prev, storyline: newStory } : null);
  };

  const addBookingTip = () => {
    setEditingCampaign(prev => prev ? { ...prev, bookingTips: [...(prev.bookingTips || []), ''] } : null);
  };
  const updateBookingTip = (index: number, value: string) => {
    const newTips = [...(editingCampaign?.bookingTips || [])];
    newTips[index] = value;
    setEditingCampaign(prev => prev ? { ...prev, bookingTips: newTips } : null);
  };
  const removeBookingTip = (index: number) => {
    const newTips = [...(editingCampaign?.bookingTips || [])];
    newTips.splice(index, 1);
    setEditingCampaign(prev => prev ? { ...prev, bookingTips: newTips } : null);
  };

  const addArrayItem = (field: 'activities' | 'accommodation' | 'meals') => {
    const newItem = { title: '', description: '', image: '' };
    setEditingCampaign(prev => prev ? { ...prev, [field]: [...(prev[field] || []), newItem] } : null);
  };
  const updateArrayItem = (field: 'activities' | 'accommodation' | 'meals', index: number, key: string, value: any) => {
    const items = [...(editingCampaign?.[field] || [])];
    items[index] = { ...items[index], [key]: value };
    setEditingCampaign(prev => prev ? { ...prev, [field]: items } : null);
  };
  const removeArrayItem = (field: 'activities' | 'accommodation' | 'meals', index: number) => {
    const items = [...(editingCampaign?.[field] || [])];
    items.splice(index, 1);
    setEditingCampaign(prev => prev ? { ...prev, [field]: items } : null);
  };

  const addCampaignSection = (type: 'text' | 'image') => {
    const newSection: ItinerarySection = {
      id: `c-s-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      content: '',
      imageLayout: type === 'image' ? 'full' : 'small'
    };
    setEditingCampaign(prev => prev ? { ...prev, sections: [...(prev.sections || []), newSection] } : null);
  };
  const moveCampaignSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...(editingCampaign?.sections || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setEditingCampaign(prev => prev ? { ...prev, sections: sections } : null);
  };
  const updateCampaignSection = (index: number, key: keyof ItinerarySection, value: any) => {
    const sections = [...(editingCampaign?.sections || [])];
    sections[index] = { ...sections[index], [key]: value };
    setEditingCampaign(prev => prev ? { ...prev, sections: sections } : null);
  };
  const removeCampaignSection = (index: number) => {
    const sections = [...(editingCampaign?.sections || [])];
    sections.splice(index, 1);
    setEditingCampaign(prev => prev ? { ...prev, sections: sections } : null);
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
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)} className="h-11 px-6 rounded-xl border-accent text-accent hover:bg-accent hover:text-white transition-all font-black uppercase text-xs tracking-widest">
                <DatabaseBackup className="mr-2 h-4 w-4" /> Bulk JSON Import
            </Button>
            <Button onClick={() => setEditingCampaign({ 
                title: '', 
                description: '', 
                region: 'Western', 
                goal: 100, 
                currentAmount: 0, 
                tags: [], 
                storyline: [], 
                activities: [], 
                accommodation: [], 
                meals: [], 
                bookingTips: [], 
                sections: [],
                organizer: 'iffe-travels'
            })} className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase text-xs tracking-widest">
                <Plus className="mr-2 h-4 w-4" /> New Itinerary
            </Button>
        </div>
      </div>

      <Tabs defaultValue="itineraries" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger value="itineraries">Tour Itineraries</TabsTrigger>
          <TabsTrigger value="departures">Scheduled Departures</TabsTrigger>
        </TabsList>

        <TabsContent value="itineraries">
          <Card>
            <CardHeader>
                <CardTitle>Public Expeditions</CardTitle>
                <CardDescription>Manage the foundational itineraries shown on the Tours page.</CardDescription>
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
                            {camp.imageUrl && camp.imageUrl.trim() !== "" ? (
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

      {/* Bulk Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl uppercase font-black text-primary">Bulk Expedition Import</DialogTitle>
                <DialogDescription>Paste an array of expedition objects in JSON format to sync with Firestore.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <Textarea 
                    placeholder='[ { "title": "New Tour", ... } ]' 
                    value={bulkJson} 
                    onChange={(e) => setBulkJson(e.target.value)}
                    rows={15}
                    className="font-mono text-xs bg-muted/30 border-none rounded-xl"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8" onClick={handleBulkImport} disabled={isImporting || !bulkJson}>
                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DatabaseBackup className="mr-2 h-4 w-4" />}
                    Begin Import Process
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Modal */}
      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="sm:max-w-5xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {editingCampaign?.id ? 'Edit Expedition' : 'Create Tour Expedition'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCampaignSubmit} className="py-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-5 w-full mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="narrative">Narrative</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="lodging">Lodging & Meals</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
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
                  <Label className="font-bold uppercase text-[10px] tracking-widest">Teaser Description (Card View)</Label>
                  <Input 
                    value={editingCampaign?.shortDescription || ''} 
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, shortDescription: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Featured Hero Image</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Paste URL..."
                        value={editingCampaign?.imageUrl || ''} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="flex-grow"
                      />
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="hero-upload"
                          onChange={(e) => handleFileUpload(e, (url) => setEditingCampaign(prev => ({ ...prev, imageUrl: url })))}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          asChild 
                          className="cursor-pointer"
                          disabled={isUploading}
                        >
                          <label htmlFor="hero-upload">
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                          </label>
                        </Button>
                      </div>
                    </div>
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
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest">Tour Operator / Organizer</Label>
                  <Input 
                    value={editingCampaign?.organizer || 'iffe-travels'} 
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, organizer: e.target.value }))}
                  />
                </div>
              </TabsContent>

              <TabsContent value="narrative" className="space-y-8">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest">Legacy Intro Narrative</Label>
                  <Textarea 
                    value={editingCampaign?.description || ''} 
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Classic text intro..."
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Layout className="h-3 w-3 text-accent" /> Dynamic Content Modules
                    </Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => addCampaignSection('text')} className="h-7 text-[10px] font-black">
                        + Narrative Block
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addCampaignSection('image')} className="h-7 text-[10px] font-black">
                        + Visual Module
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(editingCampaign?.sections || []).map((section, idx) => (
                      <div key={section.id} className="p-4 bg-muted/30 border rounded-2xl relative group/section shadow-sm flex gap-4">
                        <div className="flex flex-col shrink-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={idx === 0} onClick={() => moveCampaignSection(idx, 'up')}><ChevronUp className="h-3 w-3" /></Button>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={idx === (editingCampaign?.sections?.length || 0) - 1} onClick={() => moveCampaignSection(idx, 'down')}><ChevronDown className="h-3 w-3" /></Button>
                        </div>
                        <div className="flex-grow">
                          {section.type === 'text' ? (
                            <Textarea value={section.content} onChange={(e) => updateCampaignSection(idx, 'content', e.target.value)} placeholder="Enter narrative text..." />
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[9px] font-bold">Image Source</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Paste URL..."
                                    value={section.content} 
                                    onChange={(e) => updateCampaignSection(idx, 'content', e.target.value)} 
                                    className="text-xs flex-grow" 
                                  />
                                  <div className="relative">
                                    <Input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      id={`section-upload-${idx}`}
                                      onChange={(e) => handleFileUpload(e, (url) => updateCampaignSection(idx, 'content', url))}
                                    />
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      asChild 
                                      className="h-8 w-8 p-0 cursor-pointer"
                                      disabled={isUploading}
                                    >
                                      <label htmlFor={`section-upload-${idx}`}>
                                        {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3 w-3" />}
                                      </label>
                                    </Button>
                                  </div>
                                </div>
                                <Label className="text-[9px] font-bold mt-2 block">Layout Mode</Label>
                                <Select value={section.imageLayout || 'full'} onValueChange={(val) => updateCampaignSection(idx, 'imageLayout', val)}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Side Card</SelectItem>
                                    <SelectItem value="full">Cinematic Wide</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="relative border rounded-xl overflow-hidden bg-muted">
                                {section.content && <img src={section.content} alt="Preview" className="object-cover w-full h-full" />}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeCampaignSection(idx)}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">The Experience (Storyline Visuals)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addStoryline} className="h-7 text-[10px]">+ Add Experience Moment</Button>
                  </div>
                  <div className="grid gap-4">
                    {(editingCampaign?.storyline || []).map((item, idx) => (
                      <div key={idx} className="p-4 border rounded-2xl bg-muted/20 space-y-4 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold uppercase">Description / Narrative</Label>
                                <Textarea 
                                    value={item.text || ''} 
                                    onChange={(e) => updateStoryline(idx, 'text', e.target.value)} 
                                    placeholder="Tell the story of this specific experience..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold uppercase">Associated Visual</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={item.image || ''} 
                                        onChange={(e) => updateStoryline(idx, 'image', e.target.value)} 
                                        placeholder="Image URL..."
                                        className="text-xs flex-grow"
                                    />
                                    <div className="relative">
                                        <Input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden" 
                                          id={`storyline-upload-${idx}`}
                                          onChange={(e) => handleFileUpload(e, (url) => updateStoryline(idx, 'image', url))}
                                        />
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          asChild 
                                          className="h-10 w-10 p-0 cursor-pointer"
                                          disabled={isUploading}
                                        >
                                          <label htmlFor={`storyline-upload-${idx}`}>
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                          </label>
                                        </Button>
                                    </div>
                                </div>
                                {item.image && (
                                    <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-muted h-20">
                                        <img src={item.image} alt="Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeStoryline(idx)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Activities (Managed here)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('activities')} className="h-7 text-[10px]">+ Add Activity</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingCampaign?.activities?.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-2 relative">
                        <Input placeholder="Title" value={item.title} onChange={(e) => updateArrayItem('activities', idx, 'title', e.target.value)} className="font-bold" />
                        <Textarea placeholder="Description" value={item.description} onChange={(e) => updateArrayItem('activities', idx, 'description', e.target.value)} rows={2} className="text-xs" />
                        <Input placeholder="Image URL or Placeholder Key" value={item.image} onChange={(e) => updateArrayItem('activities', idx, 'image', e.target.value)} className="text-[10px]" />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeArrayItem('activities', idx)}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lodging" className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Accommodation Options</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('accommodation')} className="h-7 text-[10px]">+ Add Accommodation</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingCampaign?.accommodation?.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-2 relative">
                        <Input placeholder="Lodge Name" value={item.title} onChange={(e) => updateArrayItem('accommodation', idx, 'title', e.target.value)} className="font-bold" />
                        <Textarea placeholder="Description" value={item.description} onChange={(e) => updateArrayItem('accommodation', idx, 'description', e.target.value)} rows={2} className="text-xs" />
                        <Input placeholder="Image URL/Key" value={item.image} onChange={(e) => updateArrayItem('accommodation', idx, 'image', e.target.value)} className="text-[10px]" />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeArrayItem('accommodation', idx)}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Dining & Meals</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('meals')} className="h-7 text-[10px]">+ Add Meal Type</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingCampaign?.meals?.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-2 relative">
                        <Input placeholder="Meal Style" value={item.title} onChange={(e) => updateArrayItem('meals', idx, 'title', e.target.value)} className="font-bold" />
                        <Textarea placeholder="Details" value={item.description} onChange={(e) => updateArrayItem('meals', idx, 'description', e.target.value)} rows={2} className="text-xs" />
                        <Input placeholder="Image URL/Key" value={item.image} onChange={(e) => updateArrayItem('meals', idx, 'image', e.target.value)} className="text-[10px]" />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => removeArrayItem('meals', idx)}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Volunteer Spots Needed</Label>
                    <Input type="number" value={editingCampaign?.volunteersNeeded || 0} onChange={(e) => setEditingCampaign(prev => ({ ...prev, volunteersNeeded: parseInt(e.target.value) }))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Current Sign-ups</Label>
                    <Input type="number" value={editingCampaign?.volunteersSignedUp || 0} onChange={(e) => setEditingCampaign(prev => ({ ...prev, volunteersSignedUp: parseInt(e.target.value) }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest">Target End Date</Label>
                  <Input type="date" value={editingCampaign?.endDate ? new Date(editingCampaign.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingCampaign(prev => ({ ...prev, endDate: e.target.value }))} />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Booking & Safari Tips</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addBookingTip} className="h-7 text-[10px]">+ Add Tip</Button>
                  </div>
                  {editingCampaign?.bookingTips?.map((tip, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={tip} onChange={(e) => updateBookingTip(idx, e.target.value)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeBookingTip(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-8 border-t pt-6">
              <Button type="button" variant="outline" onClick={() => setEditingCampaign(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">Save Expedition Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Departure Modal (Keep as is) */}
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
