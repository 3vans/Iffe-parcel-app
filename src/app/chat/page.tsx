
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Smile, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  avatarUrl?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  dataAiHint?: string;
  userName?: string;
}

const currentUser = {
  id: 'currentUser',
  name: 'You',
  avatarUrl: placeholderImages.chatUserCurrent.src,
  avatarWidth: placeholderImages.chatUserCurrent.width,
  avatarHeight: placeholderImages.chatUserCurrent.height,
  dataAiHint: placeholderImages.chatUserCurrent.hint,
};

const otherUserMock = {
  id: 'otherUser1',
  name: 'Travel Bot',
  avatarUrl: placeholderImages.chatUserBot.src,
  avatarWidth: placeholderImages.chatUserBot.width,
  avatarHeight: placeholderImages.chatUserBot.height,
  dataAiHint: placeholderImages.chatUserBot.hint,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to the traveler\'s chat! Have questions about a tour? Ask away!',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      ...otherUserMock,
    },
    {
      id: '2',
      text: 'Hello! I\'m interested in the Gorilla Trekking tour.',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      ...currentUser,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [clientReady, setClientReady] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      ...currentUser,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');

    // Simulate a bot response for demo purposes
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: String(Date.now() + 1),
        text: `Thanks for your message about: "${userMessage.text.substring(0, 30)}${userMessage.text.length > 30 ? "..." : ""}". I am a mock assistant. A real guide will be with you shortly!`,
        sender: 'other',
        timestamp: new Date(),
        ...otherUserMock,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1500);
  };

  return (
    <div ref={ref} className={cn('flex flex-col h-full bg-background scroll-animate', isVisible && 'scroll-animate-in')}>
      <div className="p-4 border-b bg-card sticky top-0 z-10">
        <div className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          <h1 className="font-headline text-xl sm:text-2xl text-primary">Traveler Chat</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Connect with our team and other travelers.
        </p>
      </div>
      
      <ScrollArea className="flex-grow bg-muted/20">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start space-x-2 max-w-[80%] sm:max-w-[70%]',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
              )}
            >
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                {msg.avatarUrl && <AvatarImage asChild src={msg.avatarUrl} alt={msg.userName ?? undefined}>
                    <Image src={msg.avatarUrl} alt={msg.userName || 'avatar'} width={msg.avatarWidth || 40} height={msg.avatarHeight || 40} data-ai-hint={msg.dataAiHint} />
                </AvatarImage>}
                <AvatarFallback>{msg.userName?.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div
                  className={cn(
                    'p-2 sm:p-3 rounded-lg shadow',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground border rounded-bl-none'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                 <p className={cn(
                    "text-xs mt-1 px-1",
                     msg.sender === 'user' ? 'text-muted-foreground text-right' : 'text-muted-foreground text-left'
                  )}
                >
                  {clientReady ? msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '...'}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 sm:p-4 border-t bg-card sticky bottom-0 z-10">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-accent shrink-0">
            <Smile className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow h-10 sm:h-11"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-10 w-10 sm:h-11 sm:w-11">
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
