import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="rounded-full p-2 transition-colors hover:bg-muted focus:outline-none"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
            ) : (
                <Moon className="h-5 w-5 text-blue-900 transition-transform duration-300 rotate-0 scale-100" />
            )}
        </Button>
    );
}
