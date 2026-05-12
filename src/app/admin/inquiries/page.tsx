
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, MessageCircle, ArrowRight, Loader2, Calendar, User, Tag, Sparkles } from "lucide-react";
import { fetchAllInquiries } from '@/lib/services/cms-service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'read':
      case 'replied':
        return 'default';
      case 'pending':
      case 'unread':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Custom Trip': return <Sparkles className="h-4 w-4 text-accent" />;
      case 'Contact Message': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'Standard Booking': return <Calendar className="h-4 w-4 text-green-500" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
        <Mail className="mr-3 h-8 w-8 text-accent" />
        User Inquiries & Leads
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Communication</CardTitle>
          <CardDescription>Track all custom tour requests, booking inquiries, and contact messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Target / Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{item.userName || item.name}</div>
                      <div className="text-[10px] text-muted-foreground">{item.userEmail || item.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.basePackage || item.packageName || (item.message && item.message.substring(0, 30) + '...')}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.status)} className="capitalize text-[10px]">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(item)}>
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {inquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                   {getTypeIcon(selectedInquiry.type)}
                   <Badge variant="outline" className="uppercase text-[10px]">{selectedInquiry.type}</Badge>
                </div>
                <DialogTitle className="font-headline text-2xl text-primary">Inquiry Details</DialogTitle>
                <DialogDescription>Received on {selectedInquiry.createdAt?.toDate?.()?.toLocaleString()}</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Contact Name</Label>
                        <p className="font-bold">{selectedInquiry.userName || selectedInquiry.name}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Email Address</Label>
                        <p className="font-bold">{selectedInquiry.userEmail || selectedInquiry.email}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request Details</Label>
                    <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                        {selectedInquiry.type === 'Custom Trip' ? (
                            <>
                                <div>
                                    <span className="text-xs font-bold text-accent uppercase tracking-tighter">Proposed Title:</span>
                                    <p className="font-bold text-lg">{selectedInquiry.basePackage}</p>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{selectedInquiry.description}</p>
                                <div className="flex gap-4 pt-2">
                                    <Badge variant="secondary">Budget: ${selectedInquiry.pricing?.finalTotal || 'TBD'}</Badge>
                                    <Badge variant="outline">Group Size: {selectedInquiry.groupSize}</Badge>
                                </div>
                            </>
                        ) : selectedInquiry.type === 'Standard Booking' ? (
                            <>
                                <div>
                                    <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Target Package:</span>
                                    <p className="font-bold text-lg">{selectedInquiry.packageName}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-tighter">Travel Date:</span>
                                    <p className="font-bold">{selectedInquiry.travelDate?.toDate?.()?.toLocaleDateString() || selectedInquiry.travelDate}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{selectedInquiry.message}</p>
                        )}
                    </div>
                </div>

                {selectedInquiry.meta?.inspirationImage && (
                    <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inspiration Visual</Label>
                         <div className="relative aspect-video rounded-xl overflow-hidden border">
                            <img src={selectedInquiry.meta.inspirationImage} className="object-cover w-full h-full" alt="User inspiration" />
                         </div>
                    </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close</Button>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                    <a href={`mailto:${selectedInquiry.userEmail || selectedInquiry.email}?subject=Re: Your ${selectedInquiry.type} inquiry with iffe-travels`}>
                        Reply via Email
                    </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
