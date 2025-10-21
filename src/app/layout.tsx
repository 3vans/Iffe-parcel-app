
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer'; // Import the new footer
import { ThemeProviderClient } from '@/components/theme-provider-client';
import AuthProvider from '@/components/auth-provider';
import WhatsAppCTA from '@/components/layout/whatsapp-cta';
import BottomNav from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'iffe-travels',
  description: 'Your adventure into the wild awaits. Book unforgettable safari tours and expeditions.',
  icons: null,
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProviderClient>
            <div className="flex flex-col min-h-screen">
              <AppHeader />
              <main 
                className="flex-grow px-1 sm:px-4 pt-4 sm:pt-8 pb-24"
              >
                {children}
              </main>
              <AppFooter />
              <WhatsAppCTA />
              <BottomNav />
            </div>
            <Toaster />
          </ThemeProviderClient>
        </AuthProvider>
      </body>
    </html>
  );
}
