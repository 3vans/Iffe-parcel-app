
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Import useRouter

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const currentEmail = email;
    const currentPassword = password;

    try {
      const result = await signIn('credentials', {
        redirect: false, 
        email: currentEmail,
        password: currentPassword,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error === "CredentialsSignin" ? "Invalid email or password." : result.error,
          variant: "destructive",
        });
      } else if (result?.ok) {
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
        });
        onOpenChange(false); 
        
        // For testing purposes, redirect to /admin if admin credentials were used
        if (currentEmail === 'admin@rtry.com') {
          router.push('/admin');
        }
        
        setEmail(''); 
        setPassword('');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTabValue: string) => {
    setIsLoading(false); // Reset loading state
    if (newTabValue === 'admin') {
      setEmail('admin@rtry.com');
      setPassword('password1234567');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Login to e-Rotary Hub</DialogTitle>
          <DialogDescription>
            Access your account or log in as a community member/admin.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user" disabled={isLoading}>User</TabsTrigger>
            <TabsTrigger value="community" disabled={isLoading}>Community</TabsTrigger> 
            <TabsTrigger value="admin" disabled={isLoading}>Admin</TabsTrigger>
          </TabsList>
          
          {/* User Login Form */}
          <TabsContent value="user">
            <form id="user-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input 
                  id="user-email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="user-password">Password</Label>
                <Input 
                  id="user-password" 
                  type="password" 
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as User"}
              </Button>
            </form>
          </TabsContent>
          
          {/* Community Login Form */}
          <TabsContent value="community">
             <form id="community-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="community-email">Email</Label>
                <Input 
                  id="community-email" 
                  type="email" 
                  placeholder="member@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="community-password">Password</Label>
                <Input 
                  id="community-password" 
                  type="password" 
                  placeholder="Your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Community Member"}
              </Button>
            </form>
          </TabsContent>
          
          {/* Admin Login Form */}
          <TabsContent value="admin">
             <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@rtry.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Admin"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
