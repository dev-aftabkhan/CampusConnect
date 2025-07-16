import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { BookOpen, Users, MessageSquare, User, Bell } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

import { logout as logoutApi } from "@/features/auth/authApi";
import { useState } from "react";

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
      // Remove tokens or user data from localStorage/sessionStorage if any
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      // Optionally show error toast
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Top nav for desktop */}
      <nav className="hidden md:flex sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
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
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      {/* Bottom nav for mobile */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-t">
        <div className="flex justify-around items-center h-14">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${isActive(item.path) ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="h-6 w-6 mb-0.5" />
              {item.label}
            </Link>
          ))}
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
        </div>
      </nav>
    </>
  )
}