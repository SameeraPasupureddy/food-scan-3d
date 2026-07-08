import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { validateEmail } from '../../utils/validators'

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateEmail(email)) { setError('Valid email required'); return }
    setError('')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-deep-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep-950 font-bold text-lg mx-auto mb-4">B</div>
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <p className="text-gray-500 text-sm mt-1">We'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="bg-deep-800/50 border border-deep-700 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-white text-sm mb-2">Check your inbox</p>
            <p className="text-gray-500 text-xs mb-4">If an account exists for <strong className="text-gray-300">{email}</strong>, you'll receive a password reset link shortly.</p>
            <Link to="/auth/login" className="text-sm text-accent-cyan hover:underline">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-deep-800/50 border border-deep-700 rounded-2xl p-6 space-y-4">
            {error && <div className="bg-hazard-high/10 border border-hazard-high/30 text-hazard-high text-sm rounded-lg p-3">{error}</div>}
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <Button type="submit" className="w-full">Send Reset Link</Button>
            <div className="text-center">
              <Link to="/auth/login" className="text-xs text-gray-500 hover:text-accent-cyan transition">Back to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
