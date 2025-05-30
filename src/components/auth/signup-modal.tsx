
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AccountType | null;
}

type AccountType = "user" | "community" | "erotaract";

export default function SignupModal({ open, onOpenChange, initialStep = null }: SignupModalProps) {
  const [step, setStep] = useState(initialStep ? 2 : 1);
  const [accountType, setAccountType] = useState<AccountType | null>(initialStep);
  const { toast } = useToast();

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value as AccountType);
  };

  const handleNext = () => {
    if (accountType) {
      setStep(2);
    } else {
      toast({ title: "Selection Required", description: "Please choose an account type.", variant: "destructive" });
    }
  };
  
  const handleBack = () => {
    if (initialStep) onOpenChange(false); // If opened to a specific step, back closes
    else setStep(1);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for signup logic
    console.log("Signup submitted for:", accountType, Object.fromEntries(new FormData(event.target as HTMLFormElement)));
    toast({ title: "Signup Initiated", description: "Please check your email to complete registration (simulated)." });
    onOpenChange(false);
    setStep(initialStep ? 2 : 1); // Reset step
    if (!initialStep) setAccountType(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setStep(initialStep ? 2 : 1);
        if(!initialStep) setAccountType(null);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            {step === 2 && !initialStep && <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-3.5 "><ArrowLeft className="h-4 w-4 mr-1"/> Back</Button>}
            Create your e-Rotary Hub Account
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose the type of account you'd like to create."}
            {step === 2 && accountType === "user" && "Sign up for a free user account."}
            {step === 2 && accountType === "community" && "Apply to link your existing local Rotaract club membership."}
            {step === 2 && accountType === "erotaract" && "Join the e-Rotaract Club of Uganda Global (Paid Membership)."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && !initialStep && (
          <div className="py-4 space-y-4">
            <RadioGroup value={accountType ?? ""} onValueChange={handleAccountTypeChange}>
              <Label htmlFor="acc-type-user" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                <RadioGroupItem value="user" id="acc-type-user" />
                <div>
                  <span className="font-semibold block">Sign up as User (Free)</span>
                  <span className="text-xs text-muted-foreground">Comment, follow, react. Option to upgrade later.</span>
                </div>
              </Label>
              <Label htmlFor="acc-type-community" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                <RadioGroupItem value="community" id="acc-type-community" />
                 <div>
                  <span className="font-semibold block">Apply as Community Member</span>
                  <span className="text-xs text-muted-foreground">For members of existing physical Rotaract clubs.</span>
                </div>
              </Label>
              <Label htmlFor="acc-type-erotaract" className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                <RadioGroupItem value="erotaract" id="acc-type-erotaract" />
                <div>
                  <span className="font-semibold block">Join e-Rotaract Online (Paid)</span>
                  <span className="text-xs text-muted-foreground">Post blogs, create campaigns, host chatrooms, get verified.</span>
                </div>
              </Label>
            </RadioGroup>
            <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">Next</Button>
          </div>
        )}

        {step === 2 && accountType === "user" && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="user-name">Full Name</Label>
              <Input id="user-name" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="user-email-signup">Email</Label>
              <Input id="user-email-signup" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="user-password-signup">Password</Label>
              <Input id="user-password-signup" name="password" type="password" required />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Free Account</Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && accountType === "community" && (
          <div className="py-4 space-y-4 text-center">
            <p className="text-muted-foreground">The application form for Community Members (linking your existing local club) is coming soon.</p>
            <p className="text-sm">This will involve selecting your club, providing membership details, and admin review.</p>
            <Button onClick={() => onOpenChange(false)} className="w-full">Okay</Button>
          </div>
        )}

        {step === 2 && accountType === "erotaract" && (
           <div className="py-4 space-y-4">
            <p className="text-muted-foreground text-center">You're applying to become a paid member of the "e-Rotaract Club of Uganda Global"!</p>
            <div className="p-3 border rounded-md bg-muted/30">
                <h4 className="font-semibold text-primary mb-1">Membership Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                    <li>Post blogs and articles</li>
                    <li>Create and manage campaigns</li>
                    <li>Host public and private chatrooms</li>
                    <li>Personal impact tracker on your profile</li>
                    <li>Verified member badge</li>
                </ul>
            </div>
            <p className="text-sm font-semibold text-center">Membership Fee: UGX 20,000 (approx. $5.50) per year.</p>
            <Button onClick={() => {
                toast({ title: "Payment Gateway Mock", description: "Redirecting to payment gateway (simulated)."});
                onOpenChange(false);
            }} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Proceed to Payment (Simulated)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

