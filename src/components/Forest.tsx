import { useMemo } from 'react';
import * as THREE from 'three';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { PlaceholderModel } from './PlaceholderModel';

interface ForestElement {
  type: 'tree' | 'bush';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export function Forest() {
  // Generate random positions for trees and bushes
  const forestElements = useMemo<ForestElement[]>(() => {
    const elements: ForestElement[] = [];
    const { WORLD_SIZE, FOREST_DENSITY } = GAME_CONSTANTS;
    
    // Helper function to check if position is taken
    const isPositionTaken = (x: number, z: number, elements: ForestElement[], minDistance: number) => {
      return elements.some(elem => {
        const dx = elem.position[0] - x;
        const dz = elem.position[2] - z;
        return Math.sqrt(dx * dx + dz * dz) < minDistance;
      });
    };

    // Place trees
    for (let i = 0; i < FOREST_DENSITY; i++) {
      const x = (Math.random() - 0.5) * WORLD_SIZE * 0.8;
      const z = (Math.random() - 0.5) * WORLD_SIZE * 0.8;
      
      if (!isPositionTaken(x, z, elements, 5)) {
        elements.push({
          type: 'tree',
          position: [x, 0, z],
          rotation: [0, Math.random() * Math.PI * 2, 0],
          scale: 0.8 + Math.random() * 0.4,
        });
      }
    }

    // Place bushes
    for (let i = 0; i < FOREST_DENSITY * 1.5; i++) {
      const x = (Math.random() - 0.5) * WORLD_SIZE * 0.9;
      const z = (Math.random() - 0.5) * WORLD_SIZE * 0.9;
      
      if (!isPositionTaken(x, z, elements, 3)) {
        elements.push({
          type: 'bush',
          position: [x, 0, z],
          rotation: [0, Math.random() * Math.PI * 2, 0],
          scale: 0.6 + Math.random() * 0.3,
        });
      }
    }

    return elements;
  }, []);

  return (
    <group>
      {forestElements.map((elem, index) => (
        <group
          key={`${elem.type}-${index}`}
          position={elem.position}
          rotation={elem.rotation}
          scale={[elem.scale, elem.scale, elem.scale]}
        >
          <PlaceholderModel
            color={elem.type === 'tree' ? '#2d5a27' : '#3a7d32'}
            scale={elem.type === 'tree' ? 1 : 0.5}
          />
        </group>
      ))}
    </group>
  );
} 