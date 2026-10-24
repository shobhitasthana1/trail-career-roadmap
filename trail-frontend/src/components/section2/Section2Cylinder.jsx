import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const Section2Cylinder = () => {
  let tex = useTexture("/images/section2-images/Cylinder2.png");

  let cyl = useRef(null);
  const speedRef = useRef(0.35);

  useFrame((state, delta) => {
    cyl.current.rotation.y += delta * speedRef.current;
  });

  return (
    <mesh ref={cyl} rotation={[0, 1.2, 0.4]} scale={1.9}>
      <cylinderGeometry args={[2, 2, 2, 60, 60, true]} />
      <meshStandardMaterial
        map={tex}
        transparent
        side={THREE.DoubleSide}
        roughness={0.35}
        metalness={0.05}
      />
    </mesh>
  );
};

export default Section2Cylinder;