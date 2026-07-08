export const createCommunitySlice = (set, get) => ({
  comments: {},
  followedUsers: [],
  feed: [],
  productRatings: {},

  fetchComments: async (productId) => {
    await new Promise(r => setTimeout(r, 400))
    const mockComments = [
      { id: 'cmt-1', productId, userId: 'user-001', userName: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', text: 'Great product! I use this daily.', rating: 4, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'cmt-2', productId, userId: 'user-002', userName: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', text: 'Check the ingredients list - there are some additives.', rating: 3, timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'cmt-3', productId, userId: 'user-003', userName: 'Marcus Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', text: 'Good alternative options listed. The eco score is decent.', rating: 4, timestamp: new Date().toISOString() }
    ]
    set(state => ({
      comments: { ...state.comments, [productId]: mockComments }
    }))
  },

  addComment: (productId, text, rating) => {
    const state = get()
    const comment = {
      id: `cmt-${Date.now()}`,
      productId,
      userId: 'user-current',
      userName: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      text,
      rating,
      timestamp: new Date().toISOString()
    }
    const existing = state.comments[productId] || []
    set({ comments: { ...state.comments, [productId]: [comment, ...existing] } })
  },

  followUser: (userId) => {
    set(state => ({
      followedUsers: state.followedUsers.includes(userId) ? state.followedUsers : [...state.followedUsers, userId]
    }))
  },

  unfollowUser: (userId) => {
    set(state => ({
      followedUsers: state.followedUsers.filter(id => id !== userId)
    }))
  }
})
