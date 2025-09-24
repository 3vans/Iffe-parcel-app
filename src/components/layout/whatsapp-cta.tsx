'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.315 0-.765.11-1.057.332-.29.22-.72.737-.72 1.654 0 .917.72 1.769 1.057 2.335 1.164 1.992 2.902 3.513 4.814 3.513.918 0 1.54-.238 1.94-.474s1.604-.833 1.83-1.594c.228-.76.228-1.41.157-1.594-.07-.182-.24-.28-.53-.28z"
      fill="currentColor"
    />
    <path
      d="M20.57 14.317c-1.686 0-3.303.824-4.223 2.19a.64.64 0 0 1-1.103.017c-1.38-2.133-3.003-3.64-5.06-4.522A.638.638 0 0 1 9.49 11.2c-1.896-1.28-3.56-3.013-4.814-5.11a.636.636 0 0 1 .11-1.023c1.44-1.243 2.52-3.023 2.79-4.9a.637.637 0 0 1 .63-.487h2.89a.636.636 0 0 1 .638.588c.043 1.28.377 2.536.98 3.68a.638.638 0 0 1-.07.973c-.596.54-1.14 1.177-1.62 1.898a.636.636 0 0 0-.072.964c.83 1.243 1.8 2.36 2.89 3.32a.637.637 0 0 0 .972-.072c.67-1.033 1.34-2.013 2.01-2.924a.638.638 0 0 1 .966-.145c1.07.72 2.25 1.2 3.5 1.37a.637.637 0 0 1 .586.638v2.89a.637.637 0 0 1-.637.637z"
      fill="currentColor"
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
