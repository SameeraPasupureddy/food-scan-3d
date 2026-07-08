import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '../components/layout/AppShell'

import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'

import { OverviewPage } from '../pages/dashboard/OverviewPage'
import { HistoryPage } from '../pages/dashboard/HistoryPage'
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage'
import { MealPlansPage } from '../pages/dashboard/MealPlansPage'
import { AchievementsPage } from '../pages/dashboard/AchievementsPage'
import { SettingsPage } from '../pages/dashboard/SettingsPage'

import { BarcodePage } from '../pages/scan/BarcodePage'
import { VisualScanPage } from '../pages/scan/VisualScanPage'
import { ManualEntryPage } from '../pages/scan/ManualEntryPage'

import { ProductPage } from '../pages/product/ProductPage'

import { LeaderboardPage } from '../pages/community/LeaderboardPage'
import { FeedPage } from '../pages/community/FeedPage'
import { UserProfilePage } from '../pages/community/UserProfilePage'

import { SearchPage } from '../pages/explore/SearchPage'

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
)

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/dashboard/overview" element={<ProtectedLayout><OverviewPage /></ProtectedLayout>} />
      <Route path="/dashboard/history" element={<ProtectedLayout><HistoryPage /></ProtectedLayout>} />
      <Route path="/dashboard/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
      <Route path="/dashboard/meal-plans" element={<ProtectedLayout><MealPlansPage /></ProtectedLayout>} />
      <Route path="/dashboard/achievements" element={<ProtectedLayout><AchievementsPage /></ProtectedLayout>} />
      <Route path="/dashboard/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />

      <Route path="/scan/barcode" element={<ProtectedLayout><BarcodePage /></ProtectedLayout>} />
      <Route path="/scan/visual" element={<ProtectedLayout><VisualScanPage /></ProtectedLayout>} />
      <Route path="/scan/manual" element={<ProtectedLayout><ManualEntryPage /></ProtectedLayout>} />
      <Route path="/scan" element={<Navigate to="/scan/barcode" replace />} />

      <Route path="/product/:id" element={<ProtectedLayout><ProductPage /></ProtectedLayout>} />

      <Route path="/community/leaderboard" element={<ProtectedLayout><LeaderboardPage /></ProtectedLayout>} />
      <Route path="/community/feed" element={<ProtectedLayout><FeedPage /></ProtectedLayout>} />
      <Route path="/community/users/:id" element={<ProtectedLayout><UserProfilePage /></ProtectedLayout>} />
      <Route path="/community" element={<Navigate to="/community/leaderboard" replace />} />

      <Route path="/explore/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
      <Route path="/explore" element={<Navigate to="/explore/search" replace />} />

      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen bg-deep-950 text-white">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-accent-cyan mb-4">404</h1>
            <p className="text-xl text-gray-400 mb-8">Page not found</p>
            <a href="/" className="px-6 py-3 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  )
}
