'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { sendMessage, subscribeToMessages, fetchChatrooms, type ChatMessage } from '@/lib/services/cms-service';

export default function DashboardChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [supportRoomId, setSupportRoomId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSupportChannel = async () => {
      try {
        const rooms = await fetchChatrooms();
        // Prototype logic: connect user to the first available room or a designated "Support" channel
        const supportRoom = rooms.find(r => r.name.toLowerCase().includes('support')) || rooms[0];
        if (supportRoom) {
          setSupportRoomId(supportRoom.id);
        }
      } catch (err) {
        console.error("Support channel load snag:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSupportChannel();
  }, []);

  useEffect(() => {
    if (!supportRoomId) return;

    const unsubscribe = subscribeToMessages(supportRoomId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [supportRoomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !supportRoomId || !user) return;

    const msgText = input;
    setInput('');

    try {
      await sendMessage(supportRoomId, {
        text: msgText,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Traveler',
        senderAvatar: user.photoURL || undefined,
      });
    } catch (err) {
      setInput(msgText);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <Card className="max-w-4xl mx-auto h-[600px] flex flex-col shadow-xl overflow-hidden border-primary/10">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-accent" />
            <div>
              <CardTitle className="text-lg">Agency Support Channel</CardTitle>
              <p className="text-xs opacity-70">Direct line to Iffe Travels HQ</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Secure
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow bg-muted/10 p-6">
        <div className="space-y-6">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn(
                "flex items-start gap-3 max-w-[85%]",
                isMe ? "ml-auto flex-row-reverse" : ""
              )}>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={msg.senderAvatar} />
                  <AvatarFallback className={isMe ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}>
                    {msg.senderName.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className={cn(
                    "p-3 rounded-2xl shadow-sm text-sm",
                    isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border rounded-tl-none"
                  )}>
                    <p className="font-bold text-[10px] uppercase opacity-70 mb-1">{msg.senderName}</p>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <p className={cn("text-[9px] font-black uppercase text-muted-foreground px-1 mt-1", isMe ? "text-right" : "text-left")}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center py-20 opacity-40">
                <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                <p className="text-xs font-black uppercase tracking-widest">No messages in history</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <CardFooter className="p-4 border-t bg-white">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input 
            placeholder="Type your message to the agency..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-muted/30 border-none h-12 rounded-full px-6 focus-visible:ring-accent"
            autoComplete="off"
            disabled={!supportRoomId}
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 shadow-lg shadow-accent/20" disabled={!supportRoomId}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
