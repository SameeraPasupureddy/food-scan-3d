import { detectLanguage } from '../../utils/localization'

export const createUiSlice = (set, get) => ({
  sidebarOpen: true,
  language: detectLanguage(),
  modal: null,
  isMobile: false,
  theme: 'dark',

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),

  setLanguage: (lang) => set({ language: lang }),

  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),

  setIsMobile: (val) => set({ isMobile: val, sidebarOpen: !val })
})
