import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { RISK_COLORS } from '../../../utils/constants'

const GlowMaterial = ({ color, intensity = 0.5 }) => {
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uIntensity: { value: intensity },
    uOpacity: { value: 0.92 },
    uTime: { value: 0 },
    uPulseSpeed: { value: 1.5 + Math.random() }
  }), [color, intensity])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <shaderMaterial
      ref={matRef}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
    >
      <vertexShader>{`
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vPosition = mvPosition.xyz;

          vec3 pos = position;
          float displacement = sin(pos.x * 4.0 + uTime) * 0.015 + sin(pos.y * 5.0 + uTime * 1.2) * 0.015 + sin(pos.z * 3.5 + uTime * 0.8) * 0.015;
          pos += normal * displacement;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `}</vertexShader>
      <fragmentShader>{`
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uOpacity;
        uniform float uTime;
        uniform float uPulseSpeed;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
          rim = pow(rim, 3.0);

          float pulse = 0.7 + 0.3 * sin(uTime * uPulseSpeed + vPosition.y * 8.0 + vPosition.x * 6.0);

          float glow = 1.0 + rim * 2.5;
          vec3 color = uColor * glow * pulse;
          float alpha = uOpacity * (0.5 + rim * 0.5) * pulse;

          gl_FragColor = vec4(color, alpha);
        }
      `}</fragmentShader>
    </shaderMaterial>
  )
}

export const ChemicalSphere = ({ position, color, size, name, risk, onClick, isSelected }) => {
  const meshRef = useRef()
  const targetPos = useRef(position)
  const floatOffset = useRef(Math.random() * Math.PI * 2)
  const hovered = useRef(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime + floatOffset.current
    meshRef.current.position.x = targetPos.current.x + Math.sin(t * 0.5 + targetPos.current.z) * 0.08
    meshRef.current.position.y = targetPos.current.y + Math.sin(t * 0.7 + targetPos.current.x) * 0.08
    meshRef.current.position.z = targetPos.current.z + Math.sin(t * 0.6 + targetPos.current.y) * 0.08
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15
    meshRef.current.rotation.y = t * 0.08
    const s = isSelected ? 1.3 : hovered.current ? 1.15 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08)
  })

  const handlePointerOver = () => { hovered.current = true; document.body.style.cursor = 'pointer' }
  const handlePointerOut = () => { hovered.current = false; document.body.style.cursor = 'default' }

  return (
    <group ref={meshRef}>
      <Sphere
        args={[size, 48, 48]}
        position={[0, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onClick?.({ name, risk, color }) }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <GlowMaterial color={color} intensity={isSelected ? 1.0 : 0.5} />
      </Sphere>

      {/* Selected ring */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[size * 1.1, size * 1.3, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Inner core */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick?.({ name, risk, color }) }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size * 0.25, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>

      <Html
        distanceFactor={6}
        center
        style={{ pointerEvents: 'none', transition: 'opacity 0.2s', opacity: isSelected || hovered.current ? 1 : 0.7 }}
      >
        <div className="px-2 py-0.5 rounded-full whitespace-nowrap text-[10px] font-medium"
          style={{
            backgroundColor: isSelected ? `${color}22` : '#0F1520CC',
            color: isSelected ? color : '#94A3B8',
            border: `1px solid ${isSelected ? color : '#1C2840'}`,
            backdropFilter: 'blur(4px)'
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  )
}
