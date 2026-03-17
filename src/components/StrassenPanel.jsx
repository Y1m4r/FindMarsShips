/* eslint-disable react/prop-types */
import React from 'react';

const StrassenPanel = ({ breakdown, isOpen, onToggle }) => {
  if (!breakdown) return null;

  const { products, reconstruction, operationComparison } = breakdown;

  return (
    <div className="mt-4 bg-slate-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <span className="font-['VT323'] text-base text-accent-yellow">
          ¿Cómo funciona Strassen en esta misión?
        </span>
        <span className="font-['VT323'] text-lg text-gray-400 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* 7 Products */}
          <div>
            <p className="font-['VT323'] text-sm text-console-green uppercase tracking-wider mb-2">
              7 Productos de Strassen
            </p>
            <div className="bg-slate-900/70 rounded p-3 border border-slate-700 space-y-1">
              {products.map((p, idx) => (
                <p key={idx} className="font-['VT323'] text-sm">
                  <span className="text-accent-yellow">{p.name}</span>
                  <span className="text-gray-400"> = </span>
                  <span className="text-console-blue">{p.formula}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Reconstruction */}
          <div>
            <p className="font-['VT323'] text-sm text-console-green uppercase tracking-wider mb-2">
              Reconstrucción de C
            </p>
            <div className="bg-slate-900/70 rounded p-3 border border-slate-700 space-y-1">
              {reconstruction.map((r, idx) => (
                <p key={idx} className="font-['VT323'] text-sm">
                  <span className="text-accent-yellow">{r.name}</span>
                  <span className="text-gray-400"> = </span>
                  <span className="text-console-blue">{r.formula}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Operation comparison */}
          <div className="bg-indigo-900/30 rounded p-3 border border-indigo-700/50">
            <p className="font-['VT323'] text-sm text-indigo-100">
              Strassen usa <span className="text-console-green font-bold">7</span> multiplicaciones de bloques en vez de{' '}
              <span className="text-mars-red font-bold">8</span>.
              Para esta matriz {operationComparison.dimension}×{operationComparison.dimension}:{' '}
              <span className="text-console-green">~{operationComparison.strassen}</span> operaciones (Strassen) vs{' '}
              <span className="text-mars-red">~{operationComparison.naive}</span> (Naive).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrassenPanel;
