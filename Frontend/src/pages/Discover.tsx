import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchPostsByTag } from "@/api/post";
import { getUserByUsername } from "@/api/user";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("tag");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        if (searchMode === "tag") {
          const posts = await searchPostsByTag(query);
          setResults(posts || []);
        } else {
          const user = await getUserByUsername(query);
          setResults(user ? [user] : []);
        }
      } catch (err) {
        toast({ title: "Search error", variant: "destructive" });
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimeout(timeout);
  }, [query, searchMode]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Discover</h1>
      <div className="flex gap-2 mb-4">
        <Select value={searchMode} onValueChange={setSearchMode}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tag">Tag</SelectItem>
            <SelectItem value="username">Username</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={`Search ${searchMode === "tag" ? "tags" : "usernames"}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p>Searching...</p>}

      <div className="grid gap-4">
        {searchMode === "tag" &&
          results.map((post) => (
            <Card
              key={post._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/profile/${post.user}`)}
            >
              <CardContent className="p-4 flex gap-4 items-start">
                <Avatar>
                  <AvatarImage src={post.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.username}</div>
                  <div className="text-muted-foreground text-sm">
                    {post.message}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.postType?.map((type: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  {post.media?.length > 0 && post.mediaType === "image" && (
                    <img
                      src={post.media[0]}
                      alt="Post"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

        {searchMode === "username" &&
          results.map((user) => (
            <Card
              key={user._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/profile/${user.user_id}`)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-muted-foreground text-sm">
                    {user.bio || "No bio"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
