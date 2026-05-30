'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Clock, ShieldCheck, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserDoc {
  id: string;
  title: string;
  type: 'Certificate' | 'Itinerary' | 'Invoice' | 'Other';
  createdAt: string;
  fileUrl: string;
}

export default function DashboardDocuments() {
  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a production scenario, this would query a user-specific 'documents' collection in Firestore
    // or list files in a Supabase/Firebase storage folder named after the user's UID.
    setTimeout(() => {
      setDocs([
        {
          id: 'd1',
          title: 'Explorer Club Welcome Guide.pdf',
          type: 'Other',
          createdAt: 'Recently',
          fileUrl: '#'
        }
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-headline font-black text-primary uppercase">Travel Documents</h2>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <ShieldCheck className="w-3 h-3 mr-1" /> Secure Storage
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {docs.length > 0 ? (
          docs.map((doc) => (
            <Card key={doc.id} className="group hover:border-accent transition-all duration-300 hover:shadow-lg overflow-hidden border-primary/5">
              <CardHeader className="p-6 bg-muted/20 border-b">
                <Badge variant="secondary" className="w-fit mb-3 uppercase text-[10px] font-black tracking-widest">{doc.type}</Badge>
                <CardTitle className="text-base font-bold text-primary truncate leading-tight">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Issued: {doc.createdAt}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-all font-bold h-10 rounded-xl">
                  <Download className="w-4 h-4 mr-2" /> DOWNLOAD PDF
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full bg-muted/30 border-dashed border-2 rounded-[2rem] border-primary/5">
            <CardContent className="p-20 text-center">
              <Compass className="h-12 w-12 mx-auto mb-4 text-primary/10" />
              <p className="text-stone-400 font-bold uppercase tracking-widest text-sm">No documents found</p>
              <p className="text-xs text-stone-400 mt-2">Invoices and custom itineraries will appear here after booking.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
