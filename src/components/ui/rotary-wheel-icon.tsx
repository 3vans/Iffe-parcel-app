// src/components/ui/rotary-wheel-icon.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface RotaryWheelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const RotaryWheelIcon: React.FC<RotaryWheelIconProps> = ({ className, size, ...props }) => {
  const iconSize = size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)} // Pass className for styling like animate-spin
      {...props}
    >
      {/* Outer rim of the gear */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>

      {/* 6 Spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={`spoke-${angle}`}
          x1="12"
          y1="12"
          // Spoke length to connect from hub to near the rim
          x2={12 + 7 * Math.cos(angle * Math.PI / 180)}
          y2={12 + 7 * Math.sin(angle * Math.PI / 180)}
          strokeWidth="1.5"
        />
      ))}

      {/* Central Hub - a filled circle with a hole */}
      <circle cx="12" cy="12" r="3" fill="currentColor" strokeWidth="1"/> {/* Main hub color, ensure stroke for definition */}
      <circle cx="12" cy="12" r="1.5" fill="var(--background, white)" stroke="currentColor" strokeWidth="0.5"/> {/* Hole, stroke for definition */}


      {/* "Teeth" - 12 thicker lines extending from the rim */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={`tooth-${angle}`}
          // Start teeth from the rim
          x1={12 + 10 * Math.cos(angle * Math.PI / 180)}
          y1={12 + 10 * Math.sin(angle * Math.PI / 180)}
          // Teeth extend outwards
          x2={12 + 11.5 * Math.cos(angle * Math.PI / 180)} 
          y2={12 + 11.5 * Math.sin(angle * Math.PI / 180)}
          strokeWidth="2.5" // Thicker lines for teeth
        />
      ))}
    </svg>
  );
};

export default RotaryWheelIcon;
