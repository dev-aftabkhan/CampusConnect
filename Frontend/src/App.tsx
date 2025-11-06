import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";

// Pages
// Remove these imports if you are using lazy loading via appRoutes
// import Feed from "./pages/Feed";
// import Chat from "./pages/Chat";
// import Discover from "./pages/Discover";
// import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
import { appRoutes } from "@/routes/routes";
import { AuthRoute } from "@/routes/AuthRoute";
import { connectSocket } from "@/lib/socket";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getSocket } from "@/lib/socket";
 

const queryClient = new QueryClient();
interface data {
   type: string;
   from: string;
   timestamp: Date;
}
 

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const socket = connectSocket(token);
    console.log("Socket connected:", socket.connected);
  
    const handleNotification = (data: data) => {
      console.log("🔔 Received notification:", data);
      toast({
        title: `🔔 New ${data.type}`,
        description: `From ${data.from}`,
      });
    };
  
    const registerListeners = () => {
      socket.on("notification", handleNotification);
    };
  
    socket.on("connect", () => {
      console.log("✅ Connected!", socket.id);
      registerListeners(); // 🔁 Re-register notification handler on reconnect
    });
  
    // Optional: If you want to handle reconnection events
    socket.io.on("reconnect", () => {
      console.log("♻️ Socket reconnected");
      registerListeners(); // 🔁 Make sure we reattach on reconnect too
    });
  
    // Clean up
    return () => {
      socket.off("connect");
      socket.off("notification", handleNotification);
      socket.io.off("reconnect");
    };
  }, []);
  
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="campus-connect-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {appRoutes.map(({ key, path, element: Element, auth }) => (
              <Route
                key={key}
                path={path}
                element={
                  auth ? (
                    <AuthRoute auth={auth}>
                      <MainLayout>
                        <Element />
                      </MainLayout>
                    </AuthRoute>
                  ) : (
                    <AuthRoute auth={auth}>
                      <Element />
                    </AuthRoute>
                  )
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
