'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, BarChart3, PlusSquare, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/campaigns', label: 'Campaigns', icon: BarChart3 },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label} legacyBehavior>
              <a className={cn(
                "flex flex-col items-center justify-center text-xs p-2 rounded-md transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
              )}>
                <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
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
