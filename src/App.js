import {Canvas, extend} from '@react-three/fiber';
import gatorURL from './images/gator.jpg'
import {useTexture} from '@react-three/drei';
import { shaderMaterial, OrbitControls } from '@react-three/drei';
import { vertexShader, fragmentShader } from './Shader';
import {Suspense} from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';

const ImageMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    brightness: 1.0
  },
  vertexShader,
  fragmentShader
);

extend({ ImageMaterial });

const ImageShader = () => {
  const gator = useTexture(gatorURL);
  // gator.encoding = THREE.sRGBEncoding;
  // gator.minFilter = THREE.LinearFilter;
  // gator.needsUpdate = true;
  const { width, height } = gator.image;
  console.log(gator);

  return (
    <mesh scale={0.005}>
        <planeBufferGeometry args={[width, height, 16, 16]} />
        <imageMaterial attach="material" uTexture={gator} brightness={5.0} />
    </mesh>
  )
}

function App() {
  return (
    <Canvas camera={{ far: 3000, position: [0, 0, 5] }} >
      <OrbitControls />
      <ambientLight />
      <Suspense fallback={null}>
        <ImageShader />

      </Suspense>
    </Canvas>
  );
}

export default App;
