import { Component } from 'react'
import { Button } from './Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[300px] p-8">
          <div className="bg-deep-800/80 border border-deep-700 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-hazard-high/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-2">
              {this.props.message || 'An unexpected error occurred in this section.'}
            </p>
            {this.state.error && (
              <details className="text-xs text-left text-gray-600 mb-4 bg-deep-900 rounded-lg p-3 max-h-24 overflow-y-auto">
                <summary className="cursor-pointer hover:text-gray-400">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={this.handleReset}>Try Again</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export const withErrorBoundary = (Component, options = {}) => {
  return (props) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  )
}
