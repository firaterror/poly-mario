import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PlayerNameDisplay() {
  const { playerName } = useGameStore();
  const [top, setTop] = useState('150px');

  useEffect(() => {
    // Calculate the best position based on viewport size
    const calculatePosition = () => {
      const height = window.innerHeight;
      // Position the name tag above the kart
      const idealPos = Math.round(height * 0.45);
      setTop(`${idealPos}px`);
    };

    // Calculate initial position
    calculatePosition();

    // Update on resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, []);

  if (!playerName) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top,
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '5px 10px',
        borderRadius: '5px',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1000
      }}
    >
      {playerName}
    </div>
  );
} 