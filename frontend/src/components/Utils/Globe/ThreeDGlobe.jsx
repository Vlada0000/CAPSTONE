import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture, OrbitControls, Stars } from '@react-three/drei';
import { Color } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import earthTexture from '../../../assets/images/earth_day_map.jpg';
import earthNormalMap from '../../../assets/images/earth_normal_map.jpg';
import earthSpecularMap from '../../../assets/images/earth_specular_map.jpg';

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
      <Sphere args={[1, 64, 64]} scale={1.5}>
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
      <ambientLight intensity={2.5} />
      <pointLight
        color="#f6f3ea"
        position={[2, 0, 2]}
        intensity={2.5}
        castShadow
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={2}
        fade
        speed={1}
      />
      <Globe />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={2}
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
