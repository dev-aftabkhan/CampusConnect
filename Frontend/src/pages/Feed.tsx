import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CreatePost } from "@/pages/Feed/CreatePost";
import { PostCard } from "@/components/PostCard";
import { PostSkeletonList } from "@/components/ui/post-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Filter, Clock, Flame } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const userData = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserId = userData.id || "";

type PostWithExtras = {
  post_id: string;
  message: string;
  media: string[];
  mediaType: string;
  postType: string[];
  user: string;
  likes: string[];
  comments: any[];
  username: string;
  profilePicture: string | null;
  likedByUser: boolean;
};

export default function Feed() {
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [posts, setPosts] = useState<PostWithExtras[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = sortBy === "recent" ? "/posts/recentposts" : "/posts/popular";
      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${url}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const items = resp.data?.posts || [];

      const postsWithExtras = items.map((post: any) => ({
        ...post,
        likedByUser: post.likes?.includes(currentUserId),
        author: {
          username: post.username || "Unknown",
          profilePicture: post.profilePicture || null,
          _id: post.user,
        },
      }));

      setPosts(postsWithExtras);
    } catch (err) {
      toast({ title: "Error fetching posts.", variant: "destructive" });
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCommentAdded = (postId: string, newComment: any) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.post_id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );
  };  

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        <CreatePost />

        {/* Sort Dropdown */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary" />
                <span>Sort Posts</span>
              </h3>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as "recent" | "popular")}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" /> Recent
                    </span>
                  </SelectItem>
                  <SelectItem value="popular">
                    <span className="flex items-center">
                      <Flame className="h-4 w-4 mr-2 text-orange-500" /> Popular
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            <PostSkeletonList count={3} />
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                currentUserId={currentUserId}
                showEditDelete={false}
                onEditPost={() => { }}
                onDeletePost={() => { }}
                editingPostId={null}
                editMessage={""}
                editPostType={""}
                setEditMessage={() => { }}
                setEditPostType={() => { }}
                onSaveEdit={() => { }}
                onCancelEdit={() => { }}
                onCommentAdded={handleCommentAdded}
              />

            ))
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">No posts to show right now.</p>
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
              <div key={topic} className="flex items-center justify-between">
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
  );
}
