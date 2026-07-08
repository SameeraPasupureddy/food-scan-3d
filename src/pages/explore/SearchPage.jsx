import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import productsData from '../../data/products.json'

const categories = [...new Set(productsData.map(p => p.category))]

export const SearchPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('all')

  const results = useMemo(() => {
    let filtered = productsData
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (category !== 'all') filtered = filtered.filter(p => p.category === category)
    return filtered
  }, [query, category])

  const hazardColor = (product) => {
    const highCount = product.ingredients.filter(i => i.risk === 'high').length
    if (highCount > 2) return 'danger'
    if (highCount > 0) return 'warning'
    return 'success'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Explore Products</h1>
        <p className="text-gray-500 text-sm mt-1">Search our food database</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search products, brands, ingredients..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          <button onClick={() => setCategory('all')} className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${category === 'all' ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400'}`}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${category === c ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(p => (
          <Card key={p.id} hover onClick={() => navigate(`/product/${p.barcode}`)}>
            <div className="aspect-video bg-deep-900 rounded-lg mb-3 flex items-center justify-center text-4xl overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <h3 className="text-sm font-semibold text-white truncate">{p.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{p.brand}</p>
            <div className="flex items-center justify-between">
              <Badge variant={hazardColor(p)}>
                {p.ingredients.filter(i => i.risk === 'high').length > 2 ? 'High Risk' : p.ingredients.filter(i => i.risk === 'high').length > 0 ? 'Moderate' : 'Clean'}
              </Badge>
              <div className="flex gap-1">
                {p.certifications?.slice(0, 2).map(c => (
                  <span key={c} className="text-[10px] bg-deep-900 text-gray-500 px-1 py-0.5 rounded">{c.replace('_', ' ')}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">No products found</p>
          <p className="text-xs text-gray-600 mt-1">Try a different search term or category</p>
        </div>
      )}
    </div>
  )
}
