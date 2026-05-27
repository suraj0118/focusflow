/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#4F46E5',
        'primary-light': '#818CF8',
        secondary: '#10B981',
        'secondary-dark': '#059669',
        accent: '#F59E0B',
        'accent-dark': '#D97706',
        danger: '#EF4444',
        background: '#0F172A',
        surface: '#1E293B',
        'surface-light': '#334155',
        border: '#334155',
        text: '#F8FAFC',
        'text-muted': '#94A3B8',
        'text-dim': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
