import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
const WelcomeScreen = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    } else {
      alert('Por favor, introduce tu nombre de piloto.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-space-dark to-slate-900">
      <h1 className="font-['VT323'] text-9xl text-accent-yellow text-shadow-neon-blue">SPACE WAR</h1>
      <p className="font-['VT323'] text-15lg sm:text-xl mb-8 text-center max-w-2xl text-space-light">
        ¡Piloto! Venus necesita tu ayuda. Usa tus habilidades algorítmicas para predecir los movimientos de Marte multiplicando matrices.
      </p>
      <div className="w-full max-w-xs">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Introduce tu nombre de piloto"
          maxLength={20}
          className="font-['VT323'] w-full px-4 py-2 mb-4 border border-venus-blue rounded bg-slate-800 text-space-light focus:outline-none focus:ring-2 focus:ring-accent-yellow"
        />
        <button
          onClick={handleStart}
          className="w-full px-6 py-3 bg-accent-yellow text-black font-bold font-['VT323']
             rounded-md border-2 border-yellow-600 hover:bg-yellow-400
             transform hover:scale-105 transition-all duration-150
             shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]
             flex items-center justify-center gap-2 text-lg"
        >
          Iniciar Misión
        </button>
      </div>
       <p className="font-['VT323'] text-sm text-gray-500 mt-12 text-center">
        Aclaración: La predicción es una simulación basada en multiplicación matricial.
      </p>
    </div>
  );
};

export default WelcomeScreen;