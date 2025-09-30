
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Share2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export interface BlogCardProps {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  dataAiHint?: string;
  commentCount: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, author, date, excerpt, tags, imageUrl, dataAiHint, commentCount }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl || placeholderImages.blogPostDefault.src);
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className={cn('scroll-animate', isVisible && 'scroll-animate-in')}>
      <Card className={cn(
          "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full",
          "bg-card/80 backdrop-blur-sm"
          )}>
        {imageUrl && (
          <div className="relative w-full h-48">
            <Image 
              src={imgSrc} 
              alt={title} 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint={dataAiHint} 
              onError={() => setImgSrc(placeholderImages.blogPostDefault.src)}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
            <Link href={`/blog/${id}`}>{title}</Link>
          </CardTitle>
          <CardDescription className="text-xs">
            By {author} on {date}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" /> {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount} Comments</span>
          </div>
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCard;
