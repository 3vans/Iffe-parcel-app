
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit3, BarChart3, Lightbulb, Map } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

export default function CreatePage() {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div ref={ref} className={cn("flex flex-col items-center justify-center min-h-[60vh] text-center p-4 scroll-animate", isVisible && 'scroll-animate-in')}>
      <Card className="w-full max-w-lg shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <PlusCircle className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Share & Create</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Share your story, plan a custom trip, or suggest a new destination.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-6">
            Choose an action below to get started:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
              <Link href="/campaigns/new">
                <Map className="mr-2 h-5 w-5" /> Plan a Custom Tour
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/blog/submit">
                <Edit3 className="mr-2 h-5 w-5" /> Share a Travel Story
              </Link>
            </Button>
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90 sm:col-span-2" asChild>
              <Link href="/ideas"> 
                <Lightbulb className="mr-2 h-5 w-5" /> Suggest a Destination
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
