'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Send, MapPin, Share2, Facebook, Instagram, Twitter, Linkedin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import placeholderImages from "@/app/lib/placeholder-images.json";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import HeroSection from "@/components/layout/hero-section";
import { useState } from 'react';
import TestimonialSection from '@/components/testimonial-section';
import Link from 'next/link';
import { submitContactMessage } from '@/lib/services/cms-service';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;


const teamMembers = [
  {
    name: "Ian Mudembula",
    role: "Founder & Lead Guide",
    avatar: placeholderImages.teamJane,
    link: "/profile/ian-mudembula",
  },
  {
    name: "Ben",
    role: "Head of Operations",
    avatar: placeholderImages.teamJohn,
    link: "/profile/ben",
  },
  {
    name: "Alice Green",
    role: "Customer Relations",
    avatar: placeholderImages.teamAlice,
    link: "/profile/alice-green",
  },
];

function AnimatedCard({ children, className }: { children: React.ReactNode, className?:string }) {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
           <Card className={cn("bg-card/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1", className)}>
                {children}
            </Card>
        </div>
    );
}

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await submitContactMessage(data);
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. Our team will contact you shortly via email.",
      });
      reset();
    } catch (err) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <HeroSection 
        title="Get in Touch"
        subtitle="We'd love to hear from you. Whether you have a question about our tours or want to plan a custom safari, our team is ready to help."
        iconName="Mail"
        imageUrl={placeholderImages.teamJane.src}
        dataAiHint={placeholderImages.teamJane.hint}
      />
      
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-12 container mx-auto max-w-4xl px-4')}>
        <AnimatedCard>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center"><Send className="mr-2 h-6 w-6 text-accent"/>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-semibold">Your Name</Label>
                <Input id="name" {...register('name')} disabled={isSubmitting} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">Your Email</Label>
                <Input id="email" type="email" {...register('email')} disabled={isSubmitting} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold">Your Message</Label>
                <Textarea id="message" {...register('message')} rows={5} disabled={isSubmitting} placeholder="How can we help you plan your adventure?" />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-black uppercase tracking-widest" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> SENDING...</> : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </AnimatedCard>

        <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold text-primary flex items-center"><Users className="mr-2 h-6 w-6 text-accent"/>Meet Our Team</h2>
            <div className="space-y-4">
            {teamMembers.map((member) => (
              <Link href={member.link} key={member.name} className="block">
                <AnimatedCard className="p-4 flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage asChild src={member.avatar.src}>
                            <Image src={member.avatar.src} alt={member.name} width={member.avatar.width} height={member.avatar.height} data-ai-hint={member.avatar.hint}/>
                        </AvatarImage>
                        <AvatarFallback>{member.name.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                </AnimatedCard>
              </Link>
            ))}
            </div>
        </div>
      </div>
      
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-12 container mx-auto max-w-4xl px-4')}>
        <AnimatedCard>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center">
                    <MapPin className="mr-2 h-6 w-6 text-accent"/> Our Location
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-muted">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://maps.google.com/maps?q=0.347596,32.582520&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="iffe-travels Location"
                        loading="lazy"
                    ></iframe>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">Plot 123, Adventure Lane, Kampala, Uganda</p>
            </CardContent>
        </AnimatedCard>
        <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold text-primary flex items-center"><Share2 className="mr-2 h-6 w-6 text-accent"/> Connect With Us</h2>
            <div className="space-y-3">
                 <Button asChild variant="outline" className="w-full justify-center text-lg py-6 rounded-full border-primary/50">
                    <Link href="#">
                        <i className="fa-brands fa-facebook mr-3 h-6 w-6 text-blue-600"></i> Facebook
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center text-lg py-6 rounded-full border-primary/50">
                    <Link href="https://www.instagram.com/iffe.travels.ltd" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram mr-3 h-6 w-6 text-pink-500"></i> Instagram
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="w-full justify-center text-lg py-6 rounded-full border-primary/50">
                    <Link href="https://x.com/IMudembula" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-x-twitter mr-3 h-6 w-6 text-foreground"></i> X (Twitter)
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center text-lg py-6 rounded-full border-primary/50">
                    <Link href="https://www.linkedin.com/in/iffe-travels-limited-201849415" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-linkedin mr-3 h-6 w-6 text-sky-700"></i> LinkedIn
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="w-full justify-center text-lg py-6 rounded-full border-primary/50">
                    <Link href="#">
                        <i className="fa-brands fa-tripadvisor mr-3 h-6 w-6 text-green-600"></i> TripAdvisor
                    </Link>
                </Button>
            </div>
        </div>
      </div>

      <TestimonialSection />
    </div>
  );
}
