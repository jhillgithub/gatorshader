import {Canvas, extend, useFrame, useThree} from '@react-three/fiber';
import gatorURL from './images/gator.jpg';
import stonesURL from './images/stones.jpg';
import {useTexture, Environment} from '@react-three/drei';
import { shaderMaterial, OrbitControls } from '@react-three/drei';
import { vertexShader, fragmentShader } from './Shader';
import {Suspense} from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { useControls } from 'leva'

const ImageMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDisplacement: new THREE.Texture(),
    uDisplaceAmount: 0.0,
    uShadows: 0.0,
    uHighlights: 0.0 
  },
  vertexShader,
  fragmentShader
);

extend({ ImageMaterial });

const ImageShader = () => {
  const { displaceAmount, shadows, highlights } = useControls(
    { 
      displaceAmount: {
        value: 0.075,
        min: 0.0,
        max: 2.0,
        step: 0.01,
      },
      shadows: {
        value: 1.75,
        min: 0.0,
        max: 2.0,
        step: 0.1,
      }, 
      highlights: {
        value: 0.2,
        min: 0.0,
        max: 2.0,
        step: 0.1,
      }, 
    }
  )
  const gator = useTexture(gatorURL);
  const displacement = useTexture(stonesURL);
  // gator.encoding = THREE.sRGBEncoding;
  // gator.minFilter = THREE.LinearFilter;
  // gator.needsUpdate = true;
  const { width, height } = gator.image;
  console.log(gator);

  return (
    <mesh scale={0.005}>
        <planeBufferGeometry args={[width, height, 16, 16]} />
        <imageMaterial 
          attach="material"
          side={DoubleSide} 
          uTexture={gator} 
          uDisplacement={displacement} 
          uDisplaceAmount={displaceAmount}
          uShadows={shadows}
          uHighlights={highlights} 
        />
    </mesh>
  )
}


function App() {
  return (
    <Canvas camera={{position: [0, 0, 5] }} style={{
      // background: "#1b1d17"
    }}>
      <color attach="background" args={['#1b1d17']} />
      <fog attach="fog" args={['#202020']} />
      <OrbitControls />
      <ambientLight />
      <Suspense fallback={null}>
        {/* <Environment preset={"night"} background /> */}
        <ImageShader />
      </Suspense>
    </Canvas>
  );
}

export default App;
