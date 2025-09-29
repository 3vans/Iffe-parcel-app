
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import placeholderImages from "@/app/lib/placeholder-images.json";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & Lead Guide",
    avatar: placeholderImages.teamJane,
  },
  {
    name: "John Smith",
    role: "Head of Operations",
    avatar: placeholderImages.teamJohn,
  },
  {
    name: "Alice Green",
    role: "Customer Relations",
    avatar: placeholderImages.teamAlice,
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [ref1, isVisible1] = useScrollAnimation();
  const [ref2, isVisible2] = useScrollAnimation();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent! (Simulated)",
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    // In a real app, you would handle form submission here
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-12">
      <section ref={ref1} className={cn('text-center scroll-animate', isVisible1 && 'scroll-animate-in')}>
        <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <Mail className="h-12 w-12 text-accent" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">Get in Touch</h1>
        <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you. Whether you have a question about our tours, or anything else, our team is ready to answer all your questions.</p>
      </section>
      
      <div ref={ref2} className={cn('grid grid-cols-1 md:grid-cols-2 gap-12 scroll-animate', isVisible2 && 'scroll-animate-in')}>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center"><Send className="mr-2 h-6 w-6 text-accent"/>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-semibold">Your Name</Label>
                <Input id="name" type="text" required />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">Your Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold">Your Message</Label>
                <Textarea id="message" rows={5} required />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold text-primary flex items-center"><Users className="mr-2 h-6 w-6 text-accent"/>Meet Our Team</h2>
            <div className="space-y-4">
            {teamMembers.map((member) => (
                <Card key={member.name} className="bg-card/80 backdrop-blur-sm p-4 flex items-center space-x-4">
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
                </Card>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
