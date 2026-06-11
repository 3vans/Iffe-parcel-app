'use client';
import Link from 'next/link';
import { Globe, Facebook, Twitter, Instagram, Linkedin, Youtube, Waves, Mountain, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AppFooter() {
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = (e.currentTarget.elements.namedItem('email') as HTMLInputElement);
    const email = emailInput.value;

    if (email) {
      toast({
        title: "Subscribed! (Simulated)",
        description: `Thank you for subscribing, ${email}!`,
      });
      emailInput.value = '';
    } else {
       toast({
        title: "Email required",
        description: `Please enter a valid email to subscribe.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-card/75 backdrop-blur-lg border-t mt-auto text-card-foreground">
        <footer className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Brand, Newsletter, Social */}
            <div className="space-y-6">
                <div>
                    <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold text-primary mb-4">
                        <Globe size={28} className="text-primary" />
                        iffe-travels
                    </Link>
                    <div className="flex items-start text-sm text-muted-foreground mb-4 max-w-sm">
                        <MapPin className="h-4 w-4 mr-2 mt-1 text-accent shrink-0" />
                        <span>Plot 123, Adventure Lane, Kampala, Uganda</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Subscribe to our newsletter for the latest travel deals, tips, and stories from the wild.
                    </p>
                    <form className="flex w-full max-w-sm" onSubmit={handleNewsletterSubmit}>
                        <Input name="email" type="email" placeholder="Enter your email" className="rounded-r-none focus:ring-accent focus:border-accent" />
                        <Button type="submit" className="rounded-l-none bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
                    </form>
                </div>
                <div>
                <h3 className="font-headline text-lg font-semibold text-primary mb-3">Follow Us</h3>
                <div className="flex space-x-3">
                    <Link href="#" aria-label="Facebook">
                    <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                        <Facebook className="h-5 w-5" />
                    </Button>
                    </Link>
                    <Link href="https://www.instagram.com/iffe.travels.ltd" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                        <Instagram className="h-5 w-5" />
                    </Button>
                    </Link>
                    <Link href="https://x.com/IMudembula" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                        <Twitter className="h-5 w-5" />
                    </Button>
                    </Link>
                    <Link href="https://www.linkedin.com/in/iffe-travels-limited-201849415" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                        <Linkedin className="h-5 w-5" />
                    </Button>
                    </Link>
                    <Link href="https://www.youtube.com/channel/UCpzZFQ5eBs11PElV5z7CGPw" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                        <Youtube className="h-5 w-5" />
                    </Button>
                    </Link>
                </div>
                </div>
            </div>

            {/* Column 2: Quick Links & Company */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                <h3 className="font-headline text-lg font-semibold text-primary mb-3">Trips</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/packages" className="text-muted-foreground hover:text-primary">Packages</Link></li>
                    <li><Link href="/events" className="text-muted-foreground hover:text-primary">Departures</Link></li>
                    <li className="flex items-center gap-2"><Waves className="h-4 w-4 text-accent" /><Link href="/discover-jinja" className="text-muted-foreground hover:text-primary">Discover Jinja</Link></li>
                    <li className="flex items-center gap-2"><Mountain className="h-4 w-4 text-accent" /><Link href="/sipi-falls" className="text-muted-foreground hover:text-primary">Sipi Falls Adventure</Link></li>
                    <li><Link href="/ideas" className="text-muted-foreground hover:text-primary">Dream Trips</Link></li>
                </ul>
                </div>
                <div>
                <h3 className="font-headline text-lg font-semibold text-primary mb-3">Explore</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Journal</Link></li>
                    <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
                    <li><Link href="/videos" className="text-muted-foreground hover:text-primary">Videos</Link></li>
                </ul>
                </div>
                <div>
                <h3 className="font-headline text-lg font-semibold text-primary mb-3">Company</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                    <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                    <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                    <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                </ul>
                </div>
            </div>
            </div>

            {/* Bottom Perforation Strip (Inert in Footer) */}
            <Separator className="my-6" />

            <div className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} iffe-travels. All Rights Reserved. Your Adventure Awaits.
            </div>
        </footer>
    </div>
  );
}
