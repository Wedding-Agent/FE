import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#FF4D6D',
        // Semantic tokens backed by CSS variables
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'text-primary': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        icon: 'var(--radius-icon)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
