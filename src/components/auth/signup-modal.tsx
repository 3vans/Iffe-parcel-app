
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AccountType | null;
}

type AccountType = "user" | "erotaract";

export default function SignupModal({ open, onOpenChange, initialStep = null }: SignupModalProps) {
  const [step, setStep] = useState(initialStep ? 2 : 1);
  const [currentAccountType, setCurrentAccountType] = useState<AccountType | null>(initialStep);
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialStep) {
      setStep(2);
      setCurrentAccountType(initialStep);
    }
    // Reset form fields when modal opens or initialStep changes
    if (open) {
      setName('');
      setEmail('');
      setPassword('');
      setClubName('');
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
    if (initialStep && step === 2) { // If opened directly to step 2, "Back" should close.
      onOpenChange(false);
    } else {
      setStep(1);
      // Don't reset currentAccountType if initialStep is present, so it remains selected if user navigates back and forth
    }
  };

  const resetFormFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setClubName('');
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    // Delay reset to allow modal close animation
    setTimeout(() => {
      setStep(initialStep ? 2 : 1);
      if (!initialStep) {
        setCurrentAccountType(null);
      }
      resetFormFields();
    }, 300);
  };

  const handleApiSubmit = async (selectedAccountType: AccountType) => {
    setIsLoading(true);
    let requestBody: any = {
      name,
      email,
      password,
      accountType: selectedAccountType,
    };
    
    // Basic validation for common fields
    if (!name.trim() || !email.trim() || !password.trim()) {
        toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
        setIsLoading(false);
        return;
    }


    try {
      // NOTE: In a real app, you would have a dedicated API route like '/api/auth/register'.
      // For this mock, we'll just simulate success.
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = { message: "Your account has been created." };
      const response = { ok: true };


      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: result.message || "Your account has been created.",
        });
        handleCloseModal();
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
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
         if (initialStep) { // If modal is opened with an initial step, ensure state is correct
            setStep(2);
            setCurrentAccountType(initialStep);
        } else {
            setStep(1);
            setCurrentAccountType(null);
        }
        resetFormFields(); // Reset fields whenever dialog is opened/toggled
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
            </RadioGroup>
            <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">Next</Button>
          </div>
        )}

        {step === 2 && currentAccountType === "user" && (
          <form onSubmit={(e) => { e.preventDefault(); handleApiSubmit('user'); }} className="space-y-4 py-4">
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
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Free Account'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && currentAccountType === "erotaract" && (
           <form onSubmit={(e) => { 
                e.preventDefault(); 
                toast({ title: "Payment Gateway Mock", description: "Simulating payment..." });
                // Simulate a delay for payment processing
                setIsLoading(true);
                setTimeout(() => {
                    toast({ title: "Payment Successful (Simulated)", description: "Proceeding with registration." });
                    handleApiSubmit('erotaract'); // This will set isLoading to false
                }, 1500);
            }} className="py-4 space-y-4">
            <p className="text-muted-foreground text-center">You're applying to become a member of the Explorer's Club!</p>
            <div>
              <Label htmlFor="erotaract-name">Full Name</Label>
              <Input id="erotaract-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="erotaract-email">Email</Label>
              <Input id="erotaract-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="erotaract-password">Password</Label>
              <Input id="erotaract-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="p-3 border rounded-md bg-muted/30">
                <h4 className="font-semibold text-primary mb-1">Membership Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                    <li>Post travel stories and photos</li>
                    <li>Suggest and vote on new destinations</li>
                    <li>Get exclusive access to special events</li>
                    <li>Personal trip tracker on your profile</li>
                    <li>Verified member badge</li>
                </ul>
            </div>
            <p className="text-sm font-semibold text-center">Membership Fee: $50 per year.</p>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Proceed to Payment (Simulated)'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
