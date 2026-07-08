import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { validateEmail, validatePassword, validateName, validateAge, validateWeight } from '../../utils/validators'

const dietOptions = [
  { value: '', label: 'None' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-sugar', label: 'Low Sugar' },
  { value: 'low-fat', label: 'Low Fat' }
]

const goalOptions = [
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'lose', label: 'Lose Weight' },
  { value: 'gain', label: 'Gain Weight' }
]

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', weight: '', allergies: '', dietaryRestrictions: '', weightGoal: 'maintain' })
  const [errors, setErrors] = useState({})
  const { register, isLoading, error } = useStore(s => ({ register: s.register, isLoading: s.isLoading, error: s.error }))
  const navigate = useNavigate()

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    const nameErr = validateName(form.name); if (nameErr) errs.name = nameErr
    if (!validateEmail(form.email)) errs.email = 'Valid email required'
    const pwErr = validatePassword(form.password); if (pwErr) errs.password = pwErr
    const ageErr = validateAge(form.age); if (ageErr) errs.age = ageErr
    const weightErr = validateWeight(form.weight); if (weightErr) errs.weight = weightErr
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const success = await register({
      ...form,
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      dietaryRestrictions: form.dietaryRestrictions ? [form.dietaryRestrictions] : []
    })
    if (success) navigate('/dashboard/overview', { replace: true })
  }

  return (
    <div className="min-h-screen bg-deep-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep-950 font-bold text-lg mx-auto mb-4">B</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join BioScan 3D and start scanning</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-deep-800/50 border border-deep-700 rounded-2xl p-6 space-y-4">
          {error && <div className="bg-hazard-high/10 border border-hazard-high/30 text-hazard-high text-sm rounded-lg p-3">{error}</div>}

          <Input label="Full Name" placeholder="Alex Rivera" value={form.name} onChange={update('name')} error={errors.name} />
          <Input label="Email" type="email" placeholder="alex@example.com" value={form.email} onChange={update('email')} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={update('password')} error={errors.password} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" placeholder="32" value={form.age} onChange={update('age')} error={errors.age} />
            <Input label="Weight (kg)" type="number" placeholder="75" value={form.weight} onChange={update('weight')} error={errors.weight} />
          </div>
          <Input label="Allergies (comma-separated)" placeholder="peanuts, dairy, gluten" value={form.allergies} onChange={update('allergies')} />
          <Select label="Dietary Preference" options={dietOptions} value={form.dietaryRestrictions} onChange={update('dietaryRestrictions')} />
          <Select label="Weight Goal" options={goalOptions} value={form.weightGoal} onChange={update('weightGoal')} />

          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/auth/login" className="text-accent-cyan hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
