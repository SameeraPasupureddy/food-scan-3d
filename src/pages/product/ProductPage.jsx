import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useStore } from '../../store/useStore'
import { MolecularView } from '../../components/three/MolecularView'
import { AnatomyView } from '../../components/three/AnatomyView'
import { EcoCarousel } from '../../components/three/Carousel3D'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Tabs } from '../../components/ui/Tabs'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { SustainabilityPanel } from '../../components/charts/SustainabilityPanel'
import { PricePanel } from '../../components/charts/PricePanel'
import { CommentSection } from '../../components/community/CommentSection'
import { RISK_COLORS } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'

const NutritionCard = ({ label, value }) => (
  <div className="text-center p-2 bg-deep-900 rounded-lg">
    <p className="text-lg font-bold text-accent-cyan">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
)

export const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentProduct, loading, error, viewMode, selectedAdditive, setViewMode, fetchProduct } = useStore(s => ({
    currentProduct: s.currentProduct, loading: s.loading, error: s.error, viewMode: s.viewMode,
    selectedAdditive: s.selectedAdditive, setViewMode: s.setViewMode, fetchProduct: s.fetchProduct
  }))

  useEffect(() => { fetchProduct(id) }, [id])

  if (loading) return <div className="flex items-center justify-center h-96"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-20"><p className="text-hazard-high text-lg">{error}</p><Button onClick={() => navigate('/scan/barcode')} className="mt-4">Back to Scanner</Button></div>
  if (!currentProduct) return null

  const p = currentProduct
  const tabTabs = [
    { id: 'molecular', label: '🧬 Molecular Web', content: null },
    { id: 'anatomy', label: '🧍 Anatomy Map', content: null }
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{p.name}</h1>
          <p className="text-gray-500">{p.brand} &middot; {p.category}</p>
        </div>
        <div className="flex gap-2">
          {p.certifications?.map(c => (
            <Badge key={c} variant={c === 'organic' ? 'success' : c === 'fair_trade' ? 'info' : c === 'gmo_free' ? 'warning' : 'default'}>{c.replace('_', ' ')}</Badge>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="h-[400px] md:h-[500px] bg-deep-900 relative">
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true }}>
                <color attach="background" args={['#0B0F19']} />
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-5, -5, -5]} intensity={0.3} color="#00F0FF" />
                {viewMode === 'molecular' ? <MolecularView /> : <AnatomyView />}
                <OrbitControls enableDamping dampingFactor={0.08} autoRotate={false} />
                <EffectComposer>
                  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.4} />
                </EffectComposer>
              </Canvas>

              <div className="absolute top-3 left-3 flex gap-2 z-10">
                <button
                  onClick={() => setViewMode('molecular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'molecular' ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800/80 text-gray-400 hover:text-white'}`}
                >🧬 Molecular</button>
                <button
                  onClick={() => setViewMode('anatomy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'anatomy' ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800/80 text-gray-400 hover:text-white'}`}
                >🧍 Anatomy</button>
              </div>
            </div>
          </Card>

          <div className="mt-5">
            <EcoCarousel />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Nutrition Facts</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <NutritionCard label="Calories" value={p.nutrition.calories} />
                <NutritionCard label="Protein" value={`${p.nutrition.protein}g`} />
                <NutritionCard label="Carbs" value={`${p.nutrition.carbs}g`} />
                <NutritionCard label="Fat" value={`${p.nutrition.fat}g`} />
                <NutritionCard label="Fiber" value={`${p.nutrition.fiber}g`} />
                <NutritionCard label="Sugar" value={`${p.nutrition.sugar}g`} />
              </div>
              <p className="text-xs text-gray-600 mt-2">Per serving: {p.nutrition.servingSize}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ingredients</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {p.ingredientDetails?.map((ing, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-deep-900 rounded-lg text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: RISK_COLORS[ing.risk] || '#666' }} />
                    <span className="text-white truncate">{ing.name}</span>
                    {ing.type === 'additive' && <span className="text-[10px] text-gray-600">E-additive</span>}
                  </div>
                  <span className={`text-xs font-medium ${ing.risk === 'high' ? 'text-hazard-high' : ing.risk === 'medium' ? 'text-hazard-medium' : 'text-hazard-low'}`}>
                    {ing.risk}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <SustainabilityPanel product={p} />
          <PricePanel product={p} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Chemical Purpose Details</CardTitle></CardHeader>
          <CardContent>
            {p.ingredientDetails?.filter(i => i.purpose).map((ing, i) => (
              <div key={i} className="flex gap-3 p-3 bg-deep-900 rounded-lg mb-2">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: RISK_COLORS[ing.risk] }} />
                <div>
                  <p className="text-sm text-white font-medium">{ing.name}</p>
                  <p className="text-xs text-gray-500">Purpose: {ing.purpose}</p>
                  {ing.affectedOrgans?.length > 0 && (
                    <p className="text-xs text-gray-600 mt-0.5">Affects: {ing.affectedOrgans.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <CommentSection productId={p.id} />
      </div>
    </div>
  )
}
