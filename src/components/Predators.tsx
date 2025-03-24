import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

interface Coyote {
  id: string;
  position: THREE.Vector3;
  rotation: number;
  state: 'patrolling' | 'chasing' | 'retreating';
  targetPosition: THREE.Vector3;
  patrolPoint: THREE.Vector3;
  speed: number;
  lastStateChange: number;
}

export function Predators() {
  const [coyotes, setCoyotes] = useState<Coyote[]>([]);
  const playerPosition = useGameStore((state) => state.position);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const gameOver = useGameStore((state) => state.gameOver);

  // Spawn coyotes periodically
  useEffect(() => {
    const spawnCoyote = () => {
      if (coyotes.length >= 3) return;

      const angle = Math.random() * Math.PI * 2;
      const radius = 40;
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );

      const coyote: Coyote = {
        id: Math.random().toString(36).substr(2, 9),
        position: position.clone(),
        rotation: angle,
        state: 'patrolling',
        targetPosition: position.clone(),
        patrolPoint: position.clone(),
        speed: 5 + Math.random() * 2,
        lastStateChange: 0
      };
      
      setCoyotes(prev => [...prev, coyote]);
    };

    // Spawn initial coyotes
    const initialSpawn = setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        spawnCoyote();
      }
    }, 5000);
    
    const spawnInterval = setInterval(spawnCoyote, 30000);

    return () => {
      clearTimeout(initialSpawn);
      clearInterval(spawnInterval);
    };
  }, []);

  // Update coyote behavior
  useFrame((state, delta) => {
    if (gameOver) return;

    setCoyotes(prev => prev.map(coyote => {
      const coyotePos = coyote.position.clone();
      const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
      const distanceToPlayer = coyotePos.distanceTo(playerPos);
      const currentTime = state.clock.getElapsedTime();
      
      switch (coyote.state) {
        case 'patrolling': {
          // Move towards patrol point
          const distanceToTarget = coyotePos.distanceTo(coyote.targetPosition);
          
          if (distanceToTarget < 1) {
            // Set new random patrol point
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 10;
            coyote.targetPosition = new THREE.Vector3(
              coyote.patrolPoint.x + Math.cos(angle) * radius,
              0,
              coyote.patrolPoint.z + Math.sin(angle) * radius
            );
          }

          // Start chasing if player is close
          if (distanceToPlayer < 15) {
            coyote.state = 'chasing';
            coyote.lastStateChange = currentTime;
          }

          // Move towards target
          const direction = coyote.targetPosition.clone().sub(coyotePos).normalize();
          coyote.position.add(direction.multiplyScalar(coyote.speed * 0.5 * delta));
          coyote.rotation = Math.atan2(direction.x, direction.z);
          break;
        }

        case 'chasing': {
          // Chase player
          const direction = playerPos.clone().sub(coyotePos).normalize();
          coyote.position.add(direction.multiplyScalar(coyote.speed * delta));
          coyote.rotation = Math.atan2(direction.x, direction.z);

          // Damage player if caught
          if (distanceToPlayer < 1.5) {
            takeDamage(20);
            coyote.state = 'retreating';
            coyote.lastStateChange = currentTime;
          }

          // Give up chase if player is too far
          if (distanceToPlayer > 20) {
            coyote.state = 'retreating';
            coyote.lastStateChange = currentTime;
          }
          break;
        }

        case 'retreating': {
          // Move back to patrol point
          const direction = coyote.patrolPoint.clone().sub(coyotePos).normalize();
          coyote.position.add(direction.multiplyScalar(coyote.speed * 0.7 * delta));
          coyote.rotation = Math.atan2(direction.x, direction.z);

          // Resume patrolling when close to patrol point
          if (coyotePos.distanceTo(coyote.patrolPoint) < 2) {
            coyote.state = 'patrolling';
            coyote.lastStateChange = currentTime;
          }
          break;
        }
      }
      
      return coyote;
    }));
  });

  return (
    <group>
      {coyotes.map(coyote => (
        <group
          key={coyote.id}
          position={coyote.position}
          rotation={[0, coyote.rotation, 0]}
        >
          {/* Coyote body */}
          <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
            <boxGeometry args={[1.2, 0.8, 2]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          
          {/* Coyote head */}
          <mesh castShadow receiveShadow position={[0, 1, 0.8]}>
            <boxGeometry args={[0.6, 0.6, 0.8]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>

          {/* Coyote legs */}
          <mesh castShadow receiveShadow position={[0.4, 0.4, 0.5]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.4, 0.4, 0.5]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          <mesh castShadow receiveShadow position={[0.4, 0.4, -0.5]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.4, 0.4, -0.5]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>

          {/* Coyote tail */}
          <mesh castShadow receiveShadow position={[0, 0.8, -1]}>
            <boxGeometry args={[0.2, 0.2, 0.8]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
        </group>
      ))}
    </group>
  );
} 