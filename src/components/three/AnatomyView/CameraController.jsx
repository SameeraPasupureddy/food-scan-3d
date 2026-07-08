import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CameraController = ({ target, zoom = false }) => {
  const { camera } = useThree()
  const startPos = useRef(new THREE.Vector3(0, 0, 6))
  const startTarget = useRef(new THREE.Vector3(0, 0.8, 0))
  const progress = useRef(1)
  const isZooming = useRef(false)

  useEffect(() => {
    if (target) {
      startPos.current.copy(camera.position)
      startTarget.current.set(0, 0.8, 0)
      progress.current = 0
      isZooming.current = true
    } else {
      startPos.current.set(0, 0, 6)
      startTarget.current.set(0, 0.8, 0)
      progress.current = 0
      isZooming.current = false
    }
  }, [target])

  useFrame((_, delta) => {
    if (progress.current >= 1) return

    progress.current = Math.min(1, progress.current + delta * 1.2)
    const t = progress.current

    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2

    if (isZooming.current && target) {
      const targetPos = new THREE.Vector3(
        target.x * 0.6,
        target.y + 0.8,
        target.z + 2.5
      )
      camera.position.lerpVectors(startPos.current, targetPos, eased)
      camera.lookAt(new THREE.Vector3(target.x, target.y, target.z))
    } else if (!isZooming.current) {
      const resetPos = new THREE.Vector3(0, 0, 6)
      camera.position.lerpVectors(
        startPos.current,
        resetPos,
        eased
      )
      camera.lookAt(0, 0.8, 0)
    }
  })

  return null
}
