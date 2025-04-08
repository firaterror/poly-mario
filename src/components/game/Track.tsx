import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';

// Map size defines how large the overall track area is
export const mapSize = 100;

// Define the track points for the center of the track
export const trackPoints = [
  new THREE.Vector3(0, 0, -30),
  new THREE.Vector3(30, 0, -20),
  new THREE.Vector3(40, 0, 0),
  new THREE.Vector3(30, 0, 20),
  new THREE.Vector3(0, 0, 30),
  new THREE.Vector3(-30, 0, 20),
  new THREE.Vector3(-40, 0, 0),
  new THREE.Vector3(-30, 0, -20),
];

// Track width (from center to edge)
const trackWidth = 10;

export default function Track() {
  const trackRef = useRef<THREE.Group>(null);
  const { setLapCount, setBestLapTime, currentLapTime } = useGameStore();
  const checkpointTriggered = useRef(false);

  // Create a CatmullRomCurve3 from the track points
  const curve = useMemo(() => {
    const closedCurve = new THREE.CatmullRomCurve3([
      ...trackPoints,
      trackPoints[0], // Connect back to start
    ]);
    closedCurve.closed = true;
    return closedCurve;
  }, []);

  // Generate track geometry with inner and outer edges
  const trackGeometry = useMemo(() => {
    const points = curve.getPoints(100);
    const trackShape = new THREE.Shape();
    
    // Create inner and outer track edges
    const innerPoints: THREE.Vector3[] = [];
    const outerPoints: THREE.Vector3[] = [];
    
    // For each point on the curve, calculate inner and outer points
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const tangent = curve.getTangent(i / (points.length - 1));
      
      // Calculate normal vector (perpendicular to tangent)
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      
      // Create inner and outer track points
      const inner = point.clone().add(normal.clone().multiplyScalar(-trackWidth));
      innerPoints.push(inner);
      
      // For the outer points we won't use them for rendering, so no need to store
      // Just calculate it if necessary for other operations
    }
    
    // Start shape with first inner point
    trackShape.moveTo(innerPoints[0].x, innerPoints[0].z);
    
    // Add the inner edge
    for (let i = 1; i < innerPoints.length; i++) {
      trackShape.lineTo(innerPoints[i].x, innerPoints[i].z);
    }
    
    // Add the outer edge (going backwards to create a loop)
    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      const tangent = curve.getTangent(i / (points.length - 1));
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const outer = point.clone().add(normal.clone().multiplyScalar(trackWidth));
      trackShape.lineTo(outer.x, outer.z);
    }
    
    const geometry = new THREE.ShapeGeometry(trackShape);
    return geometry;
  }, [curve]);

  // Check if player has completed a lap
  useFrame(() => {
    // Logic for lap counting...
  });

  return (
    <group ref={trackRef}>
      {/* Track surface */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <primitive object={trackGeometry} attach="geometry" />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>

      {/* Dirt under the track */}
      <mesh 
        position={[0, -0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[mapSize, mapSize]} />
        <meshStandardMaterial color="#765c48" roughness={1} />
      </mesh>

      {/* Ground plane (grass) */}
      <mesh 
        position={[0, -0.2, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[mapSize * 2, mapSize * 2]} />
        <meshStandardMaterial color="#7cba3b" roughness={0.8} />
      </mesh>
    </group>
  );
} 