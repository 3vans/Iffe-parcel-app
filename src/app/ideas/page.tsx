
'use client';
import { useState, useEffect } from 'react';
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
import { PlusCircle, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  imageUrl: z.string().url('Must be a valid URL for the image.').optional().or(z.literal('')),
  dataAiHint: z.string().max(100, 'Keywords cannot exceed 100 characters.').optional(),
});
type IdeaFormValues = z.infer<typeof ideaSchema>;

// Mock data
const initialIdeas: Omit<IdeaCardProps, 'onVote' | 'hasVoted'>[] = [
  { 
    id: '1', 
    title: 'Walking Safari in Zambia', 
    description: 'Develop a new tour focused on immersive walking safaris in South Luangwa National Park, known for its incredible leopard sightings and on-foot tracking experiences. This would be for more adventurous, fit clients seeking a deeper connection with the bush.', 
    submittedBy: 'Adventurous Al', 
    dateSubmitted: 'Oct 10, 2023', 
    votes: 42, 
    commentsCount: 5, 
    status: 'Approved',
    imageUrl: placeholderImages.ideaWalkingSafari.src,
    dataAiHint: placeholderImages.ideaWalkingSafari.hint,
  },
  { 
    id: '2', 
    title: 'Family-Friendly Safari Package', 
    description: 'Create a dedicated package for families with young children, including kid-friendly lodges, special activities like animal tracking for kids, and shorter game drives. The goal is to make safari accessible and fun for all ages.', 
    submittedBy: 'Family-First Fiona', 
    dateSubmitted: 'Sep 25, 2023', 
    votes: 78, 
    commentsCount: 12, 
    status: 'Under Review',
    imageUrl: placeholderImages.ideaFamilySafari.src,
    dataAiHint: placeholderImages.ideaFamilySafari.hint,
  },
  { 
    id: '3', 
    title: 'Photographic Hide at a Waterhole', 
    description: 'Build a permanent photographic hide at a key waterhole, offering photographers a unique, low-angle perspective for stunning wildlife shots, especially during the dry season. This could be an add-on activity.', 
    submittedBy: 'Shutterbug Sam', 
    dateSubmitted: 'Nov 01, 2023', 
    votes: 15, 
    commentsCount: 2, 
    status: 'New',
    imageUrl: placeholderImages.ideaPhotoHide.src,
    dataAiHint: placeholderImages.ideaPhotoHide.hint,
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
      imageUrl: data.imageUrl || placeholderImages.ideaWalkingSafari.src, 
      dataAiHint: data.dataAiHint || 'innovative idea',
    };
    setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    toast({ title: "Trip Idea Submitted!", description: "Your suggestion has been added."});
    reset();
    setImagePreviewUrl(null); // Reset preview after submission
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };
  
    const AnimatedIdeaCard = ({ idea }: { idea: Omit<IdeaCardProps, 'onVote' | 'hasVoted'> }) => {
        const [ref, isVisible] = useScrollAnimation();
        return (
            <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
                <IdeaCard 
                    key={idea.id} 
                    {...idea} 
                    onVote={handleVote} 
                    hasVoted={votedIdeas.has(idea.id)}
                />
            </div>
        );
    };

    const [headerRef, isHeaderVisible] = useScrollAnimation();
    const heroImage = placeholderImages.ideaFamilySafari.src;
    const heroDataAiHint = placeholderImages.ideaFamilySafari.hint;


  return (
    <div className="space-y-8 animate-fade-in">
      <section ref={headerRef} className={cn('relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-lg shadow-lg scroll-animate flex items-center', isHeaderVisible && 'scroll-animate-in')}>
        <Image
          src={heroImage}
          alt="Dream Trips"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={heroDataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-stone-900/30 z-10"></div>
        
        <div className="absolute inset-0 h-full flex items-center z-10 min-h-[400px]">
            <div className="relative w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-gradient-to-r from-stone-900/80 via-stone-900/80 to-transparent text-white backdrop-blur-md p-8 md:p-12 rounded-lg">
              <p className="font-semibold text-yellow-400 uppercase tracking-widest text-sm mb-2">Community Wishlist</p>
              <h1 className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest" style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>
                Dream Trips
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8">
                Suggest new destinations and vote on where we should go next!
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                     setIsDialogOpen(isOpen);
                     if (!isOpen) {
                        reset();
                        setImagePreviewUrl(null);
                     }
                }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-stone-900 font-bold hover:opacity-90 transition-transform hover:scale-105">
                        <PlusCircle className="mr-2 h-5 w-5" /> Suggest a Trip Idea
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl text-primary">Submit Your Idea</DialogTitle>
                      <DialogDescription>
                        Share your brilliant ideas for new tours and destinations.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitIdea)} className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="title" className="text-right font-semibold">
                          Trip Idea / Title
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
                            <Image src={imagePreviewUrl || currentImageUrl || ''} alt="Idea preview" fill objectFit="contain" />
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
            </div>
          </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map(idea => (
          <AnimatedIdeaCard key={idea.id} idea={idea} />
        ))}
      </section>

      {ideas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The suggestion box is empty. Be the first to suggest a dream trip!</p>
        </div>
      )}
    </div>
  );
}
