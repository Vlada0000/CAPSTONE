import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Globe from './Globe';

function ThreeDGlobe() {
  return (
    <Canvas
      className="globe-canvas"
      onCreated={({ gl }) => {
        gl.setClearColor('black');  
      }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <ambientLight intensity={1.2} />
      <pointLight
        color="#f6f3ea"
        position={[2, 0, 5]}
        intensity={1.5}
        castShadow
      />
      <Stars radius={300} depth={50} count={5000} factor={7} fade speed={1} />
      <Globe />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </Canvas>
  );
}

export default ThreeDGlobe;
