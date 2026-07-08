import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'

const dietOptions = [
  { value: '', label: 'None' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-sugar', label: 'Low Sugar' }
]

const goalOptions = [
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'lose', label: 'Lose Weight' },
  { value: 'gain', label: 'Gain Weight' }
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' }
]

export const SettingsPage = () => {
  const user = useStore(s => s.user)
  const updateProfile = useStore(s => s.updateProfile)
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)
  const isLoading = useStore(s => s.isLoading)

  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    allergies: user?.allergies?.join(', ') || '',
    dietaryRestrictions: user?.dietaryRestrictions?.[0] || '',
    weightGoal: user?.weightGoal || 'maintain'
  })
  const [saved, setSaved] = useState(false)

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    await updateProfile({
      name: form.name,
      age: Number(form.age),
      weight: Number(form.weight),
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      dietaryRestrictions: form.dietaryRestrictions ? [form.dietaryRestrictions] : [],
      weightGoal: form.weightGoal
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-deep-700" />
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={update('name')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" value={form.age} onChange={update('age')} />
            <Input label="Weight (kg)" type="number" value={form.weight} onChange={update('weight')} />
          </div>
          <Input label="Allergies (comma-separated)" value={form.allergies} onChange={update('allergies')} placeholder="peanuts, dairy, gluten" />
          <Select label="Dietary Preference" options={dietOptions} value={form.dietaryRestrictions} onChange={update('dietaryRestrictions')} />
          <Select label="Weight Goal" options={goalOptions} value={form.weightGoal} onChange={update('weightGoal')} />
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Select label="Language" options={languageOptions} value={language} onChange={e => setLanguage(e.target.value)} />
          <div className="flex items-center justify-between p-3 bg-deep-900 rounded-lg">
            <div>
              <p className="text-sm text-white">Theme</p>
              <p className="text-xs text-gray-500">Dark mode only for optimal 3D viewing</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-deep-950 border border-deep-700 flex items-center justify-center text-xs text-gray-500">🌙</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-deep-900 rounded-lg">
            <div>
              <p className="text-sm text-white">Account Created</p>
              <p className="text-xs text-gray-500">{user.joinDate}</p>
            </div>
            <div className="text-xs text-gray-500">{user.id}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
