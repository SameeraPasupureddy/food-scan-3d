const shareLinks = [
  { name: 'Twitter', icon: '𝕏', url: (t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}` },
  { name: 'Facebook', icon: 'f', url: (t) => `https://facebook.com/sharer/sharer.php?quote=${encodeURIComponent(t)}` },
  { name: 'WhatsApp', icon: 'WA', url: (t) => `https://wa.me/?text=${encodeURIComponent(t)}` },
  { name: 'Copy Link', icon: '🔗', url: () => '#' }
]

export const ShareButtons = ({ productName, barcode }) => {
  const text = `Check out ${productName} on BioScan 3D - I just scanned it!`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    } catch {}
  }

  return (
    <div className="flex gap-2">
      {shareLinks.map(s => (
        <a
          key={s.name}
          href={s.name === 'Copy Link' ? '#' : s.url(text)}
          onClick={s.name === 'Copy Link' ? (e) => { e.preventDefault(); handleCopy() } : undefined}
          target={s.name !== 'Copy Link' ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-deep-800 flex items-center justify-center text-xs text-gray-400 hover:text-accent-cyan hover:bg-deep-700 transition"
          title={s.name}
        >
          {s.icon}
        </a>
      ))}
    </div>
  )
}
