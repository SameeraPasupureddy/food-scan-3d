import { create } from 'zustand'
import { createAuthSlice } from './slices/authSlice'
import { createScanSlice } from './slices/scanSlice'
import { createProductSlice } from './slices/productSlice'
import { createAnalyticsSlice } from './slices/analyticsSlice'
import { createMealPlanSlice } from './slices/mealPlanSlice'
import { createGamificationSlice } from './slices/gamificationSlice'
import { createCommunitySlice } from './slices/communitySlice'
import { createNotificationSlice } from './slices/notificationSlice'
import { createUiSlice } from './slices/uiSlice'

export const useStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createScanSlice(...a),
  ...createProductSlice(...a),
  ...createAnalyticsSlice(...a),
  ...createMealPlanSlice(...a),
  ...createGamificationSlice(...a),
  ...createCommunitySlice(...a),
  ...createNotificationSlice(...a),
  ...createUiSlice(...a)
}))
