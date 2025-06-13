// src/components/MatrixDisplay.jsx
import React from 'react';
import { isPrime } from '../utils';

// eslint-disable-next-line react/prop-types
const MatrixDisplay = ({
  matrix,
  title,
  gamePhaseForC = null, // Pasar la fase actual ('finding', 'results', etc.) SOLO para Matriz C
  revealedStatus = null, //  Objeto {'r-c': boolean} para saber si C[r][c] se reveló
  cellValidationStatus = null, //  Renombrado de cellStatus -> {'r-c': 'validated' | 'failed' | 'pending' ?}
  onRevealCell = null, //  Callback al clickear interferencia
  onValidateCell = null, //  Callback al clickear número revelado para validar
  readOnly = true, // Determina si se puede interactuar
}) => {

  // Si no hay matriz o está vacía, mostrar placeholder
  if (!matrix || matrix.length === 0) {
    // ... (código del placeholder igual que antes) ...
     return (
      <div className="p-4 border border-dashed border-gray-600 rounded-lg text-center text-gray-500 min-h-[150px] flex flex-col justify-center">
        <h3 className="font-bold text-lg mb-2 text-space-light">{title}</h3>
        {title.includes('Predicción') ? 'Calcula para ver...' : 'Esperando datos...'}
      </div>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  const getCellStyle = (rowIndex, colIndex, cellValue) => {
    const key = `${rowIndex}-${colIndex}`;
    const isRevealed = revealedStatus ? revealedStatus[key] : false;
    const validationStatus = cellValidationStatus ? cellValidationStatus[key] : null; // 'validated', 'failed'
    let baseStyle = ` p-1 sm:p-2 min-h-[30px] min-w-[30px] sm:min-h-[40px] sm:min-w-[40px]
      flex items-center justify-center
      border border-cyan-800/50 rounded-sm
      font-['VT323'] text-sm transition-all duration-150 `;
    let specificStyle = 'bg-gray-700/50 text-gray-500 animate-pulse';
    let hoverStyle = 'hover:bg-gray-600/70 hover:text-gray-300';
    let cursorStyle = 'cursor-default';
    let opacityStyle = '';

     // Es Matriz C durante la fase de búsqueda?
    if (gamePhaseForC === 'finding') {
        if (!isRevealed) { // No revelado aún (mostrar con opacidad)
            specificStyle = 'bg-slate-600 text-gray-400'; // Fondo oscuro, texto tenue
            opacityStyle = 'opacity-60'; // Aplicar opacidad
            if (!readOnly) {
                hoverStyle = 'hover:opacity-100 hover:bg-slate-500'; // Hover revela un poco más
                cursorStyle = 'cursor-pointer'; // Indicar que se puede clickear para revelar
            }
        } else { // Revelado, ahora se puede validar
            const valueIsPrime = typeof cellValue === 'number' && isPrime(cellValue);
            // Mostrar estado de validación si existe
            if (validationStatus === 'validated') {
                specificStyle = 'bg-teal-500 text-white font-bold ring-2 ring-teal-300';
            } else if (validationStatus === 'failed') {
                specificStyle = 'bg-orange-600 text-white font-bold ring-2 ring-orange-400';
            } else { // Aún no validado
                if (valueIsPrime) {
                    specificStyle = 'bg-cyan-700 text-white font-bold'; // Es primo, esperando validación
                    if (!readOnly) {
                        hoverStyle = 'hover:ring-2 hover:ring-yellow-400'; // Indicar que se puede validar
                        cursorStyle = 'cursor-pointer'; // Click para validar
                    }
                } else {
                    specificStyle = 'bg-cyan-700 text-white font-bold'; // No es primo, no se puede validar
                }
            }
        }
    } else if (gamePhaseForC === 'results') { // Fase de resultados, todo visible, mostrar validación
        const valueIsPrime = typeof cellValue === 'number' && isPrime(cellValue);
        if (validationStatus === 'validated') {
            specificStyle = 'bg-teal-500 text-white font-bold';
        } else if (validationStatus === 'failed') {
             specificStyle = 'bg-orange-600 text-white font-bold';
        } else if (valueIsPrime) { // Era primo pero no se validó (o no se intentó)
            specificStyle = 'bg-cyan-800 text-cyan-100 font-bold border border-dashed border-cyan-500'; // Estilo para primo no validado
        } else {
            specificStyle = 'bg-slate-700 text-space-light';
        }

    } else { // Matriz A, B o C fuera de finding/results
      specificStyle = 'bg-slate-700 text-space-light';
    }


    return `${baseStyle} ${specificStyle} ${opacityStyle} ${hoverStyle} ${cursorStyle}`;
  };

const handleCellClick = (rowIndex, colIndex) => {
  if (readOnly || gamePhaseForC !== 'finding') return; // Solo interactivo en 'finding'

    const key = `${rowIndex}-${colIndex}`;
    const isRevealed = revealedStatus ? revealedStatus[key] : false;

    if (!isRevealed && onRevealCell) {
      // Click en celda con opacidad -> Revelar
      onRevealCell(rowIndex, colIndex);
    } else if (isRevealed && onValidateCell) {
      // Click en número revelado -> Intentar Validar (Simon Says)
       const currentValidationStatus = cellValidationStatus ? cellValidationStatus[key] : null;
       // Permitir validar solo si no está ya 'validated' o 'failed'
       if (currentValidationStatus !== 'validated' && currentValidationStatus !== 'failed') {
          onValidateCell(rowIndex, colIndex, matrix[rowIndex][colIndex]);
       }
    }
};

return (
<div className="p-3 bg-slate-900/70 rounded-lg border border-slate-700 shadow-md">
  <h3 className="font-['VT323'] text-lg mb-3 text-center text-accent-yellow border-b-2 border-accent-yellow/30 pb-2">
    {/* <FaSatelliteDish className="inline mr-2" /> {title} */} {title}
  </h3>
      <div
        className={`grid gap-1 sm:gap-2`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((cell, j) => {
            const key = `${i}-${j}`;
            const isRevealed = revealedStatus ? revealedStatus[key] : false;
            const validationStatus = cellValidationStatus ? cellValidationStatus[key] : null;
             // Mostrar siempre el número, el estilo se encarga de la opacidad/apariencia
            const cellContent = cell;
            return (
              <div
                key={key}
                className={getCellStyle(i, j, cell)}
                title={
                  (() => {
                    const key = `${i}-${j}`;
                    const isRevealed = revealedStatus ? revealedStatus[key] : false;
                    const validationStatus = cellValidationStatus ? cellValidationStatus[key] : null;
                    const cellValue = cell; // Usamos 'cell' directamente

                    if (gamePhaseForC === 'finding' && !isRevealed && !readOnly) {
                        return 'Click para revelar celda';
                    } else if (gamePhaseForC === 'finding' && isRevealed && !readOnly) {
                        if (validationStatus === 'validated') {
                            return `Validado: ${cellValue} (Correcto!)`;
                        } else if (validationStatus === 'failed') {
                            return `Validación Fallida: ${cellValue}`;
                        } else {
                            // Aún no se intentó validar, indicar si es primo o no
                            if (typeof cellValue === 'number' && isPrime(cellValue)) {
                                return `Click para validar ${cellValue} (Posible Primo)`;
                            } else {
                                // No es primo, pero aún así podrías permitir el clic (aunque fallará Simon)
                                // O podrías deshabilitar la opción de validar aquí visualmente
                                return `Click para validar ${cellValue} (No Primo)`;
                            }
                        }
                    } else if (gamePhaseForC === 'results') {
                         // En resultados, mostrar estado final
                         if (validationStatus === 'validated') return `Validado: ${cellValue}`;
                         if (validationStatus === 'failed') return `Fallido: ${cellValue}`;
                         if (typeof cellValue === 'number' && isPrime(cellValue)) return `Primo no validado: ${cellValue}`;
                         return `(${i}, ${j}) = ${cellValue}`; // Celda normal en resultados
                    } else {
                        // Fase normal (briefing, ready_to_calc, calculating) o matrices A/B
                        return `(${i}, ${j}) = ${cellValue}`;
                    }
                })()
                }
                onClick={() => handleCellClick(i, j)}
              >
                {cellContent}
              </div>
            );
          })
        )}
      </div>
       <p className="text-xs text-gray-400 mt-2 text-center">Dims: {rows}x{cols}</p>
    </div>
  );
};

export default MatrixDisplay;