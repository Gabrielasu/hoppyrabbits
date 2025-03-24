import { useMemo } from 'react';
import { Color } from 'three';

interface BushProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function Bush({ position, scale = 1, rotation = [0, 0, 0] }: BushProps) {
  const variation = useMemo(() => ({
    baseRadius: 0.5 + Math.random() * 0.3,
    height: 0.8 + Math.random() * 0.4,
    segments: 8
  }), []);

  const colors = useMemo(() => ({
    base: new Color('#2d5a27').multiplyScalar(0.8 + Math.random() * 0.4),
    highlight: new Color('#355e20').multiplyScalar(0.9 + Math.random() * 0.2)
  }), []);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Main bush body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry 
          args={[
            variation.baseRadius,
            variation.segments,
            variation.segments
          ]} 
        />
        <meshStandardMaterial
          color={colors.base}
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* Additional foliage details */}
      {Array.from({ length: 4 }).map((_, index) => {
        const angle = (index / 4) * Math.PI * 2;
        const radius = variation.baseRadius * 0.4;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              variation.height * 0.3,
              Math.sin(angle) * radius
            ]}
            scale={[0.7, 0.7, 0.7]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[variation.baseRadius * 0.6, variation.segments, variation.segments]} />
            <meshStandardMaterial
              color={colors.highlight}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
} 