import { useMemo, useState, useCallback } from 'react'
import { useStore } from '../../../store/useStore'
import organsData from '../../../data/organs.json'
import diseasesData from '../../../data/diseases.json'
import { CameraController } from './CameraController'

const Organ = ({ organ, isSelected, onClick }) => {
  const { x, y, z } = organ.position

  const handleClick = (e) => {
    e.stopPropagation()
    onClick(organ)
  }

  return (
    <group position={[x, y, z]} onClick={handleClick}>
      <mesh>
        <sphereGeometry args={[isSelected ? 0.35 : 0.25, 24, 24]} />
        <meshStandardMaterial
          color={organ.color}
          emissive={organ.color}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          transparent
          opacity={isSelected ? 0.9 : 0.6}
        />
      </mesh>
      {isSelected && (
        <mesh>
          <ringGeometry args={[0.4, 0.55, 48]} />
          <meshBasicMaterial color={organ.color} transparent opacity={0.4} side={2} />
        </mesh>
      )}
      <sprite position={[0, 0.4, 0]}>
        <spriteMaterial>
          <planeGeometry args={[0.01, 0.01]} />
        </spriteMaterial>
      </sprite>
    </group>
  )
}

const SpatialLabel = ({ organ, diseases }) => {
  if (!organ) return null
  return (
    <group position={[0.8, 0.5, 0]}>
      <mesh>
        <planeGeometry args={[1.6, 0.9]} />
        <meshBasicMaterial color="#0F1520" transparent opacity={0.85} side={2} />
      </mesh>
    </group>
  )
}

export const AnatomyView = () => {
  const currentProduct = useStore(s => s.currentProduct)
  const selectedOrgan = useStore(s => s.selectedOrgan)
  const selectOrgan = useStore(s => s.selectOrgan)

  const affectedOrgans = useMemo(() => {
    if (!currentProduct?.ingredients) return []
    const organNames = new Set()
    currentProduct.ingredients.forEach(ing => {
      ing.affectedOrgans?.forEach(org => organNames.add(org))
    })
    return organsData.filter(o => organNames.has(o.id))
  }, [currentProduct])

  const organDiseases = useMemo(() => {
    if (!selectedOrgan) return []
    return diseasesData.filter(d => d.organId === selectedOrgan.id)
  }, [selectedOrgan])

  const handleOrganClick = useCallback((organ) => {
    selectOrgan(selectedOrgan?.id === organ.id ? null : organ)
  }, [selectedOrgan, selectOrgan])

  const bodyColor = '#1C2840'

  return (
    <group>
      <CameraController target={selectedOrgan?.position} zoom={!!selectedOrgan} />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#00F0FF" />

      {/* Torso silhouette */}
      <group>
        {/* Upper body */}
        <mesh position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.3} wireframe />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.3} wireframe />
        </mesh>
        {/* Lower body */}
        <mesh position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.3, 0.4, 8, 16]} />
          <meshStandardMaterial color={bodyColor} transparent opacity={0.3} wireframe />
        </mesh>
      </group>

      {/* Organs */}
      {affectedOrgans.map(organ => (
        <Organ
          key={organ.id}
          organ={organ}
          isSelected={selectedOrgan?.id === organ.id}
          onClick={handleOrganClick}
        />
      ))}

      {/* Spatial label */}
      {selectedOrgan && (
        <SpatialLabel organ={selectedOrgan} diseases={organDiseases} />
      )}
    </group>
  )
}
