import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MainLayout } from "@/layouts/MainLayout";

// Pages
// Remove these imports if you are using lazy loading via appRoutes
// import Feed from "./pages/Feed";
// import Chat from "./pages/Chat";
// import Discover from "./pages/Discover";
// import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
import { appRoutes } from "@/routes/routes";
import { AuthRoute } from "@/components/routes/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
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

export default App;
