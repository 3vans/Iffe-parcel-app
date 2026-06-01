import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { ThemeProviderClient } from '@/components/theme-provider-client';
import { AuthProvider } from '@/context/AuthContext';
import WhatsAppCTA from '@/components/layout/whatsapp-cta';
import BottomNav from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'iffe-travels | Professional Adventure Tourism',
  description: 'Your adventure into the wild awaits. Bespoke safari tours, community-driven expeditions, and expert-led journeys across Africa.',
  icons: null,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="max-w-full overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://www.youtube.com" />
      </head>
      <body suppressHydrationWarning className="max-w-full overflow-x-hidden relative">
        <AuthProvider>
          <ThemeProviderClient>
            <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
              <AppHeader />
              <main className="flex-grow w-full max-w-full overflow-x-hidden">
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