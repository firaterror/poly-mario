import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function NamePrompt() {
  const [isVisible, setIsVisible] = useState(true);
  const { setPlayerName, setIsGameStarted } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('playerName') as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
      setPlayerName(name);
      setIsGameStarted(true);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#eee',
        borderRadius: '2px',
        padding: '10px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center'
        }}>Your Name</h2>
        <form onSubmit={handleSubmit} style={{ width: '200px' }}>
          <input
            type="text"
            name="playerName"
            style={{
              width: '100%',
              padding: '5px',
              marginBottom: '5px',
              border: '1px solid #ccc'
            }}
            placeholder="Your name"
            autoFocus
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#eee',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            Start Racing!
          </button>
        </form>
      </div>
    </div>
  );
} 