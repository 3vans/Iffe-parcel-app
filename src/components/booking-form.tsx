
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Send } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  package: z.string().min(1, 'Package selection is required.'),
  travelDates: z.date({
    required_error: "Travel date is required.",
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    destination: string;
}

export default function BookingForm({ destination }: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      package: `${destination} - 2 Days Package`,
    }
  });

  const travelDate = watch("travelDates");

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    setIsLoading(true);
    // Here you would integrate with Firestore
    console.log('Booking submission for Firestore:', data);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    toast({
      title: 'Booking Request Sent!',
      description: `We've received your request for the ${data.package}. We'll be in touch shortly! (Simulated)`,
    });
    reset();
    setIsLoading(false);
  };

  return (
    <Card className="transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">Book Your {destination} Adventure</CardTitle>
        <CardDescription>Fill out the form below to start your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register('email')} disabled={isLoading} />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="package">Selected Package</Label>
            <Input id="package" {...register('package')} disabled={isLoading} />
            {errors.package && <p className="text-sm text-destructive mt-1">{errors.package.message}</p>}
          </div>
          <div>
            <Label htmlFor="travelDates">Preferred Travel Date</Label>
             <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !travelDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {travelDate ? format(travelDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={travelDate}
                    onSelect={(date) => date && setValue('travelDates', date, { shouldValidate: true })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            {errors.travelDates && <p className="text-sm text-destructive mt-1">{errors.travelDates.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : <>Submit Booking Request <Send className="ml-2 h-4 w-4"/></>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
