'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import { useGameStore } from '@/store/gameStore';
import dynamic from 'next/dynamic';

// Dynamically import components with SSR disabled
const Kart = dynamic(() => import('./Kart'), { ssr: false });
const Track = dynamic(() => import('./Track'), { ssr: false });
const Environment = dynamic(() => import('./Environment'), { ssr: false });

export default function GameScene() {
  const { isGameStarted } = useGameStore();

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 30, 40], fov: 50 }}
        className="bg-gradient-to-b from-sky-400 to-sky-600"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[50, 100, 50]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={150}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          
          <Environment />
          <Track />
          <Kart />
          {!isGameStarted && <OrbitControls />}
          <Stats />
        </Suspense>
      </Canvas>
    </div>
  );
} 