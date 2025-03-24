import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, SphereGeometry, MeshStandardMaterial } from 'three';

interface Cloud {
  position: Vector3;
  scale: Vector3;
  rotation: number;
  speed: number;
}

const createCloud = () => {
  const group = new Group();
  const numPuffs = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numPuffs; i++) {
    const puff = new Mesh(
      new SphereGeometry(1, 8, 8),
      new MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.8,
        roughness: 1,
        metalness: 0
      })
    );
    
    puff.castShadow = true;
    puff.receiveShadow = true;
    
    // Random position within cloud
    puff.position.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 2
    );
    
    // Random scale
    const scale = 0.8 + Math.random() * 0.4;
    puff.scale.set(scale, scale * 0.6, scale);
    
    group.add(puff);
  }
  
  return group;
};

export function Clouds() {
  const cloudsRef = useRef<Group>(null);
  const clouds = useRef<Cloud[]>([]);
  
  // Initialize clouds if not already done
  if (clouds.current.length === 0) {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 30 + Math.random() * 20;
      
      clouds.current.push({
        position: new Vector3(
          Math.cos(angle) * radius,
          15 + Math.random() * 10,
          Math.sin(angle) * radius
        ),
        scale: new Vector3(
          3 + Math.random() * 2,
          1,
          3 + Math.random() * 2
        ),
        rotation: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3
      });
    }
  }
  
  // Update cloud positions
  useFrame((state, delta) => {
    if (!cloudsRef.current) return;
    
    clouds.current.forEach((cloud, i) => {
      const child = cloudsRef.current?.children[i];
      if (!child) return;
      
      // Move cloud
      cloud.position.x += Math.cos(cloud.rotation) * cloud.speed * delta;
      cloud.position.z += Math.sin(cloud.rotation) * cloud.speed * delta;
      
      // Wrap around edges
      const distance = cloud.position.length();
      if (distance > 60) {
        const angle = Math.atan2(cloud.position.z, cloud.position.x);
        cloud.position.x = Math.cos(angle) * 30;
        cloud.position.z = Math.sin(angle) * 30;
      }
      
      // Update cloud position and scale
      child.position.copy(cloud.position);
      child.scale.copy(cloud.scale);
      
      // Slowly rotate cloud
      child.rotation.y += delta * 0.1;
    });
  });

  return (
    <group ref={cloudsRef}>
      {clouds.current.map((_, i) => (
        <primitive key={i} object={createCloud()} />
      ))}
    </group>
  );
} 