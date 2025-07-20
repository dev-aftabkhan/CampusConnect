import React, { useEffect, useState } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState(() =>
        document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-input bg-muted text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M19 12a7 7 0 0 1-7 7V5a7 7 0 0 1 7 7z" /></svg>
            )}
        </button>
    );
} 