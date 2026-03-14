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
import { Loader2 } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';
    const isAdminEmail = email.toLowerCase() === adminEmail.toLowerCase();

    try {
      // 1. PHASE 2 Reference: For Travelers, verify with Firebase first
      if (activeTab === 'user' && !isAdminEmail) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseError: any) {
          console.error("Firebase Auth Error:", firebaseError);
          throw new Error("Invalid traveler credentials. Please ensure your account is created.");
        }
      }

      // 2. Establish NextAuth session
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error === 'CredentialsSignin' ? "Authentication service unavailable." : result.error);
      }

      toast({
        title: "Login Successful!",
        description: isAdminEmail ? "Welcome to the Administrative Engine." : "Welcome to your Traveler Dashboard.",
      });

      // 3. PHASE 2 Reference: Redirect based on role
      onOpenChange(false);
      
      if (isAdminEmail) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not connect to authentication services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTabValue: string) => {
    setActiveTab(newTabValue);
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
          <DialogTitle className="font-headline text-2xl text-primary">Login to iffe-travels</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your protected dashboard.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" disabled={isLoading}>Traveler</TabsTrigger>
            <TabsTrigger value="admin" disabled={isLoading}>Administrator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Accessing Hub...</> : "Login as Traveler"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
             <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
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
                <Label htmlFor="admin-password">Secure Password</Label>
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Admin...</> : "Login to Admin Panel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}