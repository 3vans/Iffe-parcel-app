
'use client';

import { Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RotarySpinnerProps {
  size?: number | string;
  className?: string;
  'aria-label'?: string;
}

const RotarySpinner: React.FC<RotarySpinnerProps> = ({ 
  size = 24, 
  className,
  'aria-label': ariaLabel = "Loading..." 
}) => {
  return (
    <Cog
      className={cn('animate-spin text-accent', className)}
      size={size}
      aria-label={ariaLabel}
    />
  );
};

export default RotarySpinner;
