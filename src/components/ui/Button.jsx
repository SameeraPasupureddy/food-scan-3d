export const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-950 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-accent-cyan text-deep-950 hover:bg-accent-cyan/90 focus:ring-accent-cyan',
    secondary: 'bg-deep-700 text-gray-200 hover:bg-deep-600 focus:ring-deep-600',
    danger: 'bg-hazard-high/20 text-hazard-high hover:bg-hazard-high/30 focus:ring-hazard-high',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-deep-800 focus:ring-deep-700',
    outline: 'border border-deep-600 text-gray-300 hover:border-accent-cyan hover:text-accent-cyan focus:ring-accent-cyan'
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }

  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
