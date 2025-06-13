// src/App.jsx
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import HallOfFameScreen from './components/HallOfFameScreen';
import { LEVELS } from './constants';
import { saveScoreToHallOfFame, getHallOfFame } from './utils'; // Importa getHallOfFame si quieres precargar

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, game, hallOfFame
  const [playerName, setPlayerName] = useState('');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  // Estado para el nivel máximo desbloqueado (opcional, para futura lógica de selección de nivel)
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(0);

  // Cargar estado inicial si es necesario (ej. jugador previo, nivel desbloqueado)
  // useEffect(() => {
  //   const savedPlayer = localStorage.getItem('spaceWarPlayer');
  //   if (savedPlayer) setPlayerName(savedPlayer);
  //   // Cargar maxUnlockedLevel de localStorage si se guarda
  // }, []);


  const handleStartGame = (name) => {
    console.log("Starting game for:", name);
    setPlayerName(name);
    setCurrentLevelIndex(0);
    setTotalScore(0);
    setMaxUnlockedLevel(0); // Empieza desde el nivel 1 (índice 0)
    setCurrentScreen('game');
    // localStorage.setItem('spaceWarPlayer', name); // Guardar nombre si se desea persistencia
  };

  const handleLevelComplete = (levelPoints) => {
    console.log(`Level ${currentLevelIndex + 1} complete. Points: ${levelPoints}`);
    const newTotalScore = totalScore + levelPoints;
    setTotalScore(newTotalScore);

    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < LEVELS.length) {
      setCurrentLevelIndex(nextLevelIndex);
      setMaxUnlockedLevel(prev => Math.max(prev, nextLevelIndex)); // Actualizar nivel desbloqueado
      // No cambiar de pantalla aquí, GameScreen se actualizará con el nuevo index
    } else {
      // Si era el último nivel, la lógica de guardado se maneja en onGameEnd
      console.log("Last level completed.");
      // No llamar a handleGameEnd aquí, se llama desde el botón en GameScreen
    }
  };

   const handleGameEnd = (pointsFromLastAction = 0) => {
     const finalScore = totalScore + pointsFromLastAction;
     console.log(`Game ended. Final Score: ${finalScore} (Total: ${totalScore} + LastAction: ${pointsFromLastAction})`);
     if (playerName && finalScore > 0) {
       console.log(`Saving score for ${playerName}: ${finalScore}`);
       saveScoreToHallOfFame(playerName, finalScore);
     } else {
        console.log("Score not saved (No name or score is 0).");
     }
     setCurrentScreen('hallOfFame'); // Ir a la pantalla de Hall of Fame
   };

  const handlePlayAgain = () => {
    console.log("Playing again.");
    // Resetear estado para volver a empezar
    setPlayerName(''); // O mantener el último nombre? Por ahora lo limpiamos
    setCurrentScreen('welcome');
  };

  // Renderiza la pantalla adecuada según el estado
  const renderScreen = () => {
    switch (currentScreen) {
      case 'game':
        // Asegurarse de que solo se renderiza si hay un nivel válido
        if (currentLevelIndex >= 0 && currentLevelIndex < LEVELS.length) {
          return (
            <GameScreen
              playerName={playerName}
              currentLevelIndex={currentLevelIndex}
              totalScore={totalScore}
              onLevelComplete={handleLevelComplete}
              onGameEnd={handleGameEnd} // Pasa la función para terminar
            />
          );
        } else {
           // Algo fue mal, volver a welcome
           console.error("Invalid level index:", currentLevelIndex);
           setCurrentScreen('welcome');
           return <WelcomeScreen onStartGame={handleStartGame} />; // Muestra welcome mientras corrige
        }
      case 'hallOfFame':
        return <HallOfFameScreen onPlayAgain={handlePlayAgain} />;
      case 'welcome':
      default:
        return <WelcomeScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-[#0A0F1A] to-[#10182B] text-gray-300 font-['Exo_2']"> {/* Asegura fondo oscuro */}
      {renderScreen()}
    </div>
  );
}

export default App;