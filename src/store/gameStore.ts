import { create } from 'zustand';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { RabbitCharacter, GameState } from '../types/game';
import * as THREE from 'three';

export interface ToastMessage {
  name: string;
  fact: string;
}

interface GameStoreState {
  selectedRabbit: RabbitCharacter | null;
  position: THREE.Vector3;
  rotation: number;
  score: number;
  health: number;
  stamina: number;
  toastMessage: ToastMessage | null;
  isGameOver: boolean;
  isGameStarted: boolean;
  speedBoostEndTime: number;
  hasSpeedBoost: boolean;
  updatePosition: (x: number, y: number, z: number) => void;
  updateRotation: (angle: number) => void;
  addScore: (points: number) => void;
  updateHealth: (amount: number) => void;
  updateStamina: (amount: number) => void;
  setToastMessage: (message: ToastMessage | null) => void;
  setGameOver: (value: boolean) => void;
  setSelectedRabbit: (rabbit: RabbitCharacter | null) => void;
  startGame: () => void;
  resetGame: () => void;
  takeDamage: (amount: number) => void;
  setSpeedBoost: (duration: number) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  selectedRabbit: null,
  position: new THREE.Vector3(0, 0, 0),
  rotation: 0,
  score: 0,
  health: 100,
  stamina: 100,
  toastMessage: null,
  isGameOver: false,
  isGameStarted: false,
  speedBoostEndTime: 0,
  hasSpeedBoost: false,
  updatePosition: (x: number, y: number, z: number) => set((state) => ({ 
    position: new THREE.Vector3(x, y, z) 
  })),
  updateRotation: (angle: number) => set((state) => ({ 
    rotation: angle 
  })),
  addScore: (points: number) => set((state) => ({ 
    score: state.score + points 
  })),
  updateHealth: (amount: number) => set((state) => ({ 
    health: Math.max(0, Math.min(100, state.health + amount)) 
  })),
  updateStamina: (amount: number) => set((state) => ({ 
    stamina: Math.max(0, Math.min(100, state.stamina + amount)) 
  })),
  setToastMessage: (message: ToastMessage | null) => set((state) => ({ 
    toastMessage: message 
  })),
  setGameOver: (value: boolean) => set((state) => ({ 
    isGameOver: value,
    isGameStarted: value ? false : state.isGameStarted
  })),
  setSelectedRabbit: (rabbit: RabbitCharacter | null) => set((state) => ({
    selectedRabbit: rabbit
  })),
  takeDamage: (amount: number) => set((state) => {
    const newHealth = Math.max(0, state.health - amount);
    const isGameOver = newHealth <= 0;
    return {
      health: newHealth,
      isGameOver: isGameOver,
      isGameStarted: isGameOver ? false : state.isGameStarted,
      toastMessage: isGameOver ? { name: "GAME OVER", fact: "You were defeated!" } : state.toastMessage
    };
  }),
  setSpeedBoost: (duration: number) => set((state) => {
    const endTime = Date.now() + duration;
    
    // Set a timeout to clear the speed boost and toast
    setTimeout(() => {
      set((state) => ({
        speedBoostEndTime: 0,
        hasSpeedBoost: false,
        toastMessage: null
      }));
    }, duration);

    return {
      speedBoostEndTime: endTime,
      hasSpeedBoost: true,
      toastMessage: { name: "Speed Boost", fact: `${duration/1000} seconds of super speed` }
    };
  }),
  startGame: () => set((state) => ({
    selectedRabbit: null,
    position: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    score: 0,
    health: 100,
    stamina: 100,
    toastMessage: null,
    isGameOver: false,
    isGameStarted: true,
    speedBoostEndTime: 0,
    hasSpeedBoost: false
  })),
  resetGame: () => set((state) => ({
    selectedRabbit: null,
    position: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    score: 0,
    health: 100,
    stamina: 100,
    toastMessage: null,
    isGameOver: false,
    isGameStarted: false,
    speedBoostEndTime: 0,
    hasSpeedBoost: false
  }))
})); 