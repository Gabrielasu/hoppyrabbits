import { useMemo } from 'react';
import { Vector3, Color } from 'three';

interface GrassProps {
  position: Vector3;
  rotation?: number[];
}

export function Grass({ position, rotation = [0, 0, 0] }: GrassProps) {
  // Generate grass colors with natural variations
  const colors = useMemo(() => {
    const baseColor = new Color('#4a8505'); // Natural green base
    const tipColor = new Color('#90b825');  // Lighter green for tips
    
    return {
      base: baseColor.clone().multiplyScalar(0.8 + Math.random() * 0.4), // Darker base with variation
      tip: tipColor.clone().multiplyScalar(0.9 + Math.random() * 0.2)    // Lighter tip with variation
    };
  }, []);

  // Generate grass blade positions
  const bladePositions = useMemo(() => {
    const positions = [];
    const numBlades = 3;
    const radius = 0.1;

    for (let i = 0; i < numBlades; i++) {
      const angle = (i / numBlades) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * radius * Math.random(),
        z: Math.sin(angle) * radius * Math.random(),
        rotation: rotation[1] + Math.random() * 0.5 - 0.25,
        scale: 0.8 + Math.random() * 0.4
      });
    }
    return positions;
  }, [rotation]);

  return (
    <group position={[position.x, position.y, position.z]}>
      {bladePositions.map((blade, index) => (
        <group 
          key={index} 
          position={[blade.x, 0, blade.z]}
          rotation={[0, blade.rotation, 0]}
          scale={[blade.scale, blade.scale, blade.scale]}
        >
          {/* Base of the grass blade */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.02, 0.1, 0.01]} />
            <meshStandardMaterial color={colors.base} />
          </mesh>
          
          {/* Tip of the grass blade */}
          <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.015, 0.08, 0.008]} />
            <meshStandardMaterial color={colors.tip} />
          </mesh>
        </group>
      ))}
    </group>
  );
} 