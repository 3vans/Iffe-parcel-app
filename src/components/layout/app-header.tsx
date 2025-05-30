
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, CalendarDays, PlusCircle, UserCircle, BarChart3, Edit3, Lightbulb, Image as ImageIcon, PlayCircle, LogIn, UserPlus } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner'; // Added import for the spinner

const AppHeader = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialStep, setSignupInitialStep] = useState<"user" | "community" | "erotaract" | null>(null);
  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > headerHeight + 50) { 
        setShowNavbar(false);
      } else { 
        if (window.scrollY < lastScrollY || window.scrollY <= 50) {
            setShowNavbar(true);
        }
      }
      setLastScrollY(window.scrollY); 
    }
  }, [lastScrollY, headerHeight]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);


  const openSignupModal = (initialStep: "user" | "community" | "erotaract" | null = null) => {
    setSignupInitialStep(initialStep);
    setIsSignupModalOpen(true);
  };


  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          "bg-card/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-transform duration-300 ease-in-out",
          showNavbar ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-2 font-headline text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors">
              <RotarySpinner size={20} /> 
              Rotaract eClub Uganda Global
            </a>
          </Link>
          
          {/* Desktop Navigation Links - Hidden on mobile as they are in BottomNav */}
          <div className="hidden md:flex space-x-1 items-center">
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="mr-1 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/campaigns">
                <BarChart3 className="mr-1 h-4 w-4" /> Campaigns
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <Edit3 className="mr-1 h-4 w-4" /> Blog
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/events">
                <CalendarDays className="mr-1 h-4 w-4" /> Events
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
                <Lightbulb className="mr-1 h-4 w-4" /> Idea Box
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <UserCircle className="mr-1 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            {/* Auth Buttons - Hidden on mobile for cleaner look, accessible via other means or future mobile menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                <LogIn className="mr-2 h-4 w-4"/> Login
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openSignupModal()}>
                <UserPlus className="mr-2 h-4 w-4"/> Sign Up
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <SignupModal open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} initialStep={signupInitialStep} />
    </>
  );
};

export default AppHeader;
