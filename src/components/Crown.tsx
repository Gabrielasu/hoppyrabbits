import React from 'react';

export const Crown: React.FC = () => {
  // Crown base dimensions for reference
  const baseHeight = 0.12;
  const baseTopRadius = 0.15;
  const baseBottomRadius = 0.18;

  return (
    <group position={[0, 0.65, 0]}>
      <group>
        {/* Crown base */}
        <mesh>
          <cylinderGeometry args={[baseTopRadius, baseBottomRadius, baseHeight, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Crown points - directly connected to the top edge of base */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <mesh position={[baseTopRadius * 0.85, baseHeight / 2, 0]}>
              <coneGeometry args={[0.025, 0.15, 16]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        
        {/* Crown jewels - embedded in the base */}
        {/* Center top jewel - sits in a slight depression at the top */}
        <mesh position={[0, baseHeight / 2 + 0.01, 0]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#FF0000" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Side jewels - embedded in the cylinder wall */}
        {[0, 120, 240].map((angle, i) => (
          <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <mesh position={[baseBottomRadius * 0.95, 0, 0]}>
              <sphereGeometry args={[0.02]} />
              <meshStandardMaterial color="#4169E1" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}; 