import { useLocation, useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { BookOpen, Users, MessageSquare, User, Bell } from "lucide-react";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { logout as logoutApi } from "@/api/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { getOwnUserProfile } from "@/api/user";
import { toast } from "@/components/ui/use-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { path: "/", icon: BookOpen, label: "Feed" },
    { path: "/discover", icon: Users, label: "Discover" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } catch (error) {
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setLoading(false);
      navigate("/login", { replace: true });
      // No reload, rely on state/context for live update
    }
  };

  const [user, setUser] = useState<{ username?: string; email?: string; profilePicture?: string } | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  // Track previous notifications length
  const [prevNotifCount, setPrevNotifCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
      });
  }, []);

  // Toast for new notification
  useEffect(() => {
    if (notifications.length > prevNotifCount) {
      toast({
        title: "You have a new notification!",
        variant: "default",
      });
    }
    setPrevNotifCount(notifications.length);
  }, [notifications]);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getOwnUserProfile();
        setUser({
          username: res.user.username,
          email: res.user.email,
          profilePicture: res.user.profilePicture,
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);


  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.length || 0);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <nav className="hidden md:flex sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-2 md:px-4 gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">CampusConnect</span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors font-medium text-base ${isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow"
                  : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5 mr-1" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-0 right-0 mt-0.5 mr-0.5 h-2 w-2 rounded-full bg-red-500 border border-background z-10" />
                  <span className="absolute top-0 right-0 mt-0.5 mr-0.5 h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping z-0" />
                </>
              )}
            </Link>
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.username || "User"} />
                  <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-3 py-2">
                  <div className="font-semibold">{user?.username || "User"}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                  {loading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden fixed top-0 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">CampusConnect</span>
          </Link>

          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 border cursor-pointer hover:ring-2 hover:ring-primary">
                <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt="User" />
                <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <div className="font-semibold">{user?.username || "User"}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <DropdownMenuSeparator />
              {navItems.map(item => (
                <DropdownMenuItem asChild key={item.path}>
                  <Link to={item.path} className="flex items-center gap-2 py-1.5">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/notifications" className="relative p-2 rounded-full hover:bg-muted transition-colors">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute top-0 right-0 mt-0.5 mr-0.5 h-2 w-2 rounded-full bg-destructive border border-background z-10" />
                      <span className="absolute top-0 right-0 mt-0.5 mr-0.5 h-2 w-2 rounded-full bg-destructive opacity-75 animate-ping z-0" />
                    </>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                {loading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-0 sm:px-4 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}
