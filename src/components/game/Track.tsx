import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Track path points for collision detection
export const trackPoints = [
  new THREE.Vector3(0, 0, 0),          // Start
  new THREE.Vector3(50, 0, 0),         // Right
  new THREE.Vector3(70, 0, -20),       // First curve
  new THREE.Vector3(70, 0, -50),       // Top right
  new THREE.Vector3(50, 0, -70),       // Second curve
  new THREE.Vector3(0, 0, -70),        // Top middle
  new THREE.Vector3(-50, 0, -70),      // Top left
  new THREE.Vector3(-70, 0, -50),      // Third curve
  new THREE.Vector3(-70, 0, -20),      // Left side
  new THREE.Vector3(-50, 0, 0),        // Fourth curve
  new THREE.Vector3(0, 0, 0),          // Back to start
];

export const wallHeight = 3; // Increased wall height
export const mapSize = 200; // Smaller map size
export const trackWidth = 20; // Width of the race track

export default function Track() {
  const trackRef = useRef<THREE.Group>(null);

  // Create boundary wall positions
  const boundaryWalls = useMemo(() => {
    return [
      // North wall
      { position: [0, wallHeight/2, -mapSize/2], scale: [mapSize, wallHeight, 5] },
      // South wall
      { position: [0, wallHeight/2, mapSize/2], scale: [mapSize, wallHeight, 5] },
      // East wall
      { position: [mapSize/2, wallHeight/2, 0], scale: [5, wallHeight, mapSize] },
      // West wall
      { position: [-mapSize/2, wallHeight/2, 0], scale: [5, wallHeight, mapSize] },
    ];
  }, []);

  // Create a curve from the points for the track
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(trackPoints, true);
  }, []);

  // Generate track geometry
  const trackShape = useMemo(() => {
    const segments = 100;
    const points = curve.getPoints(segments);
    const shape = new THREE.Shape();

    points.forEach((point, i) => {
      const tangent = curve.getTangent(i / segments);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const innerPoint = point.clone().add(normal.multiplyScalar(trackWidth / 2));
      const outerPoint = point.clone().add(normal.multiplyScalar(-trackWidth / 2));

      if (i === 0) {
        shape.moveTo(innerPoint.x, innerPoint.z);
      } else {
        shape.lineTo(innerPoint.x, innerPoint.z);
      }
    });

    // Complete the track shape
    points.reverse().forEach((point, i) => {
      const tangent = curve.getTangent(1 - i / segments);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const outerPoint = point.clone().add(normal.multiplyScalar(-trackWidth / 2));
      shape.lineTo(outerPoint.x, outerPoint.z);
    });

    shape.closePath();
    return shape;
  }, [curve]);

  return (
    <group ref={trackRef}>
      {/* Ground (grass area) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[mapSize, mapSize]} />
        <meshStandardMaterial 
          color="#7CBA45"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Track surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <shapeGeometry args={[trackShape]} />
        <meshStandardMaterial 
          color="#333333"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Boundary Walls */}
      {boundaryWalls.map((wall, index) => (
        <mesh
          key={`wall-${index}`}
          position={[wall.position[0], wall.position[1], wall.position[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wall.scale[0], wall.scale[1], wall.scale[2]]} />
          <meshStandardMaterial color="#8B4513" roughness={1} />
        </mesh>
      ))}
    </group>
  );
} 