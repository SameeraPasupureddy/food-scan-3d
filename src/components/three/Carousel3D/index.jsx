import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { useStore } from '../../../store/useStore'
import { Card, CardTitle } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { formatCurrency } from '../../../utils/formatters'

const CarouselCard = ({ item, index, total, activeIndex, setActiveIndex }) => {
  const angle = (index / total) * Math.PI - Math.PI / 2
  const radius = 2.2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const isActive = index === activeIndex

  const { scale } = useSpring({
    scale: isActive ? 1.1 : 0.9,
    config: { mass: 1, tension: 200, friction: 20 }
  })

  return (
    <animated.group position={[x, 0, z]} scale={scale} onClick={() => setActiveIndex(index)}>
      <mesh>
        <planeGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={isActive ? '#1C2840' : '#0F1520'} transparent opacity={0.9} />
      </mesh>
      <sprite position={[0, 0.25, 0.01]}>
        <spriteMaterial>
          <planeGeometry args={[0.01, 0.01]} />
        </spriteMaterial>
      </sprite>
    </animated.group>
  )
}

export const EcoCarousel = () => {
  const alternatives = useStore(s => s.alternatives)
  const currentProduct = useStore(s => s.currentProduct)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!alternatives || alternatives.length === 0) {
    return (
      <Card>
        <CardTitle>Eco-Friendly Alternatives</CardTitle>
        <p className="text-sm text-gray-500 mt-2">No alternatives found for this product. Check back later.</p>
      </Card>
    )
  }

  const active = alternatives[activeIndex]

  return (
    <Card>
      <CardTitle className="mb-3">Eco-Friendly Alternatives</CardTitle>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {alternatives.map((alt, i) => (
          <div
            key={alt.id}
            className={`flex-shrink-0 w-48 p-3 rounded-xl border cursor-pointer transition-all ${
              i === activeIndex
                ? 'border-accent-cyan bg-accent-cyan/5'
                : 'border-deep-700 bg-deep-800/50 hover:border-deep-600'
            }`}
            onClick={() => setActiveIndex(i)}
          >
            <div className="w-full h-20 bg-deep-900 rounded-lg mb-2 flex items-center justify-center text-3xl">
              {alt.brand[0]}
            </div>
            <p className="text-sm font-medium text-white truncate">{alt.name}</p>
            <p className="text-xs text-gray-500">{alt.brand}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-accent-cyan">{formatCurrency(alt.price)}</span>
              <Badge variant={alt.sustainabilityScore > 80 ? 'success' : 'warning'} size="sm">
                {alt.sustainabilityScore}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      {active && (
        <div className="mt-3 p-3 bg-deep-900 rounded-lg">
          <p className="text-xs text-gray-400">Why switch: <span className="text-white">{active.reason}</span></p>
          {currentProduct?.prices?.[0] && (
            <p className="text-xs text-green-400 mt-1">
              Save {formatCurrency(currentProduct.prices[0].price - active.price)} vs {currentProduct.name}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}

import { useState } from 'react'
