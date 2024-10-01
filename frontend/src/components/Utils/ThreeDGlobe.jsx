// src/components/Utils/ThreeDGlobe.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Sphere,
  useTexture,
  OrbitControls,
  Stars,
} from '@react-three/drei';
import { Color } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import earthTexture from '../../assets/images/earth_day_map.jpg';
import earthNormalMap from '../../assets/images/earth_normal_map.jpg';
import earthSpecularMap from '../../assets/images/earth_specular_map.jpg';
import './ThreeDGlobe.css';

function Globe() {
  const globeRef = useRef();
  const [colorMap, normalMap, specularMap] = useTexture([
    earthTexture,
    earthNormalMap,
    earthSpecularMap,
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    globeRef.current.rotation.y = elapsedTime * 0.1;
  });

  return (
    <mesh ref={globeRef} position={[0, 0, 0]}>
      <Sphere args={[1, 64, 64]} scale={2.5}>
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new Color('grey')}
        />
      </Sphere>
    </mesh>
  );
}

function ThreeDGlobe() {
  return (
    <Canvas className="globe-canvas">
      <ambientLight intensity={3.9} />
      <pointLight
        color="#f6f3ea"
        position={[2, 0, 2]}
        intensity={1.5}
        castShadow
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Globe />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1} // Soglia per l'effetto Bloom
          luminanceSmoothing={0.9}  // Lisciatura delle luci
          intensity={2} // Intensità dell'effetto Bloom
        />
      </EffectComposer>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </Canvas>
  );
}

export default ThreeDGlobe;
