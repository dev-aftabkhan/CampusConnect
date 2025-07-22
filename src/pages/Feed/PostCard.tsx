import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Share, MoreHorizontal, Bookmark } from "lucide-react"

interface PostCardProps {
  id: string
  author: {
    name: string
    avatar: string
    university: string
    major: string
  }
  content: string
  image?: string
  video?: string
  likes: number
  comments: number
  timestamp: string
  tags: string[]
  isLiked?: boolean
}

export function PostCard({
  author,
  content,
  image,
  likes,
  comments,
  timestamp,
  tags,
  isLiked = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleComment = () => {
    setShowComments(!showComments)
  }

  return (
    <Card className="w-full bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Link to={`/profile/${author.name.toLowerCase().replace(' ', '-')}`}>
              <Avatar className="h-12 w-12 ring-2 ring-border hover:ring-primary transition-colors">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Link 
                  to={`/profile/${author.name.toLowerCase().replace(' ', '-')}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-sm truncate"
                >
                  {author.name}
                </Link>
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary-foreground border-secondary/20">
                  {author.major}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {author.university} • {timestamp}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4">
        <p className="text-sm leading-relaxed text-foreground mb-4">{content}</p>
        
        {image && (
          <div className="rounded-lg overflow-hidden mb-4 border border-border">
            <img
              src={image}
              alt="Post content"
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2.5 py-1 bg-accent/10 text-accent-foreground hover:bg-accent/20 cursor-pointer transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Separator className="mx-6" />
      
      <CardFooter className="px-6 py-3">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-9 px-3 text-sm font-medium rounded-md transition-all ${
                  liked 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                Like ({likeCount})
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comment ({comments})
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>

          {showComments && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Your avatar" />
                  <AvatarFallback className="text-xs">You</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-sm border-border focus:border-primary"
                  />
                  <Button 
                    size="sm" 
                    disabled={!newComment.trim()}
                    className="px-4 bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}