import React from 'react';
import { useGameStore } from '../store/gameStore';
import '../styles/GameOver.css';

export function GameOver() {
  const score = useGameStore((state) => state.score);
  const resetGame = useGameStore((state) => state.resetGame);

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1>Game Over</h1>
        <p>Your bunny didn't make it to safety in time!</p>
        <h2>Final Score: {score} points</h2>
        <button 
          className="restart-button"
          onClick={resetGame}
        >
          Choose New Bunny
        </button>
      </div>
    </div>
  );
} 