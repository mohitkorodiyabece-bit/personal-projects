/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        background: '#070A12',

        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          light: '#A78BFA',
        },

        secondary: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          light: '#67E8F9',
        },

        surface: {
          DEFAULT: '#101522',
          secondary: '#171D2C',
          elevated: '#1D2435',
        },

        border: {
          DEFAULT: '#273044',
          light: '#39445C',
        },

        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },

        success: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
        },

        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },

        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
      },

      boxShadow: {
        soft: '0 10px 35px rgba(0, 0, 0, 0.22)',
        'card-hover': '0 18px 45px rgba(0, 0, 0, 0.32)',
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },

      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
      },

      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },

        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },

  plugins: [],
};