import React, { useEffect, useState } from 'react';
import { getHallOfFame } from '../utils';

// eslint-disable-next-line react/prop-types
const HallOfFameScreen = ({ onPlayAgain }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(getHallOfFame());
  }, []);

  return (
    <div className="font-['VT323'] flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-slate-900 to-space-dark">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-accent-yellow tracking-wider">Hall of Fame</h1>

      <div className="w-full max-w-md bg-slate-800 p-6 rounded-lg shadow-xl border border-gray-700">
        {scores.length > 0 ? (
          <ol className="list-decimal list-inside space-y-3">
            {scores.map((entry, index) => (
              <li key={index} className="text-lg flex justify-between items-center border-b border-gray-600 pb-2">
                <span className=" text-space-light">
                  {index + 1}. {entry.name}
                </span>
                <span className=" text-accent-yellow">{entry.score} pts</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-400">Aún no hay puntuaciones registradas. ¡Sé el primero!</p>
        )}
      </div>

      <button
        onClick={onPlayAgain}
        className="mt-10 px-8 py-4 bg-venus-blue text-white font-semibold font-['VT323']
                  rounded-md border-2 border-blue-700 hover:bg-blue-500
                  transform hover:scale-105 transition-all duration-150
                  shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]
                  text-xl"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
};

export default HallOfFameScreen;