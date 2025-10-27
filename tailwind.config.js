/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        voxylon: {
          blue: '#1f74ff',
          purple: '#7a3cff',
          dark: '#050816'
        }
      },
      backgroundImage: {
        'grid-radial':
          'radial-gradient(circle at center, rgba(31, 116, 255, 0.2), transparent 60%)',
        'grid-lines':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
