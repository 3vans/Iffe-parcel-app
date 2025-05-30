'use client';
import { useState } from 'react';
import Link from 'next/link';
import IdeaCard, { type IdeaCardProps } from '@/components/idea-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, PlusCircle } from 'lucide-react';

const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
});
type IdeaFormValues = z.infer<typeof ideaSchema>;

// Mock data
const initialIdeas: IdeaCardProps[] = [
  { id: '1', title: 'Community Composting Program', description: 'Set up a neighborhood composting system to reduce organic waste and create fertilizer for local gardens.', submittedBy: 'GreenThumb Greta', dateSubmitted: 'Oct 10, 2023', votes: 42, commentsCount: 5, status: 'Approved', onVote: () => {} },
  { id: '2', title: 'Plastic Bottle Recycling Art Project', description: 'Collect plastic bottles and transform them into public art installations to raise awareness about plastic pollution.', submittedBy: 'EcoArtist Alex', dateSubmitted: 'Sep 25, 2023', votes: 78, commentsCount: 12, status: 'Under Review', onVote: () => {} },
  { id: '3', title: 'Solar-Powered Phone Charging Stations', description: 'Install solar-powered charging stations in public parks and community centers.', submittedBy: 'TechSavvy Tom', dateSubmitted: 'Nov 01, 2023', votes: 15, commentsCount: 2, status: 'New', onVote: () => {} },
];

export default function IdeaBoxPage() {
  const [ideas, setIdeas] = useState<Omit<IdeaCardProps, 'onVote'>[]>(initialIdeas);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
  });

  const handleVote = (id: string) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
    toast({ title: "Vote Cast!", description: "Thank you for your feedback."});
  };

  const onSubmitIdea: SubmitHandler<IdeaFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newIdea = {
      id: String(ideas.length + 1),
      ...data,
      submittedBy: 'CurrentUser', // Replace with actual user
      dateSubmitted: new Date().toLocaleDateString(),
      votes: 0,
      commentsCount: 0,
      status: 'New' as 'New',
    };
    setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    toast({ title: "Idea Submitted!", description: "Your idea has been added to the box."});
    reset();
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2 flex items-center justify-center">
          <Lightbulb className="h-10 w-10 mr-3 text-accent" />
          Idea Box
        </h1>
        <p className="text-lg text-muted-foreground">Suggest projects and vote on what our community should tackle next!</p>
      </section>

      <div className="text-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Suggest a New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">Submit Your Idea</DialogTitle>
              <DialogDescription>
                Share your brilliant ideas to help improve our community and platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitIdea)} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title" className="text-right font-semibold">
                  Idea Title
                </Label>
                <Input id="title" {...register('title')} className="col-span-3 mt-1" />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-right font-semibold">
                  Description
                </Label>
                <Textarea id="description" {...register('description')} className="col-span-3 mt-1" rows={4} />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                  {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map(idea => (
          <IdeaCard key={idea.id} {...idea} onVote={handleVote} />
        ))}
      </section>

      {ideas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The Idea Box is empty. Be the first to suggest something!</p>
        </div>
      )}
    </div>
  );
}
