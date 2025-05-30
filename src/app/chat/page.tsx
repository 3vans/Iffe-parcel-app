import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
            <MessageCircle className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Chatrooms</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Engage in real-time discussions, share media, and connect with like-minded individuals on various environmental and social topics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
