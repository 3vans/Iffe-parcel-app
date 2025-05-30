
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className, size = 16 }) => {
  return (
    <ShieldCheck 
      className={cn("text-primary fill-sky-400", className)} 
      size={size} 
      aria-label="Verified Member" 
    />
  );
};

export default VerifiedBadge;
