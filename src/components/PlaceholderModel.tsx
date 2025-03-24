import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Crown } from './Crown';

interface PlaceholderModelProps {
  color?: string;
  accessory?: string;
  scale?: number;
  isLopEared?: boolean;
  isStatic?: boolean;
  rotation?: [number, number, number];
}

const ACCESSORY_COLORS = {
  'Ninja Mask': '#2c3e50',
  'Crystal Necklace': '#9b59b6',
  'Racing Scarf': '#e74c3c',
  'Flower Crown': '#f1c40f',
  'Bow Tie': '#3498db',
  'Crown': '#f1c40f'
};

export function PlaceholderModel({ 
  color = '#ffffff', 
  accessory, 
  scale = 1,
  isLopEared = Math.random() > 0.5,
  isStatic = false,
  rotation = [0, 0, 0]
}: PlaceholderModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Ensure the group is properly initialized
    if (groupRef.current) {
      groupRef.current.matrixWorldNeedsUpdate = true;
      groupRef.current.updateMatrixWorld();
    }
  }, []);

  // Helper function to get accessory color
  const getAccessoryColor = (accessoryName: string) => {
    return ACCESSORY_COLORS[accessoryName as keyof typeof ACCESSORY_COLORS] || '#ffffff';
  };

  // Ensure scale is valid
  const validScale = typeof scale === 'number' && scale > 0 ? scale : 1;

  return (
    <group 
      ref={groupRef} 
      scale={[validScale, validScale, validScale]}
      rotation={rotation}
    >
      {/* Always render a base group even if isStatic is undefined */}
      <group>
        {!isStatic && (
          // Dynamic parts - body, head, face, tail, and paws move together
          <>
            {/* Main body */}
            <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* Head */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0.2]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* Face features */}
            {/* Nose */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0.38]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#ffb6c1" />
            </mesh>
            {/* Eyes */}
            <mesh castShadow receiveShadow position={[0.08, 0.55, 0.35]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.08, 0.55, 0.35]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            {/* White of the eyes */}
            <mesh castShadow receiveShadow position={[0.08, 0.55, 0.34]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.08, 0.55, 0.34]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Mouth */}
            <mesh castShadow receiveShadow position={[0, 0.45, 0.38]}>
              <boxGeometry args={[0.04, 0.02, 0.01]} />
              <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Paws */}
            <mesh castShadow receiveShadow position={[0.15, 0.1, 0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.15, 0.1, 0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.15, 0.1, -0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.15, 0.1, -0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* Tail */}
            <mesh castShadow receiveShadow position={[0, 0.2, -0.3]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </>
        )}

        {/* Always render ears regardless of isStatic */}
        {isLopEared ? (
          // Lop ears (drooping)
          <>
            <group position={[0.1, 0.65, 0.2]} rotation={[0.3, 0.2, Math.PI * 0.3]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.03, 0.25, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, -0.125, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
            <group position={[-0.1, 0.65, 0.2]} rotation={[0.3, -0.2, -Math.PI * 0.3]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.03, 0.25, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, -0.125, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
          </>
        ) : (
          // Regular upright ears
          <>
            <group position={[0.1, 0.65, 0.2]} rotation={[0.3, 0.2, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.03, 0.25, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.125, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
            <group position={[-0.1, 0.65, 0.2]} rotation={[0.3, -0.2, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.03, 0.25, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.125, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
          </>
        )}

        {/* Accessories */}
        {accessory && (
          <>
            {accessory === 'Crown' && <Crown />}
            {accessory === 'Ninja Mask' && (
              <mesh castShadow receiveShadow position={[0, 0.5, 0.25]}>
                <boxGeometry args={[0.25, 0.1, 0.1]} />
                <meshStandardMaterial color={getAccessoryColor('Ninja Mask')} />
              </mesh>
            )}
            {accessory === 'Crystal Necklace' && (
              <mesh castShadow receiveShadow position={[0, 0.35, 0.15]}>
                <octahedronGeometry args={[0.1]} />
                <meshStandardMaterial color={getAccessoryColor('Crystal Necklace')} metalness={0.8} roughness={0.2} />
              </mesh>
            )}
            {accessory === 'Racing Scarf' && (
              <mesh castShadow receiveShadow position={[0.15, 0.4, 0]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial color={getAccessoryColor('Racing Scarf')} />
              </mesh>
            )}
            {accessory === 'Flower Crown' && (
              <group position={[0, 0.7, 0.2]}>
                <mesh castShadow receiveShadow position={[0.15, 0, 0]}>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color={getAccessoryColor('Flower Crown')} />
                </mesh>
                <mesh castShadow receiveShadow position={[-0.15, 0, 0]}>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color={getAccessoryColor('Flower Crown')} />
                </mesh>
              </group>
            )}
            {accessory === 'Bow Tie' && (
              <mesh castShadow receiveShadow position={[0, 0.35, 0.25]}>
                <boxGeometry args={[0.2, 0.1, 0.05]} />
                <meshStandardMaterial color={getAccessoryColor('Bow Tie')} />
              </mesh>
            )}
          </>
        )}
      </group>
    </group>
  );
} 