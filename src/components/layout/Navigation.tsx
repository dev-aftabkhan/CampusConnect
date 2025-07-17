import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { BookOpen, Users, MessageSquare, User, Bell } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

import { logout as logoutApi } from "@/api/auth";
import { useState, useEffect } from "react";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isActive = (path: string) => location.pathname === path;
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
      // Optionally show error toast
      alert("Logout failed. Please try again.");
    } finally {
      // Always clear storage and force redirect
      localStorage.clear();
      sessionStorage.clear();
      setLoading(false);
      navigate("/login", { replace: true });
      // Force reload to clear all app state
      window.location.href = "/login";
    }
  };

  const [user, setUser] = useState<{ username?: string; email?: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <>
      {/* Top nav always visible for debugging */}
      <nav className="flex sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-2 md:px-4 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              CampusConnect
            </span>
          </Link>
          {/* Navigation Links */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors font-medium text-base ${isActive(item.path) ? "bg-primary text-primary-foreground shadow" : "hover:bg-muted text-muted-foreground"}`}
              >
                <item.icon className="h-5 w-5 mr-1" />
                {item.label}
              </Link>
            ))}
          </div>
          {/* Notification & Palette */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-accent animate-pulse" />
            </button>
            <ThemeToggle />
            {/* User Avatar & Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.username || "User"} />
                  <AvatarFallback>{user?.username ? user.username[0] : "U"}</AvatarFallback>
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
      {/* Hamburger menu for mobile (still visible, but desktop nav forced on) */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">CampusConnect</span>
          </Link>
          {/* Hamburger icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg border border-input bg-muted text-foreground">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map(item => (
                <DropdownMenuItem asChild key={item.path}>
                  <Link to={item.path} className="flex items-center gap-2 py-2">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                {loading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  )
}