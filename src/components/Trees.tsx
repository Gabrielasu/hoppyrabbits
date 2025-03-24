const Tree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Foliage */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#2D5A27" />
      </mesh>
    </group>
  );
}; 