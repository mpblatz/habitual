/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // light mode color palette
                "t-primary": "#121318", // for: majority of text/icons, headers
                "t-secondary": "#7F839D", // for: sub headings, descriptions
                "t-tertiary": "#838FA1", // for: input field text
                "t-interactive": "#4942E4", // for: hyperlinks
                "t-error": "#FD6566", // for: error messages
                "b-primary": "#F7F8F9", // for: fullscreen backgrounds
                "b-secondary": "#FFFFFF", // for: modals, tooltips, popups, widgets
                "b-tertiary": "#F8FAFB", // for: input fields, hrs
                // dark mode color palette
                "dt-primary": "#FFFFFF", // for: majority of text/icons, headers
                "dt-secondary": "#6F6F78", // for: sub headings, descriptions
                "dt-tertiary": "#8D8D99", // for: input field text
                "dt-interactive": "#FFFFFF", // for: hyperlinks
                "dt-error": "#FD6566", // for: error messages
                "db-primary": "#131314", // for: backgrounds
                "db-secondary": "#27272C", // for: modals, tooltips, popups, widgets
                "db-tertiary": "#40404A", // for: input fields, hrs
                // other colors
                platinum: "#EAE1DF",
                "red-1": "#E8505B",
                "red-75": "#E78188",
                "red-5": "#EC9DA3",
                "red-25": "#E6BCBF",
                "orange-1": "#e87950",
                "yellow-1": "#F9D56E",
                "green-1": "#6BCB77",
                "blue-1": "#71A9FE",
                "purple-1": "#4942E4",
                "pink-1": "#e850d9",
                "brown-1": "#662f20",
                "grey-1": "#8a8a8a",

                "grid-0": "#B9B6E1",
                "grid-1": "#A3A0D8",
                "grid-2": "#872DE4",
                "grid-3": "#4942E4",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
