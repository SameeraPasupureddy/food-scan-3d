import { useState } from 'react'

export const Tabs = ({ tabs, defaultTab, onChange, className = '' }) => {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const handleChange = (id) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={className}>
      <div className="flex border-b border-deep-700 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.id
                ? 'border-accent-cyan text-accent-cyan'
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-deep-600'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  )
}
