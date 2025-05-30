import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, UserCircle, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
}

const IdeaCard: React.FC<IdeaCardProps> = ({ id, title, description, submittedBy, dateSubmitted, votes, commentsCount, status, onVote }) => {
  
  const statusColors = {
    'New': 'bg-blue-100 text-blue-700 border-blue-300',
    'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Approved': 'bg-green-100 text-green-700 border-green-300',
    'Implemented': 'bg-purple-100 text-purple-700 border-purple-300',
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
          <Badge className={`text-xs px-2 py-1 ${statusColors[status]}`}>{status}</Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground flex flex-wrap gap-x-3 pt-1">
          <span className="flex items-center"><UserCircle className="h-3.5 w-3.5 mr-1 text-accent" /> {submittedBy}</span>
          <span className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1 text-accent" /> {dateSubmitted}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onVote(id)} className="hover:bg-accent/10 hover:border-accent">
          <ThumbsUp className="h-4 w-4 mr-2" /> Vote ({votes})
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-1" /> {commentsCount} Comments
        </div>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
