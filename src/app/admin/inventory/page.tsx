
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, Header, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Plus, Trash2, Loader2, Save, X, Database } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchBasePackages, fetchAddons, savePackage, saveAddon, deleteAddon, type Package, type Addon } from '@/lib/services/cms-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminInventoryPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
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
      toast({ title: "Package Updated" });
      setEditingPackage(null);
      loadData();
    } catch (err) {
      toast({ title: "Update Failed", variant: "destructive" });
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
          <TabsTrigger value="packages">Base Packages</TabsTrigger>
          <TabsTrigger value="addons">Add-ons (Activities)</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Base Foundations</CardTitle>
              <CardDescription>Edit the primary starting points for custom safaris.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Base Price (USD)</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-bold">{pkg.name}</TableCell>
                      <TableCell className="text-accent font-black">${pkg.basePrice}</TableCell>
                      <TableCell>{pkg.durationDays} Days</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingPackage(pkg)}>
                          <Edit2 className="h-4 w-4" />
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
                    <TableHead>Price (USD)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell className="font-medium">{addon.name}</TableCell>
                      <TableCell className="capitalize text-xs text-muted-foreground">{addon.subCategory || addon.category}</TableCell>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Package: {editingPackage?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePackage} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Base Price (USD)</Label>
              <Input 
                type="number" 
                value={editingPackage?.basePrice || 0} 
                onChange={(e) => setEditingPackage(prev => prev ? { ...prev, basePrice: parseInt(e.target.value) } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Input 
                type="number" 
                value={editingPackage?.durationDays || 0} 
                onChange={(e) => setEditingPackage(prev => prev ? { ...prev, durationDays: parseInt(e.target.value) } : null)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPackage(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
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
