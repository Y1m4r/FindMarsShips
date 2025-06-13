/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Asegúrate que busque en tus archivos React
    ],
    theme: {
      extend: {
        // Puedes añadir colores personalizados, fuentes, etc. para el tema espacial
        colors: {
          'space-dark': '#0f172a', // Ejemplo: Azul oscuro
          'space-medium': '#1E293B', // Azul grisáceo oscuro (para paneles)
          'space-light': '#e2e8f0', // Ejemplo: Gris claro
          'venus-blue': '#3b82f6',  // Ejemplo: Azul Venus
          'mars-red': '#ef4444',    // Ejemplo: Rojo Marte
          'accent-yellow': '#facc15', // Ejemplo: Amarillo para acentos
          'console-green': '#39FF14', // Ejemplo de verde neón para texto
          'console-amber': '#FFBF00', // Ejemplo de ámbar para texto
          'console-blue': '#00BFFF',  // Azul brillante tipo terminal
          'border-neon': 'rgba(0, 255, 255, 0.3)', // Para bordes sutiles
        },
        fontFamily: {
           // Puedes agregar fuentes personalizadas aquí si las importas
           mono: ['VT323', 'Share Tech Mono', 'monospace'], // Fuente principal para todo o casi todo
           display: ['VT323', 'Audiowide', 'sans-serif'], // Para títulos grandes o destacados
        },
        textShadow: {
         'neon-green': '0 0 3px rgba(57, 255, 20, 0.7), 0 0 5px rgba(57, 255, 20, 0.5), 0 0 10px rgba(57, 255, 20, 0.3)',
        'neon-blue': '0 0 3px rgba(0, 191, 255, 0.7), 0 0 5px rgba(0, 191, 255, 0.5), 0 0 10px rgba(0, 191, 255, 0.3)',
        'neon-yellow': '0 0 3px rgba(250, 204, 21, 0.7), 0 0 5px rgba(250, 204, 21, 0.5), 0 0 10px rgba(250, 204, 21, 0.3)',
        },
        keyframes: {
          scanline: {
            '0%': { transform: 'translateY(-5%)' },
            '100%': { transform: 'translateY(5%)' },
          },
          blink: {
               '0%, 100%': { opacity: '1' },
               '50%': { opacity: '0.3' },
          }
        },
        animation: {
          scanline: 'scanline 0.2s linear infinite alternate', // Muy sutil, o quitarla si distrae
          blink: 'blink 1s infinite step-end', // Para cursores o indicadores
        }
      },
    },
    plugins: [],
  }