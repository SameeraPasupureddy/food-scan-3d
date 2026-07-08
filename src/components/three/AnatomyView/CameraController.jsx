import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CameraController = ({ target, zoom = false }) => {
  const { camera } = useThree()
  const startPos = useRef(new THREE.Vector3(0, 0, 6))
  const progress = useRef(0)

  useEffect(() => {
    startPos.current.copy(camera.position)
    progress.current = 0
  }, [target])

  useFrame((_, delta) => {
    if (!target) return
    progress.current = Math.min(1, progress.current + delta * 1.5)
    const t = progress.current

    const targetPos = new THREE.Vector3(target.x, target.y + 0.5, target.z + 2)
    const start = startPos.current

    camera.position.lerpVectors(start, targetPos, t)
    camera.lookAt(new THREE.Vector3(target.x, target.y, target.z))
  })

  return null
}
