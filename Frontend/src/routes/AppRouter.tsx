

import React, { Suspense, useEffect, useState } from "react";
import { useRoutes, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { appRoutes } from "./routes";
import { getCurrentUser } from "@/api/auth";

function RouteWrapper({ element, auth, path }: { element: React.LazyExoticComponent<() => JSX.Element>; auth?: boolean; path: string }) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        getCurrentUser()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    // If not authenticated, always redirect to login except for /login and /register
    if (!isAuth && path !== "/login" && path !== "/register") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If authenticated, prevent access to /login and /register
    if (isAuth && (path === "/login" || path === "/register")) {
        return <Navigate to="/" replace />;
    }

    const Element = element;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Element />
        </Suspense>
    );
}

function RoutesRenderer() {
    const routes = appRoutes.map(({ key, path, element, auth }) => ({
        path,
        element: <RouteWrapper element={element} auth={auth} path={path} />,
    }));
    routes.push({ path: "*", element: <Navigate to="/login" replace /> });
    return useRoutes(routes);
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <RoutesRenderer />
        </BrowserRouter>
    );
}
