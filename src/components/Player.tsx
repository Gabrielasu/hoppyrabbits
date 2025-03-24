import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { PlaceholderModel } from './PlaceholderModel';

// Movement constants
const MOVE_SPEED = 0.25;
const TURN_SPEED = 0.03;
const HOP_HEIGHT = 0.15;
const HOP_SPEED = 12;

// Match the keyboard map from Game.tsx
type Controls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
};

export function Player() {
  const modelRef = useRef<THREE.Group>();
  const { camera } = useThree();
  const hopProgress = useRef(0);
  const isMoving = useRef(false);
  const positionRef = useRef(new THREE.Vector3());
  const lastHopTime = useRef(0);
  
  // Get keyboard controls
  const [, getKeys] = useKeyboardControls<Controls>();
  
  // Get game state
  const position = useGameStore((state) => state.position);
  const updatePosition = useGameStore((state) => state.updatePosition);
  const updateRotation = useGameStore((state) => state.updateRotation);
  const rotation = useGameStore((state) => state.rotation);
  const hasSpeedBoost = useGameStore((state) => state.hasSpeedBoost);

  // Keep local reference of position updated
  positionRef.current.copy(position);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const keys = getKeys();
    const moveVector = new THREE.Vector3();
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    // Calculate right vector
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    
    // Handle movement relative to camera
    if (keys.forward) moveVector.add(cameraDirection);
    if (keys.backward) moveVector.sub(cameraDirection);
    if (keys.left) moveVector.sub(rightVector);
    if (keys.right) moveVector.add(rightVector);
    
    // Normalize and apply movement
    if (moveVector.length() > 0) {
      moveVector.normalize();
      const currentSpeed = MOVE_SPEED * (keys.shift || hasSpeedBoost ? 2 : 1);
      moveVector.multiplyScalar(currentSpeed);
      
      // Update position using ref
      positionRef.current.add(moveVector);
      updatePosition(
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z
      );
      
      // Update rotation to face movement direction
      const angle = Math.atan2(moveVector.x, moveVector.z);
      updateRotation(angle);
      
      isMoving.current = true;
    } else {
      isMoving.current = false;
      hopProgress.current = 0;
    }
    
    // Apply hopping animation
    if (isMoving.current) {
      const currentTime = state.clock.getElapsedTime();
      hopProgress.current += delta * HOP_SPEED;
      
      // Reset hop progress and update last hop time
      if (hopProgress.current >= 1) {
        hopProgress.current = 0;
        lastHopTime.current = currentTime;
      }
      
      // Calculate hop height with smooth transition
      const hopOffset = Math.sin(hopProgress.current * Math.PI) * HOP_HEIGHT;
      
      // Apply hop to the body
      const bodyGroup = modelRef.current.children[1];
      if (bodyGroup) {
        bodyGroup.position.y = hopOffset;
        
        // Add slight tilt based on hop progress
        const tiltAmount = 0.1; // Maximum tilt in radians
        bodyGroup.rotation.x = Math.sin(hopProgress.current * Math.PI * 2) * tiltAmount;
      }
    } else {
      // Reset body position and rotation when not moving
      const bodyGroup = modelRef.current.children[1];
      if (bodyGroup) {
        bodyGroup.position.y = 0;
        bodyGroup.rotation.x = 0;
      }
    }
    
    // Update model position and rotation
    modelRef.current.position.x = positionRef.current.x;
    modelRef.current.position.z = positionRef.current.z;
    modelRef.current.rotation.y = rotation;
  });

  return (
    <group
      ref={modelRef}
      position={[positionRef.current.x, 0, positionRef.current.z]}
      rotation={[0, rotation + Math.PI, 0]}
    >
      {/* Static parts (ears, face) */}
      <group>
        <PlaceholderModel
          color="#F5F5F5"
          scale={1}
          isStatic={true}
        />
      </group>

      {/* Dynamic parts (body and paws) that hop together */}
      <group>
        <PlaceholderModel
          color="#F5F5F5"
          scale={1}
          isStatic={false}
        />
      </group>
    </group>
  );
} 