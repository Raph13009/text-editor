/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'garamond': ['EB Garamond', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'paper': '#fefefe',
        'ink': '#2a2a2a',
        'ink-light': '#666666',
        'accent': '#4a90e2',
        'accent-light': '#e8f2ff',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'reading': '65ch',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'EB Garamond, serif',
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: '#2a2a2a',
            maxWidth: 'none',
            h1: {
              fontSize: '2.5rem',
              lineHeight: '1.2',
              marginBottom: '1.5rem',
              fontWeight: '400',
            },
            h2: {
              fontSize: '2rem',
              lineHeight: '1.3',
              marginBottom: '1.25rem',
              fontWeight: '400',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '1.4',
              marginBottom: '1rem',
              fontWeight: '400',
            },
            p: {
              marginBottom: '1.5rem',
            },
            blockquote: {
              borderLeftColor: '#4a90e2',
              borderLeftWidth: '4px',
              paddingLeft: '1.5rem',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [],
} 