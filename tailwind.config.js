/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        deep: {
          purple: '#4C1D95',
          violet: '#5B21B6',
          dark: '#1e1035',
        },
        accent: {
          pink: '#ec4899',
          rose: '#f43f5e',
          softPink: '#fdf2f8',
        },
        safety: {
          green: '#10b981',
          emerald: '#059669',
          lightGreen: '#ecfdf5',
        },
        danger: {
          red: '#ef4444',
          darkRed: '#b91c1c',
          glow: '#fee2e2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(91, 33, 182, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glow-sos': '0 0 35px 8px rgba(239, 68, 68, 0.45)',
        'glow-purple': '0 0 25px 4px rgba(124, 58, 237, 0.35)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ripple': 'ripple 2s infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 22px rgba(239, 68, 68, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
        }
      }
    },
  },
  plugins: [],
}
