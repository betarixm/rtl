module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            keyframes: {
                up: {
                    '0%': {
                        transform: 'translateY(3em)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: 1
                    },
                },
                scale: {
                    '0%': {
                        transform: 'scale(50%)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'scale(100%)',
                        opacity: 1
                    },
                }
            },
            animation: {
                up: 'up 0.5s',
                scale: 'scale 0.5s',
            },
            colors: {
                "postech": {
                    DEFAULT: '#C80150',
                    '50': '#FFB0CF',
                    '100': '#FE97C0',
                    '200': '#FE64A1',
                    '300': '#FE3182',
                    '400': '#FB0164',
                    '500': '#C80150',
                    '600': '#95013C',
                    '700': '#630027',
                    '800': '#300013',
                    '900': '#000000'
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
