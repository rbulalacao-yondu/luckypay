/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976d2',
          light: '#4791db',
          dark: '#115293',
        },
        secondary: {
          DEFAULT: '#dc004e',
          light: '#e33371',
          dark: '#9a0036',
        },
        background: {
          DEFAULT: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
          disabled: '#9e9e9e',
        },
        error: {
          DEFAULT: '#f44336',
          light: '#e57373',
          dark: '#d32f2f',
        },
        warning: {
          DEFAULT: '#ff9800',
          light: '#ffb74d',
          dark: '#f57c00',
        },
        info: {
          DEFAULT: '#2196f3',
          light: '#64b5f6',
          dark: '#1976d2',
        },
        success: {
          DEFAULT: '#4caf50',
          light: '#81c784',
          dark: '#388e3c',
        },
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
};
