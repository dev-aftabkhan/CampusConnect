// src/pages/Discover.tsx
import React, { useState, useEffect } from "react";
import { searchPostsByTag } from "@/api/post";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("username");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const searchPrefix = searchMode === "tag" ? `#${query}` : query;
        const res = await searchPostsByTag(searchPrefix);
        const data = Array.isArray(res) ? res : res?.data?.posts || res?.data || [];
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimeout(timeout);
  }, [query, searchMode]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Discover</h2>

      {/* Combined search bar with inline dropdown */}
      <div className="relative mb-4">
        <Input
          className="pr-[120px]"
          placeholder={`Search ${searchMode === "tag" ? "#tags" : "usernames"}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 w-[120px]">
          <Select value={searchMode} onValueChange={setSearchMode}>
            <SelectTrigger className="w-full h-[32px] text-xs border border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="tag">Tags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 min-h-[200px]">
        {loading ? (
          <p className="text-muted-foreground">Searching...</p>
        ) : results.length === 0 && query ? (
          <p className="text-muted-foreground">No results found.</p>
        ) : (
          results.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4 space-y-2">
                <p className="font-medium">@{post.username}</p>
                <p>{post.content}</p>
                {post.postType && (
                  <p className="text-sm text-muted-foreground">#{post.postType}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
