import { Suspense } from 'react';
import { useGameStore } from './store/gameStore';
import { Game } from './components/Game';
import { CharacterSelect } from './components/CharacterSelect';
import { RabbitCharacter } from './types/game';
import './App.css';

export function App() {
  const isGameStarted = useGameStore((state) => state.isGameStarted);
  const setSelectedRabbit = useGameStore((state) => state.setSelectedRabbit);
  const startGame = useGameStore((state) => state.startGame);

  const handleCharacterSelect = (character: RabbitCharacter) => {
    setSelectedRabbit(character);
    startGame();
  };

  return (
    <div className="app">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        {!isGameStarted ? (
          <CharacterSelect onSelect={handleCharacterSelect} />
        ) : (
          <Game />
        )}
      </Suspense>
    </div>
  );
}
