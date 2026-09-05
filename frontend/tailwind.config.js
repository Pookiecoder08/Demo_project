/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        app: '#f8fafc',
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f1f5f9',
          hover: '#e2e8f0',
        },
        border: {
          DEFAULT: '#e2e8f0',
          strong: '#cbd5e1',
        },
        text: {
          main: '#0f172a',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
        primary: {
          DEFAULT: '#0284c7', // Sky 600
          hover: '#0369a1',   // Sky 700
          light: '#e0f2fe',   // Sky 100
        },
        accent: {
          DEFAULT: '#4f46e5', // Indigo 600
          light: '#e0e7ff',
        },
        status: {
          healthy: '#10b981',
          'healthy-bg': '#ecfdf5',
          'healthy-border': '#a7f3d0',
          warning: '#f59e0b',
          'warning-bg': '#fffbeb',
          'warning-border': '#fde68a',
          critical: '#ef4444',
          'critical-bg': '#fef2f2',
          'critical-border': '#fca5a5',
          info: '#3b82f6',
          'info-bg': '#eff6ff',
          'info-border': '#bfdbfe',
        }
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        modal: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
