
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, CalendarDays, PlusCircle, UserCircle, BarChart3, Edit3, Lightbulb, Image as ImageIcon, PlayCircle, LogIn, UserPlus, Menu, X, LogOut, MountainSnow, Telescope, Globe } from 'lucide-react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AppHeader = () => {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialStep, setSignupInitialStep] = useState<"user" | "community" | "erotaract" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    // Target the <main> element for scrolling
    scrollContainerRef.current = document.querySelector('main#main-scroll-container');
  }, []);

  const controlNavbar = useCallback(() => {
    const currentScrollContainer = scrollContainerRef.current;
    if (currentScrollContainer) {
      const currentScrollTop = currentScrollContainer.scrollTop;
      if (currentScrollTop > lastScrollY.current && currentScrollTop > headerHeight + 50) { 
        setShowNavbar(false);
      } else { 
        if (currentScrollTop < lastScrollY.current || currentScrollTop <= 50) {
            setShowNavbar(true);
        }
      }
      lastScrollY.current = currentScrollTop;
    }
  }, [headerHeight]);

  useEffect(() => {
    const currentScrollContainer = scrollContainerRef.current;
    if (currentScrollContainer) {
      currentScrollContainer.addEventListener('scroll', controlNavbar);
      return () => {
        currentScrollContainer.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);

  const openSignupModal = (initialStep: "user" | "community" | "erotaract" | null = null) => {
    setSignupInitialStep(initialStep);
    setIsSignupModalOpen(true);
    setIsMobileMenuOpen(false); 
  };

  const openLoginModalDirectly = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to home after sign out
    setIsMobileMenuOpen(false);
  };

  const mobileNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/campaigns', label: 'Tours', icon: MountainSnow },
    { href: '/blog', label: 'Journal', icon: Edit3 },
    { href: '/events', label: 'Departures', icon: CalendarDays },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/videos', label: 'Videos', icon: PlayCircle },
    { href: '/ideas', label: 'Dream Trips', icon: Lightbulb },
    { href: '/dashboard', label: 'My Trips', icon: UserCircle },
  ];

  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          "bg-card/75 backdrop-blur-lg border-b border-white/10 shadow-lg sticky top-0 z-50 transition-transform duration-300 ease-in-out",
          showNavbar ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Globe size={24} className="text-primary" /> 
            i-TRAVELS
          </Link>
          
          <div className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="mr-1 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/campaigns">
                <MountainSnow className="mr-1 h-4 w-4" /> Tours
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <Edit3 className="mr-1 h-4 w-4" /> Journal
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/events">
                <CalendarDays className="mr-1 h-4 w-4" /> Departures
              </Link>
            </Button>
             <Button variant="ghost" asChild>
              <Link href="/gallery">
                <ImageIcon className="mr-1 h-4 w-4" /> Gallery
              </Link>
            </Button>
             <Button variant="ghost" asChild>
              <Link href="/videos">
                <PlayCircle className="mr-1 h-4 w-4" /> Videos
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/ideas">
                <Lightbulb className="mr-1 h-4 w-4" /> Dream Trips
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <UserCircle className="mr-1 h-4 w-4" /> My Trips
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2 bg-border" />
            {status === 'loading' ? (
              <Button variant="outline" disabled>Loading...</Button>
            ) : session?.user ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} data-ai-hint="profile avatar" />
                  <AvatarFallback>{session.user.name?.substring(0,1).toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                 <span className="text-sm font-medium mx-2 hidden xl:inline">{session.user.name}</span>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                  <LogIn className="mr-2 h-4 w-4"/> Login
                </Button>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openSignupModal()}>
                  <UserPlus className="mr-2 h-4 w-4"/> Sign Up
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] flex flex-col bg-card/95 backdrop-blur-lg p-0">
                  <SheetHeader className="p-4 border-b">
                     <SheetTitle className="flex items-center gap-2 text-primary">
                       <Globe size={20} className="text-primary" /> i-TRAVELS
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex-grow overflow-y-auto p-4 space-y-2">
                    {mobileNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center p-3 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          <item.icon className="mr-3 h-5 w-5 text-accent" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <Separator className="my-2" />
                  <div className="p-4 space-y-3 border-t">
                    {status === 'loading' ? (
                      <Button variant="outline" className="w-full justify-start p-3 text-base" disabled>Loading...</Button>
                    ) : session?.user ? (
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full justify-start p-3 text-base" onClick={handleSignOut}>
                          <LogOut className="mr-3 h-5 w-5 text-accent"/> Sign Out
                        </Button>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button variant="outline" className="w-full justify-start p-3 text-base" onClick={openLoginModalDirectly}>
                            <LogIn className="mr-3 h-5 w-5 text-accent"/> Login
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button className="w-full justify-start p-3 text-base bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openSignupModal()}>
                            <UserPlus className="mr-3 h-5 w-5"/> Sign Up
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>
      {!session?.user && <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />}
      {!session?.user && <SignupModal open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} initialStep={signupInitialStep} />}
    </>
  );
};

export default AppHeader;
