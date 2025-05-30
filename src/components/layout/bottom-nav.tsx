
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, BarChart3, PlusSquare, UserCircle, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/campaigns', label: 'Campaigns', icon: BarChart3 },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  // { href: '/chat', label: 'Chat', icon: MessageCircle }, // Chat link can be re-added when ready
  // { href: '/videos', label: 'Videos', icon: PlayCircle }, // Videos can be added if space allows or grouped elsewhere
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/campaigns" && pathname.startsWith("/campaigns")) || (item.href === "/gallery" && pathname.startsWith("/gallery"));
          return (
            <Link href={item.href} key={item.label} legacyBehavior>
              <a className={cn(
                "flex flex-col items-center justify-center text-xs p-1 w-[19%] rounded-md transition-colors", // Adjusted padding and width
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
              )}>
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} /> {/* Adjusted icon size */}
                {item.label}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
