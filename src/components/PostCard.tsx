import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { getUserProfileById } from "@/api/user";
import { likePost, unlikePost, addComment, deleteComment } from "@/api/post";

export function PostCard({
  post,
  currentUserId,
  showEditDelete = false,
  onLike,
  onDeleteComment,
  onAddComment,
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
  const [mentionUsers, setMentionUsers] = useState<
    Record<string, { username: string }>
  >({});
  const [liked, setLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [originalComments, setOriginalComments] = useState(post.comments);
  const [commentList, setCommentList] = useState([]); // final enriched list
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentAuthors, setCommentAuthors] = useState({});
  const isCurrentUserPost = post.user === currentUserId;
  const isEditing = showEditDelete && editingPostId === post.post_id;
  const [author, setAuthor] = useState({ name: "Loading...", avatar: "" });

  useEffect(() => {
    if (post.author?.username) {
      setAuthor({
        name: post.author.username,
        avatar: post.author.profilePicture,
      });
    } else {
      const fetchAuthor = async () => {
        try {
          const userId = post.user?._id || post.user;
          if (!userId) {
            console.warn("No user ID found for post:", post);
            return; // avoid API call with undefined
          }
          const res = await getUserProfileById(userId);
          const user = res.data?.user || {};
          setAuthor({
            name: user.username || "Unknown",
            avatar: user.profilePicture || "",
          });
        } catch (err) {
          console.error("Error fetching author", err);
          setAuthor({ name: "Unknown", avatar: "" });
        }
      };
      fetchAuthor();
    }
  }, [post.user, post.author, post]);

  useEffect(() => {
    if (!post.mentions?.length) return;
    Promise.all(post.mentions.map(getUserProfileById)).then((users) => {
      const map = {};
      users.forEach((u, i) => {
        map[post.mentions[i]] = { username: u.username };
      });
      setMentionUsers(map);
    });
  }, [post.mentions]);

  useEffect(() => {
    const comments = post.comments || [];
    setOriginalComments(comments);
    setCommentList(comments);
  }, [post.comments]);

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
    try {
      const mentions = newComment.match(/@\w+/g)?.map((m) => m.slice(1)) || [];
      const res = await addComment(post.post_id, {
        text: newComment,
        mentions,
      });

      // Fetch full user info of current user
      const currentUser = await getUserProfileById(currentUserId);

      const addedComment = {
        ...res.data,
        author: {
          _id: currentUserId,
          username: currentUser?.data?.user?.username || "You",
          profilePicture: currentUser?.data?.user?.profilePicture || "",
        },
      };

      setCommentList((prev) => [...prev, addedComment]);
      setOriginalComments((prev) => [...prev, res.data]); // keep source in sync
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setOriginalComments((prev) =>
        prev.filter((c) => c.comment_id !== commentId)
      );
      setCommentList((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditPost = (
    postId: string,
    message: string,
    postType: string
  ) => {
    setEditingPostId(postId);
    setEditMessage(message);
    setEditPostType(postType);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditMessage("");
    setEditPostType("");
  };

  const handleSaveEdit = async (
    postId: string,
    updatedMessage: string,
    updatedPostType: string
  ) => {
    console.log("Saving", postId, updatedMessage, updatedPostType);
    // TODO: Call your API here to update the post

    setEditingPostId(null);
    setEditMessage("");
    setEditPostType("");
  };

  const postTypeTags = Array.isArray(post.postType)
    ? post.postType
    : post.postType
    ? [post.postType]
    : [];
  const hasMedia = post.mediaType === "image" && post.media.length > 0;

  // Render with author prop
  return (
    <Card className="w-full max-w-4xl bg-background border rounded-2xl shadow-md overflow-hidden">
      {/* Top Header */}
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={author?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {author?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <Link
              to={`/profile/${post.user?._id || post.user}`}
              className="text-sm font-semibold hover:underline text-primary"
            >
              @{author?.name || "user"}
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

      {/* Content: Media, Message, Tags, Mentions */}
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
              className="w-full border rounded p-2 text-sm"
              rows={2}
              value={editMessage}
              onChange={(e) => setEditMessage?.(e.target.value)}
            />
            <input
              className="w-full border rounded p-2 text-sm"
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
                {/* Track current index for count display */}
                {(() => {
                  const [currentIdx, setCurrentIdx] = useState(0);
                  const onSelect = useCallback((embla) => {
                    setCurrentIdx(embla.selectedScrollSnap());
                  }, []);
                  return (
                    <div className="relative">
                      <Carousel onSelect={onSelect}>
                        <CarouselContent>
                          {post.media.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <div className="w-full flex justify-center items-center bg-muted/10 rounded-lg p-2 relative">
                                <img
                                  src={img}
                                  alt="media"
                                  className="object-contain w-full h-auto max-h-[70vh]"
                                />
                                {/* Always show count for current image, overlayed */}
                                {currentIdx === idx && (
                                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                                    {currentIdx + 1} / {post.media.length}
                                  </div>
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {/* Overlay next/prev buttons */}
                        <CarouselPrevious className="z-10 absolute left-2 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="z-10 absolute right-2 top-1/2 -translate-y-1/2" />
                      </Carousel>
                      {/* Dots navigation */}
                      <div className="flex justify-center gap-2 mt-2">
                        {post.media.map((_, idx) => (
                          <span
                            key={idx}
                            className={`h-2 w-2 rounded-full transition-all duration-200
                  ${
                    currentIdx === idx
                      ? "bg-primary shadow-lg"
                      : "bg-gray-300 dark:bg-purple-400 border border-border"
                  }
                `}
                            style={{ opacity: currentIdx === idx ? 1 : 0.7 }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {post.message && (
              <p className="text-sm whitespace-pre-line break-words">
                {post.message}
              </p>
            )}

            {mentionUsers && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(mentionUsers).map(([id, u]) => (
                  <Badge key={id} className="bg-muted text-xs">
                    @{u.username}
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
        {/* Like + Comment Toggle */}
        <div className="flex items-center gap-6 justify-start w-full">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
                liked
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

        {/* Comment Section */}
        {showCommentBox && (
          <div className="space-y-4 w-full">
            {commentList.map((comment, index) => {
              const key =
                comment.comment_id || comment._id || `comment-${index}`;
              return (
                <div key={key} className="flex items-start gap-3 w-full">
                  {/* Avatar */}
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author?.profilePicture || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {comment.author?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${comment.author?._id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        @{comment.author?.username || "user"}
                      </Link>

                      {comment.author?._id === currentUserId && (
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

            {/* Input Box */}
            <div className="flex items-center gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                disabled={loading}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
