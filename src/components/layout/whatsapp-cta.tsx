
'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="currentColor"
  >
    <path d="M16.1,2.8A13.3,13.3,0,0,0,2.8,16.1,13.3,13.3,0,0,0,16.1,29.4h0a13.2,13.2,0,0,0,9.2-3.7l3.9,1.3-1.4-3.8a13.3,13.3,0,0,0,1.3-9.2A13.3,13.3,0,0,0,16.1,2.8Z" />
    <path
      d="M19.3,17.4a.6.6,0,0,1-.3-.1c-.8-.4-1.5-.8-2.2-1.4s-1.1-1.3-1.5-2a.4.4,0,0,1,0-.2c0-.3,1-1,1-1.5s-.7-2.1-.8-2.3a.6.6,0,0,0-.6-.5h-.5c-.2,0-.4,0-.5,0s-.8.1-1.1.3-.7.7-.7,1.7.7,1.8,1.1,2.3,3,3.6,5,3.6.9,0,1.5-.2,1.9-.5,1.6-.8,1.8-1.6.2-1.6,0-.2-.1-.3-.5-.3S19.7,17.4,19.3,17.4Z"
      fill="#fff"
    />
  </svg>
);


export default function WhatsAppCTA() {
  // Replace with your actual WhatsApp number
  const whatsappNumber = "1234567890";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg z-50 animate-pulse-slow"
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <WhatsAppIcon className="h-8 w-8" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card text-card-foreground border-border shadow-md">
          <p>Talk to us</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
