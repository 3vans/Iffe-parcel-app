
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Trash2, UserX, ShieldBan, VolumeX, MessageSquare, Users, PowerOff, MessageCircle, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { fetchChatrooms, subscribeToMessages, sendMessage, deleteChatMessage, type Chatroom, type ChatMessage } from '@/lib/services/cms-service';
import { useAuth } from '@/context/AuthContext';

export default function AdminChatroomsPage() {
  const { user: adminUser } = useAuth();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [selectedChatroomId, setSelectedChatroomId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedChatroom = chatrooms.find(cr => cr.id === selectedChatroomId);

  useEffect(() => {
    const loadRooms = async () => {
      const rooms = await fetchChatrooms();
      setChatrooms(rooms);
      setIsLoading(false);
    };
    loadRooms();
  }, []);

  useEffect(() => {
    if (!selectedChatroomId) {
      setCurrentMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(selectedChatroomId, (msgs) => {
      setCurrentMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChatroomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selectedChatroomId || !adminUser) return;

    try {
      await sendMessage(selectedChatroomId, {
        text: adminMessage,
        senderId: adminUser.uid,
        senderName: "Iffe Admin",
        senderAvatar: placeholderImages.adminAvatar.src,
      });
      setAdminMessage('');
    } catch (err) {
      toast({ title: "Failed to send", variant: "destructive" });
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChatroomId || !confirm("Delete this message?")) return;
    try {
      await deleteChatMessage(selectedChatroomId, messageId);
      toast({ title: "Message Deleted" });
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
      <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col transition-all duration-300 ease-out hover:shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-primary"/>
            Active Channels
          </CardTitle>
          <CardDescription>Real-time monitoring</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="space-y-2 p-4">
            {chatrooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedChatroomId === room.id ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left h-auto py-3 rounded-xl"
                onClick={() => setSelectedChatroomId(room.id)}
              >
                <div>
                  <div className="font-bold flex items-center text-primary">{room.name}</div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{room.topic}</p>
                  <p className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-widest mt-1">Last activity: {room.lastActivity}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="w-full md:w-2/3 lg:w-3/4 flex flex-col transition-all duration-300 ease-out hover:shadow-lg">
        {!selectedChatroom ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h2 className="text-xl font-headline font-black text-muted-foreground uppercase">Select a Channel</h2>
            <p className="text-muted-foreground text-sm">Choose a room from the sidebar to monitor messages.</p>
          </div>
        ) : (
          <>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline text-xl text-primary">{selectedChatroom.name}</CardTitle>
                  <CardDescription>{selectedChatroom.topic}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                    <PowerOff className="mr-2 h-4 w-4"/> Close Room
                </Button>
              </div>
            </CardHeader>
            
            <div className="flex-grow flex flex-col overflow-hidden">
              <ScrollArea className="flex-grow bg-muted/10 p-4">
                <div className="space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-start gap-3 max-w-[85%]',
                        msg.senderId === adminUser?.uid ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={msg.senderAvatar} />
                        <AvatarFallback>{msg.senderName.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col group">
                        <div
                          className={cn(
                            'p-3 rounded-2xl shadow-sm text-sm',
                            msg.senderId === adminUser?.uid
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card border rounded-tl-none'
                          )}
                        >
                          <p className="font-black text-[10px] mb-1 uppercase tracking-widest opacity-70">{msg.senderName}</p>
                          <p>{msg.text}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-1">
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{msg.timestamp}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteMessage(msg.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <CardFooter className="p-4 border-t">
                <form onSubmit={handleAdminSendMessage} className="flex w-full items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type official admin message..."
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    className="flex-grow h-12 rounded-xl"
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon" className="h-12 w-12 bg-primary hover:bg-primary/90 rounded-xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
