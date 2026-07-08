import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { useEffect } from 'react'

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-deep-800/50 border border-deep-700 rounded-xl p-6 hover:border-accent-cyan/30 transition-all"
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </motion.div>
)

export const LandingPage = () => {
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard/overview', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-deep-950">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-deep-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep-950 font-bold text-sm">B</div>
          <span className="text-white font-bold">BioScan 3D</span>
        </div>
        <div className="flex gap-3">
          <Link to="/auth/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Login</Link>
          <Link to="/auth/register" className="px-4 py-2 text-sm bg-accent-cyan text-deep-950 rounded-lg font-medium hover:bg-accent-cyan/90 transition">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Scan. Analyze.{' '}
          <span className="text-gradient">Thrive.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
        >
          AI-powered 3D food scanning, molecular analysis, and sustainability tracking.
          Know exactly what's in your food and how it affects your body.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <Link to="/auth/register" className="px-8 py-3 bg-accent-cyan text-deep-950 rounded-lg font-semibold hover:bg-accent-cyan/90 transition text-lg">Start Free</Link>
          <Link to="/explore/search" className="px-8 py-3 border border-deep-600 text-gray-300 rounded-lg font-semibold hover:border-accent-cyan hover:text-accent-cyan transition text-lg">Explore Products</Link>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-white text-center mb-12"
        >
          Everything you need for smarter eating
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon="📷" title="Instant Scanning" desc="Scan barcodes or snap photos of any food. Our AI identifies products and whole foods in seconds." />
          <FeatureCard icon="🧬" title="3D Molecular Analysis" desc="Visualize additives as an interactive 3D molecular web. See risk levels at a glance with glowing indicators." />
          <FeatureCard icon="🧍" title="Anatomy Impact Map" desc="See how ingredients affect your organs. Click any chemical to see its path through your body." />
          <FeatureCard icon="🌱" title="Sustainability Scoring" desc="Track carbon footprint, water usage, and earn eco-badges for choosing clean, green products." />
          <FeatureCard icon="📊" title="Personal Analytics" desc="Comprehensive dashboard with allergen heatmaps, nutrition trends, and health score tracking." />
          <FeatureCard icon="🥗" title="Meal Planning" desc="AI-generated 7-day meal plans tailored to your allergies, goals, and dietary preferences." />
        </div>
      </section>

      <footer className="border-t border-deep-800 py-6 text-center">
        <p className="text-xs text-gray-600">BioScan 3D &mdash; Intelligent Food Analysis Platform &mdash; 2026</p>
      </footer>
    </div>
  )
}
