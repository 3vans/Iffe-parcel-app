
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Plus, Trash2, Loader2, Database, Sparkles, LayoutList, Calendar, Trash, MapPin } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchBasePackages, fetchAddons, savePackage, deletePackage, saveAddon, deleteAddon, type Package, type Addon, type ItineraryItem } from '@/lib/services/cms-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminInventoryPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      toast({ title: "Failed to load inventory", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      await savePackage(editingPackage);
      toast({ title: editingPackage.id ? "Package Updated" : "Package Added" });
      setEditingPackage(null);
      loadData();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
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

  const handleUpdateAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddon) return;
    try {
      await saveAddon(editingAddon);
      toast({ title: editingAddon.id ? "Addon Updated" : "Addon Added" });
      setEditingAddon(null);
      loadData();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
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

  const addItineraryDay = () => {
    const currentItinerary = editingPackage?.sampleItinerary || [];
    const nextDay = currentItinerary.length + 1;
    const newItem: ItineraryItem = { day: nextDay, activity: '', description: '' };
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: [...currentItinerary, newItem] } : null);
  };

  const removeItineraryDay = (index: number) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    currentItinerary.splice(index, 1);
    // Re-index days
    const reindexed = currentItinerary.map((item, i) => ({ ...item, day: i + 1 }));
    setEditingPackage(prev => prev ? { ...prev, sampleItinerary: reindexed } : null);
  };

  const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: any) => {
    const currentItinerary = [...(editingPackage?.sampleItinerary || [])];
    currentItinerary[index] = { ...currentItinerary[index], [field]: value };
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
                imageUrl: '',
                isActive: true,
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
                  </TableRow>
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
            
            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Package Name</Label>
                    <Input 
                        value={editingPackage?.name || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="e.g. Explorer Package"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Dynamic Slug (for URL)</Label>
                    <Input 
                        value={editingPackage?.slug || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        required
                        placeholder="explorer-package"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Subtitle / Teaser</Label>
              <Input 
                value={editingPackage?.subtitle || ''} 
                onChange={(e) => setEditingPackage(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="A short, catchy line about the trip..."
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Full Description</Label>
              <Textarea 
                value={editingPackage?.description || ''} 
                onChange={(e) => setEditingPackage(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Detailed overview of the package experience..."
              />
            </div>

            {/* Pricing & Duration */}
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
                        placeholder="e.g. 4 Days / 3 Nights"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Image URL</Label>
                    <Input 
                        value={editingPackage?.imageUrl || ''} 
                        onChange={(e) => setEditingPackage(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://..."
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

            {/* Features List */}
            <div className="space-y-2">
                <Label className="font-bold uppercase text-[10px] tracking-widest">Package Features (One per line)</Label>
                <Textarea 
                    value={editingPackage?.features?.join('\n') || ''} 
                    onChange={(e) => setEditingPackage(prev => ({ ...prev, features: e.target.value.split('\n').filter(f => f.trim()) }))}
                    rows={4}
                    placeholder="Source of the Nile Visit&#10;Sipi Falls Hike&#10;Coffee Tour"
                />
            </div>

            {/* Itinerary Editor */}
            <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <LayoutList className="h-4 w-4 text-accent" /> Sample Itinerary
                    </h4>
                    <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                        <Plus className="h-3 w-3 mr-1" /> Add Day
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(editingPackage?.sampleItinerary || []).map((item, index) => (
                        <div key={index} className="p-4 bg-muted/30 border rounded-lg relative group">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <Label className="text-[10px] font-bold uppercase opacity-50">Day {item.day}</Label>
                                    <Input 
                                        value={item.activity} 
                                        onChange={(e) => updateItineraryItem(index, 'activity', e.target.value)} 
                                        placeholder="Activity Title" 
                                        className="mt-1"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Label className="text-[10px] font-bold uppercase opacity-50">Description</Label>
                                    <Textarea 
                                        value={item.description} 
                                        onChange={(e) => updateItineraryItem(index, 'description', e.target.value)} 
                                        placeholder="What happens on this day?" 
                                        className="mt-1 h-20"
                                    />
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItineraryDay(index)}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    {(editingPackage?.sampleItinerary || []).length === 0 && (
                        <p className="text-center text-xs text-muted-foreground py-4 italic">No itinerary days added yet.</p>
                    )}
                </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingPackage(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">Save Package</Button>
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
