import { useMemo } from 'react';
import { Color } from 'three';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function Tree({ position, scale = 1, rotation = [0, 0, 0] }: TreeProps) {
  const variation = useMemo(() => ({
    trunkHeight: 2 + Math.random() * 1,
    trunkWidth: 0.2 + Math.random() * 0.1,
    leafLayers: 3 + Math.floor(Math.random() * 2),
    leafHeightOffset: 0.8,
    leafRadius: 1 + Math.random() * 0.5
  }), []);

  const colors = useMemo(() => ({
    trunk: new Color('#3d2817').multiplyScalar(0.8 + Math.random() * 0.4),
    darkLeaves: new Color('#1a472a').multiplyScalar(0.8 + Math.random() * 0.2),
    midLeaves: new Color('#2d5a27').multiplyScalar(0.9 + Math.random() * 0.2),
    lightLeaves: new Color('#355e20').multiplyScalar(1 + Math.random() * 0.2)
  }), []);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Trunk */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry 
          args={[
            variation.trunkWidth * 0.8,
            variation.trunkWidth,
            variation.trunkHeight,
            8
          ]} 
        />
        <meshStandardMaterial
          color={colors.trunk}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Generate leaf layers */}
      {Array.from({ length: variation.leafLayers }).map((_, index) => {
        const layerHeight = variation.trunkHeight * 0.5 + (index * variation.leafHeightOffset);
        const layerScale = 1 - (index * 0.2);
        const color = index === 0 ? colors.darkLeaves :
                     index === variation.leafLayers - 1 ? colors.lightLeaves :
                     colors.midLeaves;
        
        return (
          <mesh
            key={index}
            position={[0, layerHeight, 0]}
            scale={[layerScale, layerScale, layerScale]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[variation.leafRadius, variation.leafHeightOffset * 2, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
} 