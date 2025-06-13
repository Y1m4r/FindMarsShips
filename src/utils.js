// src/utils.js
import { HALL_OF_FAME_MAX_SIZE } from './constants';

// --- Funciones existentes (generateRandomMatrix, multiplyMatricesNaive, getHallOfFame, saveScoreToHallOfFame) ---

/**
 * Genera una matriz con números enteros aleatorios.
 * @param {number} rows - Número de filas.
 * @param {number} cols - Número de columnas.
 * @param {number} minVal - Valor mínimo (inclusive).
 * @param {number} maxVal - Valor máximo (inclusive).
 * @returns {number[][]} - La matriz generada.
 */
export function generateRandomMatrix(rows, cols, minVal = 1, maxVal = 9) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      // Generar siempre número
      matrix[i][j] = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }
  }
  return matrix;
}

/**
 * Multiplica dos matrices usando el algoritmo Naive.
 * @param {number[][]} matrixA - Matriz A (NxM).
 * @param {number[][]} matrixB - Matriz B (MxP).
 * @returns {number[][] | null} - La matriz resultante C (NxP) o null si las dimensiones son incompatibles.
 */
export function multiplyMatricesNaive(matrixA, matrixB) {
   // Validación de dimensiones (igual que antes)
   if (!matrixA || !matrixB || matrixA.length === 0 || matrixB.length === 0 || !Array.isArray(matrixA[0]) || matrixA[0].length !== matrixB.length) {
    console.error("Naive: Dimensiones incompatibles o matrices inválidas.", matrixA, matrixB);
    return null;
  }

 const rowsA = matrixA.length;
 const colsA = matrixA[0].length;
 const colsB = matrixB[0]?.length ?? 0; // Asegurar que colsB se define

  // *** VALIDACIÓN DE DATOS ***
  for (let i = 0; i < rowsA; i++) {
    for (let k = 0; k < colsA; k++) {
      if (typeof matrixA[i]?.[k] !== 'number') {
        console.error(`Naive: Dato inválido en A[${i}][${k}]`);
        return null; // No calcular si hay datos corruptos
      }
    }
  }
  for (let k = 0; k < colsA; k++) { // rowsB es colsA
    for (let j = 0; j < colsB; j++) {
      if (typeof matrixB[k]?.[j] !== 'number') {
        console.error(`Naive: Dato inválido en B[${k}][${j}]`);
        return null; // No calcular
      }
    }
  }
  // *** FIN  VALIDACIÓN ***

 // Cálculo 
 const matrixC = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));
 for (let i = 0; i < rowsA; i++) {
   for (let j = 0; j < colsB; j++) {
     let sum = 0;
     for (let k = 0; k < colsA; k++) {
           sum += matrixA[i][k] * matrixB[k][j];
       } 
     matrixC[i][j] = sum;
   }
 }
 return matrixC;
}

/**
 * Obtiene el Hall of Fame desde localStorage.
 * @returns {Array<{name: string, score: number}>} - El array del Hall of Fame ordenado.
 */
export function getHallOfFame() {
  try {
    const storedScores = localStorage.getItem('spaceWarHallOfFame');
    return storedScores ? JSON.parse(storedScores) : [];
  } catch (error) {
    console.error("Error al leer el Hall of Fame:", error);
    return [];
  }
}

/**
 * Guarda una nueva puntuación en el Hall of Fame en localStorage.
 * Mantiene la lista ordenada y limitada en tamaño.
 * @param {string} name - Nombre del jugador.
 * @param {number} score - Puntuación del jugador.
 */
