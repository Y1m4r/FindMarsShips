// src/components/MatrixDisplay.jsx
import React from 'react';
import { isPrime } from '../utils';

// eslint-disable-next-line react/prop-types
const MatrixDisplay = ({
  matrix,
  title,
  gamePhaseForC = null,
  cellValidationStatus = null,
  onCellClick = null,        // clic izquierdo
  onCellRightClick = null,   // clic derecho
  markedCells = null,        // {'r-c': true}
  readOnly = true,
  highlightRow = null,
  highlightCol = null,
  onCellHover = null,
  onCellHoverLeave = null,
  tooltipContent = null,
  hoveredCell = null,
  teachingRevealedCells = null,
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
    const validationStatus = cellValidationStatus ? cellValidationStatus[key] : null; // 'validated', 'failed'
    let baseStyle = ` p-1 sm:p-2 min-h-[30px] min-w-[30px] sm:min-h-[40px] sm:min-w-[40px]
      flex items-center justify-center
      border border-cyan-800/50 rounded-sm
      font-['VT323'] text-base transition-all duration-150 `;
    let specificStyle = 'bg-gray-700/50 text-gray-500 animate-pulse';
    let hoverStyle = 'hover:bg-gray-600/70 hover:text-gray-300';
    let cursorStyle = 'cursor-default';
    let opacityStyle = '';

    const isMarked = markedCells ? markedCells[key] : false;

     // Es Matriz C durante la fase de búsqueda?
    if (gamePhaseForC === 'finding') {
        specificStyle = 'bg-cyan-700 text-white font-bold';
        if (isMarked) {
            specificStyle += ' ring-2 ring-accent-yellow';
        }
        if (!readOnly) {
            hoverStyle = 'hover:ring-2 hover:ring-yellow-400';
            cursorStyle = 'cursor-pointer';
        }
    } else if (gamePhaseForC === 'results') {
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


    // Highlight for teaching mode (row in A, col in B)
    if (highlightRow !== null && highlightRow !== undefined && rowIndex === highlightRow) {
      specificStyle += ' ring-2 ring-venus-blue bg-blue-900/50';
    }
    if (highlightCol !== null && highlightCol !== undefined && colIndex === highlightCol) {
      specificStyle += ' ring-2 ring-mars-red bg-red-900/50';
    }

    // Teaching mode: show revealed cells with distinct style
    if (teachingRevealedCells) {
      const tKey = `${rowIndex}-${colIndex}`;
      if (teachingRevealedCells[tKey]) {
        specificStyle = 'bg-teal-800 text-white font-bold';
      } else {
        specificStyle = 'bg-slate-600 text-gray-500';
        opacityStyle = 'opacity-40';
      }
    }

    return `${baseStyle} ${specificStyle} ${opacityStyle} ${hoverStyle} ${cursorStyle}`;
  };

const handleCellLeftClick = (rowIndex, colIndex) => {
  if (readOnly || gamePhaseForC !== 'finding') return;
  if (onCellClick) onCellClick(rowIndex, colIndex);
};

const handleCellContextMenu = (e, rowIndex, colIndex) => {
  e.preventDefault();
  if (readOnly || gamePhaseForC !== 'finding') return;
  if (onCellRightClick) onCellRightClick(rowIndex, colIndex, matrix[rowIndex][colIndex]);
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
            const cellContent = cell;
            return (
              <div
                key={key}
                className={`${getCellStyle(i, j, cell)} relative`}
                title={
                  (() => {
                    const tKey = `${i}-${j}`;
                    const validationSt = cellValidationStatus ? cellValidationStatus[tKey] : null;
                    const isCellMarked = markedCells ? markedCells[tKey] : false;
                    const cellValue = cell;

                    if (gamePhaseForC === 'finding' && !readOnly) {
                        if (isCellMarked) {
                            return 'Izq: desmarcar — Der: Simon Says';
                        } else {
                            return 'Izq: marcar — Der: Simon Says';
                        }
                    } else if (gamePhaseForC === 'results') {
                         if (validationSt === 'validated') return `Validado: ${cellValue}`;
                         if (validationSt === 'failed') return `Fallido: ${cellValue}`;
                         if (typeof cellValue === 'number' && isPrime(cellValue)) return `Primo no validado: ${cellValue}`;
                         return `(${i}, ${j}) = ${cellValue}`;
                    } else {
                        return `(${i}, ${j}) = ${cellValue}`;
                    }
                })()
                }
                onClick={() => handleCellLeftClick(i, j)}
                onContextMenu={(e) => handleCellContextMenu(e, i, j)}
                onMouseEnter={() => onCellHover && onCellHover(i, j)}
                onMouseLeave={() => onCellHoverLeave && onCellHoverLeave()}
              >
                {cellContent}
                {/* Tooltip for formula */}
                {hoveredCell && hoveredCell.row === i && hoveredCell.col === j && tooltipContent && (
                  <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none">
                    <div className="bg-slate-900 border border-console-blue text-console-blue
                      font-['VT323'] text-sm p-2 rounded shadow-lg whitespace-nowrap max-w-[90vw]">
                      {tooltipContent}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
       <p className="text-sm text-gray-400 mt-2 text-center">Dims: {rows}x{cols}</p>
    </div>
  );
};

export default MatrixDisplay;