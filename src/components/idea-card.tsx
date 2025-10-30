
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, UserCircle, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import placeholderImages from '@/app/lib/placeholder-images.json';

export interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  dateSubmitted: string;
  votes: number;
  commentsCount: number;
  status: 'New' | 'Under Review' | 'Approved' | 'Implemented';
  onVote: (id: string) => void;
  hasVoted?: boolean;
  imageUrl?: string;
  dataAiHint?: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  id, 
  title, 
  description, 
  submittedBy, 
  dateSubmitted, 
  votes, 
  commentsCount, 
  status, 
  onVote, 
  hasVoted,
  imageUrl,
  dataAiHint
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl || placeholderImages.ideaWalkingSafari.src);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const statusColors = {
    'New': 'bg-blue-100 text-blue-700 border-blue-300',
    'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Approved': 'bg-green-100 text-green-700 border-green-300',
    'Implemented': 'bg-purple-100 text-purple-700 border-purple-300',
  };

  const longDescriptionThreshold = 180; 
  const isLongDescription = description.length > longDescriptionThreshold;

  return (
    <Card className={cn(
        "overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full",
        "bg-card/80 backdrop-blur-sm"
        )}>
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imgSrc}
            alt={title || 'Idea background image'}
            layout="fill"
            objectFit="cover"
            className="z-0"
            data-ai-hint={dataAiHint || 'idea image'}
            onError={() => setImgSrc(placeholderImages.ideaWalkingSafari.src)}
          />
          <div className="absolute inset-0 w-full h-full z-[1] bg-black/10 dark:bg-black/30"></div> 
        </div>
      )}
      <CardHeader className={cn(
        "relative z-10"
      )}>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
          <Badge className={`text-xs px-2 py-1 ${statusColors[status]}`}>{status}</Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground flex flex-wrap gap-x-3 pt-1">
          <span className="flex items-center"><UserCircle className="h-3.5 w-3.5 mr-1 text-accent" /> {submittedBy}</span>
          <span className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1 text-accent" /> {dateSubmitted}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(
        "flex-grow flex flex-col relative z-10"
      )}>
        <p className={cn(
          "text-sm text-muted-foreground mb-2",
          !isExpanded && isLongDescription && "line-clamp-4"
        )}>
          {description}
        </p>
        {isLongDescription && (
          <Button
            variant="link"
            size="sm"
            onClick={toggleExpanded}
            className="text-accent hover:text-accent/80 px-0 mt-auto self-start text-xs"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show Less' : 'Continue Reading'}
            {isExpanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
          </Button>
        )}
      </CardContent>
      <CardFooter className={cn(
        "flex justify-between items-center border-t pt-4 mt-auto relative z-10"
      )}>
        <Button
          variant={hasVoted ? "default" : "outline"}
          size="sm"
          onClick={() => onVote(id)}
          className={cn(
            !hasVoted && "hover:bg-accent/10 hover:border-accent hover:text-accent",
            hasVoted && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <ThumbsUp className={cn("h-4 w-4 mr-2", hasVoted ? "text-primary-foreground" : "")} />
          {hasVoted ? 'Voted' : 'Vote'} ({votes})
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-1" /> {commentsCount} Comments
        </div>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
