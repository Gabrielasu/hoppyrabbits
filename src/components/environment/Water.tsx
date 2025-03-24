import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshPhongMaterial, Vector3 } from 'three';

interface WaterProps {
  position?: Vector3;
  scale?: Vector3;
  level?: number;
}

export function Water({ position = new Vector3(0, 0, 0), scale = new Vector3(1000, 1, 1000), level = 0 }: WaterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<MeshPhongMaterial>(null);

  // Create water geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 8, 8);
    const pos = geo.attributes.position;
    const vertices = [];
    
    // Store original positions for animation
    for (let i = 0; i < pos.count; i++) {
      vertices.push([
        pos.getX(i),
        pos.getY(i),
        pos.getZ(i)
      ]);
    }
    
    return { geo, vertices };
  }, []);

  // Animate water
  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();
    const pos = geometry.geo.attributes.position;

    // Update vertices with subtle wave animation
    for (let i = 0; i < pos.count; i++) {
      const [x, y, z] = geometry.vertices[i];
      pos.setZ(
        i,
        z + Math.sin(x * 5 + time * 2) * 0.02 +
        Math.cos(y * 5 + time * 2) * 0.02
      );
    }

    pos.needsUpdate = true;
    geometry.geo.computeVertexNormals();

    // Animate material opacity
    materialRef.current.opacity = 0.6 + Math.sin(time * 2) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      scale={scale}
      receiveShadow
    >
      <primitive object={geometry.geo} />
      <meshPhongMaterial
        ref={materialRef}
        color="#2c6d8c"
        transparent
        opacity={0.7}
        shininess={30}
        specular={new THREE.Color('#ffffff')}
      />
    </mesh>
  );
} 