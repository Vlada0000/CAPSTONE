import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';

import earthDayMap from '../../../assets/images/earth_day_map.jpg';
import earthNightMap from '../../../assets/images/night.jpg';
import earthSpecularMap from '../../../assets/images/earth_specular_map.jpg'; 
import earthCloudsMap from '../../../assets/images/earth_clouds_map.jpg'; 

function Globe() {
  const globeRef = useRef();
  const cloudsRef = useRef();

  const [dayMap, nightMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    earthDayMap,
    earthNightMap,
    earthSpecularMap,
    earthCloudsMap,
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    globeRef.current.rotation.y = elapsedTime * 0.1;
    cloudsRef.current.rotation.y = elapsedTime * 0.1; 
  });

  const uniforms = {
    uDayMap: { value: dayMap },
    uNightMap: { value: nightMap },
    uSpecularMap: { value: specularMap },
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
  };

  return (
    <>
      <mesh ref={globeRef}>
        <Sphere args={[1, 64, 64]} scale={1.1}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={`
              varying vec2 vUv;
              varying vec3 vNormal;
              
              void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform sampler2D uDayMap;
              uniform sampler2D uNightMap;
              uniform sampler2D uSpecularMap;
              uniform vec3 uSunDirection;

              varying vec2 vUv;
              varying vec3 vNormal;

              void main() {
                vec3 normal = normalize(vNormal);
                float lightIntensity = dot(normal, uSunDirection);

                vec4 dayColor = texture2D(uDayMap, vUv);
                vec4 nightColor = texture2D(uNightMap, vUv);
                vec4 specular = texture2D(uSpecularMap, vUv);

                vec4 color = mix(nightColor, dayColor, max(lightIntensity, 0.0));

                color.rgb += specular.rgb * pow(max(lightIntensity, 0.0), 2.0);

                gl_FragColor = color;
              }
            `}
          />
        </Sphere>
      </mesh>

      <mesh ref={cloudsRef}>
        <Sphere args={[1.01, 64, 64]} scale={1.1}>
          <meshPhongMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.5} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending} 
          />
        </Sphere>
      </mesh>
    </>
  );
}

export default Globe;
