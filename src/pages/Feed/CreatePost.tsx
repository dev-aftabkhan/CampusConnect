import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, BookOpen, Heart } from "lucide-react"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    
    setIsPosting(true)
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setContent("")
    setTags("")
    setIsPosting(false)
  }

  const suggestedTags = ["StudyGroup", "Assignment", "Research", "Project", "Exam", "Social"]

  return (
    <Card className="w-full animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Share with your campus</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Your avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's happening on campus? Share your thoughts, ask questions, or connect with fellow students..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
            
            <Input
              placeholder="Add tags (e.g., StudyGroup, Assignment, Research)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Popular tags:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean)
                      if (!currentTags.includes(tag)) {
                        setTags([...currentTags, tag].join(', '))
                      }
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Tag Friends
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim() || isPosting}
            className="bg-gradient-primary hover:bg-gradient-primary/90"
          >
            {isPosting ? "Posting..." : "Share Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}