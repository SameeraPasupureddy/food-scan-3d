import { useMemo, useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useStore } from '../../../store/useStore'
import { ChemicalSphere } from './ChemicalSphere'
import { RISK_COLORS } from '../../../utils/constants'

const BondLine = ({ start, end, color = '#1C2840' }) => {
  const points = useMemo(() => [
    new Float32Array([start.x, start.y, start.z]),
    new Float32Array([end.x, end.y, end.z])
  ], [start, end])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.2} />
    </line>
  )
}

export const MolecularView = () => {
  const currentProduct = useStore(s => s.currentProduct)
  const selectedAdditive = useStore(s => s.selectedAdditive)
  const selectAdditive = useStore(s => s.selectAdditive)
  const { camera } = useThree()

  const spheres = useMemo(() => {
    if (!currentProduct?.ingredients) return []
    const additives = currentProduct.ingredients.filter(i => i.type === 'additive')
    const whole = currentProduct.ingredients.filter(i => i.type === 'whole')

    const positions = []
    const count = additives.length + 1
    const radius = 2.5

    const wholePos = { x: 0, y: 0, z: 0 }

    additives.forEach((add, i) => {
      const angle = (i / additives.length) * Math.PI * 2
      const tilt = (i % 2 === 0 ? 1 : -1) * 0.5
      positions.push({
        ...add,
        pos: {
          x: Math.cos(angle) * radius,
          y: Math.sin(tilt) * 1.2,
          z: Math.sin(angle) * radius
        },
        size: add.risk === 'high' ? 0.35 : add.risk === 'medium' ? 0.28 : 0.22,
        color: RISK_COLORS[add.risk] || '#666666'
      })
    })

    return { wholePos, additives: positions }
  }, [currentProduct])

  const handleSphereClick = useCallback((additive) => {
    selectAdditive(additive)
  }, [selectAdditive])

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#00F0FF" />

      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#00F0FF" transparent opacity={0.15} wireframe />
      </mesh>

      {spheres.additives.map((add, i) => (
        <group key={i}>
          <BondLine start={spheres.wholePos} end={add.pos} color={add.color} />
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
    </group>
  )
}
