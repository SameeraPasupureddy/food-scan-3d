import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

const GlowMaterial = ({ color, intensity = 0.5 }) => {
  const uniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color(color) },
    intensity: { value: intensity },
    opacity: { value: 0.9 }
  }), [color, intensity])

  const matRef = useRef()

  return (
    <shaderMaterial
      ref={matRef}
      uniforms={uniforms}
      vertexShader={document.getElementById('glowVertex')?.textContent || `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={document.getElementById('glowFragment')?.textContent || `
        uniform vec3 glowColor;
        uniform float intensity;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
          rim = pow(rim, 3.0);
          float pulse = 0.8 + 0.2 * sin(vPosition.y * 10.0);
          vec3 color = glowColor * (1.0 + rim * 2.0) * pulse;
          float alpha = opacity * (0.6 + rim * 0.4);
          gl_FragColor = vec4(color, alpha);
        }
      `}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  )
}

export const ChemicalSphere = ({ position, color, size, name, risk, onClick, isSelected }) => {
  const meshRef = useRef()
  const targetPos = useRef(position)
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime + floatOffset.current
    meshRef.current.position.x = targetPos.current.x + Math.sin(t * 0.5 + targetPos.current.z) * 0.1
    meshRef.current.position.y = targetPos.current.y + Math.sin(t * 0.7 + targetPos.current.x) * 0.1
    meshRef.current.position.z = targetPos.current.z + Math.sin(t * 0.6 + targetPos.current.y) * 0.1
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
    meshRef.current.rotation.y = t * 0.1
  })

  const onClickHandler = (e) => {
    e.stopPropagation()
    onClick?.({ name, risk, color })
  }

  return (
    <group ref={meshRef}>
      <Sphere args={[size, 32, 32]} position={[0, 0, 0]} onClick={onClickHandler}>
        <GlowMaterial color={color} intensity={isSelected ? 1.0 : 0.5} />
      </Sphere>
      <mesh onClick={onClickHandler}>
        <sphereGeometry args={[size * 0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <Html distanceFactor={8}>
        <div className="text-xs text-white bg-deep-900/80 backdrop-blur px-2 py-0.5 rounded whitespace-nowrap">
          {name}
        </div>
      </Html>
    </group>
  )
}
