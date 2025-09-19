
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/app-header';
import BottomNav from '@/components/layout/bottom-nav';
import { ThemeProviderClient } from '@/components/theme-provider-client';
import AuthProvider from '@/components/auth-provider'; // Import AuthProvider

export const metadata: Metadata = {
  title: 'iffe-travels',
  description: 'Your adventure into the wild awaits. Book unforgettable safari tours and expeditions.',
  icons: null, // Explicitly tell Next.js not to look for default icons
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col h-screen"
        // Removed style={{ overflowX: 'hidden !important', overflowY: 'hidden !important' }}
      >
        <AuthProvider> {/* Wrap with AuthProvider */}
          <ThemeProviderClient>
            <AppHeader />
            <main 
              className="flex-grow container mx-auto px-4 pt-8 pb-24 md:pb-8 animate-fade-in" 
              id="main-scroll-container" 
              style={{ overflowY: 'auto' }}
            >
              {children}
            </main>
            <BottomNav />
            <Toaster />
          </ThemeProviderClient>
        </AuthProvider>
      </body>
    </html>
  );
}
