import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center',
          background: 'var(--gray-100)'
        }}>
          <div style={{
            maxWidth: '500px',
            background: 'var(--white)',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h1 style={{ color: 'var(--primary-red)', marginBottom: '20px' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ marginBottom: '20px', color: 'var(--gray-800)' }}>
              We apologize for the inconvenience. The Esubu SACCO team has been notified.
            </p>
            <div style={{ marginBottom: '30px' }}>
              <div className="sasra-badge">Licensed by SASRA</div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ marginRight: '10px' }}
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-outline"
            >
              Go Home
            </button>
            
            <div style={{ marginTop: '30px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              <p>Need help? Contact us:</p>
              <p>📧 info@esubusacco.co.ke</p>
              <p>📞 +254-700-123-456</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
