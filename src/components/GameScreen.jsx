/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MatrixDisplay from './MatrixDisplay';
import SimonSays from './SimonSays';
import MissionBriefing from './MissionBriefing';
import TeachingOverlay from './TeachingOverlay';
import StrassenPanel from './StrassenPanel';
import { generateRandomMatrix, multiplyMatricesNaive, multiplyMatricesStrassen, isPrime, computeStrassenBreakdown } from '../utils';
import {
  LEVELS,
  FINDING_TIME_SECONDS,
  TIME_BONUS_MULTIPLIER,
  SIMON_SAYS_SEQUENCE_LENGTH_BASE,
  POINTS_PER_REVEALED_PRIME,
  POINTS_PENALTY_PER_REVEALED_NON_PRIME
} from '../constants';

// --- Iconos (puedes moverlos a un archivo separado si prefieres) ---
const CpuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// const ShipIcon = () => '🚀'; // Puedes usar este o importar uno más elaborado


const GameScreen = ({ playerName, currentLevelIndex, totalScore, onLevelComplete, onGameEnd }) => {
  const currentLevel = LEVELS[currentLevelIndex];
  const [matrixA, setMatrixA] = useState(null);
  const [matrixB, setMatrixB] = useState(null);
  const [matrixC, setMatrixC] = useState(null); // Matriz resultado real
  // Fases: 'ready_to_calc', 'calculating', 'finding', 'simon_says', 'results'
  const [gamePhase, setGamePhase] = useState('ready_to_calc'); // Iniciar directo aquí
  const [calculationDone, setCalculationDone] = useState(false);
  const [calcTime, setCalcTime] = useState(null);
  const [timer, setTimer] = useState(FINDING_TIME_SECONDS);
  const [findingScore, setFindingScore] = useState(0); // Puntos solo de la fase 'finding' (Simon + Revelación)
  const [cellValidationStatus, setCellValidationStatus] = useState({}); // {'r-c': 'validated' | 'failed'}
  const [showSimonSays, setShowSimonSays] = useState(false);
  const [simonSaysTarget, setSimonSaysTarget] = useState(null);
  const [timeBonus, setTimeBonus] = useState(0);
  const [simonSaysUsed, setSimonSaysUsed] = useState(0);
  const [simonEvaluatedCells, setSimonEvaluatedCells] = useState({});
  const [markedCells, setMarkedCells] = useState({});
  const [dynamicMinScore, setDynamicMinScore] = useState(0);
  const [primesInMatrix, setPrimesInMatrix] = useState(0);

  // --- Feature 3: Briefing ---
  const briefingShownRef = useRef({});

  // --- Feature 2: Tooltip ---
  const [hoveredCellC, setHoveredCellC] = useState(null);
  const [tooltipFormula, setTooltipFormula] = useState('');

  // --- Feature 1: Teaching ---
  const [teachingStepIndex, setTeachingStepIndex] = useState(0);
  const [teachingAutoPlay, setTeachingAutoPlay] = useState(false);
  const [teachingComputedC, setTeachingComputedC] = useState(null);
  const [teachingHighlight, setTeachingHighlight] = useState({ row: null, col: null });
  const teachingStepsRef = useRef([]);
  const teachingIntervalRef = useRef(null);

  // --- Feature 4: Strassen Panel ---
  const [strassenPanelOpen, setStrassenPanelOpen] = useState(false);
  const [strassenBreakdown, setStrassenBreakdown] = useState(null);

  const timerIntervalRef = useRef(null); // Ref para el intervalo del timer

  // --- Bug 1: Refs espejo para estabilizar hooks ---
  const timerRef = useRef(timer);
  const cellValidationStatusRef = useRef(cellValidationStatus);
  const showSimonSaysRef = useRef(showSimonSays);
  const matrixCRef = useRef(matrixC);
  const simonSaysTargetRef = useRef(simonSaysTarget);
  const gamePhaseRef = useRef(gamePhase);
  const simonEvaluatedCellsRef = useRef(simonEvaluatedCells);
  const markedCellsRef = useRef(markedCells);
  const endFindingPhaseRef = useRef(null);

  // --- Sincronizar refs con estado ---
  useEffect(() => { timerRef.current = timer; }, [timer]);
  useEffect(() => { cellValidationStatusRef.current = cellValidationStatus; }, [cellValidationStatus]);
  useEffect(() => { showSimonSaysRef.current = showSimonSays; }, [showSimonSays]);
  useEffect(() => { matrixCRef.current = matrixC; }, [matrixC]);
  useEffect(() => { simonSaysTargetRef.current = simonSaysTarget; }, [simonSaysTarget]);
  useEffect(() => { gamePhaseRef.current = gamePhase; }, [gamePhase]);
  useEffect(() => { simonEvaluatedCellsRef.current = simonEvaluatedCells; }, [simonEvaluatedCells]);
  useEffect(() => { markedCellsRef.current = markedCells; }, [markedCells]);

  // --- Helper: calcular minScore dinámico basado en primos reales ---
  const computeDynamicMinScore = useCallback((matrix) => {
    if (!matrix) return 0;
    let primeCount = 0;
    matrix.forEach(row => row.forEach(val => { if (isPrime(val)) primeCount++; }));
    setPrimesInMatrix(primeCount);
    // Requiere encontrar ~40% de los primos (redondeado arriba), mínimo 1
    const minScore = Math.max(1, Math.ceil(primeCount * POINTS_PER_REVEALED_PRIME * 0.4));
    setDynamicMinScore(minScore);
    console.log(`Primes in matrix: ${primeCount}, dynamic minScore: ${minScore}`);
    return minScore;
  }, []);

  // --- Configuración del Nivel ---
  const setupLevel = useCallback(() => {
    console.log(`Setting up Level ${currentLevel.id}`);

    // Feature 3: Mostrar briefing si no se ha visto en este nivel
    if (!briefingShownRef.current[currentLevel.id]) {
      setGamePhase('briefing');
    } else {
      setGamePhase('ready_to_calc');
    }

    // Generar matrices A y B
    const newA = generateRandomMatrix(currentLevel.rowsA, currentLevel.colsA);
    const newB = generateRandomMatrix(currentLevel.rowsB, currentLevel.colsB);
    setMatrixA(newA);
    setMatrixB(newB);

    // Resetear estado específico del nivel
    setMatrixC(null);
    setCalculationDone(false);
    setCalcTime(null);
    setFindingScore(0);
    setCellValidationStatus({});
    setTimeBonus(0);
    setDynamicMinScore(0);
    setPrimesInMatrix(0);
    setShowSimonSays(false);
    setSimonSaysTarget(null);
    setTimer(FINDING_TIME_SECONDS);
    setSimonSaysUsed(0);
    setSimonEvaluatedCells({});
    setMarkedCells({});

    // Resetear teaching
    setTeachingStepIndex(0);
    setTeachingAutoPlay(false);
    setTeachingComputedC(null);
    setTeachingHighlight({ row: null, col: null });
    teachingStepsRef.current = [];
    if (teachingIntervalRef.current) {
      clearInterval(teachingIntervalRef.current);
      teachingIntervalRef.current = null;
    }

    // Resetear tooltip y Strassen panel
    setHoveredCellC(null);
    setTooltipFormula('');
    setStrassenPanelOpen(false);
    setStrassenBreakdown(null);

    // Limpiar intervalo si existe de nivel anterior
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }

  }, [currentLevel]); // Depende solo del nivel actual

  // --- Fase de Cálculo ---
  const handleCalculate = () => {
    if (gamePhase !== 'ready_to_calc') {
        console.warn("Calculation attempt rejected. Phase:", gamePhase);
        return;
    }

    setGamePhase('calculating');
    setMatrixC(null);
    setCalculationDone(false);
    setCalcTime(null);
    const start = performance.now();

    setTimeout(() => {
      let result = null;
      let errorOccurred = false;
      try {
        const multiplyFn = currentLevel.algorithm === 'strassen' ? multiplyMatricesStrassen : multiplyMatricesNaive;
        result = multiplyFn(matrixA, matrixB);
         if (result === null) {
             throw new Error("La multiplicación devolvió null (dimensiones incompatibles?).");
         }
      } catch (error) {
        console.error("Error during matrix multiplication:", error);
        alert(`Se produjo un error durante el cálculo: ${error.message}`);
        errorOccurred = true;
      }

      const end = performance.now();
      setCalcTime((end - start).toFixed(2));

      if (result && !errorOccurred) {
        setMatrixC(result);
        setCalculationDone(true);
        computeDynamicMinScore(result);
        setGamePhase('finding'); // PRIMERO, antes del breakdown
        // Strassen breakdown es informativo, no bloquea el juego
        try {
          if (currentLevel.algorithm === 'strassen' && matrixA && matrixB) {
            setStrassenBreakdown(computeStrassenBreakdown(matrixA, matrixB));
          }
        } catch (breakdownError) {
          console.error("Error computing Strassen breakdown:", breakdownError);
        }
      } else {
        // Si hubo error o resultado nulo, volver a 'ready_to_calc'
        setGamePhase('ready_to_calc');
      }
    }, 50); // Delay corto para UI
  };

  // --- Feature 3: Briefing handler ---
  const handleDismissBriefing = () => {
    briefingShownRef.current = { ...briefingShownRef.current, [currentLevel.id]: true };
    setGamePhase('ready_to_calc');
  };

  // --- Feature 2: Tooltip handlers ---
  const computeFormulaForCell = (row, col) => {
    if (!matrixA || !matrixB) return '';
    const rowA = matrixA[row];
    const colB = matrixB.map(r => r[col]);
    const terms = rowA.map((val, k) => `${val}×${colB[k]}`).join(' + ');
    const sum = rowA.reduce((acc, val, k) => acc + val * colB[k], 0);
    return `C[${row}][${col}] = ${terms} = ${sum}`;
  };

  const handleCellHoverC = (row, col) => {
    if (gamePhase !== 'finding' || !matrixA || !matrixB) return;
    setHoveredCellC({ row, col });
    setTooltipFormula(computeFormulaForCell(row, col));
  };

  const handleCellHoverLeave = () => {
    setHoveredCellC(null);
    setTooltipFormula('');
  };

  // --- Feature 1: Teaching handlers ---
  const handleStartTeaching = () => {
    if (gamePhase !== 'ready_to_calc' || !matrixA || !matrixB) return;

    // Compute C immediately
    const multiplyFn = currentLevel.algorithm === 'strassen' ? multiplyMatricesStrassen : multiplyMatricesNaive;
    const result = multiplyFn(matrixA, matrixB);
    if (!result) {
      alert('Error al calcular la matriz.');
      return;
    }
    setMatrixC(result);
    setCalculationDone(true);
    computeDynamicMinScore(result);

    // Build teaching steps
    const rowsC = result.length;
    const colsC = result[0].length;
    const colsA = matrixA[0].length;
    const steps = [];
    for (let i = 0; i < rowsC; i++) {
      for (let j = 0; j < colsC; j++) {
        steps.push({ type: 'cell_start', row: i, col: j });
        for (let k = 0; k < colsA; k++) {
          steps.push({ type: 'term', row: i, col: j, k });
        }
        steps.push({ type: 'cell_done', row: i, col: j, value: result[i][j] });
      }
    }
    teachingStepsRef.current = steps;
    setTeachingStepIndex(0);
    setTeachingComputedC(
      Array(rowsC).fill(null).map(() => Array(colsC).fill(null))
    );
    // Apply first step immediately
    if (steps.length > 0 && steps[0].type === 'cell_start') {
      setTeachingHighlight({ row: steps[0].row, col: steps[0].col });
    } else {
      setTeachingHighlight({ row: null, col: null });
    }
    setGamePhase('teaching');
  };

  const applyTeachingStep = useCallback((idx) => {
    const steps = teachingStepsRef.current;
    if (idx >= steps.length) return;
    const step = steps[idx];

    if (step.type === 'cell_start') {
      setTeachingHighlight({ row: step.row, col: step.col });
    } else if (step.type === 'term') {
      setTeachingHighlight({ row: step.row, col: step.col });
    } else if (step.type === 'cell_done') {
      setTeachingComputedC(prev => {
        if (!prev) return prev;
        const copy = prev.map(r => [...r]);
        copy[step.row][step.col] = step.value;
        return copy;
      });
      setTeachingHighlight({ row: null, col: null });
    }
  }, []);

  const handleTeachingNext = useCallback(() => {
    setTeachingStepIndex(prev => {
      const next = prev + 1;
      if (next < teachingStepsRef.current.length) {
        applyTeachingStep(next);
      }
      return Math.min(next, teachingStepsRef.current.length);
    });
  }, [applyTeachingStep]);

  const handleTeachingToggleAuto = () => {
    setTeachingAutoPlay(prev => !prev);
  };

  const handleTeachingSkipToEnd = () => {
    setTeachingAutoPlay(false);
    if (teachingIntervalRef.current) {
      clearInterval(teachingIntervalRef.current);
      teachingIntervalRef.current = null;
    }
    // Reveal all cells
    if (matrixC) {
      const revealed = {};
      const fullC = matrixC.map((row, i) =>
        row.map((val, j) => {
          revealed[`${i}-${j}`] = true;
          return val;
        })
      );
      setTeachingComputedC(fullC);
    }
    setTeachingHighlight({ row: null, col: null });
    setTeachingStepIndex(teachingStepsRef.current.length);
  };

  const handleTeachingContinue = () => {
    setTeachingAutoPlay(false);
    if (teachingIntervalRef.current) {
      clearInterval(teachingIntervalRef.current);
      teachingIntervalRef.current = null;
    }
    setTeachingHighlight({ row: null, col: null });

    // Compute Strassen breakdown if applicable
    if (currentLevel.algorithm === 'strassen' && matrixA && matrixB) {
      setStrassenBreakdown(computeStrassenBreakdown(matrixA, matrixB));
    }

    setGamePhase('finding');
  };

  // --- Funciones Simon Says ---
  // (No requieren useCallback si no son dependencias de otros hooks/callbacks)
  const handleSimonSuccess = () => {
    console.log("Simon Says Success!");
    if (!simonSaysTarget) return;
    const { rowIndex, colIndex, value } = simonSaysTarget;
    const key = `${rowIndex}-${colIndex}`;
    const wasPrime = isPrime(value);
    console.log(`Simon Says completed for cell ${key} (value ${value}, prime: ${wasPrime}). No score change.`);
    setShowSimonSays(false);
    setSimonSaysTarget(null);
  };

  // Usar useCallback con refs para identidad estable
  const handleSimonFailure = useCallback(() => {
    console.log("Simon Says Failure.");
    const target = simonSaysTargetRef.current;
    if (!target) return;
    const { rowIndex, colIndex, value } = target;
    const key = `${rowIndex}-${colIndex}`;
    console.log(`Failed Simon Says for cell ${key} (value ${value}). No score change.`);
    setShowSimonSays(false);
    setSimonSaysTarget(null);
  }, []); // Dependencias vacías — lee de simonSaysTargetRef

  // --- Fase Finding ---
  // (No necesitamos startFindingTimer explícito, el useEffect se encarga)

  const handleCellLeftClick = (rowIndex, colIndex) => {
    if (gamePhase !== 'finding' || showSimonSays) return;
    const key = `${rowIndex}-${colIndex}`;
    if (markedCells[key]) return; // Ya marcada — decisión irreversible
    setMarkedCells(prev => ({ ...prev, [key]: true }));
  };

  const handleCellRightClick = (rowIndex, colIndex, cellValue) => {
    if (gamePhase !== 'finding' || showSimonSays) return;
    const key = `${rowIndex}-${colIndex}`;
    if (markedCells[key]) return;                                  // ya marcada — decisión tomada
    if (simonEvaluatedCells[key]) return;                          // ya evaluada
    if (simonSaysUsed >= currentLevel.simonSaysUses) return;       // sin usos

    setSimonSaysUsed(prev => prev + 1);
    setSimonEvaluatedCells(prev => ({ ...prev, [key]: true }));
    setSimonSaysTarget({ rowIndex, colIndex, value: cellValue });
    setShowSimonSays(true);
  };

  // --- Fin de Fase y Puntuación Final ---
  const endFindingPhase = useCallback(() => {
    // Evitar ejecuciones múltiples o si no estamos en finding
    if (gamePhaseRef.current !== 'finding') {
        console.log("endFindingPhase called but phase is not 'finding'. Current phase:", gamePhaseRef.current);
        return;
    }
    console.log("Ending finding phase. Calculating final scores for level.");

    // 1. Limpiar Timer
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }

    // 2. Manejar Simon Says Interrumpido (leer de ref)
    if (showSimonSaysRef.current) {
        console.log("Finding phase ended while Simon Says was active - counts as failure.");
        handleSimonFailure();
    }

    // 3. Calcular Time Bonus (leer de ref)
    const currentTimer = timerRef.current;
    const calculatedTimeBonus = Math.floor(currentTimer * TIME_BONUS_MULTIPLIER);
    setTimeBonus(calculatedTimeBonus);
    console.log(`Time bonus calculated: ${calculatedTimeBonus} (Timer: ${currentTimer}s)`);

    // 4. Calcular Puntos por marcado (markedCells no evaluadas por Simon)
    let revealScore = 0;
    const currentSimonEvaluated = simonEvaluatedCellsRef.current;
    const currentMarked = markedCellsRef.current;
    const currentMatrixC = matrixCRef.current;
    const finalValidationStatus = {};

    if (currentMatrixC && Array.isArray(currentMatrixC)) {
        // Puntuar celdas marcadas que no fueron evaluadas por Simon
        Object.keys(currentMarked).forEach(key => {
            if (!currentSimonEvaluated[key]) {
                const [ri, ci] = key.split('-').map(Number);
                const cell = currentMatrixC[ri]?.[ci];
                if (typeof cell === 'number') {
                    if (isPrime(cell)) {
                        revealScore += POINTS_PER_REVEALED_PRIME;
                    } else {
                        revealScore += POINTS_PENALTY_PER_REVEALED_NON_PRIME;
                    }
                }
            }
        });

        // Construir validationStatus final para display
        currentMatrixC.forEach((row, i) => {
            if (Array.isArray(row)) {
                row.forEach((cell, j) => {
                    const key = `${i}-${j}`;
                    const valueIsPrime = typeof cell === 'number' && isPrime(cell);
                    if (currentMarked[key] || currentSimonEvaluated[key]) {
                        finalValidationStatus[key] = valueIsPrime ? 'validated' : 'failed';
                    }
                });
            }
        });

        console.log(`Calculated Reveal Score: ${revealScore}`);
        setFindingScore(prev => Math.max(0, prev + revealScore));
        setCellValidationStatus(finalValidationStatus);
    } else {
        console.error("Matrix C is invalid or null when finalizing phase!");
    }

    // 5. Cambiar de fase
    setGamePhase('results');

  // Sin gamePhase — se lee de gamePhaseRef. Identidad 100% estable
  }, [handleSimonFailure]);


  // --- Sincronizar endFindingPhaseRef ---
  useEffect(() => { endFindingPhaseRef.current = endFindingPhase; }, [endFindingPhase]);

  // --- useEffect Hooks ---

  // Efecto para configurar el nivel cuando cambia el índice
  useEffect(() => {
    setupLevel();
    // La limpieza del timer se maneja en el otro useEffect y en setupLevel
  }, [currentLevelIndex, setupLevel]); // Ejecutar setup al cambiar de nivel

  // Efecto para manejar el inicio/parada del timer basado en gamePhase
  useEffect(() => {
     // Limpiar SIEMPRE cualquier intervalo existente al (re)ejecutar el efecto
     if (timerIntervalRef.current) {
         clearInterval(timerIntervalRef.current);
         timerIntervalRef.current = null;
         // console.log("Cleared existing timer interval at effect start.");
     }

     // Iniciar un nuevo intervalo SOLO si estamos en la fase 'finding'
     if (gamePhase === 'finding') {
       console.log("Starting finding timer...");
       timerIntervalRef.current = setInterval(() => {
         setTimer(prevTime => {
           if (prevTime <= 1) {
             if (timerIntervalRef.current) {
                 clearInterval(timerIntervalRef.current);
                 timerIntervalRef.current = null;
             }
             console.log("Timer reached <= 1, calling endFindingPhase.");
             endFindingPhaseRef.current(); // Ref, no closure directa
             return 0;
           }
           return prevTime - 1;
         });
       }, 1000);
     }

     // Función de Limpieza
     return () => {
       if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
       }
     };
  // SOLO gamePhase — ya no depende de endFindingPhase
  }, [gamePhase]);

  // --- Feature 1: Teaching auto-play effect ---
  useEffect(() => {
    if (teachingIntervalRef.current) {
      clearInterval(teachingIntervalRef.current);
      teachingIntervalRef.current = null;
    }

    if (gamePhase === 'teaching' && teachingAutoPlay && teachingStepIndex < teachingStepsRef.current.length) {
      teachingIntervalRef.current = setInterval(() => {
        handleTeachingNext();
      }, 600);
    }

    return () => {
      if (teachingIntervalRef.current) {
        clearInterval(teachingIntervalRef.current);
        teachingIntervalRef.current = null;
      }
    };
  }, [gamePhase, teachingAutoPlay, teachingStepIndex, handleTeachingNext]);

  // Stop auto-play when teaching completes
  useEffect(() => {
    if (teachingStepIndex >= teachingStepsRef.current.length && teachingStepsRef.current.length > 0) {
      setTeachingAutoPlay(false);
      if (teachingIntervalRef.current) {
        clearInterval(teachingIntervalRef.current);
        teachingIntervalRef.current = null;
      }
    }
  }, [teachingStepIndex]);


  // --- Helpers de puntuación ---
  const computeFinalLevelScore = () => {
    return Math.max(0, findingScore + timeBonus);
  };

  // --- Handlers de Finalización ---
  const handleNextLevel = () => {
    if (gamePhase === 'results') {
        const finalLevelScore = computeFinalLevelScore();
        console.log(`Proceeding to next level. Score for this level: ${finalLevelScore}`);
        onLevelComplete(finalLevelScore);
    }
  };

  const handleEndGameAndSave = () => {
    const finalLevelScore = (gamePhase === 'results') ? computeFinalLevelScore() : 0;
    console.log(`Ending game now. Score to add from this level: ${finalLevelScore}`);
    onGameEnd(finalLevelScore);
  };

  // --- Bug 4: Reintentar nivel ---
  const handleRetryLevel = () => {
    setupLevel();
  };

  // --- Renderizado ---
  const isLastLevel = currentLevelIndex === LEVELS.length - 1;
  if (!currentLevel) {
    return <div className="min-h-screen flex items-center justify-center">Cargando Nivel...</div>;
  }
  const algorithmName = currentLevel.algorithm === 'strassen' ? 'Strassen' : 'Naive';

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-900 to-space-dark text-space-light relative">
        {/* Header */}
        <div className="font-['VT323'] flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-700 gap-4">
            <h1 className="font-['VT323'] text-xl sm:text-3xl font-bold text-accent-yellow text-center sm:text-left">
                {`Nivel ${currentLevel.id}: ${currentLevel.name}`}
            </h1>
            <div className="text-center sm:text-right text-sm sm:text-base space-y-1">
                <p>Piloto: <span className=" font-semibold text-venus-blue">{playerName}</span></p>
                <p>Puntuación Total: <span className=" font-semibold text-accent-yellow">{totalScore}</span></p>
                {/* Puntuación específica de la fase */}
                {(gamePhase === 'finding' || gamePhase === 'simon_says') && (
                    <p className="text-md text-orange-400 font-semibold">
                        Validando... [ Puntuación: {findingScore} ]
                    </p>
                )}
                {gamePhase === 'results' && (
                    <p className="text-md text-green-400">Resultado Nivel: {findingScore} (Validación) + {timeBonus} (Tiempo)</p>
                )}
                <p className="flex items-center justify-center sm:justify-end text-sm text-gray-400">
                    <CpuIcon /> Algoritmo: {algorithmName}
                    {calcTime && <span className="ml-2 text-cyan-400">({calcTime} ms)</span>}
                </p>
            </div>
        </div>

        {/* UI Fase de Búsqueda (Finding) */}
        {(gamePhase === 'finding' || gamePhase === 'simon_says') && (
            <div className="font-['VT323'] text-center mb-4 p-3 bg-indigo-900 rounded-lg border border-indigo-700 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className='flex-grow text-center sm:text-left'>
                    <p className="text-xl font-semibold text-yellow-300">Fase de Detección</p>
                    <p className="text-base text-indigo-200">Clic izq: marcar/desmarcar sospechosa — Clic der: activar Protocolo Simon Says</p>
                    <p className="text-base text-indigo-200">Puntuación Validación: <span className='font-bold'>{findingScore}</span> / <span className='text-accent-yellow'>{dynamicMinScore}</span> necesarios</p>
                    <p className="text-base text-indigo-200">Naves ocultas detectables: <span className='font-bold text-console-green'>{primesInMatrix}</span></p>
                    <p className="text-base text-indigo-200">
                        {simonSaysUsed < currentLevel.simonSaysUses
                          ? <>Protocolo Simon Says: <span className='font-bold text-accent-yellow'>{currentLevel.simonSaysUses - simonSaysUsed}</span> usos restantes</>
                          : <span className='text-red-400 font-bold'>Protocolo Simon Says agotado</span>
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Timer */}
                    <div className="text-2xl font-bold text-red-500 flex items-center bg-slate-800/50 px-2 py-1 rounded">
                        <ClockIcon /> <span className="ml-1 tabular-nums w-[4ch] text-center">{timer}s</span>
                    </div>
                    {/* Botón Finalizar Detección */}
                    <button
                        onClick={endFindingPhase}
                        className="px-4 py-2 bg-yellow-500 text-black font-semibold font-display // O font-mono
                                rounded-md border-2 border-yellow-600 hover:bg-yellow-400
                                transform hover:scale-105 transition-all duration-150
                                shadow-[0_0_10px_rgba(234,179,8,0.5)] hover:shadow-[0_0_20px_rgba(234,179,8,0.7)]
                                disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        title="Terminar búsqueda y ver resultados"
                        disabled={showSimonSays} // Deshabilitar si Simon está activo
                    >
                        Finalizar Detección
                    </button>
                </div>
            </div>
        )}

        {/* UI Fase de Resultados */}
        {gamePhase === 'results' && (
            <div className="font-['VT323'] text-center mb-4 p-3 bg-green-900 rounded-lg border border-green-700 shadow-lg">
                <p className="text-xl font-semibold text-green-300">Análisis Completado</p>
                <p className="text-lg">Puntuación Validación/Revelación: <span className="font-bold">{findingScore}</span> | Bonus Tiempo: <span className="font-bold">{timeBonus}</span></p>
                {/* Leyenda de colores/iconos podría ir aquí o en MatrixDisplay */}
                 <p className="text-sm text-gray-400 mt-1">Verde (Teal): Validado Correcto. Naranja: Fallido/Validado Incorrecto. Cian: Primo no validado/revelado. Gris: No primo no validado/revelado.</p>
            </div>
        )}

        {/* Display de Matrices */}
        <div className="p-4 md:p-6 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex flex-col lg:flex-row justify-around items-start gap-4 md:gap-6 ">
            <MatrixDisplay
                key={`matrix-a-${currentLevelIndex}`}
                matrix={matrixA}
                title={currentLevel.matrixAName || "Matriz A"}
                readOnly={true}
                highlightRow={gamePhase === 'teaching' ? teachingHighlight.row : null}
            />
            <MatrixDisplay
                key={`matrix-b-${currentLevelIndex}`}
                matrix={matrixB}
                title={currentLevel.matrixBName || "Matriz B"}
                readOnly={true}
                highlightCol={gamePhase === 'teaching' ? teachingHighlight.col : null}
            />
            <MatrixDisplay
                key={`matrix-c-${currentLevelIndex}-${gamePhase}`}
                matrix={gamePhase === 'teaching' ? (teachingComputedC || matrixC) : matrixC}
                title={currentLevel.matrixCName || "Matriz C (Resultado)"}
                gamePhaseForC={gamePhase === 'teaching' ? null : gamePhase}
                cellValidationStatus={gamePhase === 'results' ? cellValidationStatus : null}
                onCellClick={handleCellLeftClick}
                onCellRightClick={handleCellRightClick}
                markedCells={markedCells}
                readOnly={gamePhase !== 'finding' || showSimonSays}
                onCellHover={handleCellHoverC}
                onCellHoverLeave={handleCellHoverLeave}
                tooltipContent={tooltipFormula}
                hoveredCell={hoveredCellC}
                teachingRevealedCells={gamePhase === 'teaching' ? (() => {
                  if (!teachingComputedC) return null;
                  const revealed = {};
                  teachingComputedC.forEach((row, i) => row.forEach((val, j) => {
                    if (val !== null) revealed[`${i}-${j}`] = true;
                  }));
                  return revealed;
                })() : null}
            />
        </div>

        {/* Controles Principales (Adaptados a las fases) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 min-h-[60px]">
            {/* Botones ready_to_calc: Calcular + Teaching */}
            {gamePhase === 'ready_to_calc' && (
                <>
                    <button
                        onClick={handleCalculate}
                        className="px-8 py-5 font-semibold font-['VT323']
                          rounded-md border-2 transform hover:scale-110 transition-all duration-150
                          flex items-center justify-center gap-2 text-lg w-full sm:w-auto
                          bg-mars-red text-white border-red-700 hover:bg-red-500
                          shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse"
                    >
                        {currentLevel.calculateButtonText || "Iniciar Simulación"}
                    </button>
                    <button
                        onClick={handleStartTeaching}
                        className="px-6 py-4 font-semibold font-['VT323']
                          rounded-md border-2 transform hover:scale-105 transition-all duration-150
                          flex items-center justify-center gap-2 text-base w-full sm:w-auto
                          bg-slate-700 text-console-green border-green-700 hover:bg-slate-600
                          shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                    >
                        Ver cómo se calcula
                    </button>
                </>
            )}
            {/* Indicador Calculando */}
            {gamePhase === 'calculating' && (
                <div className="font-['VT323'] text-center p-3 w-full sm:w-auto">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-venus-blue mx-auto mb-2"></div>
                    <p className="text-lg text-white font-semibold">Calculando...</p>
                </div>
            )}
            {/* Mensaje durante Finding / Simon (cuando NO está Simon activo) */}
            {gamePhase === 'finding' && !showSimonSays && (
                 <p className='text-indigo-300 VT323 text-center'>Fase de detección activa...</p>
            )}
             {/* Mensaje durante Simon activo */}
             {gamePhase === 'finding' && showSimonSays && (
                  <p className='text-yellow-400 VT323 text-center'>Validando contacto (Simon Says)...</p>
             )}

            {/* Botones Siguiente / Finalizar / Reintentar */}
            {gamePhase === 'results' && (() => {
                const finalLevelScore = computeFinalLevelScore();
                const minScore = currentLevel.minScoreToPass === null ? null : dynamicMinScore;
                const passed = minScore === null || finalLevelScore >= minScore;
                return (
                <>
                    {/* Mensaje de resultado */}
                    {passed ? (
                        <p className="font-['VT323'] text-green-400 text-lg w-full text-center">
                            Misión completada — acceso al siguiente sector autorizado
                        </p>
                    ) : (
                        <p className="font-['VT323'] text-red-400 text-lg w-full text-center">
                            Puntuación insuficiente — se requieren {minScore} puntos para avanzar. Obtuviste {finalLevelScore}.
                        </p>
                    )}

                    {/* Botón reintentar (siempre visible si no pasó) */}
                    {!passed && (
                        <button
                            onClick={handleRetryLevel}
                            className="px-6 py-3 bg-orange-600 text-white font-['VT323']
                                    rounded-md border-2 border-orange-700 hover:bg-orange-500
                                    transform hover:scale-105 transition-all duration-150
                                    shadow-[0_0_15px_rgba(234,88,12,0.5)] hover:shadow-[0_0_25px_rgba(234,88,12,0.7)]
                                    text-lg w-full sm:w-auto"
                        >
                            Reintentar Misión
                        </button>
                    )}

                    {/* Botón siguiente nivel — solo si pasó y no es último */}
                    {passed && !isLastLevel && (
                        <button
                            onClick={handleNextLevel}
                            className="px-6 py-3 bg-venus-blue text-white font-['VT323']
                                    rounded-md border-2 border-blue-700 hover:bg-blue-500
                                    transform hover:scale-105 transition-all duration-150
                                    shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
                                    text-lg w-full sm:w-auto"
                        >
                            Continuar: {LEVELS[currentLevelIndex + 1]?.name || "Siguiente Nivel"}
                        </button>
                    )}

                    <button
                        onClick={handleEndGameAndSave}
                        className="font-['VT323'] px-6 py-3 bg-green-600 text-white font-['VT323']
                                rounded-md border-2 border-green-700 hover:bg-green-500
                                transform hover:scale-105 transition-all duration-150
                                shadow-[0_0_15px_rgba(22,163,74,0.5)] hover:shadow-[0_0_25px_rgba(22,163,74,0.7)]
                                text-lg w-full sm:w-auto"
                    >
                        {isLastLevel ? 'Ver Informe Final (Guardar)' : 'Terminar Misión (Guardar)'}
                    </button>
                </>
                );
            })()}
        </div>

        {/* Feature 4: Strassen Panel */}
        {currentLevel.algorithm === 'strassen' && strassenBreakdown && (gamePhase === 'finding' || gamePhase === 'simon_says' || gamePhase === 'results') && (
            <StrassenPanel
                breakdown={strassenBreakdown}
                isOpen={strassenPanelOpen}
                onToggle={() => setStrassenPanelOpen(prev => !prev)}
            />
        )}

        {/* Feature 1: Teaching Overlay */}
        {gamePhase === 'teaching' && (
            <TeachingOverlay
                currentStep={teachingStepsRef.current[teachingStepIndex] || null}
                totalSteps={teachingStepsRef.current.length}
                stepIndex={teachingStepIndex}
                matrixA={matrixA}
                matrixB={matrixB}
                autoPlay={teachingAutoPlay}
                onNext={handleTeachingNext}
                onToggleAuto={handleTeachingToggleAuto}
                onSkipToEnd={handleTeachingSkipToEnd}
                onContinue={handleTeachingContinue}
                isComplete={teachingStepIndex >= teachingStepsRef.current.length}
            />
        )}

        {/* Feature 3: Mission Briefing Modal */}
        {gamePhase === 'briefing' && (
            <MissionBriefing
                level={currentLevel}
                onDismiss={handleDismissBriefing}
            />
        )}

        {/* Modal Simon Says */}
        {showSimonSays && simonSaysTarget && (
            <SimonSays
                sequenceLength={SIMON_SAYS_SEQUENCE_LENGTH_BASE + Math.floor(currentLevelIndex / 2)}
                difficulty={1 + currentLevelIndex * 0.15}
                onSuccess={handleSimonSuccess}
                onFailure={handleSimonFailure}

                targetValue={simonSaysTarget.value}
            />
        )}
    </div>
  );
};

export default GameScreen;