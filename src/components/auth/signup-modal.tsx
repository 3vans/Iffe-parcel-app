'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/services/cms-service";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AccountType | null;
}

type AccountType = "user" | "erotaract" | "admin";

export default function SignupModal({ open, onOpenChange, initialStep = null }: SignupModalProps) {
  const [step, setStep] = useState(initialStep ? 2 : 1);
  const [currentAccountType, setCurrentAccountType] = useState<AccountType | null>(initialStep);
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialStep) {
      setStep(2);
      setCurrentAccountType(initialStep);
    }
    if (open) {
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [open, initialStep]);


  const handleAccountTypeSelectionChange = (value: string) => {
    setCurrentAccountType(value as AccountType);
  };

  const handleNext = () => {
    if (currentAccountType) {
      setStep(2);
    } else {
      toast({ title: "Selection Required", description: "Please choose an account type.", variant: "destructive" });
    }
  };
  
  const handleBack = () => {
    if (initialStep && step === 2) {
      onOpenChange(false);
    } else {
      setStep(1);
    }
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(initialStep ? 2 : 1);
      if (!initialStep) {
        setCurrentAccountType(null);
      }
      setName('');
      setEmail('');
      setPassword('');
    }, 300);
  };

  const handleApiSubmit = async (selectedAccountType: AccountType) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
        toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
    }

    setIsLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Display Name in Auth
      await updateProfile(user, { displayName: name });

      // 3. Create Profile in Firestore
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';
      
      await createUserProfile(user.uid, {
        email: email,
        displayName: name,
        isCreator: selectedAccountType === 'erotaract' || selectedAccountType === 'admin', 
        isAdmin: selectedAccountType === 'admin' || email.toLowerCase() === adminEmail.toLowerCase(),
      });

      toast({
        title: "Registration Successful!",
        description: selectedAccountType === 'admin' ? "Administrator account created." : "Welcome to the iffe-travels community.",
      });
      handleCloseModal();
    } catch (error: any) {
      console.error("Registration Error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleCloseModal();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            {step === 2 && !initialStep && <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-3.5 " disabled={isLoading}><ArrowLeft className="h-4 w-4 mr-1"/> Back</Button>}
            Create your iffe-travels Account
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose the type of account you'd like to create."}
            {step === 2 && currentAccountType === "user" && "Sign up for a free user account."}
            {step === 2 && currentAccountType === "erotaract" && "Join the Explorer's Club (Paid Membership)."}
            {step === 2 && currentAccountType === "admin" && "Initial Administrator Setup."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && !initialStep && (
          <div className="py-4 space-y-4">
            <RadioGroup value={currentAccountType ?? ""} onValueChange={handleAccountTypeSelectionChange}>
              <Label htmlFor="acc-type-user" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                <RadioGroupItem value="user" id="acc-type-user" />
                <div>
                  <span className="font-semibold block">Sign up as Traveler (Free)</span>
                  <span className="text-xs text-muted-foreground">Comment, follow, and book tours.</span>
                </div>
              </Label>
              <Label htmlFor="acc-type-erotaract" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                <RadioGroupItem value="erotaract" id="acc-type-erotaract" />
                <div>
                  <span className="font-semibold block">Join Explorer's Club (Paid)</span>
                  <span className="text-xs text-muted-foreground">Post stories, suggest destinations, and get a verified badge.</span>
                </div>
              </Label>
              {/* TEMPORARY ADMIN OPTION */}
              <Label htmlFor="acc-type-admin" className="flex items-center space-x-3 p-3 border rounded-md border-destructive/20 bg-destructive/5 hover:bg-destructive/10 cursor-pointer has-[:checked]:bg-destructive/20 has-[:checked]:border-destructive">
                <RadioGroupItem value="admin" id="acc-type-admin" />
                <div>
                  <span className="font-semibold block text-destructive flex items-center">
                    <ShieldAlert className="h-3 w-3 mr-1" /> Administrator (Temporary Setup)
                  </span>
                  <span className="text-xs text-muted-foreground">Use this to register your initial admin account.</span>
                </div>
              </Label>
            </RadioGroup>
            <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">Next</Button>
          </div>
        )}

        {step === 2 && currentAccountType && (
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            handleApiSubmit(currentAccountType); 
          }} className="space-y-4 py-4">
            {currentAccountType === 'admin' && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
                <p className="text-xs text-destructive font-bold uppercase flex items-center">
                  <ShieldAlert className="h-3 w-3 mr-1" /> Warning: Admin Setup
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Registration will grant full platform access. Use the email defined in your environment variables for full compatibility.
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="user-name">Full Name</Label>
              <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="user-email-signup">Email</Label>
              <Input id="user-email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="user-password-signup">Password</Label>
              <Input id="user-password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            <DialogFooter>
              <Button type="submit" className={cn("w-full h-12 text-base font-bold", currentAccountType === 'admin' ? "bg-destructive hover:bg-destructive/90" : "bg-accent text-accent-foreground hover:bg-accent/90")} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : currentAccountType === 'admin' ? "Register Administrator" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
