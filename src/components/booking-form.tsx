
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Calendar as CalendarIcon, Send, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { submitBooking } from '@/lib/services/cms-service';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  packageName: z.string().min(1, 'Package selection is required.'),
  travelDate: z.date({
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
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageName: `${destination} - 2 Days Package`,
    }
  });

  const travelDate = watch("travelDate");

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    setIsLoading(true);
    try {
      await submitBooking(data);
      toast({
        title: 'Booking Request Logged!',
        description: `Your interest in ${destination} has been sent to our travel desk. We'll contact you shortly.`,
      });
      reset();
    } catch (err) {
      toast({ title: "Booking snagged", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">Book Your {destination} Adventure</CardTitle>
        <CardDescription>Direct submission to iffe-travels head office.</CardDescription>
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
            <Label htmlFor="packageName">Selected Package</Label>
            <Input id="packageName" {...register('packageName')} disabled={isLoading} />
            {errors.packageName && <p className="text-sm text-destructive mt-1">{errors.packageName.message}</p>}
          </div>
          <div>
            <Label htmlFor="travelDate">Preferred Travel Date</Label>
             <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
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
                    onSelect={(date) => date && setValue('travelDate', date, { shouldValidate: true })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            {errors.travelDate && <p className="text-sm text-destructive mt-1">{errors.travelDate.message}</p>}
          </div>
          <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> LOGGING REQUEST...</> : <>Send Booking Inquiry <Send className="ml-2 h-4 w-4"/></>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
