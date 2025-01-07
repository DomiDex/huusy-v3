import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        main: 'var(--font-main)',
        bold: 'var(--font-bold)',
        heading: 'var(--font-heading)',
        italic: 'var(--font-italic)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#E4F3F8',
          100: '#D4ECF3',
          200: '#B3DEEB',
          300: '#93D0E2',
          400: '#73C2D9',
          500: '#53B4D0',
          600: '#35A5C5',
          700: '#2D8AA5',
          800: '#246F85',
          900: '#1B5465',
          950: '#174755',
        },
        secondary: {
          DEFAULT: '#E3AF5D',
          50: '#FEFCFA',
          100: '#FBF4E8',
          200: '#F5E3C5',
          300: '#EFD1A3',
          400: '#E9C080',
          500: '#E3AF5D',
          600: '#DB972D',
          700: '#B1781F',
          800: '#815816',
          900: '#52370E',
          950: '#3A270A',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
