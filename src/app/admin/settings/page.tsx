
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ListPlus, Trash2, SettingsIcon } from 'lucide-react';

interface ClubName {
  id: string;
  name: string;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [clubNames, setClubNames] = useState<ClubName[]>([
    { id: 'club1', name: 'Rotaract Club of Kampala South' },
    { id: 'club2', name: 'Rotaract Club of Makerere University' },
    { id: 'club3', name: 'Rotaract Club of Nakawa' },
  ]);
  const [newClubName, setNewClubName] = useState('');
  const [isAddingClub, setIsAddingClub] = useState(false);

  const handleAddClubName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim()) {
      toast({
        title: "Club Name Required",
        description: "Please enter a name for the club.",
        variant: "destructive",
      });
      return;
    }
    setIsAddingClub(true);
    // Simulate API call
    setTimeout(() => {
      const newClub: ClubName = {
        id: `club-${Date.now()}`,
        name: newClubName.trim(),
      };
      setClubNames(prev => [newClub, ...prev]);
      toast({
        title: "Club Added",
        description: `"${newClub.name}" has been added to the list (simulated).`,
      });
      setNewClubName('');
      setIsAddingClub(false);
    }, 500);
  };

  const handleDeleteClubName = (clubId: string, clubName: string) => {
    // Simulate API call
    setClubNames(prev => prev.filter(club => club.id !== clubId));
    toast({
      title: "Club Deleted",
      description: `"${clubName}" has been removed from the list (simulated).`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center"><SettingsIcon className="mr-2 h-6 w-6 text-primary"/>Platform Settings</CardTitle>
          <CardDescription>Configure various aspects of the e-Rotary Hub.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Manage Rotaract Club Names</h3>
            <p className="text-sm text-muted-foreground mb-4">
              These club names can be used in signup forms or other parts of the platform.
            </p>
            <form onSubmit={handleAddClubName} className="flex items-center gap-2 mb-4">
              <Input 
                type="text"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder="Enter new club name"
                className="flex-grow"
                disabled={isAddingClub}
              />
              <Button type="submit" disabled={isAddingClub}>
                <ListPlus className="mr-2 h-4 w-4" /> {isAddingClub ? 'Adding...' : 'Add Club'}
              </Button>
            </form>

            {clubNames.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3 bg-muted/20">
                {clubNames.map(club => (
                  <li key={club.id} className="flex items-center justify-between p-2 bg-background rounded-md shadow-sm">
                    <span className="text-sm">{club.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => handleDeleteClubName(club.id, club.name)}
                      title={`Delete ${club.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No club names added yet.</p>
            )}
          </section>
          
          <section>
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Other Settings</h3>
             <p className="text-muted-foreground mt-2">This section could include:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 ml-4 text-sm space-y-1">
                <li>Theme color customization (advanced).</li>
                <li>Site-wide announcements or notices.</li>
                <li>Terms of Service / Privacy Policy updates.</li>
                <li>System logs and audit trails.</li>
                <li>AI/Creator system controls (if applicable).</li>
                <li>Paid member management features.</li>
            </ul>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
