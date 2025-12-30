
'use client';

import { useRef, useState, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface DockTextEffectProps {
  text: string;
  className?: string;
}

export default function DockTextEffect({ text, className }: DockTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transforms, setTransforms] = useState<number[]>(Array(text.length).fill(1));

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;

    const newTransforms = text.split('').map((_, i) => {
      const charElement = containerRef.current?.children[i] as HTMLElement;
      if (!charElement) return 1;
      
      const charRect = charElement.getBoundingClientRect();
      const charCenterX = charRect.left - containerRect.left + charRect.width / 2;
      
      const distance = Math.abs(mouseX - charCenterX);
      const maxDistance = containerRect.width / 4; 
      
      if (distance > maxDistance) {
        return 1;
      }
      
      const scale = 1 + (1 - distance / maxDistance) * 0.8; // Max scale of 1.8
      return Math.max(1, scale);
    });

    setTransforms(newTransforms);
  };

  const handleMouseLeave = () => {
    setTransforms(Array(text.length).fill(1));
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{ transform: `scale(${transforms[i]})`, transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
