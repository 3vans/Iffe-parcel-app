'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Smile, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import HeroSection from '@/components/layout/hero-section';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, subscribeToMessages, type ChatMessage } from '@/lib/services/cms-service';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const unsubscribe = subscribeToMessages((msgs) => {
      setMessages(msgs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to join the conversation.", variant: "destructive" });
      return;
    }
  
    const msgText = newMessage;
    setNewMessage('');

    try {
      await sendMessage({
        text: msgText,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Explorer',
        senderAvatar: user.photoURL || undefined,
      });
    } catch (err) {
      toast({ title: "Failed to send message", variant: "destructive" });
      setNewMessage(msgText);
    }
  };

  return (
    <div className="space-y-8">
      <HeroSection 
        title="Traveler Chat"
        subtitle="Connect with our team and other travelers in real-time."
        iconName="MessageCircle"
      />
      <div ref={ref} className={cn('flex flex-col h-[60vh] bg-background scroll-animate border rounded-lg shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1', isVisible && 'scroll-animate-in')}>
        <ScrollArea className="flex-grow bg-muted/20">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              messages.map((msg) => {
                const isOwn = user?.uid === msg.senderId;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-start space-x-2 max-w-[80%] sm:max-w-[70%]',
                      isOwn ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage asChild src={msg.senderAvatar}>
                          <Image src={msg.senderAvatar || placeholderImages.dashboardAvatar.src} alt={msg.senderName} width={32} height={32} />
                      </AvatarImage>
                      <AvatarFallback>{msg.senderName.substring(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div
                        className={cn(
                          'p-2 sm:p-3 rounded-lg shadow text-sm',
                          isOwn
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-card text-card-foreground border rounded-bl-none'
                        )}
                      >
                        <p className="font-bold text-[10px] mb-1 opacity-70 uppercase tracking-tighter">{msg.senderName}</p>
                        <p>{msg.text}</p>
                      </div>
                      <p className={cn(
                          "text-[10px] mt-1 px-1 text-muted-foreground",
                          isOwn ? 'text-right' : 'text-left'
                        )}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-3 sm:p-4 border-t bg-card z-10">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={user ? "Type a message..." : "Please log in to chat"}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow h-10 sm:h-11"
              autoComplete="off"
              disabled={!user}
            />
            <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-10 w-10 sm:h-11 sm:w-11" disabled={!user}>
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}