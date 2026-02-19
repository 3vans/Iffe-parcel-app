
'use client';

import { useEffect, useState } from 'react';

export function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [mounted]);

  // We render children even before mounting to ensure the server-rendered HTML
  // matches the initial client-rendered HTML (both without theme side-effects applied yet).
  // This fixes hydration errors where the entire app content was missing on the server.
  return <>{children}</>;
}
