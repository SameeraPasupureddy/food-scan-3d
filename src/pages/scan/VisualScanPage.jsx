import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'
import { analyzeFoodImage } from '../../services/cvService'

export const VisualScanPage = () => {
  const fileInputRef = useRef(null)
  const [image, setImage] = useState(null)
  const [results, setResults] = useState(null)
  const [scanning, setScanning] = useState(false)
  const { processVisualScan } = useStore(s => ({ processVisualScan: s.processVisualScan }))
  const navigate = useNavigate()

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleScan = async () => {
    if (!image) return
    setScanning(true)
    const results = await analyzeFoodImage(image)
    await processVisualScan(image)
    setResults(results)
    setScanning(false)
  }

  const confidenceColor = (c) => {
    if (c > 0.9) return 'success'
    if (c > 0.7) return 'warning'
    return 'danger'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Visual Food Recognition</h1>
        <p className="text-gray-500 text-sm mt-1">Upload or snap a photo of whole foods for AI analysis</p>
      </div>

      <Card>
        {!image ? (
          <div
            className="aspect-[4/3] border-2 border-dashed border-deep-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-cyan/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-3">📷</div>
            <p className="text-gray-400 text-sm">Tap to upload a food photo</p>
            <p className="text-gray-600 text-xs mt-1">Supports JPG, PNG, WEBP</p>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={image} alt="Captured food" className="w-full aspect-[4/3] object-cover rounded-xl" />
            <div className="flex gap-3">
              <Button onClick={() => { setImage(null); setResults(null) }} variant="secondary">Retake</Button>
              <Button onClick={handleScan} disabled={scanning} className="flex-1">
                {scanning ? <><Spinner size="sm" className="mr-2" /> Analyzing...</> : 'Analyze Food'}
              </Button>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </Card>

      {results && (
        <div className="mt-4 space-y-3">
          <Card>
            <CardHeader><CardTitle>AI Detection Results</CardTitle></CardHeader>
            <div className="space-y-3">
              {results.detections.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-deep-900 rounded-lg">
                  <div>
                    <p className="text-sm text-white font-medium">{d.foodType}</p>
                    <p className="text-xs text-gray-500">{d.category}</p>
                  </div>
                  <Badge variant={confidenceColor(d.confidence)}>{(d.confidence * 100).toFixed(0)}%</Badge>
                </div>
              ))}
            </div>
          </Card>

          {results.nutritionProfile && (
            <Card>
              <CardHeader><CardTitle>Estimated Nutrition Profile</CardTitle></CardHeader>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(results.nutritionProfile).map(([key, val]) => (
                  <div key={key} className="text-center p-2 bg-deep-900 rounded-lg">
                    <p className="text-lg font-bold text-accent-cyan">{val}</p>
                    <p className="text-xs text-gray-500 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/scan/barcode')}>Switch to Barcode</Button>
            <Button onClick={() => navigate(`/explore/search?q=${results.primaryMatch}`)}>Find Similar Products</Button>
          </div>
        </div>
      )}
    </div>
  )
}
