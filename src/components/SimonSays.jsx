// src/components/SimonSays.jsx
import React, { useState, useEffect, useRef } from 'react';
import { SIMON_SAYS_GRID_ROWS, SIMON_SAYS_GRID_COLS } from '../constants';
import { isPrime } from '../utils';

// eslint-disable-next-line react/prop-types
const SimonSays = ({ sequenceLength = 3, onSuccess, onFailure, difficulty = 1, targetValue }) => {
  const gridRows = SIMON_SAYS_GRID_ROWS; // 3
  const gridCols = SIMON_SAYS_GRID_COLS; // 2
  const totalButtons = gridRows * gridCols; // 6
  const sequenceRef = useRef([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true); // True when showing sequence
  const [activeButton, setActiveButton] = useState(null); // Index of button currently lit
  const [message, setMessage] = useState('Observa la secuencia...');
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [showResult, setShowResult] = useState(null); // 'success' or 'failure'
  const [primeResult, setPrimeResult] = useState(null); // true if targetValue is prime, false if not, null if not yet determined

  // Generar secuencia al montar o cambiar longitud
  useEffect(() => {
    sequenceRef.current = Array.from({ length: sequenceLength }, () =>
      Math.floor(Math.random() * totalButtons)
    );
    setPlayerSequence([]);
    setIsPlaying(true);
    setIsPlayerTurn(false);
    setMessage('Memoriza la secuencia de activación...');
    setShowResult(null);

    // Mostrar secuencia al jugador
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequenceRef.current.length) {
        setActiveButton(sequenceRef.current[i]);
        // Apagar después de un tiempo corto
        setTimeout(() => setActiveButton(null), 400 / difficulty); // Más rápido con dificultad
        i++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setIsPlayerTurn(true);
        setMessage('Tu turno: Repite la secuencia.');
      }
    }, 700 / difficulty); // Más rápido con dificultad

    return () => clearInterval(interval); // Limpiar intervalo
  }, [sequenceLength, totalButtons, difficulty]);

  const handleButtonClick = (index) => {
    if (!isPlayerTurn || showResult) return; // No hacer nada si no es el turno del jugador o ya terminó

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Verificar si el botón presionado es correcto hasta ahora
    if (sequenceRef.current[newPlayerSequence.length - 1] !== index) {
      // Error
      setIsPlayerTurn(false);
      const prime = isPrime(targetValue);
      setPrimeResult(prime);
      setMessage(prime
        ? `${targetValue} es primo — unidad enemiga detectada`
        : `${targetValue} no es primo — falsa alarma`);
      setShowResult('failure');
      setTimeout(onFailure, 1500);
      return;
    }

    // Verificar si la secuencia está completa y es correcta
    if (newPlayerSequence.length === sequenceRef.current.length) {
      // Éxito
      setIsPlayerTurn(false);
      const prime = isPrime(targetValue);
      setPrimeResult(prime);
      setMessage(prime
        ? `${targetValue} es primo — unidad enemiga detectada`
        : `${targetValue} no es primo — falsa alarma`);
      setShowResult('success');
      setTimeout(onSuccess, 1500);
    }
    // Si no es error y no está completa, esperar siguiente clic
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <style>{`
        @keyframes simonResultPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="bg-slate-800 border border-yellow-500 rounded-lg p-6 shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-bold text-center mb-4 text-accent-yellow">Validación de Primo</h3>
        <p className={`text-center mb-4 font-semibold ${showResult === 'success' ? 'text-green-400' : showResult === 'failure' ? 'text-red-500' : 'text-space-light'}`}>
          {message}
        </p>
        <div className={`grid grid-cols-${gridCols} gap-3 mx-auto w-36 h-48 mb-4`}>
          {Array.from({ length: totalButtons }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(index)}
              disabled={!isPlayerTurn || showResult}
              className={`
              w-full h-full rounded-md border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400
              ${activeButton === index ? 'bg-yellow-400 border-yellow-200 scale-105 shadow-[0_0_10px_#FACC15]' : 'bg-slate-700 border-slate-600'}
              ${isPlayerTurn && !showResult ? 'hover:bg-slate-600 cursor-pointer' : 'cursor-default opacity-70'}
              ${showResult === 'success' && sequenceRef.current.includes(index) ? '!bg-green-500 !border-green-400' : ''}
              ${showResult === 'failure' && playerSequence.includes(index) && sequenceRef.current[playerSequence.indexOf(index)] !== index ? '!bg-red-600 !border-red-500' : ''}
              `}
              aria-label={`Botón ${index + 1}`}
            />
          ))}
        </div>
         {showResult && primeResult !== null && (
           <div
             style={{
               marginTop: '0.75rem',
               padding: '0.75rem 1rem',
               borderRadius: '0.5rem',
               border: `2px solid ${primeResult ? '#639922' : '#e24b4a'}`,
               background: primeResult ? 'rgba(99,153,34,0.2)' : 'rgba(226,75,74,0.2)',
               textAlign: 'center',
               animation: 'simonResultPop 0.3s ease-out forwards',
             }}
           >
             <span style={{
               fontSize: '2.3rem',
               fontWeight: 'bold',
               color: primeResult ? '#639922' : '#e24b4a',
               display: 'block',
               marginBottom: '0.25rem',
             }}>
               {primeResult ? '\u2713' : '\u2717'}
             </span>
             <p style={{
               fontFamily: "'Share Tech Mono', monospace",
               fontSize: '1rem',
               color: primeResult ? '#86efac' : '#fca5a5',
               margin: 0,
             }}>
               {message}
             </p>
           </div>
         )}
      </div>
    </div>
  );
};

export default SimonSays;