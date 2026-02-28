/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
                'temple-os': ['"VT323"', 'monospace'],
            },
            colors: {
                'glass-border': 'rgba(255, 255, 255, 0.2)',
                'glass-bg': 'rgba(255, 255, 255, 0.1)',
            }
        },
    },
    plugins: [],
}
