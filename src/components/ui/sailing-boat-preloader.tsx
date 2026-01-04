
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const SailingBoatPreloader: React.FC = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Keep preloader for 3 seconds

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (!visible) return null;
    
    return (
        <div className={cn(
            "fixed top-0 left-0 w-full h-full z-[100] flex flex-col justify-center items-center",
            "bg-background text-foreground transition-opacity duration-500",
            !visible && "opacity-0"
        )}>
            <div className="w-48 h-48 mb-8">
                <svg viewBox="0 0 150 150">
                    {/* Waves */}
                    <g className="waves-move">
                        <path d="M -50 100 Q 0 90, 50 100 T 150 100 T 250 100" stroke="hsl(var(--primary))" fill="none" strokeWidth="2" strokeLinecap="round" />
                        <path d="M -50 110 Q 0 100, 50 110 T 150 110 T 250 110" stroke="hsl(var(--primary) / 0.7)" fill="none" strokeWidth="2" strokeLinecap="round" />
                        <path d="M -50 120 Q 0 110, 50 120 T 150 120 T 250 120" stroke="hsl(var(--primary) / 0.4)" fill="none" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    
                    {/* Boat */}
                    <g className="boat-rock">
                        {/* Hull */}
                        <path d="M 30 100 C 40 115, 110 115, 120 100 L 110 90 L 40 90 Z" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1.5" />
                        
                        {/* Mast */}
                        <rect x="73" y="40" width="4" height="55" fill="hsl(var(--accent-foreground))" />

                        {/* Sails */}
                        <path d="M 75 45 L 110 85 L 75 85 Z" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1" />
                        <path d="M 75 45 L 45 85 L 75 85 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="1" />
                    </g>
                </svg>
            </div>
             <div className="text-center w-[300px]">
                <div className="text-xl font-bold mb-2 tracking-widest text-primary">
                    IFFE • TRAVELS LTD
                </div>
                <div className="text-sm text-muted-foreground mb-6 italic mx-auto animate-typing">
                    Charting Your Course...
                </div>
            </div>
        </div>
    );
};

export default SailingBoatPreloader;

