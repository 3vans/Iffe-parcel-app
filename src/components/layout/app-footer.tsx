
import Link from 'next/link';
import { Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto text-card-foreground hidden md:block">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand and Newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold text-primary mb-4">
              <Globe size={28} className="text-primary" />
              iffe-travels
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Subscribe to our newsletter for the latest travel deals, tips, and stories from the wild.
            </p>
            <form className="flex w-full max-w-sm">
              <Input type="email" placeholder="Enter your email" className="rounded-r-none focus:ring-accent focus:border-accent" />
              <Button type="submit" className="rounded-l-none bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/campaigns" className="text-muted-foreground hover:text-primary">Tours</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Journal</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Departures</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-3">Follow Us</h3>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook">
                <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Instagram">
                <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Twitter">
                <Button variant="outline" size="icon" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/10 hover:border-accent hover:text-accent">
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-xs text-muted-foreground">
          &copy; {currentYear} iffe-travels. All Rights Reserved. Your Adventure Awaits.
        </div>
      </div>
    </footer>
  );
}
