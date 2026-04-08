import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        return stored || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div style={{ backgroundColor: "var(--toggle-bg)" }} className="flex rounded-lg p-[3px]">
            <button
                onClick={() => setTheme("light")}
                style={
                    theme === "light"
                        ? { backgroundColor: "var(--toggle-active)", boxShadow: "var(--toggle-shadow)" }
                        : {}
                }
                className="flex items-center justify-center w-[30px] h-[26px] rounded-md transition-all duration-150"
            >
                <SunIcon size={14} className={theme === "light" ? "text-text" : "text-text-faint"} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                style={
                    theme === "dark"
                        ? { backgroundColor: "var(--toggle-active)", boxShadow: "var(--toggle-shadow)" }
                        : {}
                }
                className="flex items-center justify-center w-[30px] h-[26px] rounded-md transition-all duration-150"
            >
                <MoonIcon size={14} className={theme === "dark" ? "text-text" : "text-text-faint"} />
            </button>
        </div>
    );
}
