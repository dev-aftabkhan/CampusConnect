import { useEffect, useRef, useState } from "react";
import { BookOpen, Camera } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import { createPostWithImage } from "@/api/post";
import { getUserByUsername } from "@/api/user";
import { getOwnUserProfile } from "@/api/user";
import { toast } from "@/components/ui/use-toast";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const [mentionInput, setMentionInput] = useState("");
  const [mentionResults, setMentionResults] = useState<{ username: string; user_id: string }[]>([]);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentions, setMentions] = useState<{ user_id: string; username: string }[]>([]);
  const [mentionNotFound, setMentionNotFound] = useState("");
  const [searching, setSearching] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getOwnUserProfile();
        setProfilePic(res.user.profilePicture || ""); // updated path
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);



  useEffect(() => {
    if (mentionInput.length > 0) {
      setSearching(true);
      const handler = setTimeout(() => {
        getUserByUsername(mentionInput)
          .then((res) => {
            setSearching(false);
            if (res && res.username) {
              setMentionNotFound("");
              if (!mentions.some((m) => m.user_id === res.user_id)) {
                setMentions((prev) => [...prev, { username: res.username, user_id: res.user_id }]);
                setMentionInput("");
                setMentionOpen(false);
              }
            } else {
              setMentionOpen(false);
              setMentionNotFound(mentionInput);
            }
          })
          .catch(() => {
            setSearching(false);
            setMentionOpen(false);
            setMentionNotFound(mentionInput);
          });
      }, 1500); // 1.5 seconds debounce
      return () => clearTimeout(handler);
    } else {
      setMentionOpen(false);
      setMentionNotFound("");
      setSearching(false);
    }
  }, [mentionInput]);

  const handleMentionSelect = (username: string, user_id: string) => {
    if (!mentions.some((m) => m.user_id === user_id)) {
      setMentions((prev) => [...prev, { username, user_id }]);
    }
    setMentionInput("");
    setMentionOpen(false);
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setMedia((prev) => [...prev, ...files]);
    };
    input.click();
  };

  const handleSubmit = async () => {
    const cleanedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const postType = cleanedTags.join(",");

    if (!content.trim() && media.length === 0) {
      toast({ title: "Please write something or add an image.", variant: "destructive" });
      return;
    }
    if (!postType) {
      toast({ title: "Please add at least one tag.", variant: "destructive" });
      return;
    }

    setIsPosting(true);
    try {
      await createPostWithImage({
        message: content,
        mediaType: "image",
        postType,
        mentions: mentions.map((m) => m.user_id),
        media
      });
      setContent("");
      setTags("");
      setMedia([]);
      setMentions([]);
      toast({ title: "Post created successfully!", variant: "default" });
    } catch (e) {
      toast({ title: "Failed to create post.", variant: "destructive" });
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="w-full shadow-md rounded-2xl border bg-white dark:bg-muted animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <span>Share with your campus</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 relative">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePic || "/placeholder.svg"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>


          <div className="flex-1 relative space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="What's happening on campus?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] border-muted bg-muted/50 resize-none focus-visible:ring-1 focus-visible:ring-primary"
            />

            {/* Mention Input (separate) */}
            <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
              <div className="relative">
                <Input
                  placeholder="Mention someone by username"
                  value={mentionInput}
                  onChange={(e) => setMentionInput(e.target.value)}
                  className="border-muted bg-muted/50"
                />
                <PopoverContent side="bottom" align="start" className="w-full p-0 mt-1">
                  <Command>
                    <CommandInput placeholder="Search username..." />
                    {mentionResults.map((user) => (
                      <CommandItem
                        key={user.user_id}
                        value={user.username}
                        onSelect={() => handleMentionSelect(user.username, user.user_id)}
                      >
                        @{user.username}
                      </CommandItem>
                    ))}
                  </Command>
                </PopoverContent>
              </div>
            </Popover>

            {/* Mentions Display */}
            {mentions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mentions.map((m, i) => (
                  <Badge
                    key={i}
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    @{m.username}
                  </Badge>
                ))}
              </div>
            )}
            {/* Mention Not Found Display */}
            {mentionNotFound && mentionInput && !searching && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-red-100 text-red-700 border-red-300">
                  × @{mentionNotFound} not found
                </Badge>
              </div>
            )}

            {/* Tags Input */}
            <Input
              placeholder="Add tags (e.g., StudyGroup, Assignment)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-muted bg-muted/50"
            />

            <div className="flex flex-wrap gap-2">
              {tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="inline-flex items-center gap-1">
                    #{tag}
                    <button
                      onClick={() =>
                        setTags((prev) =>
                          prev
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t !== tag)
                            .join(", ")
                        )
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Uploaded Media */}
        {media.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {media.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden group">
                  <img src={url} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 text-xs"
                    onClick={() => setMedia((prev) => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <hr className="border-muted" />

        <div className="flex justify-between items-center flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={handleImageUpload} className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            Photo
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPosting || (!content.trim() && media.length === 0)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isPosting ? "Posting..." : "Share"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
