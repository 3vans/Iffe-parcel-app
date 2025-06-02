
'use client';

import { cn } from '@/lib/utils';
import RotaryWheelIcon from './rotary-wheel-icon'; // Import the new icon

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
    <RotaryWheelIcon
      className={cn('animate-spin', className)} // Apply animate-spin here
      size={size}
      aria-label={ariaLabel}
    />
  );
};

export default RotarySpinner;
