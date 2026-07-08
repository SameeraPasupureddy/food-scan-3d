import { useState, useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { useStore } from '../../../store/useStore'
import { RISK_COLORS } from '../../../utils/constants'
import { formatCurrency } from '../../../utils/formatters'

const CarouselCard = ({ item, index, total, isActive, onClick }) => {
  const ref = useRef()
  const angle = ((index - total / 2) / total) * Math.PI * 0.8
  const radius = 3.0
  const x = Math.sin(angle) * radius
  const z = -Math.cos(angle) * radius + 0.5
  const y = -0.2 - Math.abs(angle) * 0.3

  const { scale, opacity } = useSpring({
    scale: isActive ? 1.15 : 0.85,
    opacity: isActive ? 1 : 0.6,
    config: config.wobbly
  })

  const rotationY = -angle * 0.3

  const hazardColor = item.ingredients?.find(i => i.risk === 'high')
    ? '#FF0040'
    : item.ingredients?.find(i => i.risk === 'medium')
    ? '#FF8C00'
    : '#00FF88'

  return (
    <animated.group
      ref={ref}
      position={[x, y, z]}
      rotation={[0, rotationY, 0]}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Card body */}
      <mesh>
        <planeGeometry args={[0.9, 1.2]} />
        <meshBasicMaterial color={isActive ? '#1C2840' : '#0F1520'} transparent opacity={0.95} />
      </mesh>

      {/* Glow border when active */}
      {isActive && (
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.92, 1.22]} />
          <meshBasicMaterial color={hazardColor} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Card content via HTML overlay */}
      <Html
        position={[0, 0, 0.01]}
        center
        transform
        style={{
          width: '100px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          padding: '8px',
          color: isActive ? '#E2E8F0' : '#64748B',
          fontSize: '9px',
          lineHeight: 1.3
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto 6px',
            borderRadius: '8px',
            background: '#0B0F19',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: hazardColor
          }}>
            {item.brand?.[0] || '?'}
          </div>
          <div style={{
            fontWeight: 600,
            fontSize: '9px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: isActive ? '#FFFFFF' : '#94A3B8'
          }}>
            {item.name}
          </div>
          <div style={{ color: '#00F0FF', fontWeight: 600, marginTop: '2px' }}>
            {item.prices?.[0] ? formatCurrency(item.prices[0].price) : ''}
          </div>
        </div>
      </Html>
    </animated.group>
  )
}

export const EcoCarousel = () => {
  const alternatives = useStore(s => s.alternatives)
  const currentProduct = useStore(s => s.currentProduct)
  const [activeIndex, setActiveIndex] = useState(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const rotationOffset = useRef(0)

  const products = [currentProduct, ...(alternatives || [])].filter(Boolean)

  const handlePointerDown = (e) => {
    isDragging.current = true
    lastX.current = e.clientX || e.nativeEvent?.clientX || 0
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const dx = (e.clientX || e.nativeEvent?.clientX || 0) - lastX.current
    if (Math.abs(dx) > 30) {
      if (dx > 0) {
        setActiveIndex(prev => Math.max(0, prev - 1))
      } else {
        setActiveIndex(prev => Math.min(products.length - 1, prev + 1))
      }
      isDragging.current = false
    }
  }

  if (products.length === 0) return null

  const active = products[activeIndex]
  const isAlt = activeIndex > 0
  const savings = isAlt && currentProduct?.prices?.[0] && active?.prices?.[0]
    ? currentProduct.prices[0].price - active.prices[0].price
    : 0

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      {products.map((item, i) => (
        <CarouselCard
          key={i}
          item={item}
          index={i}
          total={products.length}
          isActive={i === activeIndex}
          onClick={() => setActiveIndex(i)}
        />
      ))}

      {/* Title */}
      <Html position={[0, -1.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          color: '#64748B',
          fontSize: '9px',
          textAlign: 'center',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {isAlt ? 'Cleaner Alternative' : 'Current Product'}
          {isAlt && savings > 0 && (
            <span style={{ color: '#00FF88', marginLeft: '6px' }}>
              Save {formatCurrency(savings)}
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}
