
'use client';
import { useState, useEffect } from "react"

const DEFAULT_MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false); // Default to false on server

  useEffect(() => {
    // This code runs only on the client, after hydration
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}
