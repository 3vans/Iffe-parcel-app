
'use client'; // Make it a client component

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RotaryWheelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

interface LineCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const RotaryWheelIcon: React.FC<RotaryWheelIconProps> = ({ className, size, ...props }) => {
  const iconSize = size || 24;
  const [spokes, setSpokes] = useState<LineCoords[]>([]);
  const [teeth, setTeeth] = useState<LineCoords[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark that we are on the client side

    // Calculate spokes
    const calculatedSpokes = [0, 60, 120, 180, 240, 300].map((angle) => {
      const rad = angle * Math.PI / 180;
      return {
        x1: 12,
        y1: 12,
        x2: 12 + 7 * Math.cos(rad),
        y2: 12 + 7 * Math.sin(rad),
      };
    });
    setSpokes(calculatedSpokes);

    // Calculate teeth
    const calculatedTeeth = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = angle * Math.PI / 180;
      return {
        x1: 12 + 10 * Math.cos(rad),
        y1: 12 + 10 * Math.sin(rad),
        x2: 12 + 11.5 * Math.cos(rad),
        y2: 12 + 11.5 * Math.sin(rad),
      };
    });
    setTeeth(calculatedTeeth);
  }, []); // Empty dependency array ensures this runs once on mount, on the client

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
      className={cn(className)}
      {...props}
    >
      {/* Outer rim of the gear */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>

      {/* 6 Spokes - Rendered only on client after calculation */}
      {isClient && spokes.map((spoke, index) => (
        <line
          key={`spoke-${index}`}
          x1={spoke.x1}
          y1={spoke.y1}
          x2={spoke.x2}
          y2={spoke.y2}
          strokeWidth="1.5"
        />
      ))}

      {/* Central Hub */}
      <circle cx="12" cy="12" r="3" fill="currentColor" strokeWidth="1"/>
      <circle cx="12" cy="12" r="1.5" fill="var(--background, white)" stroke="currentColor" strokeWidth="0.5"/>

      {/* "Teeth" - Rendered only on client after calculation */}
      {isClient && teeth.map((tooth, index) => (
        <line
          key={`tooth-${index}`}
          x1={tooth.x1}
          y1={tooth.y1}
          x2={tooth.x2}
          y2={tooth.y2}
          strokeWidth="2.5"
        />
      ))}
    </svg>
  );
};

export default RotaryWheelIcon;
