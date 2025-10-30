
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div ref={ref} className={cn("flex flex-col items-center justify-center min-h-[60vh] text-center p-4 scroll-animate", isVisible && 'scroll-animate-in')}>
      <Card className="w-full max-w-md shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <UserCircle2 className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Your Profile</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your account and track your trips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your personal dashboard for all your adventures with i-TRAVELS. View your trip history, manage settings, and more.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard">Go to My Trips</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
