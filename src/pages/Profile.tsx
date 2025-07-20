import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/pages/Feed/PostCard";
import {
  User,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Heart,
  MessageSquare,
  Edit,
  Camera
} from "lucide-react"
import { getCurrentUser } from "@/api/auth"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        const user = await getCurrentUser()
        setProfileData(user)
      } catch (e) {
        setProfileData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-lg">Loading profile...</div>
  }
  if (!profileData) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-destructive">Failed to load profile.</div>
  }

  const stats = {
    posts: 42,
    followers: 234,
    following: 189,
    likes: 1567
  }

  const userPosts = [
    {
      id: "1",
      author: {
        name: profileData.username,
        avatar: profileData.profilePicture || "/placeholder.svg",
        university: "-",
        major: "-"
      },
      content: "Just submitted my final project for CS229! Building a recommendation system was challenging but incredibly rewarding. Thanks to my study group for all the support 🚀",
      likes: 28,
      comments: 12,
      timestamp: "1 day ago",
      tags: ["CS229", "Project", "MachineLearning"],
      isLiked: false
    },
    {
      id: "2",
      author: {
        name: profileData.username,
        avatar: profileData.profilePicture || "/placeholder.svg",
        university: "-",
        major: "-"
      },
      content: "Looking for research opportunities in NLP! If anyone knows professors or labs working on language models, I'd love to connect.",
      likes: 15,
      comments: 8,
      timestamp: "3 days ago",
      tags: ["Research", "NLP", "Opportunities"],
      isLiked: false
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-hero"></div>
        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt={profileData.username} />
                <AvatarFallback className="text-2xl">{profileData.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.username}</h1>
                  <p className="text-muted-foreground">{profileData.email}</p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? "Save" : "Edit Profile"}</span>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{profileData.user_id || profileData._id || "-"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "-"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {isEditing ? (
              <Textarea
                value={profileData.bio || ""}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="mb-4"
              />
            ) : (
              <p className="text-sm mb-4">{profileData.bio}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {(profileData.interests || []).map((interest: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Posts", value: stats.posts, icon: MessageSquare },
          { label: "Followers", value: stats.followers, icon: Users },
          { label: "Following", value: stats.following, icon: User },
          { label: "Likes", value: stats.likes, icon: Heart }
        ].map((stat, index) => (
          <Card key={index} className="p-4 text-center hover:shadow-campus transition-shadow">
            <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {userPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Recent activity will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Your connections will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}