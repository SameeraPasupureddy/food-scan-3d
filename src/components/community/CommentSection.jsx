import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { timeAgo } from '../../utils/formatters'

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-sm transition ${star <= (value || 0) ? 'text-gold' : 'text-gray-600 hover:text-gray-400'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export const CommentSection = ({ productId }) => {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const { comments, fetchComments, addComment } = useStore(s => ({
    comments: s.comments, fetchComments: s.fetchComments, addComment: s.addComment
  }))

  useEffect(() => { fetchComments(productId) }, [productId])

  const productComments = comments[productId] || []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || !rating) return
    addComment(productId, text.trim(), rating)
    setText('')
    setRating(0)
  }

  return (
    <Card>
      <CardHeader><CardTitle>Community Reviews</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-deep-900 rounded-lg">
          <StarRating value={rating} onChange={setRating} />
          <textarea
            placeholder="Share your thoughts on this product..."
            className="w-full bg-deep-950 border border-deep-700 rounded-lg p-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-accent-cyan"
            rows={2}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!text.trim() || !rating}>Post Review</Button>
          </div>
        </form>

        {productComments.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">No reviews yet. Be the first!</p>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {productComments.map((c) => (
            <div key={c.id} className="p-3 bg-deep-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <img src={c.avatar} alt="" className="w-5 h-5 rounded-full bg-deep-700" />
                <span className="text-xs font-medium text-white">{c.userName}</span>
                <span className="text-[10px] text-gray-600">{timeAgo(c.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-300">{c.text}</p>
              <StarRating value={c.rating} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
