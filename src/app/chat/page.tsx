
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, MessageSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import HeroSection from '@/components/layout/hero-section';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, subscribeToMessages, fetchChatrooms, type ChatMessage, type Chatroom } from '@/lib/services/cms-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await fetchChatrooms();
        setChatrooms(rooms);
        if (rooms.length > 0) {
          setSelectedRoomId(rooms[0].id);
        }
      } catch (err) {
        console.error("Failed to load rooms:", err);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    loadRooms();
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;

    setIsLoadingMessages(true);
    const unsubscribe = subscribeToMessages(selectedRoomId, (msgs) => {
      setMessages(msgs);
      setIsLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [selectedRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedRoomId) return;
    
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to join the conversation.", variant: "destructive" });
      return;
    }
  
    const msgText = newMessage;
    setNewMessage('');

    try {
      await sendMessage(selectedRoomId, {
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

  const selectedRoom = chatrooms.find(r => r.id === selectedRoomId);

  return (
    <div className="space-y-8 pb-20">
      <HeroSection 
        title="Community Chat"
        subtitle="Connect with our team and other travelers in real-time channels."
        iconName="MessageCircle"
      />
      
      <div ref={ref} className={cn('grid grid-cols-1 lg:grid-cols-4 gap-6 container mx-auto px-4 scroll-animate', isVisible && 'scroll-animate-in')}>
        
        {/* Room List Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border p-4 shadow-sm">
            <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-accent" />
              Channels
            </h3>
            <div className="space-y-2">
              {isLoadingRooms ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
              ) : (
                chatrooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-center justify-between",
                      selectedRoomId === room.id 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "hover:bg-muted text-muted-foreground hover:text-primary"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold truncate">{room.name}</span>
                      <span className={cn("text-[10px] opacity-70", selectedRoomId === room.id ? "text-white" : "text-muted-foreground")}>
                        Active {room.lastActivity}
                      </span>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", selectedRoomId === room.id ? "rotate-90" : "group-hover:translate-x-1")} />
                  </button>
                ))
              )}
              {!isLoadingRooms && chatrooms.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 italic">No active channels yet.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <div className="lg:col-span-3 flex flex-col h-[60vh] bg-background border rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-card flex justify-between items-center">
            <div>
              <h2 className="font-headline font-bold text-primary">{selectedRoom?.name || 'Loading room...'}</h2>
              <p className="text-xs text-muted-foreground">{selectedRoom?.topic}</p>
            </div>
            {selectedRoom && <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">LIVE</Badge>}
          </div>

          <ScrollArea className="flex-grow bg-muted/10">
            <div className="p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isOwn = user?.uid === msg.senderId;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-start gap-3 max-w-[85%] sm:max-w-[75%]',
                        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0 shadow-sm">
                        <AvatarImage src={msg.senderAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {msg.senderName.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div
                          className={cn(
                            'p-3 rounded-2xl shadow-sm text-sm',
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card text-card-foreground border rounded-tl-none'
                          )}
                        >
                          <p className="font-black text-[10px] mb-1 opacity-70 uppercase tracking-widest">{msg.senderName}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        <p className={cn(
                            "text-[9px] font-bold mt-1 px-1 text-muted-foreground uppercase tracking-widest",
                            isOwn ? 'text-right' : 'text-left'
                          )}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                  <MessageSquare className="h-12 w-12 mb-2 text-muted-foreground" />
                  <p className="text-sm font-bold uppercase tracking-widest">No messages yet. Be the first to speak!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <Input
                type="text"
                placeholder={user ? `Message in #${selectedRoom?.name || 'channel'}...` : "Sign in to chat"}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-accent"
                autoComplete="off"
                disabled={!user || !selectedRoomId}
              />
              <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-12 w-12 rounded-xl shadow-lg shadow-accent/20" disabled={!user || !selectedRoomId}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
