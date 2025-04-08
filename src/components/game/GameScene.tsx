'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import { useGameStore } from '@/store/gameStore';

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
          
          <SceneContent showControls={!isGameStarted} />
          <Stats />
        </Suspense>
      </Canvas>
    </div>
  );
}

// This component will be loaded dynamically to avoid SSR issues with Three.js
function SceneContent({ showControls }: { showControls: boolean }) {
  // Use dynamic import using React.lazy
  const Kart = require('./Kart').default;
  const Track = require('./Track').default;
  const Environment = require('./Environment').default;

  return (
    <>
      <Environment />
      <Track />
      <Kart />
      {showControls && <OrbitControls />}
    </>
  );
} 