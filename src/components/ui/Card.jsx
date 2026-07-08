export const Card = ({ children, className = '', glow = false, onClick, hover = false }) => {
  return (
    <div
      className={`bg-deep-800/80 border border-deep-700 rounded-xl p-5 ${glow ? 'glow-cyan' : ''} ${hover ? 'hover:border-deep-600 hover:bg-deep-800 transition-all cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)
