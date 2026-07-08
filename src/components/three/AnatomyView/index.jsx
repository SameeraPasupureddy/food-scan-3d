import { useMemo, useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../../store/useStore'
import organsData from '../../../data/organs.json'
import diseasesData from '../../../data/diseases.json'
import { CameraController } from './CameraController'

const HazardRing = ({ position, color, active }) => {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current || !active) return
    const t = state.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.15)
    ref.current.material.opacity = 0.3 + Math.sin(t * 5) * 0.2
  })

  if (!active) return null

  return (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <ringGeometry args={[0.35, 0.55, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  )
}

const OrganGlow = ({ position, color, active }) => {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current || !active) return
    const t = state.clock.elapsedTime
    ref.current.material.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.3
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
  })

  return (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.28, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={active ? color : '#000000'}
        emissiveIntensity={active ? 0.5 : 0}
        transparent
        opacity={active ? 0.9 : 0.4}
      />
    </mesh>
  )
}

const SpatialInfoPanel = ({ organ, diseases }) => {
  if (!organ) return null

  return (
    <Html
      position={[1.2, organ.position.y + 0.3, 0]}
      style={{
        width: '220px',
        pointerEvents: 'none',
        transform: 'translateX(10px)'
      }}
    >
      <div
        style={{
          background: 'rgba(11, 15, 25, 0.92)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${organ.color}44`,
          borderRadius: '12px',
          padding: '12px',
          boxShadow: `0 0 30px ${organ.color}22`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: organ.color, flexShrink: 0 }} />
          <h3 style={{ color: organ.color, fontSize: '13px', fontWeight: 600, margin: 0 }}>{organ.name}</h3>
        </div>

        <p style={{ color: '#94A3B8', fontSize: '10px', lineHeight: 1.4, margin: '0 0 8px 0' }}>
          {organ.system}
        </p>

        <p style={{ color: '#CBD5E1', fontSize: '10px', lineHeight: 1.5, margin: '0 0 8px 0' }}>
          {organ.description}
        </p>

        {diseases.length > 0 && (
          <div>
            <p style={{ color: '#FF0040', fontSize: '9px', fontWeight: 600, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Associated Diseases
            </p>
            {diseases.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '2px 0', fontSize: '9px', color: '#94A3B8'
              }}>
                <span style={{ color: '#FF0040' }}>⚠</span>
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Html>
  )
}

const ChemicalPathway = ({ start, end, active }) => {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.material.opacity = active ? 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0.05
  })

  const positions = new Float32Array([
    start.x, start.y, start.z,
    end.x, end.y, end.z
  ])

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
      <lineBasicMaterial color="#FF0040" transparent opacity={0.05} />
    </line>
  )
}

export const AnatomyView = () => {
  const currentProduct = useStore(s => s.currentProduct)
  const selectedOrgan = useStore(s => s.selectedOrgan)
  const selectOrgan = useStore(s => s.selectOrgan)
  const selectedAdditive = useStore(s => s.selectedAdditive)

  const affectedOrgans = useMemo(() => {
    if (!currentProduct?.ingredients) return []
    const organIds = new Set()
    currentProduct.ingredients.forEach(ing => {
      ing.affectedOrgans?.forEach(org => organIds.add(org))
    })
    return organsData.filter(o => organIds.has(o.id))
  }, [currentProduct])

  const allOrgans = useMemo(() => organsData, [])

  const organDiseases = useMemo(() => {
    if (!selectedOrgan) return []
    return diseasesData.filter(d => d.organId === selectedOrgan.id) || []
  }, [selectedOrgan])

  const handleOrganClick = useCallback((organ) => {
    selectOrgan(selectedOrgan?.id === organ.id ? null : organ)
  }, [selectedOrgan, selectOrgan])

  const bodyColor = '#1C2840'
  const bodyGlowColor = '#00F0FF'

  return (
    <group>
      <CameraController target={selectedOrgan?.position} zoom={!!selectedOrgan} />

      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#00F0FF" />
      <pointLight position={[0, -3, 3]} intensity={0.2} color="#8B5CF6" />

      {/* Full body wireframe silhouette */}
      <group>
        {/* Head */}
        <mesh position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.25} wireframe />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.2} wireframe />
        </mesh>

        {/* Upper torso */}
        <mesh position={[0, 1.0, 0]}>
          <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.25} wireframe />
        </mesh>

        {/* Lower torso */}
        <mesh position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.3, 0.35, 8, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.25} wireframe />
        </mesh>

        {/* Left arm */}
        <mesh position={[-0.45, 1.1, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.06, 0.4, 8, 12]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.2} wireframe />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.45, 1.1, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.06, 0.4, 8, 12]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.2} wireframe />
        </mesh>

        {/* Left leg */}
        <mesh position={[-0.15, -0.15, 0]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.2} wireframe />
        </mesh>

        {/* Right leg */}
        <mesh position={[0.15, -0.15, 0]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.2} wireframe />
        </mesh>

        {/* Body glow outline */}
        <mesh position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.38, 1.2, 8, 16]} />
          <meshBasicMaterial color={bodyGlowColor} transparent opacity={0.04} wireframe />
        </mesh>
      </group>

      {/* Chemical pathways to affected organs */}
      {selectedAdditive && affectedOrgans.map(organ => (
        <ChemicalPathway
          key={organ.id}
          start={{ x: 0, y: 0, z: 0 }}
          end={organ.position}
          active={selectedOrgan?.id === organ.id}
        />
      ))}

      {/* Organs */}
      {allOrgans.map(organ => {
        const isAffected = affectedOrgans.some(a => a.id === organ.id)
        const isSelected = selectedOrgan?.id === organ.id

        return (
          <group key={organ.id}>
            {/* Only show affected organs */}
            {isAffected && (
              <>
                <OrganGlow
                  position={organ.position}
                  color={organ.color}
                  active={isSelected}
                />
                <HazardRing
                  position={organ.position}
                  color={organ.color}
                  active={isSelected}
                />
                <group
                  position={[organ.position.x, organ.position.y, organ.position.z]}
                  onClick={(e) => { e.stopPropagation(); handleOrganClick(organ) }}
                  onPointerOver={() => { document.body.style.cursor = 'pointer' }}
                  onPointerOut={() => { document.body.style.cursor = 'default' }}
                >
                  {/* Clickable area */}
                  <mesh>
                    <sphereGeometry args={[0.35, 16, 16]} />
                    <meshBasicMaterial transparent opacity={0} />
                  </mesh>
                </group>
              </>
            )}

            {/* Organ label */}
            {isAffected && (
              <Html
                position={[organ.position.x, organ.position.y - 0.4, organ.position.z]}
                center
                style={{ pointerEvents: 'none' }}
              >
                <div style={{
                  color: isSelected ? organ.color : '#64748B',
                  fontSize: '9px',
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: 'center',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  transition: 'color 0.3s'
                }}>
                  {organ.name}
                </div>
              </Html>
            )}
          </group>
        )
      })}

      {/* Information panel for selected organ */}
      <SpatialInfoPanel organ={selectedOrgan} diseases={organDiseases} />

      {/* Legend */}
      <Html position={[-1.8, -1.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: '12px', fontSize: '8px', color: '#475569' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00F0FF', display: 'inline-block' }} />
            Affected organ
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF0040', display: 'inline-block' }} />
            High risk
          </span>
        </div>
      </Html>
    </group>
  )
}
