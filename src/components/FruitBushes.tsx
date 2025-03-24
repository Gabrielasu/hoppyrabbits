import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';

interface FruitBush {
  id: string;
  position: THREE.Vector3;
  scale: number;
  rotation: number;
  hasFruit: boolean;
  lastPickTime: number;
  type: 'strawberry' | 'blueberry' | 'raspberry';
}

interface FruitType {
  color: string;
  points: number;
  effect: {
    type: string;
    value: number;
    duration: number;
  };
}

const FRUITS: FruitType[] = [
  {
    color: '#ff0000',
    points: 15,
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  },
  {
    color: '#4B0082',
    points: 20,
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  },
  {
    color: '#FF69B4',
    points: 25,
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  }
];

const NUM_BUSHES = 80;
const SPAWN_RADIUS = 80;
const REGROW_TIME = 8000; // 8 seconds
const COLLECTION_DISTANCE = 2;

export function FruitBushes() {
  const [bushes, setBushes] = useState<FruitBush[]>([]);
  const playerPosition = useGameStore((state) => state.position);
  const addScore = useGameStore((state) => state.addScore);
  const setSpeedBoost = useGameStore((state) => state.setSpeedBoost);

  // Initialize bushes
  useEffect(() => {
    const newBushes: FruitBush[] = [];
    for (let i = 0; i < NUM_BUSHES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * SPAWN_RADIUS;
      const type = ['strawberry', 'blueberry', 'raspberry'][Math.floor(Math.random() * 3)] as FruitBush['type'];
      
      newBushes.push({
        id: Math.random().toString(),
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        hasFruit: true,
        lastPickTime: 0,
        type
      });
    }
    setBushes(newBushes);
  }, []);

  // Regrow fruits
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setBushes(prev => prev.map(bush => {
        if (!bush.hasFruit && currentTime - bush.lastPickTime >= REGROW_TIME) {
          return { ...bush, hasFruit: true };
        }
        return bush;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for fruit collection
  useFrame(() => {
    const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);

    setBushes(prev => prev.map(bush => {
      if (!bush.hasFruit) return bush;

      const distance = playerPos.distanceTo(bush.position);
      if (distance < COLLECTION_DISTANCE) {
        const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        addScore(fruit.points);
        setSpeedBoost(fruit.effect.duration);
        
        return {
          ...bush,
          hasFruit: false,
          lastPickTime: Date.now()
        };
      }
      return bush;
    }));
  });

  return (
    <group>
      {bushes.map(bush => (
        <group
          key={bush.id}
          position={bush.position}
          rotation={[0, bush.rotation, 0]}
          scale={[bush.scale, bush.scale, bush.scale]}
        >
          {/* Bush base */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#2D5A27" />
          </mesh>
          
          {/* Fruit */}
          {bush.hasFruit && (
            <mesh
              position={[0, 0.5, 0]}
              castShadow
            >
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial
                color={FRUITS[0].color}
                emissive={FRUITS[0].color}
                emissiveIntensity={0.2}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
} 