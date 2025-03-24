import { useRef, useMemo } from 'react';
import { Vector3, Mesh, Color, Group, CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { createNoise2D } from 'simplex-noise';
import { Tree } from './environment/Tree';
import { Water } from './environment/Water';
import { Bush } from './environment/Bush';

// Constants for world generation
const CHUNK_SIZE = 32;
const VIEW_DISTANCE = 3;
const NOISE_SCALE = 120; // Even larger scale for more gradual terrain changes
const TREE_DENSITY = 0.012; // Slightly increased tree density
const BUSH_DENSITY = 0.015; // Slightly increased bush density
const MIN_TREE_SPACING = 6; // Reduced spacing to allow more trees

// Colors for terrain
const GRASS_COLOR = new Color('#2d5a27'); // Darker grass
const DIRT_COLOR = new Color('#3c2f22');

interface Chunk {
  x: number;
  z: number;
  heightMap: Float32Array;
  trees: { position: Vector3; scale: number; rotation: number }[];
  bushes: { position: Vector3; scale: number; rotation: number }[];
}

// Helper function to check if a position is too close to existing trees
const isTooCloseToOtherTrees = (
  x: number,
  z: number,
  trees: { position: Vector3; scale: number; rotation: number }[]
): boolean => {
  return trees.some(tree => {
    const dx = tree.position.x - x;
    const dz = tree.position.z - z;
    return Math.sqrt(dx * dx + dz * dz) < MIN_TREE_SPACING;
  });
};

// Tree generation with shadows
const generateTree = (x: number, z: number, scale: number = 1) => {
  const treeGroup = new Group();
  treeGroup.userData.isTree = true; // Mark as tree for collision detection
  
  // Trunk
  const trunk = new Mesh(
    new CylinderGeometry(0.2 * scale, 0.3 * scale, 2 * scale, 8),
    new MeshStandardMaterial({ color: '#3b2b15', roughness: 0.8 })
  );
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.position.set(0, 1 * scale, 0);
  treeGroup.add(trunk);

  // Leaves
  const leaves = new Mesh(
    new SphereGeometry(1 * scale, 8, 8),
    new MeshStandardMaterial({ 
      color: '#1a4d1a',
      roughness: 0.8,
      metalness: 0.1
    })
  );
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  leaves.position.set(0, 2.5 * scale, 0);
  treeGroup.add(leaves);

  treeGroup.position.set(x, 0, z);
  return treeGroup;
};

export function ProceduralForest() {
  const chunks = useRef<Map<string, Chunk>>(new Map());
  const terrain = useRef<Mesh>(null);
  const playerPosition = useGameStore((state) => state.position);
  const noise = useMemo(() => createNoise2D(), []);

  // Generate height for a given world position
  const getHeight = (x: number, z: number): number => {
    // Base terrain height (more subtle)
    const baseHeight = noise(x / NOISE_SCALE, z / NOISE_SCALE) * 0.5;
    
    // Add medium details (reduced intensity)
    const mediumDetail = noise(x / (NOISE_SCALE / 2), z / (NOISE_SCALE / 2)) * 0.2;
    
    // Add small details (very subtle)
    const smallDetail = noise(x / (NOISE_SCALE / 4), z / (NOISE_SCALE / 4)) * 0.05;
    
    return baseHeight + mediumDetail + smallDetail;
  };

  // Generate a new chunk at the given chunk coordinates
  const generateChunk = (chunkX: number, chunkZ: number): Chunk => {
    const heightMap = new Float32Array(CHUNK_SIZE * CHUNK_SIZE);
    const trees: Chunk['trees'] = [];
    const bushes: Chunk['bushes'] = [];

    // Generate height map and features
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const worldX = chunkX * CHUNK_SIZE + x;
        const worldZ = chunkZ * CHUNK_SIZE + z;
        const height = getHeight(worldX, worldZ);
        heightMap[z * CHUNK_SIZE + x] = height;

        // Add vegetation
        const treeRoll = Math.random();
        if (treeRoll < TREE_DENSITY && !isTooCloseToOtherTrees(x, z, trees)) {
          // More consistent tree sizes
          const treeSize = 1.5 + Math.random() * 0.5;
          trees.push({
            position: new Vector3(x, height, z),
            scale: treeSize,
            rotation: Math.random() * Math.PI * 2
          });

          // Add fewer bushes around trees
          if (Math.random() < 0.4) { // Reduced chance of bush clusters
            const bushCount = Math.floor(Math.random() * 2) + 1; // 1-2 bushes instead of 1-3
            for (let i = 0; i < bushCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = 1.5 + Math.random(); // Slightly larger spacing
              bushes.push({
                position: new Vector3(
                  x + Math.cos(angle) * distance,
                  height,
                  z + Math.sin(angle) * distance
                ),
                scale: 0.5 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2
              });
            }
          }
        } else if (Math.random() < BUSH_DENSITY) {
          // Standalone bushes
          bushes.push({
            position: new Vector3(x, height, z),
            scale: 0.6 + Math.random() * 0.3,
            rotation: Math.random() * Math.PI * 2
          });
        }
      }
    }

    return { x: chunkX, z: chunkZ, heightMap, trees, bushes };
  };

  // Update visible chunks based on player position
  useFrame(() => {
    const currentChunkX = Math.floor(playerPosition.x / CHUNK_SIZE);
    const currentChunkZ = Math.floor(playerPosition.z / CHUNK_SIZE);

    // Generate or update chunks in view distance
    for (let dx = -VIEW_DISTANCE; dx <= VIEW_DISTANCE; dx++) {
      for (let dz = -VIEW_DISTANCE; dz <= VIEW_DISTANCE; dz++) {
        const chunkX = currentChunkX + dx;
        const chunkZ = currentChunkZ + dz;
        const key = `${chunkX},${chunkZ}`;

        if (!chunks.current.has(key)) {
          chunks.current.set(key, generateChunk(chunkX, chunkZ));
        }
      }
    }

    // Remove chunks that are too far away
    chunks.current.forEach((chunk, key) => {
      const [x, z] = key.split(',').map(Number);
      if (
        Math.abs(x - currentChunkX) > VIEW_DISTANCE ||
        Math.abs(z - currentChunkZ) > VIEW_DISTANCE
      ) {
        chunks.current.delete(key);
      }
    });
  });

  return (
    <group>
      {/* Base ground plane for consistent color */}
      <mesh
        receiveShadow
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial 
          color={GRASS_COLOR}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {Array.from(chunks.current.values()).map((chunk) => (
        <group key={`${chunk.x},${chunk.z}`} position={[chunk.x * CHUNK_SIZE, 0, chunk.z * CHUNK_SIZE]}>
          {/* Terrain */}
          <mesh 
            receiveShadow
            position={[CHUNK_SIZE / 2, 0, CHUNK_SIZE / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry 
              args={[CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE - 1, CHUNK_SIZE - 1]} 
              onUpdate={(geometry) => {
                const positions = geometry.attributes.position.array as Float32Array;
                for (let i = 0; i < positions.length; i += 3) {
                  const x = Math.floor((i / 3) % CHUNK_SIZE);
                  const z = Math.floor((i / 3) / CHUNK_SIZE);
                  positions[i + 1] = chunk.heightMap[z * CHUNK_SIZE + x];
                }
                geometry.computeVertexNormals();
              }}
            />
            <meshStandardMaterial
              color={GRASS_COLOR}
              roughness={1}
              metalness={0}
            />
          </mesh>

          {/* Trees */}
          {chunk.trees.map((tree, index) => (
            <Tree
              key={`tree-${chunk.x}-${chunk.z}-${index}`}
              position={[
                tree.position.x,
                tree.position.y,
                tree.position.z
              ] as [number, number, number]}
              scale={tree.scale}
              rotation={[0, tree.rotation, 0]}
            />
          ))}

          {/* Bushes */}
          {chunk.bushes.map((bush, index) => (
            <Bush
              key={`bush-${chunk.x}-${chunk.z}-${index}`}
              position={[
                bush.position.x,
                bush.position.y,
                bush.position.z
              ] as [number, number, number]}
              scale={bush.scale}
              rotation={[0, bush.rotation, 0]}
            />
          ))}
        </group>
      ))}
    </group>
  );
} 