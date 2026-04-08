'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Plus, Trash2, Loader2, Map, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchCampaigns, saveCampaign, deleteCampaign, type Campaign } from '@/lib/services/cms-service';
import Image from 'next/image';

export default function AdminExpeditionsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      toast({ title: "Failed to load expeditions", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    try {
      await saveCampaign(editingCampaign);
      toast({ title: editingCampaign.id ? "Expedition Updated" : "Expedition Added" });
      setEditingCampaign(null);
      loadCampaigns();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expedition?")) return;
    try {
      await deleteCampaign(id);
      toast({ title: "Expedition Deleted" });
      loadCampaigns();
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
        <Button onClick={() => setEditingCampaign({ title: '', description: '', region: 'Western', goal: 100, currentAmount: 0, tags: [] })}>
          <Plus className="mr-2 h-4 w-4" /> New Expedition
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Expeditions</CardTitle>
          <CardDescription>Manage the tours shown on the public tours page.</CardDescription>
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
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(camp.id)}>
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

      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {editingCampaign?.id ? 'Edit Expedition' : 'Create New Expedition'}
            </DialogTitle>
            <DialogDescription>Details will be stored in the campaigns_public Firestore collection.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Expedition Title</Label>
                    <Input 
                        value={editingCampaign?.title || ''} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="e.g. Bwindi Gorilla Trekking"
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
              <Label className="font-bold uppercase text-[10px] tracking-widest">Short Description (Teaser)</Label>
              <Input 
                value={editingCampaign?.shortDescription || ''} 
                onChange={(e) => setEditingCampaign(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="A one-sentence summary for listing cards."
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-[10px] tracking-widest">Full Description</Label>
              <Textarea 
                value={editingCampaign?.description || ''} 
                onChange={(e) => setEditingCampaign(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Detailed information about the tour..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest">Image URL (Supabase preferred)</Label>
                    <Input 
                        value={editingCampaign?.imageUrl || ''} 
                        onChange={(e) => setEditingCampaign(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://..."
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

            <div className="space-y-2">
                <Label className="font-bold uppercase text-[10px] tracking-widest">Tags (comma separated)</Label>
                <Input 
                    value={editingCampaign?.tags?.join(', ') || ''} 
                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                    placeholder="#Gorilla, #UNESCO, #Wildlife"
                />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setEditingCampaign(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">Save Expedition</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
