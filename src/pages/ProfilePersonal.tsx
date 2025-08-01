import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostCard } from "@/components/PostCard";
import {
  User,
  Calendar,
  BookOpen,
  Users,
  MessageSquare,
  Edit,
  MoreHorizontal,
  Phone,
} from "lucide-react";
import { getCurrentUser } from "@/api/auth";
import {
  updateProfile,
  updateProfilePicture,
  getFollowers,
  getFollowing,
} from "@/api/user";
import { editPost, deletePost } from "@/api/post";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePersonal() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [userList, setUserList] = useState<any[]>([]);
  const [userListLoading, setUserListLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editPostType, setEditPostType] = useState("");
  const [enrichedPosts, setEnrichedPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        setProfileData(response);
      } catch {
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profileData?.posts || !profileData.username) return;
    setPostsLoading(true);
    const author = {
      username: profileData.username,
      profilePicture: profileData.profilePicture,
    };
    const enriched = profileData.posts.map((post) => {
      const enrichedComments = post.comments.map((comment: any) => ({
        ...comment,
        username: author.username,
        profilePicture: author.profilePicture,
      }));
      return {
        ...post,
        author,
        comments: enrichedComments,
      };
    });
    setTimeout(() => {
      setEnrichedPosts(enriched);
      setPostsLoading(false);
    }, 500); // Simulate loading for cool effect
  }, [profileData]);


  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const updated = await updateProfilePicture(file);
      setProfileData((prev: any) => ({
        ...prev,
        profilePicture: updated.profilePicture,
      }));
      setShowImageEditor(false);
      setPreview(null);
      toast({ title: "Profile picture updated", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to upload profile picture", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenList = async (type: "followers" | "following") => {
    if (!profileData?.user_id) return;
    setDialogTitle(type === "followers" ? "Followers" : "Following");
    setDialogOpen(true);
    setUserListLoading(true);
    try {
      const data =
        type === "followers"
          ? await getFollowers(profileData.user_id)
          : await getFollowing(profileData.user_id);
      setUserList(type === "followers" ? data.followers : data.following);
    } catch (err) {
      setUserList([]);
    } finally {
      setTimeout(() => setUserListLoading(false), 400); // for cool effect
    }
  };

  const handleEditPost = async (postId: string) => {
    try {
      await editPost(postId, { message: editMessage, postType: editPostType });
      setProfileData((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: any) =>
          p.post_id === postId
            ? { ...p, message: editMessage, postType: editPostType }
            : p
        ),
      }));
      setEditingPostId(null);
      toast({ title: "Post updated!", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to update post", variant: "destructive" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setProfileData((prev: any) => ({
        ...prev,
        posts: prev.posts.filter((p: any) => p.post_id !== postId),
      }));
      toast({ title: "Post deleted!", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to delete post", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        username: profileData.username,
        email: profileData.email, // ✅ ADD THIS
        phone: profileData.phone,
        bio: profileData.bio,
      });
      const refreshed = await getCurrentUser();
      setProfileData(refreshed);
      setIsEditing(false);
      toast({ title: "Profile updated successfully", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-lg">
        Loading profile...
      </div>
    );
  if (!profileData)
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-red-600">
        Failed to load profile.
      </div>
    );

  const stats = {
    posts: profileData.postCount,
    followers: profileData.followerCount,
    following: profileData.followingCount,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 relative">
      {/* Remove local toastMsg banner */}

      <Card className="relative overflow-hidden shadow-lg border-0 max-w-4xl mx-auto">
        <div className="h-40 bg-gradient-to-r from-primary to-indigo-600 w-full rounded-t-xl" />
        <CardContent className="relative -mt-20 pb-6 pt-2 px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative group w-32 h-32">
              <Avatar className="h-full w-full border-4 border-background shadow-md group-hover:opacity-80 transition-opacity duration-300">
                <AvatarImage
                  src={profileData.profilePicture || "/placeholder.svg"}
                  alt={profileData.username}
                />
                <AvatarFallback className="text-2xl">
                  {profileData.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute bottom-1 right-1 bg-primary rounded-full p-1 cursor-pointer border border-white shadow"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
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

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold leading-tight">
                    {profileData.username}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {profileData.email}
                  </p>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} variant="default">
                      <Check className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="mt-2 md:mt-0"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
              {profileData.bio && (
                <p className="text-base text-foreground max-w-2xl">
                  {profileData.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {new Date(profileData.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                      })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({ ...profileData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={profileData.phone || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Bio
                </label>
                <Textarea
                  value={profileData.bio || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Tell us something about you..."
                  className="w-full bg-background"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          {
            label: "Posts",
            value: stats.posts,
            icon: MessageSquare,
            onClick: null,
          },
          {
            label: "Followers",
            value: stats.followers,
            icon: Users,
            onClick: () => handleOpenList("followers"),
          },
          {
            label: "Following",
            value: stats.following,
            icon: User,
            onClick: () => handleOpenList("following"),
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`text-center p-4 hover:shadow-md transition-shadow ${stat.onClick ? "cursor-pointer" : ""
              }`}
            onClick={stat.onClick || undefined}
          >
            <stat.icon className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-xl font-semibold">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Only Posts Tab */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-muted rounded-md">
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6 space-y-4">
          {postsLoading ? (
            <div className="flex flex-col items-center gap-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="w-full h-40 rounded-xl" />
              ))}
            </div>
          ) : enrichedPosts.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              {enrichedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={profileData.user_id || ""}
                  showEditDelete={true}
                  onEditPost={(postId) => {
                    setEditingPostId(postId);
                    const postToEdit = enrichedPosts.find((p) => p._id === postId);
                    setEditMessage(postToEdit?.message || "");
                    setEditPostType(postToEdit?.postType || "");
                  }}
                  onDeletePost={handleDeletePost}
                  onSaveEdit={handleEditPost}
                  onCancelEdit={() => setEditingPostId(null)}
                  editingPostId={editingPostId}
                  editMessage={editMessage}
                  editPostType={editPostType}
                  setEditMessage={setEditMessage}
                  setEditPostType={setEditPostType}
                  onCommentAdded={(comment) => {
                    setEnrichedPosts((prev) =>
                      prev.map((p) =>
                        p._id === post._id
                          ? { ...p, comments: [...(p.comments || []), comment] }
                          : p
                      )
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No posts yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Followers Dialog */}
      <Dialog
        open={dialogOpen && dialogTitle === "Followers"}
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          {userListLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded" />
                </div>
              ))}
            </div>
          ) : userList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {userList.map((user: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded p-2 transition"
                  onClick={() => navigate(`/profile/${user.user_id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No followers found.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog
        open={dialogOpen && dialogTitle === "Following"}
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          {userListLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded" />
                </div>
              ))}
            </div>
          ) : userList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {userList.map((user: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded p-2 transition"
                  onClick={() => navigate(`/profile/${user.user_id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No following found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
