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

  const handleSubmit = async (type: "image" | "video") => {
    if (!content.trim() || !media) {
      console.error("Content or media is missing");
      return;
    }

    setIsPosting(true);
    try {
      const mentions = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      const formData = new FormData();
      formData.append("message", content);
      formData.append("mediaType", type);
      formData.append("postType", "general");
      mentions.forEach((mention) => formData.append("mentions[]", mention));
      media.forEach((file) => formData.append("media", file));

      // Log FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Log headers
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      console.log("Headers:", headers);

      if (type === "image") {
        console.log("Sending request to createPostWithImage");
        await createPostWithImage({
          message: content,
          mediaType: "image",
          postType: "general",
          mentions,
          media: media, // Pass the entire array of files
        });
      } else {
        console.log("Sending request to createPostWithVideo");
        await createPostWithVideo({
          message: content,
          mediaType: "video",
          postType: "general",
          media: media[0], // Pass only the first file
        });
      }

      console.log("Post created successfully");
      setContent("");
      setTags("");
      setMedia(null);
    } catch (error) {
      console.error(`Failed to create ${type} post`, error);
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

        {media && media.length > 0 && (
          <div className="mt-2 border rounded-lg p-2 bg-muted/30 text-sm text-muted-foreground">
            Selected: <strong>{media.map(file => file.name).join(", ")}</strong>
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
              onClick={() => handleSubmit("image")}
              disabled={!content.trim() || !media || isPosting}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isPosting ? "Posting..." : "Share Photo"}
            </Button>
            <Button
              onClick={() => handleSubmit("video")}
              disabled={!content.trim() || !media || isPosting}
              className="bg-secondary text-white hover:bg-secondary/90"
            >
              {isPosting ? "Posting..." : "Share Video"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}