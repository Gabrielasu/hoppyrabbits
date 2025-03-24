import * as React from 'react';

interface ToastProps {
  name: string;
  fact: string;
}

export function Toast({ name, fact }: ToastProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '20px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      animation: 'fadeInOut 3s ease-in-out',
      border: '2px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ fontWeight: 'bold', color: '#ffa500', fontSize: '18px' }}>
        {name}
      </div>
      <div style={{ fontSize: '14px', opacity: 0.9, color: '#ffffff' }}>
        {fact}
      </div>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
          }
        `}
      </style>
    </div>
  );
} 