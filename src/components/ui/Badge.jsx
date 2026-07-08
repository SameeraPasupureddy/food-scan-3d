export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-deep-700 text-gray-300',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-hazard-high/20 text-hazard-high',
    info: 'bg-accent-cyan/20 text-accent-cyan',
    purple: 'bg-accent-purple/20 text-accent-purple',
    gold: 'bg-gold/20 text-gold'
  }
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
