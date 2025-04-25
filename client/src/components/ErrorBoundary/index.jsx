import React, { Component } from 'react';
import VercelErrorHandler from './VercelErrorHandler';
import { isVercelDeploymentError } from '../../utils/vercelErrorHandling';

/**
 * Error Boundary class component to catch and handle errors in the application
 * with special handling for Vercel deployment-related errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error 
    };
  }

  /**
   * Capture additional error information when an error occurs
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo
    });
    
    // You could also send this to an error tracking service
    // like Sentry or LogRocket in a production application
  }

  /**
   * Reset the error state to allow the app to try again
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const isVercelError = isVercelDeploymentError(error);
      
      // Use custom Vercel error handler for Vercel-specific errors
      if (isVercelError) {
        return <VercelErrorHandler error={error} resetError={this.resetError} />;
      }
      
      // Generic error fallback
      return (
        <div style={{ padding: '20px', margin: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>{error?.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={this.resetError}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 