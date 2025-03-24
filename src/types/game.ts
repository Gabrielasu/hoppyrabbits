import * as THREE from 'three';

export interface RabbitCharacter {
  id: number;
  name: string;
  color: string;
  accessory: string;
  bio: string;
  stats: {
    speed: number;
    agility: number;
    stealth: number;
    charm: number;
  };
}

export interface ToastMessage {
  name: string;
  fact: string;
}

export interface GameState {
  selectedRabbit: RabbitCharacter | null;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  hunger: number;
  score: number;
  position: THREE.Vector3;
  rotation: number;
  isGameStarted: boolean;
  isPaused: boolean;
  gameOver: boolean;
  collectedItems: any[];
  activeEffects: Array<{
    type: string;
    value: number;
    endTime: number;
  }>;
  toastMessage: ToastMessage | null;

  setSelectedRabbit: (rabbit: RabbitCharacter) => void;
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: number) => void;
  takeDamage: (amount: number) => void;
  addHealth: (amount: number) => void;
  updateStamina: (amount: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  updatePosition: (x: number, y: number, z: number) => void;
  updateRotation: (rotation: number) => void;
  collectItem: (item: any) => void;
  updateHunger: (amount: number) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  setToastMessage: (message: ToastMessage | null) => void;
} 