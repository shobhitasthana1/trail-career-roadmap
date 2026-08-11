import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Section2Cylinder from "./Section2Cylinder";

const Section2 = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{fov: 60}}>
        <OrbitControls />
        <ambientLight />
        <Section2Cylinder />
      </Canvas>
    </div>
  );
};

export default Section2;