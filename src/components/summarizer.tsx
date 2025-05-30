
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import RotarySpinner from '@/components/ui/rotary-spinner'; // New Import
import { campaignDescriptionSummarizer } from '@/ai/flows/campaign-description-summarizer'; // Adjust path if needed
import { useToast } from '@/hooks/use-toast';

interface SummarizerProps {
  campaignDescription: string;
  campaignTitle: string;
}

const Summarizer: React.FC<SummarizerProps> = ({ campaignDescription, campaignTitle }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await campaignDescriptionSummarizer({ campaignDescription });
      setSummary(result.summary);
      toast({
        title: "Summary Generated!",
        description: `AI summary for "${campaignTitle}" is ready.`,
      });
    } catch (error) {
      console.error("Error summarizing campaign:", error);
      toast({
        title: "Error",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
      setSummary("Failed to generate summary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-accent" />
          AI Content Summarizer
        </CardTitle>
        <CardDescription>Get a quick highlight of this campaign's key points.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSummarize} disabled={isLoading} className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <>
              <RotarySpinner size={16} className="mr-2" />
              Generating...
            </>
          ) : (
            <>
             <Wand2 className="mr-2 h-4 w-4" />
              Summarize Campaign
            </>
          )}
        </Button>
        {summary && (
          <div className="p-4 bg-muted/50 rounded-md border border-border">
            <h4 className="font-semibold mb-2 text-primary">Summary:</h4>
            <p className="text-sm text-foreground">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Summarizer;
