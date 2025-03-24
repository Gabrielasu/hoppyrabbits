import * as React from 'react';
import { useGameStore } from '../../store/gameStore';

export function HealthBar() {
  const score = useGameStore((state) => state.score);
  const hasSpeedBoost = useGameStore((state) => state.hasSpeedBoost);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px',
      pointerEvents: 'none',
      userSelect: 'none',
      transform: 'scale(1)',
      transformOrigin: 'top right',
    }}>
      {/* Score counter */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '25px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
      }}>
        <span role="img" aria-label="carrot" style={{ fontSize: '24px' }}>🥕</span>
        <span style={{ 
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#ffa500',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          {score}
        </span>
      </div>

      {/* Speed boost indicator */}
      {hasSpeedBoost && (
        <div style={{
          padding: '10px 16px',
          backgroundColor: 'rgba(0, 150, 255, 0.9)',
          borderRadius: '20px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          animation: 'pulse 1s infinite',
        }}>
          <span role="img" aria-label="lightning" style={{ fontSize: '20px' }}>⚡</span>
          <span style={{ fontWeight: 'bold' }}>
            Speed Boost
          </span>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
} 