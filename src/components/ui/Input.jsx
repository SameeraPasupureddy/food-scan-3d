import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, className = '', icon, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
        <input
          ref={ref}
          className={`w-full bg-deep-900 border border-deep-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors ${icon ? 'pl-10' : ''} ${error ? 'border-hazard-high' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-hazard-high">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'

export const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <select
        className={`w-full bg-deep-900 border border-deep-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors ${error ? 'border-hazard-high' : ''} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-hazard-high">{error}</p>}
    </div>
  )
}
