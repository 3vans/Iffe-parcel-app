'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; 
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';
    const isAdminEmail = email.toLowerCase() === adminEmail.toLowerCase();

    try {
      // 1. For Travelers, attempt Firebase Auth verification first
      if (activeTab === 'user' && !isAdminEmail) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseError: any) {
          console.error("Firebase Auth Error:", firebaseError);
          throw new Error("Login failed. Please check your credentials or create a traveler account.");
        }
      }

      // 2. Establish NextAuth session (Admins bypass Firebase check directly to this handshake)
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("NextAuth Error:", result.error);
        throw new Error(result.error === 'CredentialsSignin' ? "Invalid email or password." : "Authentication service is currently unavailable.");
      }

      toast({
        title: "Login Successful!",
        description: isAdminEmail ? "Welcome back, Admin." : "Welcome to your Traveler Dashboard.",
      });

      onOpenChange(false);
      
      // 3. Trigger redirect and a hard refresh to update middleware state
      if (isAdminEmail) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTabValue: string) => {
    setActiveTab(newTabValue);
    setError(null);
    if (newTabValue === 'admin') {
      setEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com');
    } else {
      setEmail('');
    }
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Access Your Hub</DialogTitle>
          <DialogDescription>
            Log in to manage expeditions or view your personal travel dashboard.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="user" disabled={isLoading}>Traveler</TabsTrigger>
            <TabsTrigger value="admin" disabled={isLoading}>Administrator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <Input 
                  id="user-email" 
                  type="email" 
                  placeholder="traveler@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Password</Label>
                <Input 
                  id="user-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
             <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Identifier</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@iffe-travels.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Administrative Password</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unlocking Panel...</> : "Enter Admin Panel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
