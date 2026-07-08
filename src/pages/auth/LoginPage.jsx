import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { validateEmail } from '../../utils/validators'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, isLoading, error } = useStore(s => ({ login: s.login, isLoading: s.isLoading, error: s.error }))
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!validateEmail(email)) errs.email = 'Valid email required'
    if (!password) errs.password = 'Password required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const success = await login(email, password)
    if (success) navigate('/dashboard/overview', { replace: true })
  }

  return (
    <div className="min-h-screen bg-deep-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep-950 font-bold text-lg mx-auto mb-4">B</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your BioScan account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-deep-800/50 border border-deep-700 rounded-2xl p-6 space-y-4">
          {error && <div className="bg-hazard-high/10 border border-hazard-high/30 text-hazard-high text-sm rounded-lg p-3">{error}</div>}

          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />

          <div className="text-right">
            <Link to="/auth/forgot-password" className="text-xs text-accent-cyan hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/auth/register" className="text-accent-cyan hover:underline">Create one</Link>
        </p>

        <div className="mt-4 p-3 bg-deep-800/30 border border-deep-700 rounded-lg text-xs text-gray-500 text-center">
          Demo: alex@example.com / password123
        </div>
      </div>
    </div>
  )
}
