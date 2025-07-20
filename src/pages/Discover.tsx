import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getFollowers,
  getFollowing,
  getMutuals,
  getFollowRequests,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollowUser
} from "@/api/user";

const userId = JSON.parse(localStorage.getItem("user") || '{}').id;

export default function Connections() {
  const [tab, setTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      getFollowers(userId),
      getFollowing(userId),
      getMutuals(userId),
      getFollowRequests()
    ]).then(([f, g, m, r]) => {
      setFollowers(f);
      setFollowing(g);
      setMutuals(m);
      setRequests(r);
    }).finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id: string) => {
    await acceptFollowRequest(id);
    setRequests(requests.filter((req: any) => req.id !== id));
    setFollowers(await getFollowers(userId));
  };
  const handleReject = async (id: string) => {
    await rejectFollowRequest(id);
    setRequests(requests.filter((req: any) => req.id !== id));
  };
  const handleUnfollow = async (id: string) => {
    await unfollowUser(id);
    setFollowing(following.filter((f: any) => f.id !== id));
  };
  const handleFollow = async (id: string) => {
    await sendFollowRequest(id);
    // Optionally update UI
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="mutuals">Mutuals</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="followers">
              {followers.length === 0 ? <p className="text-muted-foreground">No followers yet.</p> : (
                <div className="space-y-2">
                  {followers.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8"><AvatarImage src={f.profilePicture || "/placeholder.svg"} /><AvatarFallback>{f.username?.[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{f.username}</span>
                      <Badge variant="secondary">{f.email}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="following">
              {following.length === 0 ? <p className="text-muted-foreground">Not following anyone yet.</p> : (
                <div className="space-y-2">
                  {following.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8"><AvatarImage src={f.profilePicture || "/placeholder.svg"} /><AvatarFallback>{f.username?.[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{f.username}</span>
                      <Badge variant="secondary">{f.email}</Badge>
                      <Button size="sm" variant="destructive" onClick={() => handleUnfollow(f.id)}>Unfollow</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="mutuals">
              {mutuals.length === 0 ? <p className="text-muted-foreground">No mutuals yet.</p> : (
                <div className="space-y-2">
                  {mutuals.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8"><AvatarImage src={f.profilePicture || "/placeholder.svg"} /><AvatarFallback>{f.username?.[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{f.username}</span>
                      <Badge variant="secondary">{f.email}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="requests">
              {requests.length === 0 ? <p className="text-muted-foreground">No follow requests.</p> : (
                <div className="space-y-2">
                  {requests.map((r: any) => (
                    <div key={r.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8"><AvatarImage src={r.profilePicture || "/placeholder.svg"} /><AvatarFallback>{r.username?.[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{r.username}</span>
                      <Badge variant="secondary">{r.email}</Badge>
                      <Button size="sm" variant="success" onClick={() => handleAccept(r.id)}>Accept</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)}>Reject</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}