import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const Section2Cylinder = () => {
  let tex = useTexture("/images/section2-images/Cylinder2.png");

  let cyl = useRef(null)

  useFrame((state, delta)=>{
   cyl.current.rotation.y += delta;
  });
  
  return (
    <mesh ref={cyl} rotation={[0, 1.2, 0.4]}>
      <cylinderGeometry args={[2, 2, 2, 60, 60, true]} />
      <meshStandardMaterial map={tex} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Section2Cylinder;