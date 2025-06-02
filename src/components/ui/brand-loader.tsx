
'use client';

import { cn } from '@/lib/utils';
import RotaryWheelIcon from './rotary-wheel-icon';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[100] p-4">
      <RotaryWheelIcon
        size={60} 
        className={cn(
          "animate-spin text-primary"
        )}
        aria-label="Loading..."
      />
    </div>
  );
}
