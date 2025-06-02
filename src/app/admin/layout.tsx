
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, FileText, Image as ImageIcon, MessageSquare, Settings, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/admin/posts', label: 'Content Moderation', icon: FileText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/chatrooms', label: 'Chatrooms', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      router.replace('/'); // Not logged in
      return;
    }

    // Status is 'authenticated' here
    if (!session?.user?.role || session.user.role !== 'admin') {
      router.replace('/'); // Logged in, but not an admin or role is missing
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <RotarySpinner size={60} />
      </div>
    );
  }

  // This check ensures that if redirection is slow or fails, "Access Denied" is shown
  // instead of potentially flashing admin content.
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6 text-center">You do not have permission to view this page. Redirecting...</p>
            <Button onClick={() => router.push('/')} variant="outline">Go to Homepage</Button>
        </div>
    );
  }
  
  // If we reach here, status is 'authenticated' and user.role is 'admin'
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/admin"
            className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 text-lg font-semibold text-primary-foreground md:h-10 md:px-4 md:text-base"
          >
            <RotarySpinner size={20} className="transition-all group-hover:scale-110" />
            <span>Admin Panel</span>
          </Link>
        </nav>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
      <main className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-72 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
