import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/pages/Feed/PostCard"
import { User, Calendar, BookOpen, Users, MessageSquare, Edit, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/api/auth"
import { updateProfile } from "@/api/user"
import { updateProfilePicture } from "@/api/user"
import { Phone } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        const response = await getCurrentUser()
        setProfileData(response)
      } catch {
        setProfileData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const showToast = (message: string, duration = 3000) => {
    setToastMsg(message)
    setTimeout(() => setToastMsg(""), duration)
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const updated = await updateProfilePicture(file)
      setProfileData((prev: any) => ({
        ...prev,
        profilePicture: updated.profilePicture,
      }))
      setShowImageEditor(false)
      setPreview(null)
      showToast("Profile picture updated")
    } catch (err) {
      console.error(err)
      showToast("Failed to upload profile picture")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-lg">Loading profile...</div>
  }

  if (!profileData) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-red-600">Failed to load profile.</div>
  }

  const stats = {
    posts: profileData.postCount,
    followers: profileData.followerCount,
    following: profileData.followingCount,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-md z-50 animate-fadeIn">
          {toastMsg}
        </div>
      )}

      {/* Profile Header */}
      <Card className="relative overflow-hidden shadow-md">
        <div className="h-32 bg-gradient-to-r from-primary to-indigo-600"></div>
        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar
                className="h-24 w-24 border-4 border-background group-hover:opacity-80 transition-opacity duration-300"
              >
                <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt={profileData.username} />
                <AvatarFallback className="text-2xl">{profileData.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                <Edit className="h-4 w-4 text-white" />
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <h1 className="text-2xl font-bold">{profileData.username}</h1>
                  <p className="text-muted-foreground text-sm">{profileData.email}</p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 mt-2 md:mt-0"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? "Save" : "Edit Profile"}</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{profileData.user_id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Section */}
          {isEditing && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                <input
                  type="text"
                  value={profileData.phone || ""}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Bio</label>
                <Textarea
                  value={profileData.bio || ""}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us something about you..."
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Interests</label>
                <input
                  type="text"
                  placeholder="Add interests separated by commas"
                  onBlur={(e) => {
                    const interests = e.target.value.split(',').map((interest) => interest.trim());
                    setProfileData({ ...profileData, interests });
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.interests?.map((interest, index) => (
                    <Badge key={index} variant="outline" className="bg-muted text-xs px-2 py-1 rounded-full">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="default"
                onClick={async () => {
                  try {
                    await updateProfile({
                      username: profileData.username,
                      email: profileData.email,
                      phone: profileData.phone || "",
                      bio: profileData.bio || "",
                    });
                    showToast("Profile updated successfully");
                    setIsEditing(false);
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to update profile");
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Posts", value: stats.posts, icon: MessageSquare },
          { label: "Followers", value: stats.followers, icon: Users },
          { label: "Following", value: stats.following, icon: User },
        ].map((stat, index) => (
          <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow">
            <stat.icon className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-xl font-semibold">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted rounded-md">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-4">
          {profileData.posts.length ? (
            profileData.posts.map((post) => (
              <PostCard
                key={post._id}
                id={post.post_id}
                author={{
                  name: profileData.username,
                  avatar: profileData.profilePicture || "/placeholder.svg",
                  university: "-",
                  major: "-",
                }}
                content={post.message}
                image={post.mediaType === "image" ? post.media[0] : undefined}
                video={post.mediaType === "video" ? post.media[0] : undefined}
                likes={post.likes.length}
                comments={post.comments.length}
                timestamp={new Date(post.createdAt).toLocaleDateString()}
                tags={[]}
                isLiked={false}
              />
            ))
          ) : (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No posts yet.</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card><CardContent className="p-6 text-center text-muted-foreground">Recent activity will appear here.</CardContent></Card>
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          <Card><CardContent className="p-6 text-center text-muted-foreground">Your connections will appear here.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
