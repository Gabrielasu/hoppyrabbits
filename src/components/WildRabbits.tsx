import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { PlaceholderModel } from './PlaceholderModel';
import { DeerModel, SquirrelModel, FoxModel, HedgehogModel, RaccoonModel, OwlModel, BeaverModel } from './ForestAnimals';
import { isInShadow, findNearestShadow } from '../utils/shadowCheck';
import { RabbitCharacter } from '../types/game';

interface WildRabbit {
  id: string;
  position: THREE.Vector3;
  rotation: number;
  targetPosition: THREE.Vector3;
  hopHeight: number;
  hopProgress: number;
  hopSpeed: number;
  nextHopTime: number;
  color: string;
  hasMetPlayer: boolean;
  name: string;
  funFact: string;
  isDead?: boolean;
  deathProgress?: number;
  reachedSafety?: boolean;
  _triggerToast?: boolean;
}

interface ForestAnimal {
  id: string;
  position: THREE.Vector3;
  rotation: number;
  targetPosition: THREE.Vector3;
  hopHeight: number;
  hopProgress: number;
  hopSpeed: number;
  nextHopTime: number;
  color: string;
  type: 'deer' | 'squirrel' | 'fox' | 'hedgehog' | 'raccoon' | 'owl' | 'beaver';
  scale: number;
}

const RABBIT_COLORS = [
  '#F5F5F5', // White
  '#8B7355', // Brown
  '#363636', // Black
  '#B87333', // Copper
  '#9E9E9E', // Grey
  '#8B4513', // Dark brown
];

const RABBIT_NAMES = [
  'Hoppy', 'Thumper', 'Cotton', 'Luna', 'Daisy',
  'Clover', 'Sage', 'Willow', 'Maple', 'Hazel',
  'Juniper', 'Bramble', 'Thistle', 'Fern', 'Ash'
];

const RABBIT_FACTS = [
  'Can jump up to 4 feet high!',
  'Loves to eat dandelions',
  'Does a happy dance called a binky',
  'Can see behind without turning head',
  'Purrs when happy, like a cat',
  'Has excellent night vision',
  'Can run up to 35 mph',
  'Sleeps with eyes open',
  'Has very soft paw pads',
  'Communicates through ear positions',
  'Grooms themselves like cats',
  'Can live up to 12 years',
  'Born with eyes closed',
  'Has amazing sense of smell',
  'Hops on all fours when happy'
];

const POINTS_FOR_MEETING = 50;
const MEETING_DISTANCE = 3;
const MAX_RABBITS = 30;
const SPAWN_RADIUS = 80;
const MIN_SPAWN_DISTANCE = 15;
const HOP_INTERVAL = 2000; // Increased back to 2 seconds between hops
const SPAWN_INTERVAL = 5000;
const FOREST_ANIMAL_SPAWN_INTERVAL = 3000; // Faster spawn interval for forest animals
const PREDATOR_WARNING_INTERVAL = 30000;
const SHADOW_SAFETY_TIME = 5000;
const DEATH_ANIMATION_DURATION = 2;

const FOREST_ANIMAL_TYPES = [
  {
    type: 'deer' as const,
    color: '#8B4513',
    scale: 1.25,
    spawnChance: 0.35,
    maxCount: 4
  },
  {
    type: 'squirrel' as const,
    color: '#D2691E',
    scale: 0.6,
    spawnChance: 0.6, // Increased from 0.4
    maxCount: 12 // Increased from 8
  },
  {
    type: 'fox' as const,
    color: '#D2691E',
    scale: 1.5,
    spawnChance: 0.25, // Increased from 0.1
    maxCount: 3 // Increased from 2
  },
  {
    type: 'hedgehog' as const,
    color: '#696969',
    scale: 0.4,
    spawnChance: 0.45, // Increased from 0.3
    maxCount: 8 // Increased from 5
  },
  {
    type: 'raccoon' as const,
    color: '#808080',
    scale: 0.8,
    spawnChance: 0.4, // Increased from 0.25
    maxCount: 6 // Increased from 4
  },
  {
    type: 'owl' as const,
    color: '#8B7355',
    scale: 0.7,
    spawnChance: 0.3, // Increased from 0.15
    maxCount: 5 // Increased from 3
  },
  {
    type: 'beaver' as const,
    color: '#8B4513',
    scale: 0.9,
    spawnChance: 0.35, // Increased from 0.2
    maxCount: 4 // Increased from 2
  }
] as const;

// Helper functions
const generateRabbitName = (): string => {
  return RABBIT_NAMES[Math.floor(Math.random() * RABBIT_NAMES.length)];
};

const generateRabbitFact = (): string => {
  return RABBIT_FACTS[Math.floor(Math.random() * RABBIT_FACTS.length)];
};

