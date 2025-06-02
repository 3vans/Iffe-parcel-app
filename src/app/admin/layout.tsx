
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, FileText, Image as ImageIcon, MessageSquare, Settings, LayoutDashboard, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

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
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={false}> {/* Default to collapsed on desktop */}
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r bg-card text-card-foreground">
        <SidebarHeader className="p-3 border-b h-14 flex items-center">
          <Link href="/admin" className="flex items-center gap-2 group/logo">
            <RotarySpinner size={28} className="text-primary" />
            <span className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden whitespace-nowrap">
              Admin Panel
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex flex-col justify-center flex-grow">
          <SidebarMenu className="px-2 py-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label, side: 'right', align: 'center', className: 'bg-card text-card-foreground border-border shadow-md' }}
                    className={cn(
                        "w-full justify-start text-sm font-medium",
                         // Rely on data-active for themed active state from sidebar component itself
                    )}
                  >
                    <Link href={item.href} className="flex items-center"> {/* Ensure link is flex for alignment */}
                      <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          "group-data-[collapsible=expanded]:mr-3", // Margin only when expanded
                           isActive ? "" : "text-muted-foreground group-hover/menu-item:text-sidebar-accent-foreground"
                        )} />
                      <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger asChild>
            {/* This trigger is primarily for mobile, hidden on larger screens where sidebar rail/interaction works */}
            <Button size="icon" variant="outline" className="lg:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SidebarTrigger>
          <div className="flex-1">
            {/* Placeholder for future header content, e.g., page title or user actions */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-0">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-6 rounded-md" role="alert">
            <p className="font-bold">Developer Note:</p>
            <p>Admin authentication is currently bypassed for testing. Remember to re-enable security checks.</p>
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
