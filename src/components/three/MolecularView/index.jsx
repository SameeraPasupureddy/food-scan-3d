import { useMemo, useCallback, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../../store/useStore'
import { ChemicalSphere } from './ChemicalSphere'
import { RISK_COLORS } from '../../../utils/constants'

const AnimatedBond = ({ start, end, color = '#1C2840', risk }) => {
  const ref = useRef()
  const midPoint = useMemo(() => ({
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
    z: (start.z + end.z) / 2
  }), [start, end])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const dashOffset = Math.sin(t * 2) * 0.5
    ref.current.material.opacity = 0.15 + Math.sin(t * 1.5 + start.x) * 0.1
  })

  const positions = new Float32Array([
    start.x, start.y, start.z,
    end.x, end.y, end.z
  ])

  const bondColor = risk === 'high' ? '#FF0040' : risk === 'medium' ? '#FF8C00' : '#00FF88'

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={bondColor} transparent opacity={0.2} linewidth={1} />
    </line>
  )
}

export const MolecularView = () => {
  const currentProduct = useStore(s => s.currentProduct)
  const selectedAdditive = useStore(s => s.selectedAdditive)
  const selectAdditive = useStore(s => s.selectAdditive)
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  const spheres = useMemo(() => {
    if (!currentProduct?.ingredients) return { wholePos: { x: 0, y: 0, z: 0 }, additives: [] }
    const additives = currentProduct.ingredients.filter(i => i.type === 'additive')
    const whole = currentProduct.ingredients.filter(i => i.type === 'whole')

    const radius = Math.min(2.8, 1.5 + additives.length * 0.3)

    const positions = additives.map((add, i) => {
      const angle = (i / additives.length) * Math.PI * 2
      const tilt = Math.sin(i * 1.7) * 0.6
      return {
        ...add,
        pos: {
          x: Math.cos(angle) * radius,
          y: tilt,
          z: Math.sin(angle) * radius
        },
        size: add.risk === 'high' ? 0.4 : add.risk === 'medium' ? 0.32 : 0.25,
        color: RISK_COLORS[add.risk] || '#666666'
      }
    })

    return { wholePos: { x: 0, y: 0, z: 0 }, additives: positions }
  }, [currentProduct])

  const handleSphereClick = useCallback((additive) => {
    selectAdditive(selectedAdditive?.name === additive.name ? null : additive)
  }, [selectAdditive, selectedAdditive])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#00F0FF" />
      <pointLight position={[-3, -3, 3]} intensity={0.4} color="#8B5CF6" />

      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} />
      </mesh>

      {spheres.additives.map((add, i) => (
        <group key={i}>
          <AnimatedBond
            start={spheres.wholePos}
            end={add.pos}
            color={add.color}
            risk={add.risk}
          />
          {/* Connect adjacent additives */}
          {i > 0 && (
            <AnimatedBond
              start={spheres.additives[i - 1].pos}
              end={add.pos}
              color="#1C2840"
              risk={add.risk}
            />
          )}
          <ChemicalSphere
            position={add.pos}
            color={add.color}
            size={add.size}
            name={add.name}
            risk={add.risk}
            onClick={handleSphereClick}
            isSelected={selectedAdditive?.name === add.name}
          />
        </group>
      ))}

      {/* Particle field */}
      {Array.from({ length: 60 }).map((_, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1}
              array={new Float32Array([
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.02} color="#00F0FF" transparent opacity={0.3} />
        </points>
      ))}
    </group>
  )
}
