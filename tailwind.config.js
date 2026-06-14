/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // High-density ERP type scale (base 13px) — overrides Tailwind defaults.
    fontSize: {
      '2xs': ['10px', { lineHeight: '14px' }],
      xs: ['11px', { lineHeight: '16px' }],
      sm: ['12px', { lineHeight: '17px' }],
      base: ['13px', { lineHeight: '19px' }],
      md: ['14px', { lineHeight: '20px' }],
      lg: ['16px', { lineHeight: '23px' }],
      xl: ['18px', { lineHeight: '26px' }],
      '2xl': ['22px', { lineHeight: '29px' }],
      '3xl': ['28px', { lineHeight: '34px' }],
      '4xl': ['34px', { lineHeight: '40px' }],
    },
    extend: {
      colors: {
        // Brand — deep indigo/violet extracted from colors.png (sidebar/chrome).
        brand: {
          50: '#F4F2FB',
          100: '#E8E3F5',
          200: '#CFC7EA',
          300: '#B0A2D8',
          400: '#8B79B7', // sampled (sidebar hover/upper)
          500: '#6B5499',
          600: '#533D80',
          700: '#3F2D6B',
          800: '#301F63', // sampled (sidebar top)
          900: '#231257', // sampled (sidebar base)
          950: '#190B40',
        },
        // Primary — violet/purple CTAs / links / active / selected (clearly purple, harmonises with the indigo brand).
        primary: {
          50: '#F6F2FE',
          100: '#EDE6FD',
          200: '#DCCEFB',
          300: '#C3AAF7',
          400: '#A47BF0',
          500: '#8C53E8',
          600: '#7C3AED',
          700: '#6A28D4',
          800: '#5821A8',
          900: '#4A1E88',
          950: '#2E1065',
        },
        // Navy — alternate sidebar tone from the functional mockups (switchable).
        navy: {
          600: '#2A3A60',
          700: '#1F2F55',
          800: '#172445',
          900: '#101A34',
        },
        // Lavender surfaces extracted from colors.png.
        surface: {
          page: '#F6EEFF',
          header: '#EDEBFF',
          muted: '#ECEAFF',
          card: '#FFFFFF',
        },
        // Periwinkle accent from top-bg.jpg.
        accent: {
          light: '#E1E2F4',
          DEFAULT: '#C8CBEC',
          dark: '#ADB0E3',
        },
        // Selected/hover row tint sampled from the by-passenger modal header.
        rowtint: '#DEE7F5',
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)',
        soft: '0 1px 2px rgba(16,24,40,0.06)',
        panel: '0 4px 16px -2px rgba(16,24,40,0.10), 0 2px 6px -2px rgba(16,24,40,0.06)',
        popover: '0 8px 24px -4px rgba(16,24,40,0.14), 0 4px 8px -4px rgba(16,24,40,0.08)',
        sidebar: '0 0 28px rgba(25,11,64,0.28)',
      },
      borderRadius: {
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      spacing: {
        4.5: '1.125rem',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        62: '15.5rem',
        sidebar: '15.5rem',
        'sidebar-collapsed': '4.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-start': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(-100%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.16s ease-out',
        'scale-in': 'scale-in 0.14s ease-out',
        // In RTL the inline-start edge is the right; drawers slide from there.
        'slide-in-start': 'slide-in-start 0.22s cubic-bezier(0.32,0.72,0,1)',
        'slide-down': 'slide-down 0.14s ease-out',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};
