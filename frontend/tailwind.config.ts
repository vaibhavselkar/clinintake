import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B6B3A',
          dark: '#0F4023',
        },
        accent: '#2D9B55',
        'light-green': '#E8F5EE',
        mint: '#F0FAF4',
        border: '#C8E6D4',
        text: {
          primary: '#0D2818',
          secondary: '#3D6B50',
          muted: '#7A9E87',
        },
        patient: {
          DEFAULT: '#166534',
          bg: '#DCFCE7',
        },
        alert: {
          DEFAULT: '#991B1B',
          bg: '#FEF2F2',
        },
        amber: '#92400E',
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(27, 107, 58, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
