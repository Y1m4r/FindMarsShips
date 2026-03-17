// src/constants.js

export const LEVELS = [
  {
    id: 1, name: "Sector Training Alpha",
    rowsA: 3, colsA: 3, rowsB: 3, colsB: 3, algorithm: 'naive', minScoreToPass: 4, simonSaysUses: 1,
    briefing: "Calibración inicial. Detecta firmas energéticas básicas. Protocolo Marciano estándar.",
    mathExplanation: [
      "Multiplicarás A×B usando el algoritmo Naive: cada celda C[i][j] es el producto punto de la fila i de A con la columna j de B.",
      "Recorres cada fila y cada columna, multiplicas elemento a elemento y sumas. Costo total: n³ operaciones.",
    ],
    matrixAName: "Sensor Grid Primario", matrixBName: "Clave Estándar", matrixCName: "Mapa Táctico Inicial",
    calculateButtonText: "Iniciar Simulación Básica",
  },
  {
    id: 2, name: "Nebulosa Beta Patrol",
    rowsA: 4, colsA: 3, rowsB: 3, colsB: 4, algorithm: 'naive', minScoreToPass: 6, simonSaysUses: 2,
    briefing: "Patrulla en Nebulosa Beta. Posibles lecturas fantasma. Usa protocolo de desencriptación Beta.",
    mathExplanation: [
      "Simulación Naive con matrices no cuadradas: A es 4×3 y B es 3×4. El resultado C será 4×4.",
      "Cada celda C[i][j] sigue siendo el producto punto de la fila i de A (3 elementos) con la columna j de B (3 elementos).",
    ],
    matrixAName: "Radar de Largo Alcance", matrixBName: "Protocolo Beta", matrixCName: "Proyección de Amenazas",
    calculateButtonText: "Ejecutar Análisis Táctico",
  },
  {
    id: 3, name: "Anillos de Saturno Skirmish",
    rowsA: 4, colsA: 4, rowsB: 4, colsB: 4, algorithm: 'naive', minScoreToPass: 8, simonSaysUses: 3,
    briefing: "Escaramuza detectada en los Anillos. Alta interferencia. Calibra sensores y aplica matriz de contramedidas.",
    mathExplanation: [
      "Algoritmo Naive sobre matrices 4×4: 64 multiplicaciones escalares y 48 sumas para completar las 16 celdas de C.",
      "Cada producto punto tiene 4 términos. Observa cómo crece el trabajo al aumentar la dimensión.",
    ],
    matrixAName: "Sensores de Combate", matrixBName: "Matriz Contramedidas", matrixCName: "Resultado del Enfrentamiento",
    calculateButtonText: "Simular Enfrentamiento",
  },
  {
    id: 4, name: "Emboscada en Luna Gamma",
    rowsA: 6, colsA: 6, rowsB: 6, colsB: 6, algorithm: 'naive', minScoreToPass: 12, simonSaysUses: 5,
    briefing: "¡Emboscada! Múltiples señales hostiles en Luna Gamma. Requiere procesamiento rápido pero cuidado con datos corruptos.",
    mathExplanation: [
      "Matrices 6×6: el Naive necesita 6³ = 216 multiplicaciones escalares. La complejidad O(n³) empieza a notarse.",
      "En las próximas misiones necesitarás algo más eficiente: el algoritmo de Strassen.",
    ],
    matrixAName: "Scan de Emergencia", matrixBName: "Clave de Reacción Rápida", matrixCName: "Predicción de Flanqueo",
    calculateButtonText: "Procesar Datos de Combate",
  },
  {
    id: 5, name: "Flota Fantasma Delta",
    rowsA: 8, colsA: 8, rowsB: 8, colsB: 8, algorithm: 'strassen', minScoreToPass: 18, simonSaysUses: 6,
    briefing: "¡Alerta Máxima! Detectada Flota Fantasma Delta. Señales de ocultamiento avanzadas. Simulación Strassen requerida.",
    mathExplanation: [
      "Algoritmo de Strassen: divide cada matriz en 4 bloques y calcula solo 7 productos recursivos (M₁…M₇) en vez de los 8 del método directo.",
      "Esto reduce la complejidad de O(n³) a O(n^2.807). Para 8×8 la diferencia ya es significativa.",
    ],
    matrixAName: "Deep Space Array", matrixBName: "Algoritmo Predictivo Avanzado", matrixCName: "Vector de Ataque Fantasma",
    calculateButtonText: "Ejecutar Simulación Strassen",
  },
  {
    id: 6, name: "Agujero de Gusano Omega",
    rowsA: 12, colsA: 12, rowsB: 12, colsB: 12, algorithm: 'strassen', minScoreToPass: null, simonSaysUses: 6,
    briefing: "Anomalía detectada cerca de Agujero de Gusano Omega. Datos volátiles y masivos. Máxima prioridad.",
    mathExplanation: [
      "Matrices 12×12: Naive necesitaría 1728 multiplicaciones. Strassen con padding a 16×16 y recursión reduce drásticamente ese número.",
      "La simulación cuántica Strassen aplica divide-and-conquer: parte en bloques, calcula 7 productos M₁…M₇, y reconstruye C.",
    ],
    matrixAName: "Sensor Subespacial", matrixBName: "Matriz de Convergencia", matrixCName: "Análisis de Singularidad",
    calculateButtonText: "Computar Datos Omega",
  },
];

export const HALL_OF_FAME_MAX_SIZE = 5;
export const FINDING_TIME_SECONDS = 30;
export const POINTS_PER_REVEALED_PRIME = 2;
export const POINTS_PENALTY_PER_REVEALED_NON_PRIME = -1;
export const TIME_BONUS_MULTIPLIER = 0.12;
export const SIMON_SAYS_GRID_ROWS = 3;
export const SIMON_SAYS_GRID_COLS = 2;
export const SIMON_SAYS_SEQUENCE_LENGTH_BASE = 3;
