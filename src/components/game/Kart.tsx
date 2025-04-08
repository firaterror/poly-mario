import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';
import { trackPoints, mapSize } from './Track';

// Preload the kart model
useGLTF.preload('/kart.glb');

export default function Kart() {
  const kartRef = useRef<THREE.Group>(null);
  const { scene: kartModel } = useGLTF('/kart.glb');
  const { speed, setSpeed, isGameStarted } = useGameStore();
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const jumpHeight = 2;
  const gravity = 0.1;
  const acceleration = 0.01;
  const maxSpeed = 0.5;
  const turnSpeed = 0.03;
  const { camera } = useThree();
  const kartSize = new THREE.Vector3(2, 1, 3); // Size of the kart for collision detection

  // Clone the model to avoid modifying the original
  useEffect(() => {
    if (kartRef.current) {
      const modelClone = kartModel.clone();
      
      // Set the model's scale and position to match the map scale
      modelClone.scale.set(2, 2, 2);
      modelClone.position.set(0, 0, 0);
      modelClone.rotation.set(0, Math.PI, 0);
      
      // Clear any existing children and add the new model
      while (kartRef.current.children.length > 0) {
        kartRef.current.remove(kartRef.current.children[0]);
      }
      
      kartRef.current.add(modelClone);
    }
  }, [kartModel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process key inputs if the game has started
      if (isGameStarted) {
        keys.current[e.key.toLowerCase()] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      // Only process key inputs if the game has started
      if (isGameStarted) {
        keys.current[e.key.toLowerCase()] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameStarted]);

  // Check if kart is inside map boundaries
  const isInBounds = (position: THREE.Vector3) => {
    const halfSize = mapSize / 2 - kartSize.x;
    return (
      position.x >= -halfSize &&
      position.x <= halfSize &&
      position.z >= -halfSize &&
      position.z <= halfSize
    );
  };

  useFrame(() => {
    if (!kartRef.current) return;

    // Only process movement if the game has started
    if (isGameStarted) {
      // Handle acceleration
      if (keys.current['w']) {
        velocity.current.z = Math.max(velocity.current.z - acceleration, -maxSpeed);
      } else if (keys.current['s']) {
        velocity.current.z = Math.min(velocity.current.z + acceleration, maxSpeed / 2);
      } else {
        velocity.current.z *= 0.95; // Friction
      }

      // Handle turning
      if (keys.current['a']) {
        kartRef.current.rotation.y += turnSpeed;
      }
      if (keys.current['d']) {
        kartRef.current.rotation.y -= turnSpeed;
      }

      // Handle jumping
      if (keys.current[' '] && !isJumping.current) {
        isJumping.current = true;
        kartRef.current.position.y = jumpHeight;
      }

      // Apply gravity when jumping
      if (isJumping.current) {
        kartRef.current.position.y -= gravity;
        if (kartRef.current.position.y <= 0.5) {
          kartRef.current.position.y = 0.5;
          isJumping.current = false;
        }
      }

      // Calculate next position
      const moveX = Math.sin(kartRef.current.rotation.y) * velocity.current.z;
      const moveZ = Math.cos(kartRef.current.rotation.y) * velocity.current.z;
      const nextPosition = kartRef.current.position.clone();
      nextPosition.x += moveX;
      nextPosition.z += moveZ;
      
      // Check if the kart would remain in bounds
      if (isInBounds(nextPosition)) {
        // Still in bounds, move the kart
        kartRef.current.position.x = nextPosition.x;
        kartRef.current.position.z = nextPosition.z;
      } else {
        // Hit boundary wall, bounce back
        velocity.current.z *= -0.5; // Bounce back with reduced speed
      }
    }

    // Update camera position to follow kart
    const cameraOffset = new THREE.Vector3(
      Math.sin(kartRef.current.rotation.y) * 25,
      15,
      Math.cos(kartRef.current.rotation.y) * 25
    );
    camera.position.copy(kartRef.current.position).add(cameraOffset);
    camera.lookAt(kartRef.current.position);

    // Update speed in store
    setSpeed(Math.abs(velocity.current.z));
  });

  return (
    <group ref={kartRef} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]} name="kart">
      {/* The GLB model will be added in the useEffect */}
    </group>
  );
} 