export function saveScoreToHallOfFame(name, score) {
  if (!name || typeof score !== 'number') return;

  try {
    const scores = getHallOfFame();
    // Evitar duplicados exactos (opcional, pero buena práctica)
    const existingIndex = scores.findIndex(s => s.name === name && s.score === score);
    if (existingIndex !== -1) return; // Ya existe esta entrada exacta

    scores.push({ name, score });
    // Ordenar descendente por puntuación
    scores.sort((a, b) => b.score - a.score);
    // Limitar al tamaño máximo
    const topScores = scores.slice(0, HALL_OF_FAME_MAX_SIZE);
    localStorage.setItem('spaceWarHallOfFame', JSON.stringify(topScores));
    console.log("Score saved:", name, score, topScores);
  } catch (error) {
    console.error("Error al guardar la puntuación:", error);
  }
}


// ---  STRASSEN ---

/**
 * Encuentra la siguiente potencia de 2 mayor o igual a n.
 * @param {number} n
 * @returns {number}
 */
function nextPowerOf2(n) {
  if (n <= 0) return 1; // O manejar error
  let power = 1;
  while (power < n) {
    power *= 2;
  }
  return power;
}

/**
 * Añade padding de ceros a una matriz para que tenga dimensiones potencias de 2.
 * @param {number[][]} matrix - Matriz original.
 * @param {number} targetRows - Filas deseadas (potencia de 2).
 * @param {number} targetCols - Columnas deseadas (potencia de 2).
 * @returns {number[][]} - Matriz con padding.
 */
function padMatrix(matrix, targetRows, targetCols) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const paddedMatrix = Array(targetRows).fill(0).map(() => Array(targetCols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      paddedMatrix[i][j] = matrix[i][j];
    }
  }
  return paddedMatrix;
}

/**
 * Elimina el padding de una matriz.
 * @param {number[][]} matrix - Matriz con padding.
 * @param {number} originalRows - Filas originales.
 * @param {number} originalCols - Columnas originales.
 * @returns {number[][]} - Matriz sin padding.
 */
function unpadMatrix(matrix, originalRows, originalCols) {
  // Validar entrada 
  if (!matrix || !Array.isArray(matrix)) {
    console.error("unpadMatrix recibió una matriz inválida:", matrix);
    // Devolver una matriz vacía o lanzar un error podría ser una opción
    return Array(originalRows).fill(0).map(() => Array(originalCols).fill(0)); // Devolver matriz de ceros como fallback
}

const resultMatrix = Array(originalRows).fill(0).map(() => Array(originalCols).fill(0));

for (let i = 0; i < originalRows; i++) {
  // Asegurarse de que la fila existe en la matriz con padding
  if (!matrix[i]) {
    console.warn(`Fila ${i} no encontrada en matriz con padding durante unpad.`);
    continue; // Saltar esta fila, se quedará con ceros
  }
  for (let j = 0; j < originalCols; j++) {
    // Asegurarse de que la celda existe y es un número
    if (typeof matrix[i][j] === 'number') {
       resultMatrix[i][j] = matrix[i][j];
    } else {
       // Dejar el 0 por defecto si falta el valor o no es número
       // console.warn(`Celda (${i}, ${j}) inválida o faltante en matriz con padding durante unpad.`);
    }
  }
}
  return resultMatrix;
}


/**
 * Divide una matriz en 4 submatrices.
 * @param {number[][]} matrix
 * @returns {{a11: number[][], a12: number[][], a21: number[][], a22: number[][]}}
 */
function splitMatrix(matrix) {
  const n = matrix.length;
  const mid = n / 2;
  const a11 = [], a12 = [], a21 = [], a22 = [];

  for (let i = 0; i < mid; i++) {
    a11[i] = matrix[i].slice(0, mid);
    a12[i] = matrix[i].slice(mid);
    a21[i] = matrix[i + mid].slice(0, mid);
    a22[i] = matrix[i + mid].slice(mid);
  }
  return { a11, a12, a21, a22 };
}

/**
 * Suma dos matrices.
 * @param {number[][]} A
 * @param {number[][]} B
 * @returns {(number|string)[][]}
 */
function addMatrices(A, B) {
  const n = A.length;
  const C = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C;
}

