/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                "card-bg": "var(--card-bg)",
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                "text-faint": "var(--text-faint)",
                "text-very-faint": "var(--text-very-faint)",
                accent: "var(--accent)",
                line: "var(--border)",
                "line-hover": "var(--border-hover)",
                "btn-bg": "var(--btn-bg)",
                "toggle-bg": "var(--toggle-bg)",
                "toggle-active": "var(--toggle-active)",
                divider: "var(--divider)",
                "image-bg": "var(--image-bg)",
                "input-bg": "var(--input-bg)",
                error: "var(--error)",
            },
            boxShadow: {
                card: "var(--shadow)",
                "card-hover": "var(--shadow-hover)",
                toggle: "var(--toggle-shadow)",
            },
            fontFamily: {
                heading: ['"Space Mono"', "monospace"],
                body: ['"IBM Plex Sans"', "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
            },
            maxWidth: {
                content: "1100px",
            },
            borderRadius: {
                card: "14px",
                btn: "8px",
                tag: "5px",
            },
        },
    },
    plugins: [],
    darkMode: ["class", '[data-theme="dark"]'],
};
