
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Trash2, UserX, ShieldBan, VolumeX, MessageSquare, Users, PowerOff, CornerDownLeft, MessageCircle } from "lucide-react";
import { cn } from '@/lib/utils';

interface Chatroom {
  id: string;
  name: string;
  topic: string;
  userCount: number;
  lastActivity: string;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  dataAiHint?: string;
  role: 'user' | 'moderator';
  isMuted?: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  senderId: string; // Links to ChatParticipant id or 'admin'
  senderName: string;
  senderAvatar: string;
  dataAiHint?: string;
  timestamp: Date;
  isOwnMessage?: boolean; // True if sent by the current admin
}

const mockAdminUser = {
  id: 'admin',
  name: 'Admin',
  avatarUrl: 'https://placehold.co/40x40.png?text=A',
  dataAiHint: 'admin avatar',
};

const mockChatrooms: Chatroom[] = [
  { id: 'cr1', name: 'General Discussion', topic: 'Talk about anything Rotary related!', userCount: 25, lastActivity: '5m ago' },
  { id: 'cr2', name: 'Project Brainstorming', topic: 'Ideas for new community projects.', userCount: 12, lastActivity: '1h ago' },
  { id: 'cr3', name: 'Tech Help & Support', topic: 'Get help with platform features.', userCount: 8, lastActivity: '30m ago' },
];

const mockParticipants: { [chatroomId: string]: ChatParticipant[] } = {
  cr1: [
    { id: 'u1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png?text=AW', dataAiHint:'woman avatar', role: 'user' },
    { id: 'u2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png?text=BB', dataAiHint:'man avatar construction', role: 'user' },
    { id: 'u3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/40x40.png?text=CC', dataAiHint:'man avatar classic', role: 'moderator' },
  ],
  cr2: [
    { id: 'u4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/40x40.png?text=DP', dataAiHint:'woman avatar hero', role: 'user' },
    { id: 'u5', name: 'Edward Scissorhands', avatarUrl: 'https://placehold.co/40x40.png?text=ES', dataAiHint:'man avatar goth', role: 'user' },
  ],
  cr3: [
    { id: 'u2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png?text=BB', dataAiHint:'man construction', role: 'user' }, // Bob is also here
  ],
};

