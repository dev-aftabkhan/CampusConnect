import { Navigate, useLocation } from "react-router-dom";

// Dummy authentication hook for demonstration.
// Replace with your actual authentication logic.
function useAuth() {
    // Example: check localStorage or context for auth token
    const token = localStorage.getItem("token");
    return { isAuthenticated: !!token };
}

type AuthRouteProps = {
    children: JSX.Element;
    auth?: boolean;
};

export function AuthRoute({ children, auth }: AuthRouteProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (auth && !isAuthenticated) {
        // Redirect unauthenticated users from protected routes to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!auth && isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
        // Redirect authenticated users away from login/register
        return <Navigate to="/" replace />;
    }
    return children;
}