const generateRabbitColor = (): string => {
  return RABBIT_COLORS[Math.floor(Math.random() * RABBIT_COLORS.length)];
};

const spawnRabbit = (): WildRabbit => {
  const angle = Math.random() * Math.PI * 2;
  const radius = MIN_SPAWN_DISTANCE + Math.random() * (SPAWN_RADIUS - MIN_SPAWN_DISTANCE);
  const position = new THREE.Vector3(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius
  );
  
  // Set initial target position different from spawn position
  const targetAngle = Math.random() * Math.PI * 2;
  const targetRadius = 3 + Math.random() * 4; // Reduced movement range
  const targetPosition = new THREE.Vector3(
    position.x + Math.cos(targetAngle) * targetRadius,
    0,
    position.z + Math.sin(targetAngle) * targetRadius
  );

  return {
    id: `rabbit-${Date.now()}-${Math.random()}`,
    position: position,
    rotation: Math.random() * Math.PI * 2,
    targetPosition: targetPosition,
    hopHeight: 0.2 + Math.random() * 0.3,
    hopProgress: 0,
    hopSpeed: 0.6 + Math.random() * 0.4, // Reduced hop speed
    nextHopTime: Date.now(),
    color: generateRabbitColor(),
    hasMetPlayer: false,
    name: generateRabbitName(),
    funFact: generateRabbitFact()
  };
};

const spawnForestAnimal = (): ForestAnimal | null => {
  const animalType = FOREST_ANIMAL_TYPES.find(type => 
    Math.random() < type.spawnChance
  );
  
  if (!animalType) return null;

  const angle = Math.random() * Math.PI * 2;
  const radius = MIN_SPAWN_DISTANCE + Math.random() * (SPAWN_RADIUS - MIN_SPAWN_DISTANCE);
  const position = new THREE.Vector3(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius
  );
  
  const targetAngle = Math.random() * Math.PI * 2;
  const targetRadius = 5 + Math.random() * 8;
  const targetPosition = new THREE.Vector3(
    position.x + Math.cos(targetAngle) * targetRadius,
    0,
    position.z + Math.sin(targetAngle) * targetRadius
  );

  return {
    id: `animal-${Date.now()}-${Math.random()}`,
    position,
    rotation: Math.random() * Math.PI * 2,
    targetPosition,
    hopHeight: 0.2 + Math.random() * 0.3,
    hopProgress: 0,
    hopSpeed: 0.4 + Math.random() * 0.3,
    nextHopTime: Date.now(),
    color: animalType.color,
    type: animalType.type,
    scale: animalType.scale
  };
};

