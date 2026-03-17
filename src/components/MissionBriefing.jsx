/* eslint-disable react/prop-types */
import React from 'react';

const MissionBriefing = ({ level, onDismiss }) => {
  const algorithmName = level.algorithm === 'strassen' ? 'Strassen' : 'Naive';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border-2 border-accent-yellow rounded-lg p-6 max-w-lg w-full shadow-[0_0_30px_rgba(250,204,21,0.3)]">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="font-['VT323'] text-sm text-venus-blue tracking-widest uppercase">
            Briefing de Misión
          </p>
          <h2 className="font-['VT323'] text-2xl sm:text-3xl text-accent-yellow mt-1">
            {level.name}
          </h2>
        </div>

        {/* Narrative briefing */}
        <div className="bg-slate-900/60 rounded p-4 mb-4 border border-slate-700">
          <p className="font-['VT323'] text-space-light text-base leading-relaxed">
            {level.briefing}
          </p>
        </div>

        {/* Math explanation */}
        <div className="bg-indigo-900/40 rounded p-4 mb-4 border border-indigo-700/50">
          <p className="font-['VT323'] text-xs text-indigo-300 uppercase tracking-wider mb-2">
            Motor de simulación: {algorithmName}
          </p>
          {level.mathExplanation && level.mathExplanation.map((line, idx) => (
            <p key={idx} className="font-['VT323'] text-sm text-indigo-100 leading-relaxed mb-1 last:mb-0">
              {line}
            </p>
          ))}
          <p className="font-['VT323'] text-xs text-gray-400 mt-2">
            Dimensiones: {level.rowsA}×{level.colsA} × {level.rowsB}×{level.colsB} → Resultado {level.rowsA}×{level.colsB}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full px-6 py-3 bg-accent-yellow text-black font-bold font-['VT323']
            rounded-md border-2 border-yellow-600 hover:bg-yellow-400
            transform hover:scale-105 transition-all duration-150
            shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]
            text-lg"
        >
          Entendido, iniciar misión
        </button>
      </div>
    </div>
  );
};

export default MissionBriefing;
