import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { useStore } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { parseBarcode } from '../../services/barcodeService'

export const BarcodePage = () => {
  const scannerRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const { processBarcode, fetchProduct } = useStore(s => ({ processBarcode: s.processBarcode, fetchProduct: s.fetchProduct }))
  const navigate = useNavigate()

  useEffect(() => {
    let scanner
    const init = async () => {
      try {
        scanner = new Html5Qrcode('barcode-reader')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 250, height: 150 } },
          onScanSuccess,
          () => {}
        )
        setCameraReady(true)
      } catch (err) {
        setError('Camera access denied or not available. Use manual entry instead.')
      }
    }
    init()
    return () => { scanner?.stop().catch(() => {}); scanner?.clear().catch(() => {}) }
  }, [])

  const onScanSuccess = async (decodedText) => {
    if (scanResult) return
    const parsed = parseBarcode(decodedText)
    if (!parsed.valid) return
    setScanResult(parsed)
    await processBarcode(decodedText)
    await fetchProduct(decodedText)
    setTimeout(() => navigate(`/product/${decodedText}`), 800)
  }

  const handleManualRedirect = () => navigate('/scan/manual')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Barcode Scanner</h1>
        <p className="text-gray-500 text-sm mt-1">Point your camera at a product barcode or QR code</p>
      </div>

      <Card className="overflow-hidden">
        <div id="barcode-reader" className="w-full aspect-[4/3] bg-black rounded-lg overflow-hidden relative">
          {!cameraReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 text-center">
            <div className="text-hazard-high text-lg mb-2">⚠️</div>
            <p className="text-gray-400 text-sm mb-3">{error}</p>
            <Button onClick={handleManualRedirect}>Go to Manual Entry</Button>
          </div>
        )}

        {scanResult && (
          <div className="p-4 border-t border-deep-700 bg-deep-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
              <div>
                <p className="text-sm text-white font-medium">Barcode Detected</p>
                <p className="text-xs text-gray-400">{scanResult.code} ({scanResult.format})</p>
              </div>
              <Spinner size="sm" className="ml-auto" />
            </div>
          </div>
        )}
      </Card>

      <div className="mt-4 flex gap-3 justify-center">
        <Button variant="outline" onClick={handleManualRedirect}>Enter Barcode Manually</Button>
        <Button variant="ghost" onClick={() => navigate('/scan/visual')}>Visual Scan Instead</Button>
      </div>
    </div>
  )
}
