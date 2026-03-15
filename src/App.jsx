import React from 'react'
import BookingPage from './components/booking/BookingPage'
import NotFound from './components/booking/NotFound'

function resolveBookingCode() {
  const pathMatch = window.location.pathname.match(/\/booking\/([^/?#]+)/)
  if (pathMatch?.[1]) return pathMatch[1]
  const params = new URLSearchParams(window.location.search)
  const qCode = params.get('booking') || params.get('code')
  if (qCode) return qCode
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_BOOKING_CODE) {
    return import.meta.env.VITE_DEV_BOOKING_CODE
  }
  return null
}

// ── Error boundary to catch any unexpected render errors ──
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('BookingPage error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 12,
          fontFamily: 'system-ui, sans-serif', color: '#374151',
          background: '#f9fafb', padding: 24,
        }}>
          <div style={{ fontSize: 48 }}>⚓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Loading your booking…</h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: '10px 20px', borderRadius: 8,
              background: '#2563eb', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const code = resolveBookingCode()

  if (!code) {
    return (
      <NotFound
        message={
          import.meta.env.DEV
            ? 'No booking code found. Set VITE_DEV_BOOKING_CODE in .env.development or visit /?booking=XXXX'
            : 'No booking code provided.'
        }
      />
    )
  }

  return (
    <ErrorBoundary>
      <BookingPage code={code} />
    </ErrorBoundary>
  )
}
