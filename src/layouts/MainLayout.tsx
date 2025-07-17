import { Navigation } from "@/components/layout/Navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                if (user) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            })
            .catch(() => setIsAuth(false));
    }, []);
    if (isAuth === null) return <div className="w-full h-screen flex items-center justify-center text-lg">Loading...</div>;
    return (
        <div className="min-h-screen flex flex-col bg-background">
            {isAuth && <Navigation />}
            <main className="flex-1 container mx-auto px-0 sm:px-4 py-4 sm:py-6">
                {children}
            </main>
        </div>
    );
}