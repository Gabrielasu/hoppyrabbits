import { useGameStore } from '../store/gameStore';
import '../styles/HUD.css';

export function HUD() {
  const { health, hunger, score, activeEffects } = useGameStore();

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-stats">
          <div className="stat-bar health">
            <span className="stat-label">Health</span>
            <div className="stat-fill" style={{ width: `${health}%` }} />
          </div>
          <div className="stat-bar hunger">
            <span className="stat-label">Hunger</span>
            <div className="stat-fill" style={{ width: `${hunger}%` }} />
          </div>
        </div>
        <div className="score">Score: {score}</div>
      </div>
      
      {activeEffects.length > 0 && (
        <div className="active-effects">
          {activeEffects.map((effect, index) => {
            const timeLeft = Math.ceil((effect.endTime - Date.now()) / 1000);
            return (
              <div key={index} className="effect">
                <span className="effect-type">{effect.type}</span>
                <span className="effect-timer">{timeLeft}s</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 