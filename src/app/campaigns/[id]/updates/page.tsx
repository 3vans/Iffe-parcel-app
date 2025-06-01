
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rss } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CampaignUpdatesPage({ params }: { params: { id: string } }) {
  // In a real app, fetch campaign updates for params.id
  const campaignTitle = `Campaign ID: ${params.id}`; // Placeholder title

  const mockUpdates = [
    { id: 'u1', date: 'Nov 10, 2023', title: 'Project Kick-off!', content: `We're excited to announce that Campaign ${params.id} has officially started! Thanks to our early supporters.` },
    { id: 'u2', date: 'Nov 15, 2023', title: 'First Milestone Reached', content: `Great news! We've hit our first milestone. More details to come on how these funds will be utilized.` },
    { id: 'u3', date: 'Nov 20, 2023', title: 'Volunteer Call', content: `We're looking for volunteers for an upcoming event related to Campaign ${params.id}. Sign up if you're interested!` },
  ];
  
  return (
    <div className="space-y-6 animate-slide-up">
      <Button variant="ghost" asChild>
        <Link href={`/campaigns/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign Details
        </Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <Rss className="mr-3 h-7 w-7 text-accent" />
            Updates for {campaignTitle}
          </CardTitle>
          <CardDescription>
            Stay informed about the latest progress and news for this campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockUpdates.length > 0 ? (
            mockUpdates.map(update => (
              <Card key={update.id} className="bg-muted/30 p-0">
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-xl text-primary">{update.title}</CardTitle>
                  <CardDescription className="text-xs">{update.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{update.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No updates posted for this campaign yet. Check back soon!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
