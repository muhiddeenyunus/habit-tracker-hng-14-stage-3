import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e8f0e8',
          200: '#cddece',
          300: '#a6c4a7',
          400: '#77a479',
          500: '#528554',
          600: '#3e6940',
          700: '#335536',
          800: '#2b452d',
          900: '#243926',
        },
        stone: {
          950: '#0c0a09',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' },               '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}

export default config
