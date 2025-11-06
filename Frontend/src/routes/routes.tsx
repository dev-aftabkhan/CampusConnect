import { lazy } from "react";
import type { ReactNode } from "react";

export type AppRoute = {
    key: string;
    path: string;
    element: React.LazyExoticComponent<() => JSX.Element>;
    auth?: boolean;
};

export const appRoutes: AppRoute[] = [
    {
        key: "feed",
        path: "/",
        element: lazy(() => import("@/pages/Feed")),
        auth: true,
    },
    {
        key: "login",
        path: "/login",
        element: lazy(() => import("@/pages/auth/LoginPage")),
    },
    {
        key: "register",
        path: "/register",
        element: lazy(() => import("@/pages/auth/Register")),
    },
    {
        key: "profile",
        path: "/profile",
        element: lazy(() => import("@/pages/ProfilePersonal")),
        auth: true,
    },
    {
        key: "profile-public",
        path: "/profile/:userId",
        element: lazy(() => import("@/pages/ProfileUser")),
        auth: true,
    },
    {
        key: "discover",
        path: "/discover",
        element: lazy(() => import("@/pages/Discover")),
        auth:true,
    },
    {
        key: "chat",
        path: "/chat",
        element: lazy(() => import("@/pages/Chat")),
        auth: true,
    },
    {
        key: "notifications",
        path: "/notifications",
        element: lazy(() => import("@/pages/Notification")),
        auth: true,
    },    
];
