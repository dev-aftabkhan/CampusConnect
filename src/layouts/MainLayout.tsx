import { Navigation } from "@/components/layout/Navigation";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1 container mx-auto px-0 sm:px-4 py-4 sm:py-6">
                {children}
            </main>
        </div>
    );
}
