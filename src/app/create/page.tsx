import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit3, BarChart3, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <PlusCircle className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Create & Contribute</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Share your voice, start initiatives, and make an impact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-6">
            Choose an action below to get started:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90" asChild>
              <Link href="/campaigns/new"> {/* Assuming a new campaign route */}
                <BarChart3 className="mr-2 h-5 w-5" /> Start a Campaign
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="w-full py-6 text-base bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/blog/submit">
                <Edit3 className="mr-2 h-5 w-5" /> Submit a Blog Post
              </Link>
            </Button>
            <Button size="lg" className="w-full py-6 text-base bg-primary hover:bg-primary/90 sm:col-span-2" asChild>
              <Link href="/ideas"> {/* Links to idea box where one can submit */}
                <Lightbulb className="mr-2 h-5 w-5" /> Suggest an Idea
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
