import { create } from 'zustand';

interface GameStore {
  speed: number;
  setSpeed: (speed: number) => void;
  lapCount: number;
  setLapCount: (count: number) => void;
  currentLapTime: number;
  setCurrentLapTime: (time: number) => void;
  bestLapTime: number;
  setBestLapTime: (time: number) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  isGameStarted: boolean;
  setIsGameStarted: (started: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  speed: 0,
  setSpeed: (speed) => set({ speed }),
  lapCount: 0,
  setLapCount: (count) => set({ lapCount: count }),
  currentLapTime: 0,
  setCurrentLapTime: (time) => set({ currentLapTime: time }),
  bestLapTime: Infinity,
  setBestLapTime: (time) => set({ bestLapTime: time }),
  playerName: '',
  setPlayerName: (name) => set({ playerName: name }),
  isGameStarted: false,
  setIsGameStarted: (started) => set({ isGameStarted: started }),
})); 