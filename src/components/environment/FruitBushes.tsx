import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface FruitBush {
  id: string;
  position: THREE.Vector3;
  scale: number;
  rotation: number;
  hasFruit: boolean;
  lastPickTime: number;
  type: 'strawberry' | 'blueberry' | 'raspberry';
  fruitCount: number;
}

const NUM_BUSHES = 20;
const SPAWN_RADIUS = 80;
const REGROW_TIME = 8; // seconds
const COLLECTION_DISTANCE = 2;
const MIN_FRUITS = 3;
const MAX_FRUITS = 7;

const BUSH_TYPES = {
  strawberry: {
    color: '#ff0000',
    points: 20,
    leafColor: '#2d5a27',
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  },
  blueberry: {
    color: '#4169E1',
    points: 25,
    leafColor: '#1f4d1f',
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  },
  raspberry: {
    color: '#FF69B4',
    points: 30,
    leafColor: '#2d5a27',
    effect: {
      type: 'speed',
      value: 1.5,
      duration: 5000 // 5 seconds
    }
  },
};

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
      const type = Object.keys(BUSH_TYPES)[Math.floor(Math.random() * 3)] as keyof typeof BUSH_TYPES;
      
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
        type,
        fruitCount: MIN_FRUITS + Math.floor(Math.random() * (MAX_FRUITS - MIN_FRUITS + 1))
      });
    }
    setBushes(newBushes);
  }, []);

  // Check for fruit collection in the game loop
  useFrame(() => {
    const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
    let needsUpdate = false;
    const updatedBushes = bushes.map(bush => {
      if (bush.hasFruit && playerPos.distanceTo(bush.position) < COLLECTION_DISTANCE) {
        const bushType = BUSH_TYPES[bush.type];
        addScore(bushType.points);
        setSpeedBoost(bushType.effect.duration);
        needsUpdate = true;
        return {
          ...bush,
          hasFruit: false,
          fruitCount: 0
        };
      }
      return bush;
    });

    if (needsUpdate) {
      setBushes(updatedBushes);
    }
  });

  return (
    <group>
      {bushes.map(bush => {
        const bushType = BUSH_TYPES[bush.type];
        return (
          <group
            key={bush.id}
            position={bush.position}
            rotation={[0, bush.rotation, 0]}
            scale={[bush.scale, bush.scale, bush.scale]}
          >
            {/* Bush base */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial color={bushType.leafColor} />
            </mesh>

            {/* Smaller leaf clusters */}
            {[...Array(5)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(i * Math.PI * 0.4) * 0.7,
                  Math.sin(i * Math.PI * 0.4) * 0.3 + 0.3,
                  Math.sin(i * Math.PI * 0.4) * 0.7,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.6, 6, 6]} />
                <meshStandardMaterial
                  color={bushType.leafColor}
                  roughness={0.8}
                />
              </mesh>
            ))}

            {/* Fruits */}
            {bush.hasFruit && [...Array(bush.fruitCount)].map((_, i) => {
              const angle = (i / bush.fruitCount) * Math.PI * 2;
              const radius = 0.6;
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
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial
                    color={bushType.color}
                    emissive={bushType.color}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
} 