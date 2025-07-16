import React, { useState, useMemo, useCallback } from "react"
import { CreatePost } from "@/components/feed/CreatePost"
import { PostCard } from "@/components/feed/PostCard"
import { PostSkeletonList } from "@/components/ui/post-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { Users, BookOpen, Calendar, TrendingUp, Filter } from "lucide-react"


export default function Feed() {
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "following">("recent")
  const [posts, setPosts] = useState<typeof mockPosts>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Mock data for posts
  const mockPosts = [
    {
      id: "1",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg",
        university: "Stanford University",
        major: "Computer Science"
      },
      content: "Just finished my Machine Learning assignment! The neural network finally converged after debugging for hours. Anyone else working on similar projects? Would love to discuss different approaches to gradient descent optimization.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      tags: ["MachineLearning", "CS", "Assignment"],
      isLiked: false
    },
    {
      id: "2",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        university: "MIT",
        major: "Biology"
      },
      content: "Looking for study partners for the upcoming Organic Chemistry exam! Planning to meet at the library this weekend. Drop a comment if you're interested 📚",
      likes: 15,
      comments: 12,
      timestamp: "4 hours ago",
      tags: ["StudyGroup", "Chemistry", "Exam"],
      isLiked: true
    },
    {
      id: "3",
      author: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg",
        university: "UC Berkeley",
        major: "Business"
      },
      content: "Great networking event yesterday! Met some amazing entrepreneurs and learned about startup opportunities in the Bay Area. Special thanks to the Career Center for organizing this.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500",
      likes: 32,
      comments: 6,
      timestamp: "1 day ago",
      tags: ["Networking", "Career", "Startup"],
      isLiked: false
    }
  ]

  const trendingTopics = [
    "Finals2024", "StudyGroups", "CareerFair", "Research", "Internships"
  ]

  const upcomingEvents = [
    { name: "Career Fair", date: "Dec 15", attendees: 450 },
    { name: "Study Group: Physics", date: "Dec 12", attendees: 12 },
    { name: "Research Symposium", date: "Dec 20", attendees: 280 }
  ]

  // Initialize posts on first load
  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(mockPosts)
    }
  }, [])

  // Generate more mock posts for infinite scroll
  const generateMorePosts = useCallback(() => {
    const newPosts = Array.from({ length: 3 }, (_, index) => ({
      id: `generated-${page}-${index}`,
      author: {
        name: ["Emma Wilson", "David Kim", "Lisa Brown", "James Chen", "Sophie Martinez"][Math.floor(Math.random() * 5)],
        avatar: "/placeholder.svg",
        university: ["Stanford University", "MIT", "UC Berkeley", "Harvard University"][Math.floor(Math.random() * 4)],
        major: ["Computer Science", "Biology", "Business", "Engineering", "Psychology"][Math.floor(Math.random() * 5)]
      },
      content: [
        "Just finished an amazing group project! Working with diverse perspectives really enhanced our solution.",
        "Looking for study partners for the upcoming midterms. Let's tackle these challenges together!",
        "Attended a fantastic guest lecture today. The insights on emerging technologies were mind-blowing!",
        "Successfully completed my internship application. Fingers crossed for that dream position!",
        "Organizing a study group for advanced mathematics. Join us if you're interested!"
      ][Math.floor(Math.random() * 5)],
      image: Math.random() > 0.6 ? `https://images.unsplash.com/photo-${[
        "1526374965328-7f61d4dc18c5",
        "1581091226825-a6a2a5aee158",
        "1518770660439-4636190af475",
        "1486312338219-ce68d2c6f44d"
      ][Math.floor(Math.random() * 4)]}?w=500` : undefined,
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 20) + 1,
      timestamp: `${Math.floor(Math.random() * 12) + 1} hours ago`,
      tags: [
        ["StudyGroup", "Mathematics", "Academic"],
        ["Internship", "Career", "Opportunities"],
        ["Project", "Teamwork", "Innovation"],
        ["Lecture", "Technology", "Learning"],
        ["Networking", "Community", "Growth"]
      ][Math.floor(Math.random() * 5)],
      isLiked: Math.random() > 0.7
    }))

    return newPosts
  }, [page])

  // Fetch more posts for infinite scroll
  const fetchMorePosts = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPosts = generateMorePosts()
    setPosts(prev => [...prev, ...newPosts])
    setPage(prev => prev + 1)

    // Stop loading after 20 posts to simulate end of feed
    if (posts.length + newPosts.length >= 20) {
      setHasMore(false)
    }

    setIsLoading(false)
  }, [generateMorePosts, posts.length, isLoading])

  // Use infinite scroll hook
  const { isFetching } = useInfiniteScroll({
    fetchMore: fetchMorePosts,
    hasMore,
    isLoading
  })

  // Sort posts based on selected criteria
  const sortedPosts = useMemo(() => {
    const allPosts = [...posts]
    switch (sortBy) {
      case "popular":
        return allPosts.sort((a, b) => b.likes - a.likes)
      case "following":
        return allPosts.filter(post => Math.random() > 0.3) // Mock filter for following
      case "recent":
      default:
        return allPosts.sort((a, b) => {
          const timeA = a.timestamp.includes("hour") ? parseInt(a.timestamp) :
            a.timestamp.includes("day") ? parseInt(a.timestamp) * 24 : 0
          const timeB = b.timestamp.includes("hour") ? parseInt(b.timestamp) :
            b.timestamp.includes("day") ? parseInt(b.timestamp) * 24 : 0
          return timeA - timeB
        })
    }
  }, [posts, sortBy])

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        <CreatePost />

        {/* Post Sorting */}
        <Card className="bg-card border border-border">
          <CardContent className="p-4">
            <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span>Sort Posts</span>
                </h3>
              </div>
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="recent" className="text-sm">Recent</TabsTrigger>
                <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
                <TabsTrigger value="following" className="text-sm">Following</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}

          {/* Loading skeletons */}
          {(isLoading || isFetching) && <PostSkeletonList count={3} />}

          {/* End of feed message */}
          {!hasMore && sortedPosts.length > 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">You've reached the end of your feed!</p>
                <p className="text-sm text-muted-foreground mt-2">Follow more people to see more posts</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Trending Topics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trending</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={topic} className="flex items-center justify-between">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  #{topic}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 100) + 10}k posts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-secondary" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <h4 className="font-medium text-sm">{event.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{event.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Connections */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>Suggested</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Emma Wilson", major: "Psychology", mutual: 3 },
              { name: "David Kim", major: "Engineering", mutual: 7 },
              { name: "Lisa Brown", major: "Art History", mutual: 2 }
            ].map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.major} • {user.mutual} mutual
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}