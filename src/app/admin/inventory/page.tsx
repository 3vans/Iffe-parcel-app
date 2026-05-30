
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Plus, Trash2, Loader2, Database, Sparkles, LayoutList, Calendar, Trash, MapPin, Image as ImageIcon, CheckCircle2, X, Layout, RectangleHorizontal, Type, ChevronUp, ChevronDown, Download, DatabaseBackup } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchBasePackages, fetchAddons, savePackage, deletePackage, saveAddon, deleteAddon, type Package, type Addon, type ItineraryItem, type ItinerarySection } from '@/lib/services/cms-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pkgs, ads] = await Promise.all([fetchBasePackages(), fetchAddons()]);
      setPackages(pkgs);
      setAddons(ads);
    } catch (err) {
      console.error("Load failed:", err);
      toast({ title: "Failed to load inventory", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        "name": "Ultimate Primate Safari",
        "slug": "ultimate-primate-safari",
        "subtitle": "Bwindi & Kibale Combined",
        "description": "A comprehensive journey through Uganda's primate capitals.",
        "basePrice": 4500,
        "priceDescription": "per person",
        "durationDays": 7,
        "durationText": "7 Days / 6 Nights",
        "features": ["Gorilla Trekking", "Chimp Tracking"],
        "whatsIncluded": ["Transport", "Meals", "Accommodation"],
        "imageUrl": "https://picsum.photos/seed/pkg1/1200/600",
        "isActive": true,
        "isPopular": true,
        "includedTours": [],
        "itineraryTitle": "The Primate Route",
        "sampleItinerary": [
          {
            "day": 1,
            "activity": "Arrival",
            "sections": [
              { "id": "s1", "type": "text", "content": "Welcome to Uganda. Transfer to your luxury lodge." }
            ]
          }
        ]
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iffe-package-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: "Template Downloaded", description: "Use this file to structure your bulk package data." });
  };

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return;
    setIsImporting(true);
    try {
      const data = JSON.parse(bulkJson);
      const pkgs = Array.isArray(data) ? data : [data];
      
      let successCount = 0;
      for (const p of pkgs) {
        const { id, ...rest } = p;
        await savePackage(rest);
        successCount++;
      }
      
      toast({ title: "Import Successful", description: `Added ${successCount} tour packages.` });
      setBulkJson('');
      setShowImportDialog(false);
      loadData();
    } catch (err: any) {
      toast({ title: "Import Failed", description: "Invalid JSON format. Check template.", variant: "destructive" });
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    
    savePackage(editingPackage)
      .then(() => {
        toast({ title: editingPackage.id ? "Package Updated" : "Package Added" });
        setEditingPackage(null);
        loadData();
      })
      .catch((err) => {
        console.error("Save package failed:", err);
        toast({ 
          title: "Operation Failed", 
          description: "Check for missing required fields or invalid data.",
          variant: "destructive" 
        });
      });
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This cannot be undone.")) return;
    try {
      await deletePackage(id);
      toast({ title: "Package Removed" });
      loadData();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const handleUpdateAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddon) return;
    
    saveAddon(editingAddon)
      .then(() => {
        toast({ title: editingAddon.id ? "Addon Updated" : "Addon Added" });
        setEditingAddon(null);
        loadData();
      })
      .catch((err) => {
        console.error("Save addon failed:", err);
        toast({ title: "Operation Failed", variant: "destructive" });
      });
  };

  const handleDeleteAddon = async (id: string) => {
    if (!confirm("Are you sure? This will remove the item from the custom builder.")) return;
    try {
      await deleteAddon(id);
      toast({ title: "Item Removed" });
      loadData();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const addFeature = () => {
    setEditingPackage(prev => prev ? { ...prev, features: [...(prev.features || []), ''] } : null);
  };
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(editingPackage?.features || [])];
    newFeatures[index] = value;
    setEditingPackage(prev => prev ? { ...prev, features: newFeatures } : null);
  };
  const removeFeature = (index: number) => {
    const newFeatures = [...(editingPackage?.features || [])];
    newFeatures.splice(index, 1);
    setEditingPackage(prev => prev ? { ...prev, features: newFeatures } : null);
  };

  const addInclusion = () => {
    setEditingPackage(prev => prev ? { ...prev, whatsIncluded: [...(prev.whatsIncluded || []), ''] } : null);
  };
  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...(editingPackage?.whatsIncluded || [])];
    newInclusions[index] = value;
    setEditingPackage(prev => prev ? { ...prev, whatsIncluded: newInclusions } : null);
  };
  const removeInclusion = (index: number) => {
    const newInclusions = [...(editingPackage?.whatsIncluded || [])];
    newInclusions.splice(index, 1);
    setEditingPackage(prev => prev ? { ...prev, whatsIncluded: newInclusions } : null);
  };

  const addItineraryDay = () => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const nextDay = currentItinerary.length + 1;
    const newItem: ItineraryItem = { day: nextDay, activity: '', sections: [] };
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: [...currentItinerary, newItem] } : null);
  };
  const removeItineraryDay = (index: number) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    currentItinerary.splice(index, 1);
    const reindexed = currentItinerary.map((item, i) => ({ ...item, day: i + 1 }));
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: reindexed } : null);
  };
  const moveItineraryDay = (index: number, direction: 'up' | 'down') => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItinerary.length) return;
    [currentItinerary[index], currentItinerary[targetIndex]] = [currentItinerary[targetIndex], currentItinerary[index]];
    const reindexed = currentItinerary.map((item, i) => ({ ...item, day: i + 1 }));
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: reindexed } : null);
  };
  const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: any) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    currentItinerary[index] = { ...currentItinerary[index], [field]: value };
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };

  const addItinerarySection = (dayIndex: number, type: 'text' | 'image') => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const newSection: ItinerarySection = {
      id: `s-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      content: '',
      imageLayout: type === 'image' ? 'full' : 'small'
    };
    const updatedDay = { ...currentItinerary[dayIndex] };
    updatedDay.sections = [...(updatedDay.sections || []), newSection];
    currentItinerary[dayIndex] = updatedDay;
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };
  const moveItinerarySection = (dayIndex: number, sectionIndex: number, direction: 'up' | 'down') => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const updatedDay = { ...currentItinerary[dayIndex] };
    const updatedSections = [...(updatedDay.sections || [])];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (targetIndex < 0 || targetIndex >= updatedSections.length) return;
    [updatedSections[sectionIndex], updatedSections[targetIndex]] = [updatedSections[targetIndex], updatedSections[sectionIndex]];
    updatedDay.sections = updatedSections;
    currentItinerary[dayIndex] = updatedDay;
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };
  const updateItinerarySection = (dayIndex: number, sectionIndex: number, value: string) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const updatedDay = { ...currentItinerary[dayIndex] };
    const updatedSections = [...(updatedDay.sections || [])];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], content: value };
    updatedDay.sections = updatedSections;
    currentItinerary[dayIndex] = updatedDay;
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };
  const updateItinerarySectionLayout = (dayIndex: number, sectionIndex: number, layout: 'small' | 'full') => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const updatedDay = { ...currentItinerary[dayIndex] };
    const updatedSections = [...(updatedDay.sections || [])];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], imageLayout: layout };
    updatedDay.sections = updatedSections;
    currentItinerary[dayIndex] = updatedDay;
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };
  const removeItinerarySection = (dayIndex: number, sectionIndex: number) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    const updatedDay = { ...currentItinerary[dayIndex] };
    const updatedSections = [...(updatedDay.sections || [])];
    updatedSections.splice(sectionIndex, 1);
    updatedDay.sections = updatedSections;
    currentItinerary[dayIndex] = updatedDay;
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: currentItinerary } : null);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
          <Database className="mr-3 h-8 w-8 text-accent" />
          Inventory & Price Management
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadTemplate} className="h-11 px-6 rounded-xl border-primary/20 text-primary hover:bg-primary/5 transition-all font-black uppercase text-xs tracking-widest">
                <Download className="mr-2 h-4 w-4" /> Download Template
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)} className="h-11 px-6 rounded-xl border-accent text-accent hover:bg-accent hover:text-white transition-all font-black uppercase text-xs tracking-widest">
                <DatabaseBackup className="mr-2 h-4 w-4" /> Bulk JSON Import
            </Button>
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger value="packages">Agency Packages</TabsTrigger>
          <TabsTrigger value="addons">Add-ons (Activities)</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tour Packages</CardTitle>
                <CardDescription>Primary tour offerings shown on the public packages page.</CardDescription>
              </div>
              <Button onClick={() => setEditingPackage({ 
                name: '', 
                subtitle: '', 
                description: '', 
                basePrice: 0, 
                priceDescription: 'per person',
                durationDays: 1,
                durationText: '',
                features: [],
                whatsIncluded: [],
                imageUrl: '',
                isActive: true,
                itineraryTitle: 'The Journey',
                sampleItinerary: []
              })}>
                <Plus className="mr-2 h-4 w-4" /> Create New Package
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-bold">{pkg.name}</TableCell>
                      <TableCell className="text-accent font-black">${pkg.basePrice}</TableCell>
                      <TableCell>{pkg.durationDays} Days</TableCell>
                      <TableCell>{pkg.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingPackage(pkg)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePackage(pkg.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Add-on Activities & Upgrades</CardTitle>
                <CardDescription>Manage individual pricing for all selectable items in the builder.</CardDescription>
              </div>
              <Button onClick={() => setEditingAddon({ id: '', name: '', price: 0, category: 'activity', isActive: true })}>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Price (USD)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableHeader>
                </TableHeader>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell className="font-medium">{addon.name}</TableCell>
                      <TableCell className="capitalize text-xs text-muted-foreground">{addon.subCategory || addon.category}</TableCell>
                      <TableCell className="text-xs font-bold text-stone-500 uppercase tracking-widest">{addon.region || 'N/A'}</TableCell>
                      <TableCell className="text-accent font-bold">${addon.price}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingAddon(addon)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAddon(addon.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl uppercase font-black text-primary">Bulk Package Import</DialogTitle>
                <DialogDescription>Paste an array of package objects in JSON format to sync with Firestore.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">JSON Input Data</Label>
                    <Button variant="link" size="sm" onClick={handleDownloadTemplate} className="h-6 text-[10px] p-0 text-accent font-black uppercase">
                        Download Format Guide <Download className="ml-1 h-3 w-3" />
                    </Button>
                </div>
                <Textarea 
                    placeholder='[ { "name": "New Package", ... } ]' 
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

      {/* Package Edit Modal */}
      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {editingPackage?.id ? 'Edit Package' : 'Create Agency Package'}
            </DialogTitle>
            <DialogDescription>These details will appear on the Safari Packages and details pages.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePackage} className="space-y-8 py-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Package Name</Label>
                    <Input 
                        value={editingPackage?.name || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Dynamic Slug (for URL)</Label>
                    <Input 
                        value={editingPackage?.slug || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Subtitle / Teaser</Label>
              <Input 
                value={editingPackage?.subtitle || ''} 
                onChange={(e) => setEditingPackage(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Full Description</Label>
              <Textarea 
                value={editingPackage?.description || ''} 
                onChange={(e) => setEditingPackage(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Base Price (USD)</Label>
                    <Input 
                        type="number"
                        value={editingPackage?.basePrice || 0} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, basePrice: parseInt(e.target.value) }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Duration (Days)</Label>
                    <Input 
                        type="number"
                        value={editingPackage?.durationDays || 1} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Duration Text (Display)</Label>
                    <Input 
                        value={editingPackage?.durationText || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, durationText: e.target.value }))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Hero Image URL</Label>
                    <Input 
                        value={editingPackage?.imageUrl || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                </div>
                <div className="flex items-center gap-6 h-full pt-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="isPopular" 
                            checked={!!editingPackage?.isPopular} 
                            onCheckedChange={(val) => setEditingPackage(prev => ({ ...prev, isPopular: !!val }))}
                        />
                        <Label htmlFor="isPopular" className="text-sm font-bold">Featured / Most Popular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="isActive" 
                            checked={!!editingPackage?.isActive} 
                            onCheckedChange={(val) => setEditingPackage(prev => ({ ...prev, isActive: !!val }))}
                        />
                        <Label htmlFor="isActive" className="text-sm font-bold">Published (Live)</Label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-accent" /> Package Highlights
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="h-7 text-[10px] font-black uppercase">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                      {editingPackage?.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <Input 
                            value={feature} 
                            onChange={(e) => updateFeature(idx, e.target.value)} 
                            className="flex-grow"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFeature(idx)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-accent" /> What's Included?
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInclusion} className="h-7 text-[10px] font-black uppercase">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                      {editingPackage?.whatsIncluded?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <Input 
                            value={item} 
                            onChange={(e) => updateInclusion(idx, e.target.value)} 
                            className="flex-grow"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeInclusion(idx)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LayoutList className="h-4 w-4 text-accent" />
                        <Input 
                            value={editingPackage?.itineraryTitle || 'The Journey'} 
                            onChange={(e) => setEditingPackage(prev => prev ? { ...prev, itineraryTitle: e.target.value } : null)}
                            className="h-8 font-black uppercase tracking-widest text-sm bg-muted/50 border-none w-[250px]"
                        />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                        <Plus className="h-3 w-3 mr-1" /> Add Day
                    </Button>
                </div>
                
                <div className="space-y-8">
                    {(editingPackage?.sampleItinerary || []).map((day, dayIndex) => (
                        <div key={dayIndex} className="p-6 bg-muted/30 border rounded-3xl relative group transition-all hover:bg-muted/50">
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 w-1/2">
                                        <div className="flex flex-col">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-5 w-5" 
                                                disabled={dayIndex === 0}
                                                onClick={() => moveItineraryDay(dayIndex, 'up')}
                                            >
                                                <ChevronUp className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-5 w-5"
                                                disabled={dayIndex === (editingPackage?.sampleItinerary?.length || 0) - 1}
                                                onClick={() => moveItineraryDay(dayIndex, 'down')}
                                            >
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="space-y-1 flex-grow">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Day {day.day}</Label>
                                            <Input 
                                                value={day.activity} 
                                                onChange={(e) => updateItineraryItem(dayIndex, 'activity', e.target.value)} 
                                                placeholder="Activity Title" 
                                                className="h-10 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => addItinerarySection(dayIndex, 'text')} className="h-8 text-[9px] font-black uppercase">
                                            <Type className="h-3 w-3 mr-1" /> + Narrative
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addItinerarySection(dayIndex, 'image')} className="h-8 text-[9px] font-black uppercase">
                                            <ImageIcon className="h-3 w-3 mr-1" /> + Visual
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {(day.sections || []).map((section, sIdx) => (
                                        <div key={section.id} className="p-4 bg-background/50 border rounded-2xl relative group/section shadow-sm flex gap-4">
                                            <div className="flex flex-col shrink-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6" 
                                                    disabled={sIdx === 0}
                                                    onClick={() => moveItinerarySection(dayIndex, sIdx, 'up')}
                                                >
                                                    <ChevronUp className="h-3 w-3" />
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6"
                                                    disabled={sIdx === (day.sections?.length || 0) - 1}
                                                    onClick={() => moveItinerarySection(dayIndex, sIdx, 'down')}
                                                >
                                                    <ChevronDown className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="flex-grow">
                                                {section.type === 'text' ? (
                                                    <div className="space-y-2">
                                                        <Label className="text-[9px] font-bold uppercase text-muted-foreground">Narrative Block</Label>
                                                        <Textarea 
                                                            value={section.content}
                                                            onChange={(e) => updateItinerarySection(dayIndex, sIdx, e.target.value)}
                                                            className="min-h-[100px]"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-[9px] font-bold uppercase text-muted-foreground">Image URL</Label>
                                                                <Input 
                                                                    value={section.content}
                                                                    onChange={(e) => updateItinerarySection(dayIndex, sIdx, e.target.value)}
                                                                    className="text-xs"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[9px] font-bold uppercase text-muted-foreground">Display Mode</Label>
                                                                <Select 
                                                                    value={section.imageLayout || 'full'}
                                                                    onValueChange={(val: any) => updateItinerarySectionLayout(dayIndex, sIdx, val)}
                                                                >
                                                                    <SelectTrigger className="h-9">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="small"><div className="flex items-center gap-2"><Layout className="h-3 w-3"/> Side Card</div></SelectItem>
                                                                        <SelectItem value="full"><div className="flex items-center gap-2"><RectangleHorizontal className="h-3 w-3"/> Cinematic Wide</div></SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            {section.content && (
                                                                <div className={cn(
                                                                    "relative rounded-xl overflow-hidden border bg-muted shadow-inner h-full min-h-[100px]",
                                                                    section.imageLayout === 'full' ? 'aspect-video' : 'aspect-square max-w-[150px] mx-auto'
                                                                )}>
                                                                    <img src={section.content} alt="Preview" className="object-cover w-full h-full" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 rounded-full bg-destructive text-white hover:bg-destructive/90 opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg"
                                                onClick={() => removeItinerarySection(dayIndex, sIdx)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItineraryDay(dayIndex)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingPackage(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 font-black uppercase tracking-widest">Save Package</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Addon Edit Modal */}
      <Dialog open={!!editingAddon} onOpenChange={() => setEditingAddon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddon?.id ? 'Edit Item' : 'New Add-on Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAddon} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={editingAddon?.name || ''} 
                onChange={(e) => setEditingAddon(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (USD)</Label>
              <Input 
                type="number" 
                value={editingAddon?.price || 0} 
                onChange={(e) => setEditingAddon(prev => prev ? { ...prev, price: parseInt(e.target.value) } : null)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={editingAddon?.category || 'activity'}
                        onChange={(e) => setEditingAddon(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                    >
                        <option value="activity">Activity</option>
                        <option value="luxury">Luxury</option>
                        <option value="extension">Extension</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Sub-Category (Optional)</Label>
                    <select 
                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={editingAddon?.subCategory || ''}
                        onChange={(e) => setEditingAddon(prev => prev ? { ...prev, subCategory: e.target.value as any } : null)}
                    >
                        <option value="">None</option>
                        <option value="Wildlife">Wildlife</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Culture">Culture</option>
                        <option value="Nature & Scenic">Nature & Scenic</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Region (Optional)
                </Label>
                <select 
                    className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                    value={editingAddon?.region || ''}
                    onChange={(e) => setEditingAddon(prev => prev ? { ...prev, region: e.target.value as any } : null)}
                >
                    <option value="">None / General</option>
                    <option value="Central">Central</option>
                    <option value="Western">Western</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Northern">Northern</option>
                </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAddon(null)}>Cancel</Button>
              <Button type="submit">Save Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
