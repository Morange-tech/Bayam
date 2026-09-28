/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        violet: {
          deep: '#3A1868',
          active: '#6D28D9',
          'active-hover': '#5B21B6',
          soft: '#A78BFA',
          light: '#EDE9FE',
        },
        beige: {
          base: '#FAF5EC',
          card: '#F3EAD8',
          border: '#DDD0B8',
          gold: '#B8966E',
        },
        // Secondary text + status colors from the admin dashboard design —
        // shared by the admin/* pages (Vue d'ensemble, Finances, Équipe).
        'text-secondary': '#6B5C7E',
        status: {
          success: '#1A7A45',
          'success-tint': '#E7F4EC',
          alert: '#C0392B',
          'alert-tint': '#FBEAE8',
          warning: '#B45309',
          'warning-tint': '#FDF1E3',
          info: '#1D4ED8',
          'info-tint': '#E8EEFC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(58, 24, 104, 0.08)',
        'card-hover': '0 4px 20px rgba(58, 24, 104, 0.14)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
