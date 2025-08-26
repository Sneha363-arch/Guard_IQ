
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-white text-center p-8 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl mb-2">AR Simulation Error</h3>
            <p className="text-gray-300 mb-4">
              The 3D animation encountered an error. This might be due to browser compatibility or WebGL issues.
            </p>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs text-gray-400 mb-4 max-h-32 overflow-y-auto">
                <summary className="cursor-pointer mb-2">Error Details</summary>
                <pre className="whitespace-pre-wrap">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2 justify-center">
              <button 
                onClick={this.handleRetry}
                className="px-4 py-2 bg-purple-500 rounded text-white hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleRefresh}
                className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              💡 If the problem persists, try using a different browser or enabling hardware acceleration.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
