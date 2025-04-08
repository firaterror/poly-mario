import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
import React from 'react';

interface CloudProps {
  position: [number, number, number];
  scale: number;
}

interface CloudGroupProps {
  position: [number, number, number];
  count: number;
  spread: number;
}

export default function Environment() {
  const envRef = useRef<THREE.Group>(null);

  return (
    <group ref={envRef}>
      {/* Sky with sun */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.49}
        azimuth={0.25}
        rayleigh={1}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Directional light for sun */}
      <directionalLight
        position={[50, 100, -50]}
        intensity={1.2}
        castShadow
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ambient light to brighten shadows */}
      <ambientLight intensity={0.6} />
      
      {/* Hemisphere light to add sky color to scene */}
      <hemisphereLight args={["#87CEEB", "#7CBA45", 0.4]} />
      
      {/* Custom clouds */}
      <CloudGroup position={[0, 80, -100]} count={10} spread={150} />
    </group>
  );
}

// Cloud component
const Cloud = React.memo(function Cloud({ position = [0, 0, 0], scale = 1 }: CloudProps) {
  return (
    <group position={[position[0], position[1], position[2]]} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[3, -1, 0]} castShadow>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[-3, -1, 0]} castShadow>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[0, -1, 3]} castShadow>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
    </group>
  );
});

// CloudGroup component for grouping clouds
const CloudGroup = React.memo(function CloudGroup({ position = [0, 0, 0], count = 8, spread = 100 }: CloudGroupProps) {
  const clouds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * spread;
      const scale = 0.8 + Math.random() * 1.2;
      
      return { position: [x, y, z] as [number, number, number], scale, key: i };
    });
  }, [count, spread]);

  return (
    <group position={[position[0], position[1], position[2]]}>
      {clouds.map((cloud) => (
        <Cloud key={cloud.key} position={cloud.position} scale={cloud.scale} />
      ))}
    </group>
  );
}); 