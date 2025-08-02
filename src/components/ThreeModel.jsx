import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, Center, OrbitControls } from '@react-three/drei';

const Model = ({ modelPath, scale, rotation }) => {
  const { scene } = useGLTF(modelPath);
  return (
    <Center>
      <primitive object={scene} scale={scale} rotation={rotation} />
    </Center>
  );
};

const ThreeModel = ({ modelPath, scale = [5, 5, 5], rotation = [0, 0, 0] }) => {
  return (
    <div className="threeCanvasWrapper">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense
          fallback={
            <Html center>
              <p className="loader">Loading...</p>
            </Html>
          }
        >
          <Model modelPath={modelPath} scale={scale} rotation={rotation} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ThreeModel;
