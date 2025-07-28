import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface NotificationType {
  notification_id: string;
  user: string;
  type: string;
  from: string;
  postId?: string;
  content?: string;
  read: boolean;
  createdAt: string;
  username: string;
  profilePicture?: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: NotificationType[] = res.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/notifications/${id}/read`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderContent = (notif: NotificationType) => {
    const { type, username, content } = notif;
    switch (type) {
      case "like":
        return <p><strong>{username}</strong> liked your post.</p>;
      case "follow":
        return <p><strong>{username}</strong> started following you.</p>;
      case "comment":
        return <p><strong>{username}</strong> commented: “{content}”</p>;
      case "message":
        return <p><strong>{username}</strong> sent you a message: “{content}”</p>;
      default:
        return <p><strong>{username}</strong> sent you a notification.</p>;
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-muted-foreground">You're all caught up!</p>
      ) : (
        notifications.map((notif) => (
          <Card
            key={notif.notification_id}
            className={`flex items-center p-3 space-x-4 ${notif.read ? "opacity-70" : "bg-muted"}`}
          >
            <Avatar>
              <AvatarImage src={notif.profilePicture || "/placeholder.svg"} />
              <AvatarFallback>{notif.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <CardContent className="flex-1 px-0 py-0">
              {renderContent(notif)}
              <p className="text-xs text-muted-foreground">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </CardContent>
            {!notif.read && (
              <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.notification_id)}>
                Mark as read
              </Button>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default Notification;
