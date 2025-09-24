
'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="currentColor"
    >
        <path d="M12.04 2.75C6.58 2.75 2.15 7.18 2.15 12.64C2.15 14.77 2.73 16.82 3.8 18.59L2.5 23.5L7.58 22.2C9.25 23.18 11.11 23.7 13 23.7H13.01C18.47 23.7 22.9 19.27 22.9 13.81C22.9 8.35 18.47 3.92 13.01 3.92H13C10.87 3.92 8.82 4.5 7.05 5.58" />
        <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.24 7.84C9.06 7.44 8.85 7.42 8.68 7.41C8.54 7.4 8.32 7.4 8.1 7.4C7.88 7.4 7.58 7.49 7.32 7.76C7.07 8.02 6.47 8.57 6.47 9.7C6.47 10.84 7.35 11.93 7.5 12.11C7.66 12.29 9.24 14.83 11.78 15.83C13.92 16.67 14.33 16.51 14.73 16.46C15.12 16.41 16.32 15.76 16.54 15.1C16.76 14.44 16.76 13.9 16.67 13.77C16.58 13.64 16.42 13.55 16.17 13.43C15.92 13.3 14.72 12.7 14.5 12.61C14.28 12.52 14.12 12.48 13.96 12.75C13.8 13.02 13.25 13.64 13.11 13.82C12.97 14 12.83 14.02 12.58 13.9C12.33 13.78 11.44 13.46 10.37 12.54C9.55 11.84 9.03 11 8.84 10.73C8.66 10.46 8.76 10.34 8.89 10.21C9 10.1 9.14 9.91 9.27 9.75C9.4 9.59 9.45 9.47 9.54 9.29C9.63 9.11 9.58 8.94 9.5 8.81C9.42 8.68 9.24 8.23 9.24 7.84Z"
        fill="white"
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
            className="fixed bottom-20 md:bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg z-50 animate-pulse-slow"
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
