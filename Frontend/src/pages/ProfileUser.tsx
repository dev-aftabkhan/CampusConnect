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
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/api/user";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";



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
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isMutual, setIsMutual] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [enrichedPosts, setEnrichedPosts] = useState<Post[]>([]);
  const [followStatus, setFollowStatus] = useState<
    "not following" | "Requested" | "incoming request" | "connected" | null
  >(null);
  const [searchParams] = useSearchParams();
  const scrollToPostId = searchParams.get("scrollTo");
  const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});



  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        if (!userId) return;

        const profileRes = await getUserProfileById(userId);
        const user = profileRes.user;
        setProfileData(user);
        setFollowStatus(user.status);

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
    setTimeout(() => {
      if (scrollToPostId && postRefs.current[scrollToPostId]) {
        postRefs.current[scrollToPostId]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300); // wait a little for rendering
    
  }, [profileData]);

  useEffect(() => {
    if (scrollToPostId) {
      const el = document.getElementById(`post-${scrollToPostId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-blue-500"); // Optional highlight
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-blue-500");
        }, 2000);
      }
    }
  }, [scrollToPostId, enrichedPosts]); // `posts` should be your post list state
  

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

  const handleAcceptFollow = async () => {
    if (!profileData) return;
    try {
      await acceptFollowRequest(profileData.user_id); // assuming 2nd arg indicates acceptance
      setFollowStatus("connected");
      toast({ title: "Follow request accepted!", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to accept follow request.", variant: "destructive" });
      console.error("❌ Accept follow failed", err);
    }
  };

  const handleDeclineFollow = async () => {
    if (!profileData) return;
    try {
      await rejectFollowRequest(profileData.user_id); // or a separate declineFollow API
      setFollowStatus("not following");
      toast({ title: "Follow request declined.", variant: "default" });
    } catch (err) {
      toast({ title: "Failed to decline follow request.", variant: "destructive" });
      console.error("❌ Decline follow failed", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      if (followStatus === "connected") {
        await unfollowUser(profileData.user_id);
        setFollowStatus("not following");
        toast({ title: "Unfollowed user.", variant: "default" });
      } else if (followStatus === "not following") {
        await followUser(profileData.user_id);
        setFollowStatus("Requested");
        toast({ title: "Follow request sent!", variant: "default" });
      }
    } catch (err) {
      toast({ title: "Failed to update follow status.", variant: "destructive" });
      console.error("❌ Follow toggle failed", err);
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
    <div className="min-h-screen py-10 px-2">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-2xl rounded-2xl border-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-indigo-600" />
          <CardContent className="-mt-16 pb-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left: Avatar + Info */}
            <div className="flex gap-4 items-start">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage
                  src={profileData.profilePicture || "/placeholder.svg"}
                  alt={profileData.username}
                />
                <AvatarFallback>{profileData.username?.[0]}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{profileData.username}</h1>
                <p className="text-muted-foreground text-sm">{profileData.email}</p>
                {profileData.bio && (
                  <p className="text-sm mt-1">{profileData.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                  {profileData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
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

            {/* Right: Follow Button */}
            {/* Right: Follow Button (Dynamic per followStatus) */}
            {profileData.user_id !== loggedInUserId && (
                <>
                  {followStatus === "not following" && (
                    <button
                      onClick={handleFollowToggle}
                      className="mt-4 md:mt-0 px-4 py-2 text-sm rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                    >
                      Follow
                    </button>
                  )}

                  {followStatus === "Requested" && (
                    <button
                      disabled
                      className="mt-4 md:mt-0 px-4 py-2 text-sm rounded-md font-medium bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      Requested
                    </button>
                  )}

                  {followStatus === "incoming request" && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={handleAcceptFollow}
                        className="px-4 py-2 text-sm rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={handleDeclineFollow}
                        className="px-4 py-2 text-sm rounded-md font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {followStatus === "connected" && (
                    <button
                      onClick={handleFollowToggle}
                      className="mt-4 md:mt-0 px-4 py-2 text-sm rounded-md font-medium bg-primary text-primary-foreground hover:bg-destructive transition-colors"
                    >
                      Unfollow
                    </button>
                  )}
                </>
              )}


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
              className={`text-center p-4 rounded-xl hover:shadow-xl transition-shadow border-0 ${stat.onClick ? "cursor-pointer" : ""}`}
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
                <div
                  key={post._id}
                  id={`post-${post.post_id}`} 
                  className={post._id === scrollToPostId ? "border border-primary rounded-md shadow-md" : ""}
                >
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={loggedInUserId || ""}
                    showEditDelete={false}
                    onEditPost={() => {}}
                    onDeletePost={() => {}}
                    editingPostId={null}
                    editMessage={""}
                    editPostType={""}
                    setEditMessage={() => {}}
                    setEditPostType={() => {}}
                    onSaveEdit={() => {}}
                    onCancelEdit={() => {}}
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
                </div>
              ))
            ) : (
              <Card className="border-0 shadow-none">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No posts yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Followers/Following/Mutuals Modal */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">{dialogTitle}</DialogTitle>
            </DialogHeader>
            {userList.length > 0 ? (
              <div className="flex flex-col gap-3">
                {userList.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 rounded p-2 transition"
                    onClick={() => navigate(`/profile/${user.user_id}`)}
                  >
                    <Avatar className="h-10 w-10 shadow">
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
    </div>
  );
}
