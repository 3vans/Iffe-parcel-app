
'use client';

import { cn } from '@/lib/utils';
import GiraffeIcon from './giraffe-icon';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[100] p-4">
      <GiraffeIcon
        className={cn(
          "h-20 w-20 text-primary animate-pulse-slow"
        )}
        aria-label="Loading..."
      />
    </div>
  );
}
