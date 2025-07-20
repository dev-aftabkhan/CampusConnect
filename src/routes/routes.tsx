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
        element: lazy(() => import("@/pages/Profile")),
        auth: true,
    },
    {
        key: "discover",
        path: "/discover",
        element: lazy(() => import("@/pages/Discover")),
    },
    {
        key: "chat",
        path: "/chat",
        element: lazy(() => import("@/pages/Chat")),
        auth: true,
    },
];
