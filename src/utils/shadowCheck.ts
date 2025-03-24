import * as THREE from 'three';

const TREE_SHADOW_RADIUS = 3; // 3 units radius for tree shadows
const BUSH_SHADOW_RADIUS = 1.5; // 1.5 units radius for bush shadows

// Helper function to check if a point is within a circular shadow area
function isWithinShadowArea(position: THREE.Vector3, center: THREE.Vector3, radius: number): boolean {
  const distance = position.distanceTo(center);
  return distance <= radius;
}

// Helper function to check if a point is in shadow
export function isInShadow(position: THREE.Vector3, trees: THREE.Vector3[], bushes: THREE.Vector3[]): boolean {
  // Check tree shadows
  for (const treePos of trees) {
    if (isWithinShadowArea(position, treePos, TREE_SHADOW_RADIUS)) {
      return true;
    }
  }

  // Check bush shadows
  for (const bushPos of bushes) {
    if (isWithinShadowArea(position, bushPos, BUSH_SHADOW_RADIUS)) {
      return true;
    }
  }

  return false;
}

// Function to find nearest shadow position
export function findNearestShadow(position: THREE.Vector3, trees: THREE.Vector3[], bushes: THREE.Vector3[]): THREE.Vector3 {
  let nearestDistance = Infinity;
  let nearestPosition = position.clone();

  // Check trees first (bigger shadows)
  for (const treePos of trees) {
    const distance = position.distanceTo(treePos);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      // Calculate position at the edge of tree shadow
      const direction = new THREE.Vector3().subVectors(position, treePos).normalize();
      nearestPosition = treePos.clone().add(direction.multiplyScalar(TREE_SHADOW_RADIUS * 0.9));
    }
  }

  // Check bushes
  for (const bushPos of bushes) {
    const distance = position.distanceTo(bushPos);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      // Calculate position at the edge of bush shadow
      const direction = new THREE.Vector3().subVectors(position, bushPos).normalize();
      nearestPosition = bushPos.clone().add(direction.multiplyScalar(BUSH_SHADOW_RADIUS * 0.9));
    }
  }

  return nearestPosition;
} 