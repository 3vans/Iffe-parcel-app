
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

export default function PrivacyPage() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
              <Shield className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              This is a placeholder page for your Privacy Policy.
            </p>
            <p>
              It's important to inform your users about how you collect, use, and protect their data. You should consult with a legal professional to draft a policy that complies with regulations like GDPR, CCPA, etc.
            </p>
            <p>
              You can easily edit this content by opening the file at <code className="font-code bg-muted px-1 py-0.5 rounded text-sm">src/app/privacy/page.tsx</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
