import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import StartScreen from './components/StartScreen';
import GameCanvas from './components/GameCanvas';
import Results from './components/Results';
import BonusLevel from './components/BonusLevel';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('loading'); // loading, start, playing, results, bonus
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [userData, setUserData] = useState(null);

  // Flow Transitions
  const handleLoadingComplete = () => setGameState('start');
  const handleStartGame = () => setGameState('playing');
  
  const handleGameOver = (finalScore, count) => {
    setScore(finalScore);
    setCollectedCount(count);
    setGameState('results');
  };

  const handleFormSubmit = (data) => {
    setUserData(data);
    console.log('Lead Captured:', data); // Mock backend
    setGameState('bonus');
  };

  const handleRestart = () => {
    setScore(0);
    setCollectedCount(0);
    setGameState('start');
  };

  return (
    <div className="game-container">
      {gameState === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
      {gameState === 'playing' && <GameCanvas onGameOver={handleGameOver} />}
      {gameState === 'results' && (
        <Results 
          score={score} 
          collectedCount={collectedCount} 
          onSubmit={handleFormSubmit} 
        />
      )}
      {gameState === 'bonus' && <BonusLevel onRestart={handleRestart} />}
    </div>
  );
}

export default App;
