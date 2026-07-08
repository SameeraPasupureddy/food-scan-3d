import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { AllergenHeatmap } from '../../components/charts/AllergenHeatmap'
import { ProgressBar } from '../../components/ui/ProgressBar'

export const AnalyticsPage = () => {
  const { totalScans, averageHazardScore, allergenExposure, nutritionTrends, streakDays, isLoading, fetchAnalytics, exportData } = useStore(s => ({
    totalScans: s.totalScans, averageHazardScore: s.averageHazardScore, allergenExposure: s.allergenExposure,
    nutritionTrends: s.nutritionTrends, streakDays: s.streakDays, isLoading: s.isLoading,
    fetchAnalytics: s.fetchAnalytics, exportData: s.exportData
  }))
  const user = useStore(s => s.user)
  const [exporting, setExporting] = useState(null)

  useEffect(() => { fetchAnalytics(user?.id) }, [])

  const handleExport = async (format) => {
    setExporting(format)
    const result = await exportData(format)
    if (result) {
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(null)
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const avgCalories = nutritionTrends.length > 0 ? Math.round(nutritionTrends.reduce((s, d) => s + d.calories, 0) / nutritionTrends.length) : 0
  const avgProtein = nutritionTrends.length > 0 ? Math.round(nutritionTrends.reduce((s, d) => s + d.protein, 0) / nutritionTrends.length) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Deep insights into your scanning patterns</p>
        </div>
        <div className="flex gap-2">
          {['csv', 'json', 'pdf'].map(f => (
            <Button key={f} variant="outline" size="sm" onClick={() => handleExport(f)} disabled={exporting === f}>
              {exporting === f ? '...' : f.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-accent-cyan">{totalScans}</p><p className="text-xs text-gray-500">Total Scans</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className={`text-2xl font-bold ${averageHazardScore > 50 ? 'text-hazard-high' : averageHazardScore > 30 ? 'text-amber-400' : 'text-green-400'}`}>{averageHazardScore}</p><p className="text-xs text-gray-500">Avg Hazard</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-gold">{streakDays}</p><p className="text-xs text-gray-500">Day Streak</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-accent-purple">{avgCalories}</p><p className="text-xs text-gray-500">Avg Daily Cals</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <AllergenHeatmap data={allergenExposure} />

        <Card>
          <CardHeader><CardTitle>Nutrition Trends</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {nutritionTrends.slice(-7).reverse().map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span>{d.calories} cal</span>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="bg-accent-cyan rounded-l-full" style={{ flex: d.protein }} />
                  <div className="bg-accent-purple" style={{ flex: d.carbs }} />
                  <div className="bg-gold rounded-r-full" style={{ flex: d.fat }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Weekly Averages</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-deep-900 rounded-lg">
            <p className="text-lg font-bold text-accent-cyan">{avgCalories}</p>
            <p className="text-xs text-gray-500">Calories</p>
          </div>
          <div className="text-center p-3 bg-deep-900 rounded-lg">
            <p className="text-lg font-bold text-accent-purple">{avgProtein}g</p>
            <p className="text-xs text-gray-500">Protein</p>
          </div>
          <div className="text-center p-3 bg-deep-900 rounded-lg">
            <p className="text-lg font-bold text-gold">{avgCalories > 2000 ? 'High' : avgCalories > 1500 ? 'Moderate' : 'Low'}</p>
            <p className="text-xs text-gray-500">Intake Level</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Data Export</CardTitle></CardHeader>
        <CardContent className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => handleExport('csv')} disabled={exporting === 'csv'}>Export CSV</Button>
          <Button variant="secondary" onClick={() => handleExport('json')} disabled={exporting === 'json'}>Export JSON</Button>
          <Button variant="secondary" onClick={() => handleExport('pdf')} disabled={exporting === 'pdf'}>Export PDF</Button>
        </CardContent>
      </Card>
    </div>
  )
}
