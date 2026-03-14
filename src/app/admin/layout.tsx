
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckSquare, FileText, Image as ImageIcon, MessageSquare, Settings, LayoutDashboard, Database, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import RotarySpinner from '@/components/ui/rotary-spinner';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import AdminMobileTopNav from '@/components/admin/admin-mobile-top-nav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/inventory', label: 'Inventory & Prices', icon: Database },
  { href: '/admin/expeditions', label: 'Expeditions', icon: Map },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/admin/posts', label: 'Content Moderation', icon: FileText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/chatrooms', label: 'Chatrooms', icon: MessageSquare },
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [ref, isVisible] = useScrollAnimation();

  if (isMobile) {
    return (
      <>
        <AdminMobileTopNav navItems={adminNavItems} />
        <main className="flex-1 overflow-y-auto p-6 pt-20">
          {children}
        </main>
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r bg-card text-card-foreground">
        <SidebarHeader className="p-2 py-3 border-b h-14 flex items-center">
          <Link href="/admin" className="flex items-center gap-2 group/logo">
            <RotarySpinner size={28} className="text-primary" />
            <span className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden whitespace-nowrap">
              Admin Panel
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex flex-col justify-center flex-grow">
          <SidebarMenu className="px-2 pb-2 pt-0 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label, side: 'right', align: 'center', className: 'bg-card text-card-foreground border-border shadow-md' }}
                    className={cn(
                        "w-full justify-start text-sm font-medium",
                    )}
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          "group-data-[collapsible=expanded]:mr-3",
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
        <main ref={ref} className={cn('flex-1 overflow-y-auto p-6 scroll-animate', isVisible && 'scroll-animate-in')}>
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
