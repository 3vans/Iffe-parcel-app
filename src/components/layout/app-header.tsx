import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, CalendarDays, PlusCircle, UserCircle, BarChart3, Edit3, Lightbulb } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50 hidden md:block">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="font-headline text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            e-Rotary Hub
          </a>
        </Link>
        <div className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/campaigns">
              <BarChart3 className="mr-2 h-4 w-4" /> Campaigns
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <Edit3 className="mr-2 h-4 w-4" /> Blog
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/events">
              <CalendarDays className="mr-2 h-4 w-4" /> Events
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/ideas">
              <Lightbulb className="mr-2 h-4 w-4" /> Idea Box
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <UserCircle className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
