import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <UserCircle2 className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Your Profile</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your account and track your contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your personal space in the e-Rotary Hub is under construction. Soon you'll be able to view your activity, manage settings, and more.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
