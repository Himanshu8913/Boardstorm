/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        mystery: 'var(--color-mystery)',
        background: {
          DEFAULT: 'var(--color-background)',
          accent: 'var(--color-background-accent)',
        },
        surface: 'var(--color-surface)',
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        ink: {
          DEFAULT: 'var(--color-text-primary)',
          muted: 'var(--color-text-secondary)',
          inverse: 'var(--color-text-inverse)',
        },
        tile: {
          safe: 'var(--color-tile-safe)',
          'safe-text': 'var(--color-tile-safe-text)',
          trap: 'var(--color-tile-trap)',
          'trap-text': 'var(--color-tile-trap-text)',
          boost: 'var(--color-tile-boost)',
          'boost-text': 'var(--color-tile-boost-text)',
          mystery: 'var(--color-tile-mystery)',
          'mystery-text': 'var(--color-tile-mystery-text)',
          start: 'var(--color-tile-start)',
          'start-ring': 'var(--color-tile-start-ring)',
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        primary: 'var(--shadow-primary)',
        secondary: 'var(--shadow-secondary)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      fontSize: {
        hero: ['var(--text-hero)', { lineHeight: '1.1', fontWeight: '600' }],
        'page-title': [
          'var(--text-page-title)',
          { lineHeight: '1.2', fontWeight: '600' },
        ],
        section: [
          'var(--text-section)',
          { lineHeight: '1.25', fontWeight: '600' },
        ],
      },
    },
  },
  plugins: [],
};
