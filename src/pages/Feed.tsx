import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { CreatePost } from "@/pages/Feed/CreatePost"
import { PostCard } from "@/pages/Feed/PostCard"
import { PostSkeletonList } from "@/components/ui/post-skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  TrendingUp,
  Filter,
} from "lucide-react"

export default function Feed() {
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const url =
        sortBy === "recent"
          ? "/posts/recentposts"
          : "/posts/popular"

      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${url}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      // Always access resp.data.posts, as your API wraps data like: { message, posts }
      const items = resp.data?.posts || []
      setPosts(items)
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setIsLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        <CreatePost />

        {/* Sort Tabs */}
        <Card>
          <CardContent className="p-4">
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "recent" | "popular")}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span>Sort Posts</span>
                </h3>
              </div>
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="recent" className="text-sm">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="text-sm">
                  Popular
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {isLoading ? (
            <PostSkeletonList count={3} />
          ) : (
            posts.map((post) => (
              <PostCard key={post._id || post.id} {...post} />
            ))
          )}


          {!isLoading && posts.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">
                  No posts to show right now.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Trending Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trending</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Finals2024", "StudyGroups", "CareerFair"].map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between"
              >
                <Badge variant="outline" className="cursor-pointer">
                  #{topic}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 100) + 10}k posts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
