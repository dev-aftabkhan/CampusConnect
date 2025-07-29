import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, Trash2, Edit2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { likePost, unlikePost, addComment, deleteComment } from "@/api/post";

export function PostCard({
  post,
  currentUserId,
  showEditDelete = false,
  onEditPost,
  onDeletePost,
  editingPostId,
  editMessage,
  editPostType,
  setEditMessage,
  setEditPostType,
  onSaveEdit,
  onCancelEdit,
}) {
  const [liked, setLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentList, setCommentList] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(post.likes.includes(currentUserId));
    setLikeCount(post.likes.length);
  }, [post.likes, currentUserId]);


  const isEditing = showEditDelete && editingPostId === post.post_id;

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.post_id);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post.post_id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const mentions = newComment.match(/@\w+/g)?.map((m) => m.slice(1)) || [];
      const res = await addComment(post.post_id, {
        text: newComment,
        mentions,
      });

      const addedComment = {
        comment_id: res.data.comment_id || res.data._id,
        text: res.data.text,
        username: post.currentUser?.username || "You",
        user: currentUserId,
        profilePicture: post.currentUser?.profilePicture || "",
      };

      setCommentList((prev) => [...prev, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setCommentList((prev) =>
        prev.filter((c) => c.comment_id !== commentId)
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const postTypeTags = Array.isArray(post.postType)
    ? post.postType
    : post.postType
      ? [post.postType]
      : [];

  const hasMedia = post.mediaType === "image" && post.media.length > 0;

  return (
    <Card className="w-full max-w-4xl bg-background border rounded-2xl shadow-md overflow-hidden">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={post.author?.profilePicture || "/placeholder.svg"}
              />
              <AvatarFallback>
                {post.author?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Link
              to={`/profile/${post.user?._id || post.user}`}
              className="text-sm font-semibold hover:underline text-primary"
            >
              @{post.author?.username || "user"}
            </Link>
          </div>

          {showEditDelete && (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditMessage?.(post.message || "");
                  setEditPostType?.(post.postType || "");
                  onEditPost?.(
                    post.post_id,
                    post.message || "",
                    post.postType || ""
                  );
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDeletePost?.(post.post_id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-2">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSaveEdit?.(post.post_id, editMessage, editPostType);
            }}
            className="space-y-2"
          >
            <textarea
              className="w-full border rounded p-2 text-sm focus-visible:ring-0 focus-visible:outline-none"
              rows={2}
              value={editMessage}
              onChange={(e) => setEditMessage?.(e.target.value)}
            />
            <input
              className="w-full border rounded p-2 text-sm focus-visible:ring-0 focus-visible:outline-none"
              value={editPostType}
              onChange={(e) => setEditPostType?.(e.target.value)}
            />

            <div className="flex gap-2">
              <Button size="sm" type="submit">
                Save
              </Button>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            {hasMedia && (
              <div className="relative">
                <Carousel>
                  <CarouselContent>
                    {post.media.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div className="w-full flex justify-center items-center bg-muted/10 rounded-lg p-2 relative">
                          <img
                            src={img}
                            alt="media"
                            className="object-contain w-full h-auto max-h-[70vh]"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="z-10 absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="z-10 absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>
            )}

            {post.message && (
              <p className="text-sm whitespace-pre-line break-words">
                {post.message}
              </p>
            )}

            {post.mentions?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.mentions.map((username) => (
                  <Badge key={username} className="bg-muted text-xs">
                    @{username}
                  </Badge>
                ))}
              </div>
            )}

            {postTypeTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postTypeTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center gap-6 justify-start w-full">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${liked
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground group-hover:text-red-400"
                }`}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowCommentBox((prev) => !prev)}
          >
            <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">
              {commentList.length}{" "}
              {commentList.length === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>

        {showCommentBox && (
          <div className="space-y-4 w-full">
            {commentList.map((comment, index) => {
              const key =
                comment.comment_id || comment._id || `comment-${index}`;
              return (
                <div key={key} className="flex items-start gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.profilePicture || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {comment.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${comment.user}`}
                        className="text-sm font-medium hover:underline"
                      >
                        @{comment.username || "user"}
                      </Link>
                      {comment._id === currentUserId && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            handleDeleteComment?.(
                              post.post_id,
                              comment.comment_id || comment._id
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              );
            })}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment();
              }}
              className="flex items-center gap-2 w-full"
            >
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="h-8 text-sm flex-1"
                disabled={loading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !newComment.trim()}
              >
                Post
              </Button>
            </form>

          </div>
        )}
      </CardFooter>
    </Card>
  );
}
