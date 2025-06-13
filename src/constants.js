// src/constants.js

export const LEVELS = [
  {
    id: 1, name: "Sector Training Alpha",
    rowsA: 3, colsA: 3, rowsB: 3, colsB: 3, points: 10, algorithm: 'naive',
    briefing: "Calibración inicial. Detecta firmas energéticas básicas. Protocolo Marciano estándar.",
    matrixAName: "Sensor Grid Primario", matrixBName: "Clave Estándar", matrixCName: "Mapa Táctico Inicial",
    calculateButtonText: "Iniciar Simulación Básica",
  },
  {
    id: 2, name: "Nebulosa Beta Patrol",
    rowsA: 4, colsA: 3, rowsB: 3, colsB: 4, points: 20, algorithm: 'naive',
    briefing: "Patrulla en Nebulosa Beta. Posibles lecturas fantasma. Usa protocolo de desencriptación Beta.",
    matrixAName: "Radar de Largo Alcance", matrixBName: "Protocolo Beta", matrixCName: "Proyección de Amenazas",
    calculateButtonText: "Ejecutar Análisis Táctico",
  },
  {
    id: 3, name: "Anillos de Saturno Skirmish",
    rowsA: 4, colsA: 4, rowsB: 4, colsB: 4, points: 40, algorithm: 'naive', // Apto para Strassen opcional?
    briefing: "Escaramuza detectada en los Anillos. Alta interferencia. Calibra sensores y aplica matriz de contramedidas.",
    matrixAName: "Sensores de Combate", matrixBName: "Matriz Contramedidas", matrixCName: "Resultado del Enfrentamiento",
    calculateButtonText: "Simular Enfrentamiento",
  },
  {
    id: 4, name: "Emboscada en Luna Gamma",
    rowsA: 6, colsA: 6, rowsB: 6, colsB: 6, points: 60, algorithm: 'naive', // Apto Strassen
    briefing: "¡Emboscada! Múltiples señales hostiles en Luna Gamma. Requiere procesamiento rápido pero cuidado con datos corruptos.",
    matrixAName: "Scan de Emergencia", matrixBName: "Clave de Reacción Rápida", matrixCName: "Predicción de Flanqueo",
    calculateButtonText: "Procesar Datos de Combate",
  },
  {
    id: 5, name: "Flota Fantasma Delta",
    rowsA: 8, colsA: 8, rowsB: 8, colsB: 8, points: 100, algorithm: 'strassen',
    briefing: "¡Alerta Máxima! Detectada Flota Fantasma Delta. Señales de ocultamiento avanzadas. Simulación Strassen requerida.",
    matrixAName: "Deep Space Array", matrixBName: "Algoritmo Predictivo Avanzado", matrixCName: "Vector de Ataque Fantasma",
    calculateButtonText: "Ejecutar Simulación Strassen",
  },
  {
    id: 6, name: "Agujero de Gusano Omega",
    rowsA: 12, colsA: 12, rowsB: 12, colsB: 12, points: 150, algorithm: 'strassen', // Ajustado tamaño a 12x12
    briefing: "Anomalía detectada cerca de Agujero de Gusano Omega. Datos volátiles y masivos. Máxima prioridad.",
    matrixAName: "Sensor Subespacial", matrixBName: "Matriz de Convergencia", matrixCName: "Análisis de Singularidad",
    calculateButtonText: "Computar Datos Omega",
  },
];

export const HALL_OF_FAME_MAX_SIZE = 5;
export const FINDING_TIME_SECONDS = 30; // Mantener o ajustar
export const POINTS_PER_CORRECT_VALIDATION = 6; // Puntos por pasar Simon Says
export const POINTS_PENALTY_PER_FAILED_VALIDATION = -1; // Penalización leve por fallar Simon
export const POINTS_PENALTY_FOR_WRONG_VALIDATION_ATTEMPT = -2; // Penalización por intentar validar un NO primo
export const POINTS_PER_REVEALED_PRIME = 2;
export const POINTS_PENALTY_PER_REVEALED_NON_PRIME = -1;
export const TIME_BONUS_MULTIPLIER = 0.12;
// export const COMBO_BONUS_POINTS = 2; // Combo es menos relevante ahora
export const SIMON_SAYS_GRID_ROWS = 3;
export const SIMON_SAYS_GRID_COLS = 2;
export const SIMON_SAYS_SEQUENCE_LENGTH_BASE = 3;
