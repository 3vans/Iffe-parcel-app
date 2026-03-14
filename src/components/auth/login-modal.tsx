'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${res.user.email}`,
      });

      onOpenChange(false);
      
      // Direct redirect based on email as per reference
      if (res.user.email?.toLowerCase() === adminEmail.toLowerCase()) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError("Login failed. Please check your credentials.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary text-center">Login to Your Account</DialogTitle>
          <DialogDescription className="text-center">
            Enter your email and password to access your dashboard.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
