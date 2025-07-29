
'use client';

import { cn } from '@/lib/utils';
import { Telescope } from 'lucide-react'; // Changed to Telescope

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
    <Telescope
      className={cn('animate-pulse-slow', className)} // Changed animation
      size={size}
      aria-label={ariaLabel}
    />
  );
};

export default RotarySpinner;
