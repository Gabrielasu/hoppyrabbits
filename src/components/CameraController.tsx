import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// Camera configuration
const CAMERA_HEIGHT = 2;
const CAMERA_DISTANCE = 5;
const CAMERA_LAG = 0.1;

export function CameraController() {
  const { camera } = useThree();
  const playerPosition = useGameStore((state) => state.position);
  const playerRotation = useGameStore((state) => state.rotation);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    // Create a direction vector pointing in the direction the player is facing
    const direction = new THREE.Vector3();
    direction.setFromSphericalCoords(1, Math.PI / 2, playerRotation);

    // Calculate camera position by moving backwards from player position
    targetPosition.current.copy(playerPosition);
    targetPosition.current.y += CAMERA_HEIGHT;
    targetPosition.current.sub(direction.multiplyScalar(CAMERA_DISTANCE));

    // Smoothly move camera
    currentPosition.current.lerp(targetPosition.current, CAMERA_LAG);
    camera.position.copy(currentPosition.current);

    // Look at player position
    camera.lookAt(
      playerPosition.x,
      playerPosition.y + 1, // Look slightly above player
      playerPosition.z
    );
  });

  return null;
} 