const mockMessages: { [chatroomId: string]: ChatMessage[] } = {
  cr1: [
    { id: 'm1', text: 'Hello everyone! Welcome to the general chat.', senderId: 'u3', senderName: 'Charlie Chaplin', senderAvatar: 'https://placehold.co/40x40.png?text=CC', dataAiHint:'man classic', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 'm2', text: 'Hi Charlie! Glad to be here.', senderId: 'u1', senderName: 'Alice Wonderland', senderAvatar: 'https://placehold.co/40x40.png?text=AW', dataAiHint:'woman avatar', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    { id: 'm3', text: 'What are we discussing today?', senderId: 'u2', senderName: 'Bob The Builder', senderAvatar: 'https://placehold.co/40x40.png?text=BB', dataAiHint:'man construction', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  cr2: [
    { id: 'm4', text: 'Any new project ideas for this quarter?', senderId: 'u4', senderName: 'Diana Prince', senderAvatar: 'https://placehold.co/40x40.png?text=DP', dataAiHint:'woman hero', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  ],
  cr3: [],
};


export default function AdminChatroomsPage() {
  const [selectedChatroomId, setSelectedChatroomId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [currentParticipants, setCurrentParticipants] = useState<ChatParticipant[]>([]);
  const [adminMessage, setAdminMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedChatroom = mockChatrooms.find(cr => cr.id === selectedChatroomId);

  useEffect(() => {
    if (selectedChatroomId) {
      setCurrentMessages(mockMessages[selectedChatroomId] || []);
      setCurrentParticipants(mockParticipants[selectedChatroomId] || []);
      setAdminMessage('');
    } else {
      setCurrentMessages([]);
      setCurrentParticipants([]);
    }
  }, [selectedChatroomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSelectChatroom = (chatroomId: string) => {
    setSelectedChatroomId(chatroomId);
  };

  const handleAdminSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selectedChatroomId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: adminMessage,
      senderId: mockAdminUser.id,
      senderName: mockAdminUser.name,
      senderAvatar: mockAdminUser.avatarUrl,
      dataAiHint: mockAdminUser.dataAiHint,
      timestamp: new Date(),
      isOwnMessage: true,
    };
    setCurrentMessages(prev => [...prev, newMessage]);
    setAdminMessage('');
    toast({ title: "Message Sent", description: `Your message was sent to "${selectedChatroom?.name}".` });
  };
  
  const handleDeleteMessage = (messageId: string, messageText: string) => {
    setCurrentMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({ title: "Message Deleted", description: `Message "${messageText.substring(0,20)}..." deleted. (Simulated)`, variant: "destructive" });
  };

  const handleUserAction = (action: 'Mute' | 'Kick' | 'Ban', userId: string, userName: string) => {
    // Simulate action
    if (action === 'Mute') {
      setCurrentParticipants(prev => prev.map(p => p.id === userId ? {...p, isMuted: !p.isMuted} : p));
    }
    toast({
      title: `User ${action}d`,
      description: `${userName} has been ${action.toLowerCase()}ed from ${selectedChatroom?.name || 'this chat'}. (Simulated)`,
      variant: action === 'Ban' || action === 'Kick' ? 'destructive' : 'default',
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-var(--header-height,100px)-2rem)]"> {/* Adjust height based on your header */}
      {/* Chatroom List Column */}
      <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Active Chatrooms</CardTitle>
          <CardDescription>Select a room to monitor.</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="space-y-2 p-4">
            {mockChatrooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedChatroomId === room.id ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleSelectChatroom(room.id)}
              >
                <div>
                  <p className="font-semibold">{room.name} <Badge variant="outline" className="ml-2">{room.userCount}</Badge></p>
                  <p className="text-xs text-muted-foreground">{room.topic}</p>
                  <p className="text-xs text-muted-foreground/70">Last active: {room.lastActivity}</p>
                </div>
              </Button>
            ))}
             {mockChatrooms.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No active chatrooms.</p>}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Chat Monitoring Column */}
      <Card className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
        {!selectedChatroom ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">No Chatroom Selected</h2>
            <p className="text-muted-foreground">Please select a chatroom from the list to start monitoring.</p>
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
                    <PowerOff className="mr-2 h-4 w-4"/> Close Room (Simulated)
                </Button>
              </div>
            </CardHeader>
            
            <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
              {/* Messages Area */}
              <div className="flex-grow flex flex-col h-[calc(50vh-50px)] lg:h-auto"> {/* Adjusted height for mobile and larger screens */}
                <ScrollArea className="flex-grow bg-muted/10 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex items-start space-x-2 max-w-[85%]',
                          msg.isOwnMessage ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={msg.senderAvatar} alt={msg.senderName} data-ai-hint={msg.dataAiHint} />
                          <AvatarFallback>{msg.senderName?.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col group">
                          <div
                            className={cn(
                              'p-2.5 rounded-lg shadow-sm text-sm',
                              msg.isOwnMessage
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-card border rounded-bl-none'
                            )}
                          >
                            <p className="font-medium mb-0.5">{msg.senderName}</p>
                            <p>{msg.text}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={cn(
                                "text-xs mt-1 px-1 text-muted-foreground",
                                msg.isOwnMessage ? 'text-right w-full' : ''
                              )}
                            >
                              {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </p>
                            {!msg.isOwnMessage && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteMessage(msg.id, msg.text)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentMessages.length === 0 && <p className="text-center text-muted-foreground py-8">No messages in this chatroom yet.</p>}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <CardFooter className="p-3 border-t">
                  <form onSubmit={handleAdminSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Type your admin message..."
                      value={adminMessage}
                      onChange={(e) => setAdminMessage(e.target.value)}
                      className="flex-grow"
                      autoComplete="off"
                    />
                    <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </div>

              {/* Participants Area (Right sidebar on larger screens) */}
              <Card className="w-full lg:w-1/3 lg:max-w-xs border-0 border-l-0 lg:border-l rounded-none lg:rounded-l-none flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="font-headline text-md flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Participants ({currentParticipants.length})</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <CardContent className="p-3 space-y-2">
                    {currentParticipants.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint} />
                            <AvatarFallback>{user.name.substring(0,1)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{user.name} {user.isMuted && <Badge variant="outline" className="text-xs ml-1">Muted</Badge>}</p>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-yellow-600" onClick={() => handleUserAction('Mute', user.id, user.name)} title={user.isMuted ? "Unmute" : "Mute"}>
                                <VolumeX className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-orange-600" onClick={() => handleUserAction('Kick', user.id, user.name)} title="Kick">
                                <UserX className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600" onClick={() => handleUserAction('Ban', user.id, user.name)} title="Ban">
                                <ShieldBan className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                    ))}
                    {currentParticipants.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No participants in this room.</p>}
                    </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