/**
 * Resta dos matrices (A - B).
 * @param {number[][]} A
 * @param {number[][]} B
 * @returns {(number|string)[][]}
 */
function subtractMatrices(A, B) {
  const n = A.length;
  const C = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] - B[i][j];
    }
  }
  return C;
}

/**
 * Multiplica dos matrices cuadradas usando el algoritmo de Strassen (recursivo).
 * Asume que las matrices de entrada YA tienen padding a potencia de 2.
 * @param {number[][]} A - Matriz A (NxN, N es potencia de 2).
 * @param {number[][]} B - Matriz B (NxN, N es potencia de 2).
 * @returns {number[][]} - Matriz resultante C (NxN).
 */
function strassenRecursive(A, B) {
  // Validación de entrada robusta
  if (!A || !B || !Array.isArray(A) || !Array.isArray(B) || A.length === 0 || A.length !== B.length || A[0]?.length !== A.length || B[0]?.length !== B.length) {
    console.error("strassenRecursive recibió matrices inválidas o no cuadradas:", A, B);
     // Intentar devolver una matriz de ceros del tamaño esperado si es posible
    const n = A?.length || B?.length || 1; // Estimar tamaño
    return Array(n).fill(0).map(() => Array(n).fill(0));
}

const n = A.length;

// Caso base: Matriz 1x1
if (n === 1) {
  // Asegurarse que A[0] y B[0] existen
  if (A[0] && B[0] && typeof A[0][0] === 'number' && typeof B[0][0] === 'number') {
      return [[A[0][0] * B[0][0]]];
  } else {
      console.error("Error en caso base 1x1 de Strassen:", A, B);
      return [[0]]; // Fallback
  }
}
 // Caso base alternativo para matrices pequeñas (Naive puede ser más rápido)
 // AUMENTAMOS EL LÍMITE: Strassen suele tener overhead, Naive es mejor para pequeñas
 if (n <= 16) { // Ajusta este umbral según pruebas (16, 32, 64 son comunes)
   // console.log(`Strassen usando Naive para n=${n}`);
   return multiplyMatricesNaive(A, B); // Asegúrate que Naive maneja bien estas dimensiones
 }


// Dividir matrices en cuadrantes
let a11, a12, a21, a22, b11, b12, b21, b22;
try {
  ({ a11, a12, a21, a22 } = splitMatrix(A));
  ({ b11, b12, b21, b22 } = splitMatrix(B));
} catch (splitError) {
   console.error("Error durante splitMatrix en Strassen:", splitError, "Matrices:", A, B);
   return Array(n).fill(0).map(() => Array(n).fill(0)); // Fallback
}


// Calcular las 7 multiplicaciones de Strassen recursivamente
// Envolver cada llamada recursiva en try-catch o validar resultados podría ser útil para depuración extrema
const p1 = strassenRecursive(a11, subtractMatrices(b12, b22));
const p2 = strassenRecursive(addMatrices(a11, a12), b22);
const p3 = strassenRecursive(addMatrices(a21, a22), b11);
const p4 = strassenRecursive(a22, subtractMatrices(b21, b11));
const p5 = strassenRecursive(addMatrices(a11, a22), addMatrices(b11, b22));
const p6 = strassenRecursive(subtractMatrices(a12, a22), addMatrices(b21, b22));
const p7 = strassenRecursive(subtractMatrices(a11, a21), addMatrices(b11, b12));

// Validar que los resultados Px son matrices válidas (opcional pero seguro)
const resultsAreValid = [p1, p2, p3, p4, p5, p6, p7].every(p => Array.isArray(p) && p.length > 0);
if (!resultsAreValid) {
    console.error("Una o más multiplicaciones recursivas de Strassen fallaron.");
    return Array(n).fill(0).map(() => Array(n).fill(0)); // Fallback
}

// Calcular los cuadrantes de la matriz resultado C
const c11 = addMatrices(subtractMatrices(addMatrices(p5, p4), p2), p6);
const c12 = addMatrices(p1, p2);
const c21 = addMatrices(p3, p4);
const c22 = subtractMatrices(subtractMatrices(addMatrices(p5, p1), p3), p7);

// Combinar los cuadrantes en la matriz resultado C
const mid = n / 2;
const C = Array(n).fill(0).map(() => Array(n).fill(0));
try { // Añadir try-catch aquí también por si acaso
  for (let i = 0; i < mid; i++) {
      for (let j = 0; j < mid; j++) {
          // Verificar que los cuadrantes cXY existen y tienen la celda
          C[i][j] = c11?.[i]?.[j] ?? 0;
          C[i][j + mid] = c12?.[i]?.[j] ?? 0;
          C[i + mid][j] = c21?.[i]?.[j] ?? 0;
          C[i + mid][j + mid] = c22?.[i]?.[j] ?? 0;
      }
  }
} catch (combineError) {
    console.error("Error combinando cuadrantes en Strassen:", combineError);
    // Devolver C parcialmente lleno o una matriz de ceros
}

return C;
}


