import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { GAME_CONSTANTS } from '../config/gameConfig';

interface FruitBush {
  id: string;
  position: THREE.Vector3;
  rotation: number;
  fruits: number;
  scale: number;
}

const FRUITS = [
  { 
    color: '#ff0000', 
    points: 15, 
    effect: { 
      type: 'food', 
      value: 20,
      duration: 0 // Instant effect
    }
  }, // Red berries
  { 
    color: '#4B0082', 
    points: 20, 
    effect: { 
      type: 'food', 
      value: 25,
      duration: 0 // Instant effect
    }
  }, // Blueberries
  { 
    color: '#FF69B4', 
    points: 25, 
    effect: { 
      type: 'food', 
      value: 30,
      duration: 0 // Instant effect
    }
  }, // Raspberries
];

export function Items() {
  const [bushes, setBushes] = useState<FruitBush[]>([]);
  const playerPosition = useGameStore((state) => state.position);
  const collectItem = useGameStore((state) => state.collectItem);

  // Spawn fruit bushes
  useEffect(() => {
    const spawnBush = () => {
      if (bushes.length >= 10) return; // Limit number of bushes

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 40;
      const bush: FruitBush = {
        id: Math.random().toString(36).substr(2, 9),
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        rotation: Math.random() * Math.PI * 2,
        fruits: 3 + Math.floor(Math.random() * 3), // 3-5 fruits per bush
        scale: 0.8 + Math.random() * 0.4
      };
      
      setBushes(prev => [...prev, bush]);
    };

    // Initial bushes
    for (let i = 0; i < 5; i++) {
      spawnBush();
    }

    // Spawn new bushes periodically
    const spawnInterval = setInterval(spawnBush, 15000);
    return () => clearInterval(spawnInterval);
  }, []);

  // Check for fruit collection
  useFrame(() => {
    const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
    const collectionDistance = 2;

    setBushes(prev => prev.map(bush => {
      const distance = playerPos.distanceTo(bush.position);
      
      if (distance < collectionDistance && bush.fruits > 0) {
        // Collect a fruit
        const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        collectItem({
          type: 'fruit',
          ...fruit
        });
        
        return {
          ...bush,
          fruits: bush.fruits - 1
        };
      }
      return bush;
    }).filter(bush => bush.fruits > 0)); // Remove empty bushes
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
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#2d5a27" />
          </mesh>
          
          {/* Fruits */}
          {Array.from({ length: bush.fruits }).map((_, i) => {
            const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
            const angle = (i / bush.fruits) * Math.PI * 2;
            const radius = 0.7;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0.5,
                  Math.sin(angle) * radius
                ]}
                castShadow
              >
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial
                  color={fruit.color}
                  emissive={fruit.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
} 