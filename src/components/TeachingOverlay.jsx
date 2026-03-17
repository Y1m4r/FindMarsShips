/* eslint-disable react/prop-types */
import React from 'react';

const TeachingOverlay = ({
  currentStep,
  totalSteps,
  stepIndex,
  matrixA,
  matrixB,
  autoPlay,
  onNext,
  onToggleAuto,
  onSkipToEnd,
  onContinue,
  isComplete,
}) => {
  // Build formula display from current step
  let formulaDisplay = null;
  if (currentStep) {
    const { type, row, col, k } = currentStep;
    if (type === 'cell_start') {
      formulaDisplay = (
        <span className="text-console-blue">
          Calculando C[{row}][{col}] = fila {row} de A · columna {col} de B
        </span>
      );
    } else if (type === 'term') {
      // Build all terms up to current k
      const terms = [];
      let runningSum = 0;
      for (let t = 0; t <= k; t++) {
        const a = matrixA[row][t];
        const b = matrixB[t][col];
        terms.push(`${a}×${b}`);
        runningSum += a * b;
      }
      const remaining = matrixA[row].length - k - 1;
      formulaDisplay = (
        <span>
          <span className="text-console-blue">C[{row}][{col}]</span>
          <span className="text-gray-400"> = </span>
          <span className="text-console-green">{terms.join(' + ')}</span>
          {remaining > 0 && <span className="text-gray-500"> + ...</span>}
          <span className="text-gray-400"> = </span>
          <span className="text-accent-yellow font-bold">{runningSum}</span>
          {remaining > 0 && <span className="text-gray-500"> (parcial)</span>}
        </span>
      );
    } else if (type === 'cell_done') {
      formulaDisplay = (
        <span>
          <span className="text-console-blue">C[{row}][{col}]</span>
          <span className="text-gray-400"> = </span>
          <span className="text-console-green font-bold">{currentStep.value}</span>
          <span className="text-teal-400"> ✓</span>
        </span>
      );
    }
  }

  const progress = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0;

  return (
    <div className="mt-4 bg-slate-800 p-4 rounded-lg border border-console-green/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-['VT323'] text-sm text-console-green uppercase tracking-wider">
          Modo Aprendizaje — Paso a paso
        </p>
        <p className="font-['VT323'] text-xs text-gray-400">
          {stepIndex}/{totalSteps} ({progress}%)
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
        <div
          className="bg-console-green h-1.5 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Formula display */}
      <div className="bg-slate-900/70 rounded p-3 mb-3 min-h-[48px] flex items-center border border-slate-700">
        <p className="font-['VT323'] text-base">
          {formulaDisplay || <span className="text-gray-500">Preparando simulación...</span>}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {!isComplete ? (
          <>
            <button
              onClick={onNext}
              disabled={autoPlay}
              className="px-4 py-2 bg-console-green text-black font-bold font-['VT323']
                rounded-md border border-green-700 hover:bg-green-400
                transform hover:scale-105 transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Siguiente
            </button>
            <button
              onClick={onToggleAuto}
              className={`px-4 py-2 font-bold font-['VT323'] rounded-md border
                transform hover:scale-105 transition-all duration-150 text-sm
                ${autoPlay
                  ? 'bg-orange-500 text-black border-orange-600 hover:bg-orange-400'
                  : 'bg-slate-600 text-white border-slate-500 hover:bg-slate-500'
                }`}
            >
              {autoPlay ? 'Pausar' : 'Auto'}
            </button>
            <button
              onClick={onSkipToEnd}
              className="px-4 py-2 bg-slate-600 text-white font-['VT323']
                rounded-md border border-slate-500 hover:bg-slate-500
                transform hover:scale-105 transition-all duration-150 text-sm"
            >
              Saltar al final
            </button>
          </>
        ) : (
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-accent-yellow text-black font-bold font-['VT323']
              rounded-md border-2 border-yellow-600 hover:bg-yellow-400
              transform hover:scale-105 transition-all duration-150
              shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]
              text-lg animate-pulse"
          >
            Continuar misión
          </button>
        )}
      </div>
    </div>
  );
};

export default TeachingOverlay;
