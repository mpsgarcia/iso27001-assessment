import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F5FA',
        surface: '#FFFFFF',
        'surface-bright': '#FFFFFF',
        'surface-variant': '#FAFAFA',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FFFFFF',
        'surface-container': '#FAFAFA',
        'surface-container-high': '#F7F5FA',
        'surface-container-highest': '#E5E5E5',
        
        'on-background': '#2D2D2D',
        'on-surface': '#2D2D2D',
        'on-surface-variant': '#7F7F7F',
        
        primary: '#FF7400',
        'on-primary': '#ffffff',
        'primary-container': '#FFF1E5',
        'on-primary-container': '#FF7400',
        
        secondary: '#4B1196',
        'on-secondary': '#ffffff',
        'secondary-container': '#F2EAFC',
        'on-secondary-container': '#4B1196',
        
        tertiary: '#FF9A0A',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#FFF8EB',
        'on-tertiary-container': '#FF9A0A',
        
        error: '#ef4444',
        'on-error': '#ffffff',
        'error-container': '#fee2e2',
        'on-error-container': '#7f1d1d',
        
        outline: '#E5E5E5',
        'outline-variant': '#E5E5E5',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      spacing: {
        'container-padding': '40px',
        xl: '32px',
        xs: '8px',
        base: '4px',
        lg: '24px',
        md: '16px',
        sm: '12px',
      },
      fontFamily: {
        manrope: ['var(--font-montserrat)', 'sans-serif'],
        inter: ['var(--font-ubuntu)', 'sans-serif'],
        title: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-ubuntu)', 'sans-serif'],
      },
      fontSize: {
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'display-xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'title-md': ['18px', { lineHeight: '24px', fontWeight: '600' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
