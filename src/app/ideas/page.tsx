
'use client';
import { useState, useEffect } from 'react';
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
import { Lightbulb, PlusCircle, UploadCloud } from 'lucide-react';
import Image from 'next/image'; // Import next/image

const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  imageUrl: z.string().url('Must be a valid URL for the image.').optional().or(z.literal('')),
  dataAiHint: z.string().max(100, 'Keywords cannot exceed 100 characters.').optional(), // Increased limit
});
type IdeaFormValues = z.infer<typeof ideaSchema>;

// Mock data
const initialIdeas: Omit<IdeaCardProps, 'onVote' | 'hasVoted'>[] = [
  { 
    id: '1', 
    title: 'Community Composting Program', 
    description: 'Set up a neighborhood composting system to reduce organic waste and create fertilizer for local gardens. This involves community workshops, distribution of composting bins, and regular collection schedules. The goal is to significantly reduce landfill waste and promote sustainable living practices across several districts.', 
    submittedBy: 'GreenThumb Greta', 
    dateSubmitted: 'Oct 10, 2023', 
    votes: 42, 
    commentsCount: 5, 
    status: 'Approved',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'compost garden',
  },
  { 
    id: '2', 
    title: 'Plastic Bottle Recycling Art Project', 
    description: 'Collect plastic bottles and transform them into public art installations to raise awareness about plastic pollution. This initiative will engage local artists and schools, fostering creativity while highlighting an important environmental issue. The final art pieces will be displayed in prominent public spaces.', 
    submittedBy: 'EcoArtist Alex', 
    dateSubmitted: 'Sep 25, 2023', 
    votes: 78, 
    commentsCount: 12, 
    status: 'Under Review',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'recycle art',
  },
  { 
    id: '3', 
    title: 'Solar-Powered Phone Charging Stations', 
    description: 'Install solar-powered charging stations in public parks and community centers, providing a free and sustainable energy source for residents. These stations will also serve as small hubs for information dissemination about renewable energy.', 
    submittedBy: 'TechSavvy Tom', 
    dateSubmitted: 'Nov 01, 2023', 
    votes: 15, 
    commentsCount: 2, 
    status: 'New',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'solar station',
  },
];

export default function IdeaBoxPage() {
  const [ideas, setIdeas] = useState<Omit<IdeaCardProps, 'onVote' | 'hasVoted'>[]>(initialIdeas);
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
        imageUrl: '',
        dataAiHint: '',
    }
  });
  
  const currentImageUrl = watch('imageUrl');

  useEffect(() => {
    // If the dialog is closed, reset the image preview
    if (!isDialogOpen) {
      setImagePreviewUrl(null);
    }
  }, [isDialogOpen]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result);
        setValue('imageUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
      setValue('imageUrl', '', { shouldValidate: true }); // Clear if no file selected
    }
  };

  const handleVote = (id: string) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea => {
        if (idea.id === id) {
          if (votedIdeas.has(id)) {
            setVotedIdeas(prevVoted => {
              const newVoted = new Set(prevVoted);
              newVoted.delete(id);
              return newVoted;
            });
            toast({ title: "Vote Removed.", description: `Your vote for "${idea.title}" has been removed.`});
            return { ...idea, votes: idea.votes - 1 };
          } else {
            setVotedIdeas(prevVoted => new Set(prevVoted).add(id));
            toast({ title: "Vote Cast!", description: `Thank you for voting for "${idea.title}".`});
            return { ...idea, votes: idea.votes + 1 };
          }
        }
        return idea;
      })
    );
  };

  const onSubmitIdea: SubmitHandler<IdeaFormValues> = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newIdea = {
      id: String(ideas.length + 1 + Date.now()),
      title: data.title,
      description: data.description,
      submittedBy: 'CurrentUser', 
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      votes: 0,
      commentsCount: 0,
      status: 'New' as 'New',
      imageUrl: data.imageUrl || 'https://placehold.co/600x400.png', 
      dataAiHint: data.dataAiHint || 'innovative idea',
    };
    setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    toast({ title: "Idea Submitted!", description: "Your idea has been added to the box."});
    reset();
    setImagePreviewUrl(null); // Reset preview after submission
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
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
             setIsDialogOpen(isOpen);
             if (!isOpen) {
                reset(); // Reset form when closing dialog
                setImagePreviewUrl(null);
             }
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Suggest a New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
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
              
              <div>
                <Label htmlFor="imageUpload" className="text-right font-semibold flex items-center">
                  <UploadCloud className="h-4 w-4 mr-2 text-muted-foreground"/> Upload Image (Optional)
                </Label>
                <Input 
                  id="imageUpload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  className="col-span-3 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {(imagePreviewUrl || (currentImageUrl && currentImageUrl.startsWith('data:image'))) && (
                <div className="mt-2 col-span-3">
                  <Label className="font-semibold">Image Preview:</Label>
                  <div className="relative w-full aspect-video mt-1 border rounded-md overflow-hidden bg-muted">
                    <Image src={imagePreviewUrl || currentImageUrl || ''} alt="Idea preview" layout="fill" objectFit="contain" />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="imageUrl" className="text-right font-semibold">Or Paste Image URL (Optional)</Label>
                <Input 
                    id="imageUrl" 
                    {...register('imageUrl')} 
                    className="col-span-3 mt-1" 
                    placeholder="https://example.com/image.png"
                    // If a file is uploaded, this field is populated by its data URI.
                    // User can still override by typing/pasting here.
                />
                {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <Label htmlFor="dataAiHint" className="text-right font-semibold">Image Keywords (for AI)</Label>
                <Input id="dataAiHint" {...register('dataAiHint')} className="col-span-3 mt-1" placeholder="e.g., nature community (max 2 words)" />
                {errors.dataAiHint && <p className="text-sm text-destructive mt-1">{errors.dataAiHint.message}</p>}
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
          <IdeaCard 
            key={idea.id} 
            {...idea} 
            onVote={handleVote} 
            hasVoted={votedIdeas.has(idea.id)}
          />
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
