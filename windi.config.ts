import { defineConfig } from "windicss/helpers";

export default defineConfig({
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#008899",
                secondary: "#048B9A",
            },
        },
    },
    variants: {
        scrollbar: ["rounded", "dark"],
    },
    plugins: [require("@windicss/plugin-scrollbar")],
});
