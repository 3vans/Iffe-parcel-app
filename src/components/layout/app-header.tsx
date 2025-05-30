
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, CalendarDays, PlusCircle, UserCircle, BarChart3, Edit3, Lightbulb, Image as ImageIcon, PlayCircle, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

const AppHeader = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialStep, setSignupInitialStep] = useState<"user" | "community" | "erotaract" | null>(null);


  const openSignupModal = (initialStep: "user" | "community" | "erotaract" | null = null) => {
    setSignupInitialStep(initialStep);
    setIsSignupModalOpen(true);
  };


  return (
    <>
      <header className="bg-card shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" legacyBehavior>
            <a className="font-headline text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              e-Rotary Hub
            </a>
          </Link>
          
          {/* Desktop Navigation Links - Hidden on mobile */}
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
            <ThemeToggleButton /> {/* Always visible */}
            {/* Auth Buttons - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                <LogIn className="mr-2 h-4 w-4"/> Login
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openSignupModal()}>
                <UserPlus className="mr-2 h-4 w-4"/> Sign Up
              </Button>
            </div>
             {/* Placeholder for mobile menu trigger - can be added later */}
            {/* <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button> */}
          </div>
        </nav>
      </header>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <SignupModal open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} initialStep={signupInitialStep} />
    </>
  );
};

export default AppHeader;
