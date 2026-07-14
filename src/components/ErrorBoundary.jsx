import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorBoundary = () => {
  const error = useRouteError()

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#d32f2f', marginBottom: '1rem' }}>
        Oops! Something went wrong
      </h1>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '1.1rem' }}>
        {error?.message || 'Unable to load dashboard data'}
      </p>
      {error?.status && (
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          Error Status: {error.status}
        </p>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorBoundary
