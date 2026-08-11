import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Mesh } from 'three'

const Section2 = () => {
  return (
<div className='w-screen h-screen'>
    <Canvas>

<mesh>
<boxGeometry/>
<meshBasicMaterial/>
</mesh>

  </Canvas>
</div>
  )
}

export default Section2