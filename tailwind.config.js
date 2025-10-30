/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-4px)' },
                    '75%': { transform: 'translateX(4px)' },
                },
                popIn: {
                    '0%': { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
                    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
            },
            animation: {
                shake: 'shake 150ms ease-in-out 0s 2',
                'pop-in': 'popIn 300ms ease-out',
            },
        },
    },
    plugins: [],
};
