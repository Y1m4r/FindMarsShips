/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MatrixDisplay from './MatrixDisplay'; // Asegúrate que la ruta es correcta
import SimonSays from './SimonSays';       // Asegúrate que la ruta es correcta
import { generateRandomMatrix, multiplyMatricesNaive, multiplyMatricesStrassen, isPrime } from '../utils'; // Asegúrate que la ruta es correcta
import {
  LEVELS,
  FINDING_TIME_SECONDS,
  POINTS_PER_CORRECT_VALIDATION,
  POINTS_PENALTY_PER_FAILED_VALIDATION,
  POINTS_PENALTY_FOR_WRONG_VALIDATION_ATTEMPT,
  TIME_BONUS_MULTIPLIER,
  SIMON_SAYS_SEQUENCE_LENGTH_BASE,
  POINTS_PER_REVEALED_PRIME,
  POINTS_PENALTY_PER_REVEALED_NON_PRIME
} from '../constants'; // Asegúrate que la ruta es correcta

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
  const [revealedCellsC, setRevealedCellsC] = useState({}); // {'r-c': true}
  const [cellValidationStatus, setCellValidationStatus] = useState({}); // {'r-c': 'validated' | 'failed'}
  const [showSimonSays, setShowSimonSays] = useState(false);
  const [simonSaysTarget, setSimonSaysTarget] = useState(null);
  const [timeBonus, setTimeBonus] = useState(0);

  const timerIntervalRef = useRef(null); // Ref para el intervalo del timer

  // --- Configuración del Nivel ---
  const setupLevel = useCallback(() => {
    console.log(`Setting up Level ${currentLevel.id}`);
    setGamePhase('ready_to_calc'); // <<<--- Ir directo a ready_to_calc

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
    setRevealedCellsC({});
    setCellValidationStatus({});
    setTimeBonus(0);
    setShowSimonSays(false);
    setSimonSaysTarget(null);
    setTimer(FINDING_TIME_SECONDS); // Resetear timer

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
        setGamePhase('finding'); // Pasar a la fase de búsqueda
        // El timer se iniciará por el useEffect que depende de gamePhase
      } else {
        // Si hubo error o resultado nulo, volver a 'ready_to_calc'
        setGamePhase('ready_to_calc');
      }
    }, 50); // Delay corto para UI
  };

  // --- Funciones Simon Says ---
  // (No requieren useCallback si no son dependencias de otros hooks/callbacks)
  const handleSimonSuccess = () => {
    console.log("Simon Says Success!");
    if (!simonSaysTarget) return;
    const { rowIndex, colIndex, value } = simonSaysTarget;
    const key = `${rowIndex}-${colIndex}`;
    const wasPrime = isPrime(value); // Verificar si el NÚMERO ORIGINAL era primo

    let scoreChange = 0;
    let newStatus = '';

    if (wasPrime) {
      scoreChange = POINTS_PER_CORRECT_VALIDATION; // Puntos por validar un primo
      newStatus = 'validated';
      console.log(`Correctly validated prime ${value} at ${key}. Score +${scoreChange}`);
    } else {
      // Pasó Simon, pero validó un NO-primo
      scoreChange = POINTS_PENALTY_FOR_WRONG_VALIDATION_ATTEMPT; // Penalización
      newStatus = 'failed'; // Falló la validación (aunque pasó Simon)
      console.log(`Incorrectly validated non-prime ${value} at ${key}. Score ${scoreChange}`);
    }

    setFindingScore(prev => prev + scoreChange);
    setCellValidationStatus(prev => ({ ...prev, [key]: newStatus }));
    setShowSimonSays(false);
    setSimonSaysTarget(null);
    // Vuelve automáticamente a 'finding' visualmente al ocultar el modal
  };

  // Usar useCallback aquí porque es dependencia de endFindingPhase
  const handleSimonFailure = useCallback(() => {
    console.log("Simon Says Failure.");
    if (!simonSaysTarget) return;
    const { rowIndex, colIndex, value } = simonSaysTarget; // Obtener el valor original
    const key = `${rowIndex}-${colIndex}`;

    let scoreChange = POINTS_PENALTY_PER_FAILED_VALIDATION; // Penalización estándar por fallar Simon
    let newStatus = 'failed'; // Siempre es 'failed' si falla Simon

    console.log(`Failed Simon Says for cell ${key} (value ${value}). Score ${scoreChange}`);

    setFindingScore(prev => prev + scoreChange);
    setCellValidationStatus(prev => ({ ...prev, [key]: newStatus }));
    setShowSimonSays(false);
    setSimonSaysTarget(null);
    // Vuelve automáticamente a 'finding' visualmente al ocultar el modal
  }, [simonSaysTarget]); // Dependencia de simonSaysTarget

  // --- Fase Finding ---
  // (No necesitamos startFindingTimer explícito, el useEffect se encarga)

  const handleRevealCellC = (rowIndex, colIndex) => {
    if (gamePhase !== 'finding') return;
    const key = `${rowIndex}-${colIndex}`;
    // Solo revelar si no está ya revelada
    if (!revealedCellsC[key]) {
       setRevealedCellsC(prev => ({ ...prev, [key]: true }));
    }
    // No se añade puntuación aquí
  };

  const handleValidateCell = (rowIndex, colIndex, cellValue) => {
    // Solo se puede iniciar si estamos en 'finding' Y Simon no está activo
    if (gamePhase !== 'finding' || showSimonSays) return;
    const key = `${rowIndex}-${colIndex}`;
    const currentValidationStatus = cellValidationStatus[key];

    // Permitir iniciar Simon si la celda está revelada Y NO tiene estado 'validated'/'failed'
    if (revealedCellsC[key] && currentValidationStatus !== 'validated' && currentValidationStatus !== 'failed') {
        console.log(`Attempting to validate cell value ${cellValue} at ${key} via Simon Says.`);
        setSimonSaysTarget({ rowIndex, colIndex, value: cellValue }); // Guardar valor original
        setShowSimonSays(true);
        // No cambiamos gamePhase aquí, sigue siendo 'finding' de fondo
    } else if (!revealedCellsC[key]) {
         console.log(`Cell ${key} must be revealed first.`);
    } else {
        console.log(`Validation status for cell ${key} is already ${currentValidationStatus}`);
    }
  };

  // --- Fin de Fase y Puntuación Final ---
  const endFindingPhase = useCallback(() => {
    // Evitar ejecuciones múltiples o si no estamos en finding
    if (gamePhase !== 'finding') {
        console.log("endFindingPhase called but phase is not 'finding'. Current phase:", gamePhase);
        return;
    }
    console.log("Ending finding phase. Calculating final scores for level.");

    // 1. Limpiar Timer (por si se llama manualmente antes de que llegue a 0)
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        console.log("Timer interval cleared manually.");
    }

    // 2. Manejar Simon Says Interrumpido
    if (showSimonSays) {
        console.log("Finding phase ended while Simon Says was active - counts as failure.");
        // Llama a la lógica de fallo de Simon ANTES de calcular el resto
        handleSimonFailure();
    }

    // 3. Calcular Time Bonus (basado en el tiempo *restante*)
    // Usamos el estado 'timer' que se actualiza cada segundo
    const calculatedTimeBonus = Math.floor(timer * TIME_BONUS_MULTIPLIER);
    setTimeBonus(calculatedTimeBonus); // Guardar en estado
    console.log(`Time bonus calculated: ${calculatedTimeBonus} (Timer: ${timer}s)`);

    // 4. Calcular Puntos por Revelación Simple y preparar estado final
    let revealScore = 0;
    const finalValidationStatus = { ...cellValidationStatus }; // Copia estado actual
    const finalRevealedStatus = { ...revealedCellsC }; // Copia reveladas

    if (matrixC && Array.isArray(matrixC)) {
        matrixC.forEach((row, i) => {
            if (Array.isArray(row)) {
                row.forEach((cell, j) => {
                    const key = `${i}-${j}`;
                    // Marcar todas como reveladas visualmente para la fase 'results'
                    finalRevealedStatus[key] = true;

                    // Calcular puntos por revelación SOLO SI:
                    // a) La celda FUE revelada por el jugador (revealedCellsC[key] es true)
                    // b) La celda NO tiene un estado de validación ('validated' o 'failed')
                    if (revealedCellsC[key] && !finalValidationStatus[key]) {
                        if (isPrime(cell)) {
                            revealScore += POINTS_PER_REVEALED_PRIME;
                        } else {
                            revealScore += POINTS_PENALTY_PER_REVEALED_NON_PRIME;
                        }
                    }
                });
            }
        });
        console.log(`Calculated Reveal Score (for non-validated revealed cells): ${revealScore}`);
        // Sumar el revealScore al findingScore (que ya tiene los puntos/penalizaciones de Simon)
        // Usamos una función de actualización para asegurar que se basa en el estado más reciente
        setFindingScore(prevFindingScore => prevFindingScore + revealScore);

        // Establecer los estados visuales finales para la fase 'results'
        setCellValidationStatus(finalValidationStatus); // Mantiene los estados de Simon
        setRevealedCellsC(finalRevealedStatus); // Todas reveladas
    } else {
        console.error("Matrix C is invalid or null when finalizing phase!");
         // Considerar volver a 'ready_to_calc' o mostrar error?
         // Por ahora, procedemos a 'results' pero podría mostrar matriz vacía.
    }

    // 5. Cambiar de fase
    setGamePhase('results');

  // Dependencias Clave:
  // gamePhase: Para evitar ejecuciones múltiples.
  // timer: Para calcular el bonus.
  // cellValidationStatus, revealedCellsC, matrixC: Para calcular puntuación de revelación.
  // showSimonSays: Para manejar interrupción.
  // handleSimonFailure: Para llamar en caso de interrupción.
  // Los setters de estado (setTimeBonus, setFindingScore, etc.) no necesitan ser dependencias.
  }, [gamePhase, timer, cellValidationStatus, matrixC, showSimonSays, revealedCellsC, handleSimonFailure]);


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
             // Limpiar aquí explícitamente antes de llamar a endFindingPhase
             if (timerIntervalRef.current) {
                 clearInterval(timerIntervalRef.current);
                 timerIntervalRef.current = null;
             }
             console.log("Timer reached <= 1, calling endFindingPhase.");
             endFindingPhase(); // endFindingPhase ahora está en useCallback
             return 0; // Asegurar que el estado del timer llegue a 0
           }
           return prevTime - 1;
         });
       }, 1000);
     }

     // Función de Limpieza: Se ejecuta cuando gamePhase cambia O el componente se desmonta
     return () => {
       // console.log("Clearing timer interval (Cleanup Effect for gamePhase change or unmount)");
       if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
       }
     };
  // Depender de gamePhase y endFindingPhase (que es useCallback)
  }, [gamePhase, endFindingPhase]);


  // --- Handlers de Finalización ---
  const handleNextLevel = () => {
    if (gamePhase === 'results') {
        // findingScore ya incluye Simon + Revelación. timeBonus se calculó en endFindingPhase.
        const finalLevelScore = currentLevel.points + findingScore + timeBonus;
        console.log(`Proceeding to next level. Score for this level: ${finalLevelScore} (Base:${currentLevel.points} + FindTotal:${findingScore} + Time:${timeBonus})`);
        onLevelComplete(finalLevelScore); // Pasar la puntuación TOTAL del nivel
    } else {
        console.warn("Attempting to proceed to next level outside of 'results' phase.");
    }
  };

  const handleEndGameAndSave = () => {
    // Solo sumar puntos si se llegó a la fase de resultados
    const finalLevelScore = (gamePhase === 'results')
                            ? (currentLevel.points + findingScore + timeBonus)
                            : 0;
    console.log(`Ending game now. Score to add from this level: ${finalLevelScore}`);
    onGameEnd(finalLevelScore); // Pasar la puntuación del nivel (o 0 si no terminó)
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
                <p className="flex items-center justify-center sm:justify-end text-xs text-gray-400">
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
                    <p className="text-sm text-indigo-200">1. Clic en celda para revelar. 2. Clic en NÚMERO para validar (si sospechas que es primo).</p>
                     <p className="text-sm text-indigo-200">Puntuación Validación: <span className='font-bold'>{findingScore}</span></p>
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
                                disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                 <p className="text-xs text-gray-400 mt-1">Verde (Teal): Validado Correcto. Naranja: Fallido/Validado Incorrecto. Cian: Primo no validado/revelado. Gris: No primo no validado/revelado.</p>
            </div>
        )}

        {/* Display de Matrices */}
        <div className="p-4 md:p-6 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex flex-col lg:flex-row justify-around items-start gap-4 md:gap-6 ">
            <MatrixDisplay
                key={`matrix-a-${currentLevelIndex}`}
                matrix={matrixA}
                title={currentLevel.matrixAName || "Matriz A"}
                readOnly={true} // Siempre solo lectura para A y B
            />
            <MatrixDisplay
                key={`matrix-b-${currentLevelIndex}`}
                matrix={matrixB}
                title={currentLevel.matrixBName || "Matriz B"}
                readOnly={true}
            />
            <MatrixDisplay
                key={`matrix-c-${currentLevelIndex}-${gamePhase}`} // Key cambia con la fase para forzar re-render si es necesario
                matrix={matrixC}
                title={currentLevel.matrixCName || "Matriz C (Resultado)"}
                gamePhaseForC={gamePhase} // Pasar fase para estilos condicionales
                revealedStatus={revealedCellsC}
                cellValidationStatus={cellValidationStatus}
                onRevealCell={handleRevealCellC} // Para revelar al primer clic
                onValidateCell={handleValidateCell} // Para validar al segundo clic (en el número)
                // Interactuable solo en 'finding' Y cuando Simon NO está activo
                readOnly={gamePhase !== 'finding' || showSimonSays}
            />
        </div>

        {/* Controles Principales (Adaptados a las fases) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 min-h-[60px]">
            {/* Botón Calcular */}
            {gamePhase === 'ready_to_calc' && (
                <button
                    onClick={handleCalculate}
                    className={`px-8 py-5 font-semibold font-['VT323']
             rounded-md border-2 transform hover:scale-110 transition-all duration-150
             flex items-center justify-center gap-2 text-lg w-full sm:w-auto
             ${ /* Lógica de colores basada solo en gamePhase */
               gamePhase !== 'ready_to_calc' // Si NO está listo para calcular
                 ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50' // Más opaco también
                 : 'bg-mars-red text-white border-red-700 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse' // Añadir pulse si está listo
             }`}
                >
                    {currentLevel.calculateButtonText || "Iniciar Simulación"}
                </button>
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

            {/* Botones Siguiente / Finalizar */}
            {gamePhase === 'results' && (
                <>
                    {!isLastLevel && (
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
            )}
        </div>

        {/* Modal Simon Says */}
        {showSimonSays && simonSaysTarget && (
            <SimonSays
                sequenceLength={SIMON_SAYS_SEQUENCE_LENGTH_BASE + Math.floor(currentLevelIndex / 2)}
                difficulty={1 + currentLevelIndex * 0.15}
                onSuccess={handleSimonSuccess}
                onFailure={handleSimonFailure}
                targetValue={simonSaysTarget.value} // Opcional: mostrar el número que se está validando
            />
        )}
    </div>
  );
};

export default GameScreen;