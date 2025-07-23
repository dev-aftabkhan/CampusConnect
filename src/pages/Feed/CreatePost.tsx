import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Video,
  BookOpen
} from "lucide-react";
import {
  createPostWithImage,
  createPostWithVideo
} from "@/api/post";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const suggestedTags = [
    "StudyGroup",
    "Assignment",
    "Research",
    "Project",
    "Exam",
    "Social"
  ];

  const handleFixPostType = () => {
    const cleanedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .join(", ");
    setTags(cleanedTags);
  };

  const handleMediaUpload = (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.multiple = type === "image"; // Allow multiple files for images
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (type === "image") {
        setMedia((prevMedia) => [...prevMedia, ...files]); // Append new files to the existing array
      } else if (files.length > 0) {
        setMedia([files[0]]); // Only allow one video file
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      console.error("Either content or media is required.");
      return;
    }

    // Clean and prepare postType from tags
    const cleanedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const postType = cleanedTags.join(",");

    if (!postType) {
      alert("At least one tag is required.");
      return;
    }

    // Validate video file size
    const oversizedVideos = media.filter(
      (file) => file.type.startsWith("video") && file.size > 30 * 1024 * 1024
    );
    if (oversizedVideos.length > 0) {
      alert("Each video must be less than or equal to 30MB.");
      return;
    }

    const hasVideo = media.some((file) => file.type.startsWith("video"));

    setIsPosting(true);

    try {
      if (hasVideo) {
        // Send all media (image + video) using the video API
        await createPostWithVideo({
          message: content,
          mediaType: "video",
          postType,
          media: media, // array of mixed media
        });
      } else {
        // Only text or images
        await createPostWithImage({
          message: content,
          mediaType: "image",
          postType,
          mentions: [], // optional
          media, // [] if text-only
        });
      }

      console.log("Post created successfully");
      setContent("");
      setTags("");
      setMedia([]);
    } catch (error) {
      console.error("Failed to create post", error);
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

      <CardContent className="space-y-5">
        <div className="flex gap-3 items-start">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's happening on campus?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] border-muted bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary resize-none"
            />

            <Input
              placeholder="Add tags (e.g., StudyGroup, Assignment)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-muted bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
            />

            {tags &&
              tags
                .split(",")
                .map((tag, index) => tag.trim())
                .filter(Boolean)
                .map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="inline-flex items-center gap-1 mr-2 mt-2 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t !== tag)
                          .join(", ");
                        setTags(updated);
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

            <div>
              <p className="text-xs text-muted-foreground">Popular tags:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => {
                      const current = tags.split(",").map(t => t.trim());
                      if (!current.includes(tag)) {
                        setTags([...current, tag].join(", "));
                      }
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {media.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {media.map((file, index) => {
              const isImage = file.type.startsWith("image");
              const url = URL.createObjectURL(file);

              return (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden group">
                  {isImage ? (
                    <img src={url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={url} className="w-full h-full object-cover" controls />
                  )}

                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80"
                    onClick={() =>
                      setMedia((prev) => prev.filter((_, i) => i !== index))
                    }
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMediaUpload("image")}
              className="flex items-center gap-1"
            >
              <Camera className="h-4 w-4" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMediaUpload("video")}
              className="flex items-center gap-1"
            >
              <Video className="h-4 w-4" />
              Video
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPosting || (!content.trim() && media.length === 0)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isPosting ? "Posting..." : "Share"}
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}