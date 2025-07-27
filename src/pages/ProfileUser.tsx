import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Phone,
} from "lucide-react";
import {
  getUserProfileById,
  getOwnUserProfile,
  getFollowers,
  getFollowing,
  getMutuals,
  followUser,
  unfollowUser,
  updateProfile,
} from "@/api/user";

interface Post {
  _id: string;
  post_id: string;
  message: string;
  media: string[];
  mediaType: "image" | "video";
  likes: string[];
  comments: any[];
  createdAt: string;
  postType?: string;
}

interface ProfileData {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  profilePicture?: string;
  posts: Post[];
  postCount: number;
  followerCount: number;
  followingCount: number;
  mutualCount: number;
}

export default function ProfileUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isMutual, setIsMutual] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [enrichedPosts, setEnrichedPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        if (!userId) return;

        const profileRes = await getUserProfileById(userId);
        const user = profileRes.user;
        setProfileData(user);

        setEditUsername(user.username);
        setEditEmail(user.email);
        setEditPhone(user.phone || "");
        setEditBio(user.bio || "");

        const ownProfileRes = await getOwnUserProfile();
        const myUserId = ownProfileRes.user.user_id;
        setLoggedInUserId(myUserId);

        const [followingRes, mutualsRes] = await Promise.all([
          getFollowing(myUserId),
          getMutuals(userId),
        ]);

        setIsFollowing(
          followingRes.following.some((u: any) => u.user_id === userId)
        );
        setIsMutual(
          mutualsRes.mutuals.some((u: any) => u.user_id === myUserId)
        );
      } catch (error) {
        console.error("❌ Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!profileData?.posts || !profileData.username) return;

    const author = {
      username: profileData.username,
      profilePicture: profileData.profilePicture,
    };

    const enriched = profileData.posts.map((post) => ({
      ...post,
      author,
    }));

    setEnrichedPosts(enriched);
  }, [profileData]);

  const handleOpenList = async (
    type: "followers" | "following" | "mutuals"
  ) => {
    if (!profileData?.user_id) return;
    setDialogTitle(type.charAt(0).toUpperCase() + type.slice(1));
    setDialogOpen(true);
    try {
      const data =
        type === "followers"
          ? await getFollowers(profileData.user_id)
          : type === "following"
          ? await getFollowing(profileData.user_id)
          : await getMutuals(profileData.user_id);

      setUserList(data[type]);
    } catch {
      setUserList([]);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      if (isFollowing) {
        await unfollowUser(profileData.user_id);
        setIsFollowing(false);
        setIsMutual(false);
      } else {
        await followUser(profileData.user_id);
        setIsFollowing(true);
        const mutualsRes = await getMutuals(userId);
        setIsMutual(
          mutualsRes.mutuals.some((u: any) => u.user_id === loggedInUserId)
        );
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  const handleSaveProfile = async () => {
    console.log("📝 Save clicked with values:", {
      username: editUsername,
      email: editEmail,
      phone: editPhone,
      bio: editBio,
    });

    try {
      const response = await updateProfile({
        username: editUsername,
        email: editEmail,
        phone: editPhone,
        bio: editBio,
      });

      console.log("✅ Profile updated", response);

      setEditMode(false);

      if (userId) {
        const refreshed = await getUserProfileById(userId);
        setProfileData(refreshed.user);
      }
    } catch (err) {
      console.error("❌ Failed to save profile", err);
    }
  };

  if (loading)
    return <div className="text-center py-12 text-lg">Loading profile...</div>;
  if (!profileData)
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load profile.
      </div>
    );

  const stats = {
    posts: profileData.postCount,
    followers: profileData.followerCount,
    following: profileData.followingCount,
    mutuals: profileData.mutualCount,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Card>
        <div className="h-32 bg-gradient-to-r from-primary to-indigo-600" />
        <CardContent className="-mt-16 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage
                src={profileData.profilePicture || "/placeholder.svg"}
                alt={profileData.username}
              />
              <AvatarFallback>{profileData.username?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between gap-2 items-start md:items-center">
                {editMode ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      className="border px-3 py-1 rounded-md"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                    <input
                      className="border px-3 py-1 rounded-md"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                    <input
                      className="border px-3 py-1 rounded-md"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                    <textarea
                      className="border px-3 py-1 rounded-md"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Bio"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {profileData.username}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {profileData.email}
                    </p>
                  </div>
                )}

                {profileData.user_id === loggedInUserId ? (
                  editMode ? (
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-1 text-sm rounded-md font-medium transition-colors ${
                      isMutual || isFollowing
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isMutual || isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
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
                  <span>
                    Joined{" "}
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Posts", value: profileData.postCount, icon: MessageSquare },
          {
            label: "Followers",
            value: profileData.followerCount,
            icon: Users,
            onClick: () => handleOpenList("followers"),
          },
          {
            label: "Following",
            value: profileData.followingCount,
            icon: User,
            onClick: () => handleOpenList("following"),
          },
          {
            label: "Mutuals",
            value: profileData.mutualCount,
            icon: User,
            onClick: () => handleOpenList("mutuals"),
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className={`text-center p-4 hover:shadow-lg transition-shadow ${
              stat.onClick ? "cursor-pointer" : ""
            }`}
            onClick={stat.onClick}
          >
            <stat.icon className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-xl font-semibold">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Posts */}
      <Tabs defaultValue="posts" className="mt-6 space-y-4">
        <TabsList className="hidden" />
        <TabsContent value="posts" className="space-y-4">
          {enrichedPosts.length > 0 ? (
            enrichedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={loggedInUserId || ""}
                showEditDelete={false}
                onLike={() => {}}
                onDeleteComment={() => {}}
                onAddComment={() => {}}
                onEditPost={() => {}}
                onDeletePost={() => {}}
                editingPostId={null}
                editMessage={""}
                editPostType={""}
                setEditMessage={() => {}}
                setEditPostType={() => {}}
                onSaveEdit={() => {}}
                onCancelEdit={() => {}}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No posts yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Followers/Following/Mutuals Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          {userList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {userList.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${user.user_id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No {dialogTitle.toLowerCase()} found.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
