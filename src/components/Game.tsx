import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { CameraController } from './CameraController';
import { ProceduralForest } from './ProceduralForest';
import { FruitBushes } from './environment/FruitBushes';
import { WildRabbits } from './WildRabbits';
import { Predators } from './Predators';
import { HealthBar } from './ui/HealthBar';
import { Toast } from './ui/Toast';
import { GameOver } from './GameOver';
import { Clouds } from './environment/Clouds';
import { useGameStore } from '../store/gameStore';

// Define keyboard controls map
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'shift', keys: ['ShiftLeft', 'ShiftRight'] }
];

// Environment colors
const GROUND_COLOR = '#4a8505'; // Natural forest green

export function Game() {
  const toastMessage = useGameStore((state) => state.toastMessage);
  const isGameOver = useGameStore((state) => state.isGameOver);

  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[100, 100, 100]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-camera-near={0.1}
            shadow-camera-far={500}
          />
          <Clouds />
          <CameraController />
          <Player />
          <ProceduralForest />
          <FruitBushes />
          <WildRabbits />
          <Predators />
          <mesh 
            receiveShadow 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]}
          >
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color={GROUND_COLOR} />
          </mesh>
        </Canvas>
      </KeyboardControls>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        pointerEvents: 'none',
        zIndex: 9999
      }}>
        <HealthBar />
      </div>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
          zIndex: 10000
        }}>
          <Toast 
            name={toastMessage.name} 
            fact={toastMessage.fact} 
          />
        </div>
      )}
      {isGameOver && <GameOver />}
    </>
  );
} 