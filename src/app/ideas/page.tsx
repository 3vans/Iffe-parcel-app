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
import { PlusCircle, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { fetchIdeas, submitIdea, voteForIdea, type Idea } from '@/lib/services/cms-service';

const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  imageUrl: z.string().url('Must be a valid URL for the image.').optional().or(z.literal('')),
  dataAiHint: z.string().max(100, 'Keywords cannot exceed 100 characters.').optional(),
});
type IdeaFormValues = z.infer<typeof ideaSchema>;

export default function IdeaBoxPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (err) {
      toast({ title: "Failed to load ideas", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
        imageUrl: '',
        dataAiHint: '',
    }
  });
  
  const currentImageUrl = watch('imageUrl');

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
    }
  };

  const handleVote = async (id: string) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to vote for ideas.", variant: "destructive" });
      return;
    }

    const idea = ideas.find(i => i.id === id);
    if (!idea) return;

    const hasVoted = idea.voters.includes(user.uid);
    
    try {
      await voteForIdea(id, user.uid, hasVoted);
      loadIdeas(); // Refresh list
      toast({ 
        title: hasVoted ? "Vote Removed" : "Vote Cast!", 
        description: hasVoted ? `You unvoted for "${idea.title}"` : `Thank you for supporting "${idea.title}"`
      });
    } catch (err) {
      toast({ title: "Voting Failed", variant: "destructive" });
    }
  };

  const onSubmitIdea: SubmitHandler<IdeaFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to submit a trip idea.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitIdea({
        title: data.title,
        description: data.description,
        submittedBy: user.displayName || user.email || 'Anonymous',
        imageUrl: data.imageUrl,
        dataAiHint: data.dataAiHint,
      });
      
      toast({ title: "Trip Idea Submitted!", description: "Your suggestion has been added to the database."});
      loadIdeas();
      reset();
      setImagePreviewUrl(null);
      setIsDialogOpen(false);
    } catch (err) {
      toast({ title: "Submission Failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
    const AnimatedIdeaCard = ({ idea }: { idea: Idea }) => {
        const [ref, isVisible] = useScrollAnimation();
        const hasVoted = user ? idea.voters.includes(user.uid) : false;

        return (
            <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
                <IdeaCard 
                    id={idea.id}
                    title={idea.title}
                    description={idea.description}
                    submittedBy={idea.submittedBy}
                    dateSubmitted={idea.dateSubmitted}
                    votes={idea.votes}
                    commentsCount={idea.commentsCount}
                    status={idea.status}
                    imageUrl={idea.imageUrl}
                    dataAiHint={idea.dataAiHint}
                    onVote={handleVote} 
                    hasVoted={hasVoted}
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
              <h1
                className="font-headline text-4xl md:text-5xl font-black mb-4 pb-4 relative uppercase tracking-widest"
                style={{
                  color: 'hsl(var(--primary-foreground))',
                  WebkitTextStroke: '1px hsl(var(--primary))',
                }}
              >
                Dream Trips
                 <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md mb-8">
                Suggest new destinations and vote on where we should go next!
              </p>
              <div className="flex flex-wrap items-center gap-4">
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                            <Image src={imagePreviewUrl || currentImageUrl || ''} alt="Idea preview" fill style={{ objectFit: 'contain' }} />
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

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
          {ideas.map(idea => (
            <AnimatedIdeaCard key={idea.id} idea={idea} />
          ))}
        </section>
      )}

      {!isLoading && ideas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">The suggestion box is empty. Be the first to suggest a dream trip!</p>
        </div>
      )}
    </div>
  );
}