export function WildRabbits() {
  const [rabbits, setRabbits] = useState<WildRabbit[]>([]);
  const [forestAnimals, setForestAnimals] = useState<ForestAnimal[]>([]);
  const [isPredatorNearby, setIsPredatorNearby] = useState(false);
  const [treePositions, setTreePositions] = useState<THREE.Vector3[]>([]);
  const [bushPositions, setBushPositions] = useState<THREE.Vector3[]>([]);
  const playerPosition = useGameStore((state) => state.position);
  const score = useGameStore((state) => state.score);
  const addScore = useGameStore((state) => state.addScore);
  const setToastMessage = useGameStore((state) => state.setToastMessage);
  const setGameOver = useGameStore((state) => state.setGameOver);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const resetGame = useGameStore((state) => state.resetGame);

  // Initialize with some rabbits
  useEffect(() => {
    const initialRabbits = Array.from({ length: 15 }, () => spawnRabbit());
    console.log('Spawned initial rabbits:', initialRabbits.length);
    setRabbits(initialRabbits);
  }, []);

  // Spawn rabbits and forest animals
  useEffect(() => {
    // Separate spawn intervals for rabbits and forest animals
    const spawnRabbitsInterval = setInterval(() => {
      setRabbits(prev => {
        if (prev.length >= MAX_RABBITS) {
          console.log('Max rabbits reached:', prev.length);
          return prev;
        }
        const newRabbits = [...prev, spawnRabbit()];
        console.log('Current rabbit count:', newRabbits.length);
        return newRabbits;
      });
    }, SPAWN_INTERVAL);

    const spawnForestAnimalsInterval = setInterval(() => {
      setForestAnimals(prev => {
        const newAnimals = [...prev];
        FOREST_ANIMAL_TYPES.forEach(type => {
          const typeCount = newAnimals.filter(a => a.type === type.type).length;
          if (typeCount < type.maxCount && Math.random() < type.spawnChance) {
            const newAnimal = spawnForestAnimal();
            if (newAnimal) newAnimals.push(newAnimal);
          }
        });
        return newAnimals;
      });
    }, FOREST_ANIMAL_SPAWN_INTERVAL);

    return () => {
      clearInterval(spawnRabbitsInterval);
      clearInterval(spawnForestAnimalsInterval);
    };
  }, []);

  // Effect to collect tree and bush positions from the scene
  useEffect(() => {
    // This would need to be coordinated with your actual tree/bush placement logic
    // For now, we'll create some sample positions
    const trees = [];
    const bushes = [];

    // Create some sample tree positions
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      trees.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }

    // Create some sample bush positions
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 15 + Math.random() * 40;
      bushes.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }

    setTreePositions(trees);
    setBushPositions(bushes);
  }, []);

  // Predator warning system
  useEffect(() => {
    const triggerPredatorWarning = () => {
      if (isGameOver) return;

      setIsPredatorNearby(true);
      setToastMessage({ name: "DANGER", fact: "Hide in the shadows!" });
      
      // Make all rabbits run for shadows
      setRabbits(prev => prev.map(rabbit => {
        if (rabbit.isDead) return rabbit;
        
        const shadowPosition = findNearestShadow(rabbit.position, treePositions, bushPositions);
        return {
          ...rabbit,
          targetPosition: shadowPosition,
          hopSpeed: 8 + Math.random() * 4,
          reachedSafety: false
        };
      }));
      
      // After 5 seconds, check which rabbits and player are not in shadows
      setTimeout(() => {
        // Check player safety first
        const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
        const isPlayerSafe = isInShadow(playerPos, treePositions, bushPositions);
        
        if (!isPlayerSafe) {
          setToastMessage({ 
            name: "GAME OVER", 
            fact: `Your bunny didn't hide in time! Total score: ${score} points` 
          });
          setGameOver(true);
          setTimeout(() => {
            resetGame();
          }, 3000);
          return;
        }
        
        // Check rabbits safety
        setRabbits(prev => prev.map(rabbit => {
          if (rabbit.isDead) return rabbit;
          
          const inSafety = isInShadow(rabbit.position, treePositions, bushPositions);
          if (!inSafety) {
            return {
              ...rabbit,
              isDead: true,
              deathProgress: 0,
            };
          }
          
          return {
            ...rabbit,
            hopSpeed: 5 + Math.random() * 3,
            reachedSafety: true
          };
        }));

        // Show safety message
        setToastMessage({ name: "SAFE", fact: "The danger has passed. You can come out now!" });
        setTimeout(() => setToastMessage(null), 3000);
        setIsPredatorNearby(false);
      }, SHADOW_SAFETY_TIME);
    };

    const warningInterval = setInterval(triggerPredatorWarning, PREDATOR_WARNING_INTERVAL);
    return () => clearInterval(warningInterval);
  }, [setToastMessage, treePositions, bushPositions, playerPosition, isGameOver, setGameOver, score, resetGame]);

  useFrame((state, delta) => {
    const currentTime = state.clock.getElapsedTime() * 1000;
    const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
    
    setRabbits(prev => prev.map(rabbit => {
      if (rabbit.isDead) {
        const newDeathProgress = (rabbit.deathProgress || 0) + delta / DEATH_ANIMATION_DURATION;
        if (newDeathProgress >= 1) return null;
        
        return {
          ...rabbit,
          deathProgress: newDeathProgress,
          rotation: rabbit.rotation + (Math.PI / 2) * delta
        };
      }

      // Always update position and hopping
      const newHopProgress = rabbit.hopProgress + delta * rabbit.hopSpeed;
      const resetHop = newHopProgress >= 1;
      
      // Move towards target position
      const moveSpeed = 1.5 * delta;
      const newPosition = rabbit.position.clone().lerp(rabbit.targetPosition, moveSpeed);
      
      // Check if player is nearby
      const distanceToPlayer = playerPos.distanceTo(newPosition);

      if (!rabbit.hasMetPlayer && distanceToPlayer < MEETING_DISTANCE) {
        console.log('Player met rabbit:', rabbit.name, 'at distance:', distanceToPlayer);
        setToastMessage({ 
          name: `Met ${rabbit.name}`, 
          fact: rabbit.funFact 
        });
        addScore(POINTS_FOR_MEETING);
        
        // Clear toast after delay
        setTimeout(() => {
          setToastMessage(null);
        }, 4000);
        
        return {
          ...rabbit,
          position: newPosition,
          targetPosition: rabbit.targetPosition,
          rotation: rabbit.rotation,
          nextHopTime: rabbit.nextHopTime,
          hopProgress: resetHop ? 0 : newHopProgress,
          hasMetPlayer: true
        };
      }

      // Check if we need a new target position
      let newTargetPosition = rabbit.targetPosition;
      let newRotation = rabbit.rotation;
      let newNextHopTime = rabbit.nextHopTime;
      
      if (currentTime > rabbit.nextHopTime || newPosition.distanceTo(rabbit.targetPosition) < 0.1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 3 + Math.random() * 4;
        newTargetPosition = new THREE.Vector3(
          newPosition.x + Math.cos(angle) * distance,
          0,
          newPosition.z + Math.sin(angle) * distance
        );

        // Keep rabbits within bounds
        const distanceFromCenter = newTargetPosition.length();
        if (distanceFromCenter > SPAWN_RADIUS) {
          newTargetPosition.normalize().multiplyScalar(SPAWN_RADIUS * 0.8);
        }

        // Update rotation to face movement direction
        const direction = newTargetPosition.clone().sub(newPosition);
        newRotation = Math.atan2(direction.x, direction.z);
        newNextHopTime = currentTime + HOP_INTERVAL * (0.8 + Math.random() * 0.4);
      }

      return {
        ...rabbit,
        position: newPosition,
        targetPosition: newTargetPosition,
        rotation: newRotation,
        nextHopTime: newNextHopTime,
        hopProgress: resetHop ? 0 : newHopProgress
      };
    }).filter(Boolean) as WildRabbit[]);

    // Update forest animals
    setForestAnimals(prev => prev.map(animal => {
      let newPosition = animal.position.clone();
      let newTargetPosition = animal.targetPosition;
      let newRotation = animal.rotation;
      let newHopProgress = animal.hopProgress;
      let newNextHopTime = animal.nextHopTime;
      let resetHop = false;

      // Update position
      const direction = animal.targetPosition.clone().sub(newPosition);
      if (direction.length() > 0.1) {
        direction.normalize();
        direction.multiplyScalar(delta * animal.hopSpeed);
        newPosition.add(direction);
      }

      // Update hopping
      newHopProgress += delta * animal.hopSpeed;
      if (newHopProgress >= 1) {
        newHopProgress = 0;
        resetHop = true;
      }

      // Generate new target if reached or timeout
      if (currentTime > animal.nextHopTime || newPosition.distanceTo(animal.targetPosition) < 0.1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * 8;
        newTargetPosition = new THREE.Vector3(
          newPosition.x + Math.cos(angle) * distance,
          0,
          newPosition.z + Math.sin(angle) * distance
        );

        // Keep within bounds
        const distanceFromCenter = newTargetPosition.length();
        if (distanceFromCenter > SPAWN_RADIUS) {
          newTargetPosition.normalize().multiplyScalar(SPAWN_RADIUS * 0.8);
        }

        // Update rotation to face movement direction
        const direction = newTargetPosition.clone().sub(newPosition);
        newRotation = Math.atan2(direction.x, direction.z);
        newNextHopTime = currentTime + HOP_INTERVAL * (0.8 + Math.random() * 0.4);
      }

      return {
        ...animal,
        position: newPosition,
        targetPosition: newTargetPosition,
        rotation: newRotation,
        nextHopTime: newNextHopTime,
        hopProgress: resetHop ? 0 : newHopProgress
      };
    }));
  });

  return (
    <group>
      {rabbits.map(rabbit => {
        // Calculate vertical offset based on hop progress
        const hopOffset = Math.sin(rabbit.hopProgress * Math.PI) * rabbit.hopHeight;
        
        return (
          <group
            key={rabbit.id}
            position={[rabbit.position.x, hopOffset, rabbit.position.z]}
            rotation={[0, rabbit.rotation, 0]}
          >
            {/* Add debug sphere to visualize meeting distance */}
            {!rabbit.hasMetPlayer && (
              <mesh visible={false}>
                <sphereGeometry args={[MEETING_DISTANCE, 8, 8]} />
                <meshBasicMaterial wireframe color="red" />
              </mesh>
            )}
            <PlaceholderModel 
              color={rabbit.color} 
              scale={1}
            />
          </group>
        );
      })}

      {/* Render forest animals */}
      {forestAnimals.map(animal => {
        const hopOffset = Math.sin(animal.hopProgress * Math.PI) * animal.hopHeight;
        
        return (
          <group
            key={animal.id}
            position={[animal.position.x, hopOffset, animal.position.z]}
            rotation={[0, animal.rotation, 0]}
            scale={[animal.scale, animal.scale, animal.scale]}
          >
            {animal.type === 'deer' && <DeerModel color={animal.color} />}
            {animal.type === 'squirrel' && <SquirrelModel color={animal.color} />}
            {animal.type === 'fox' && <FoxModel color={animal.color} />}
            {animal.type === 'hedgehog' && <HedgehogModel color={animal.color} />}
            {animal.type === 'raccoon' && <RaccoonModel color={animal.color} />}
            {animal.type === 'owl' && <OwlModel color={animal.color} />}
            {animal.type === 'beaver' && <BeaverModel color={animal.color} />}
          </group>
        );
      })}
    </group>
  );
} 