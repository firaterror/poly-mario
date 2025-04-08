'use client';

import { useEffect, useState } from 'react';
import GameScene from '@/components/game/GameScene';
import NamePrompt from '@/components/game/NamePrompt';
import PlayerNameDisplay from '@/components/game/PlayerNameDisplay';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { speed, lapCount, bestLapTime, currentLapTime } = useGameStore();
  const [startTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (speed > 0) {
        useGameStore.getState().setCurrentLapTime(Date.now() - startTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [speed, startTime]);

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  return (
    <main className="relative w-full h-screen">
      <NamePrompt />
      <PlayerNameDisplay />
      <GameScene />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white font-bold text-xl">
        <div>Speed: {Math.round(speed * 100)} km/h</div>
        <div>Lap: {lapCount}</div>
        <div>Time: {formatTime(currentLapTime)}s</div>
        <div>Best: {formatTime(bestLapTime)}s</div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 text-white font-bold text-xl">
        <div>W - Accelerate</div>
        <div>S - Brake/Reverse</div>
        <div>A/D - Turn Left/Right</div>
        <div>Space - Jump</div>
      </div>
    </main>
  );
}