/**
 * Multiplica dos matrices usando el algoritmo de Strassen (función principal).
 * Maneja padding y unpadding.
 * @param {number[][]} matrixA - Matriz A (NxM).
 * @param {number[][]} matrixB - Matriz B (MxP).
 * @returns {number[][] | null} - La matriz resultante C (NxP) o null si las dimensiones son incompatibles.
 */
export function multiplyMatricesStrassen(matrixA, matrixB) {
  // Validación de dimensiones (igual que antes)
  if (!matrixA || !matrixB || !Array.isArray(matrixA) || !Array.isArray(matrixB) || matrixA.length === 0 || matrixB.length === 0 || !Array.isArray(matrixA[0]) || matrixA[0].length !== matrixB.length) {
    console.error("Strassen: Dimensiones incompatibles o matrices inválidas.", matrixA, matrixB);
    return null;
  }

 const originalRowsA = matrixA.length;
 const originalColsA = matrixA[0].length;
 const originalColsB = matrixB[0]?.length ?? 0;

  // *** NUEVA VALIDACIÓN DE DATOS ***
  for (let i = 0; i < originalRowsA; i++) {
    for (let j = 0; j < originalColsA; j++) {
      if (typeof matrixA[i]?.[j] !== 'number') {
        console.error(`Strassen: Dato inválido en A[${i}][${j}]`);
        return null;
      }
    }
  }
   for (let i = 0; i < originalColsA; i++) { // rowsB = colsA
    for (let j = 0; j < originalColsB; j++) {
      if (typeof matrixB[i]?.[j] !== 'number') {
        console.error(`Strassen: Dato inválido en B[${i}][${j}]`);
        return null;
      }
    }
  }
  // *** FIN VALIDACIÓN ***


 // Padding y cálculo recursivo (igual que antes)
 const n = nextPowerOf2(Math.max(originalRowsA, originalColsA, originalColsB));
 const paddedA = padMatrix(matrixA, n, n);
 const paddedB = padMatrix(matrixB, n, n);
 const paddedC = strassenRecursive(paddedA, paddedB); // strassenRecursive ya debería manejar errores internos o devolver ceros
 const matrixC = unpadMatrix(paddedC, originalRowsA, originalColsB);

 return matrixC;
}

/**
 * Verifica si un número es primo (simple trial division).
 * Optimizado para no verificar números pares > 2 y hasta sqrt(n).
 * Considera los números <= 1 como no primos.
 * @param {number} num - El número a verificar.
 * @returns {boolean} - True si es primo, false en caso contrario.
 */
export function isPrime(num) {
  if (num <= 1) return false; // 1 y menores no son primos
  if (num <= 3) return true;  // 2 y 3 son primos
  if (num % 2 === 0 || num % 3 === 0) return false; // Optimización para múltiplos de 2 y 3

  // Solo necesitamos verificar divisores impares hasta la raíz cuadrada
  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}
