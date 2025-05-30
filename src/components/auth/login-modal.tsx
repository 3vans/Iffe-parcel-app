
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for login logic
    console.log("Login submitted for:", (event.target as HTMLFormElement).id);
    onOpenChange(false);
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
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <form id="user-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label htmlFor="user-password">Password</Label>
                <Input id="user-password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login as User</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="community">
            <form id="community-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="community-email">Club Email or Username</Label>
                <Input id="community-email" type="text" placeholder="yourclub@example.com" required />
              </div>
              <div>
                <Label htmlFor="community-password">Password</Label>
                <Input id="community-password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login as Community Member</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
            <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="admin-username">Admin Username</Label>
                <Input id="admin-username" type="text" placeholder="admin_user" required />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90">Login as Admin</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
