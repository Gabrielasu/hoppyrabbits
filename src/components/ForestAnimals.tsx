import React, { useRef } from 'react';
import * as THREE from 'three';
import { Color } from 'three';

interface AnimalModelProps {
  color: string;
}

export const DeerModel: React.FC<AnimalModelProps> = ({ color }) => {
  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Neck */}
      <mesh castShadow receiveShadow position={[0, 1.6, 0.4]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 2.0, 0.6]}>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Antlers */}
      <group position={[0, 2.2, 0.5]}>
        {/* Left antler */}
        <mesh castShadow receiveShadow position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Right antler */}
        <mesh castShadow receiveShadow position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh castShadow receiveShadow position={[0.3, 0.5, 0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.3, 0.5, 0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.3, 0.5, -0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.3, 0.5, -0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Tail */}
      <mesh castShadow receiveShadow position={[0, 1.2, -0.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};

export const SquirrelModel: React.FC<AnimalModelProps> = ({ color }) => {
  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0.15]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Eyes */}
      <mesh castShadow receiveShadow position={[0.08, 0.55, 0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.08, 0.55, 0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nose */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0.3]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Tail */}
      <mesh castShadow receiveShadow position={[0, 0.3, -0.3]} rotation={[Math.PI / 4, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export const FoxModel: React.FC<AnimalModelProps> = ({ color }) => {
  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0.4]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Eyes */}
      <mesh castShadow receiveShadow position={[0.1, 0.65, 0.5]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.1, 0.65, 0.5]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nose */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0.6]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Ears */}
      <mesh castShadow receiveShadow position={[0.15, 0.8, 0.4]} rotation={[0.2, 0.2, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.15, 0.8, 0.4]} rotation={[0.2, -0.2, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      <mesh castShadow receiveShadow position={[0.2, 0.2, 0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.2, 0.2, 0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.2, -0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.2, 0.2, -0.2]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Tail */}
      <mesh castShadow receiveShadow position={[0, 0.4, -0.4]} rotation={[Math.PI / 4, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.6, -0.6]} rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export function HedgehogModel({ color }: AnimalModelProps) {
  const bodyColor = new Color(color).multiplyScalar(0.9);
  const spikeColor = new Color(color).multiplyScalar(1.1);
  
  return (
    <group>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.2, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0.3, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Spikes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI * 0.1) * 0.25,
            0.2 + Math.random() * 0.1,
            Math.sin(i * Math.PI * 0.1) * 0.25
          ]}
          rotation={[
            Math.random() * 0.5,
            Math.random() * Math.PI * 2,
            Math.random() * 0.5
          ]}
          castShadow
        >
          <coneGeometry args={[0.03, 0.15, 4]} />
          <meshStandardMaterial color={spikeColor} />
        </mesh>
      ))}
    </group>
  );
}

export function RaccoonModel({ color }: AnimalModelProps) {
  const bodyColor = new Color(color);
  const maskColor = new Color('#333333');
  
  return (
    <group>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.3, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Mask */}
      <mesh position={[0.35, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={maskColor} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[0.25, 0.5, 0.15]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.25, 0.5, -0.15]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, Math.PI * 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
    </group>
  );
}

export function OwlModel({ color }: AnimalModelProps) {
  const bodyColor = new Color(color);
  const eyeColor = new Color('#FFD700');
  
  return (
    <group>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.1, 0.45, 0.15]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.1, 0.45, -0.15]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0.2, 0.35, 0]} rotation={[0, 0, -Math.PI * 0.1]} castShadow>
        <coneGeometry args={[0.05, 0.15, 16]} />
        <meshStandardMaterial color="#FFB90F" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, 0.2, 0.3]} rotation={[0, 0, -Math.PI * 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 0.2, -0.3]} rotation={[0, 0, -Math.PI * 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
    </group>
  );
}

export function BeaverModel({ color }: AnimalModelProps) {
  const bodyColor = new Color(color);
  const tailColor = new Color(color).multiplyScalar(0.8);
  
  return (
    <group>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.4, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0.55, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, Math.PI * 0.1]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color={tailColor} />
      </mesh>
      
      {/* Front teeth */}
      <mesh position={[0.5, 0.15, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      <mesh position={[0.5, 0.15, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
    </group>
  );
} 