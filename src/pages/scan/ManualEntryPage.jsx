import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { validateBarcode } from '../../utils/validators'
import { parseBarcode } from '../../services/barcodeService'
import { analyzeFoodText } from '../../services/cvService'

export const ManualEntryPage = () => {
  const [mode, setMode] = useState('barcode')
  const [barcode, setBarcode] = useState('')
  const [foodName, setFoodName] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const { processBarcode, fetchProduct } = useStore(s => ({ processBarcode: s.processBarcode, fetchProduct: s.fetchProduct }))
  const navigate = useNavigate()

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateBarcode(barcode)) { setError('Invalid barcode. Must be 8-13 digits.'); return }
    const parsed = parseBarcode(barcode)
    await processBarcode(barcode)
    await fetchProduct(barcode)
    navigate(`/product/${barcode}`)
  }

  const handleFoodSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!foodName.trim()) { setError('Enter a food name'); return }
    const analysis = analyzeFoodText(foodName)
    if (!analysis.success) { setError('Unknown food item. Try being more specific.'); return }
    setResult(analysis)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manual Entry</h1>
        <p className="text-gray-500 text-sm mt-1">Type a barcode or describe a food item</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={mode === 'barcode' ? 'primary' : 'ghost'} onClick={() => setMode('barcode')} size="sm">Barcode</Button>
        <Button variant={mode === 'food' ? 'primary' : 'ghost'} onClick={() => setMode('food')} size="sm">Food Name</Button>
      </div>

      {mode === 'barcode' ? (
        <Card>
          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <Input
              label="Product Barcode"
              placeholder="e.g. 4901234567890"
              value={barcode}
              onChange={e => setBarcode(e.target.value.replace(/\D/g, '').slice(0, 13))}
              error={error}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600">UPC, EAN-8, EAN-13 supported</p>
              <Button type="submit" disabled={barcode.length < 8}>Look Up</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleFoodSubmit} className="space-y-4">
            <Input
              label="Food Name"
              placeholder="e.g. Grilled Chicken Breast"
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              error={error}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!foodName.trim()}>Analyze</Button>
            </div>
          </form>

          {result && (
            <div className="mt-4 pt-4 border-t border-deep-700 space-y-3">
              <p className="text-sm font-medium text-accent-cyan">Detected: {result.primaryMatch}</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(result.nutritionProfile).map(([k, v]) => (
                  <div key={k} className="text-center p-2 bg-deep-900 rounded-lg">
                    <p className="text-sm font-bold text-white">{v}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{k}</p>
                  </div>
                ))}
              </div>
              <Button size="sm" onClick={() => navigate(`/explore/search?q=${result.primaryMatch}`)}>Find in Database</Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
