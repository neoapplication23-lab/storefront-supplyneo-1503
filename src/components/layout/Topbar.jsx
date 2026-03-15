import React from 'react'
import { isValidImageSrc } from '../../utils/image'

export default function Topbar({ appearance, cartCount, cartTotal, onOpenCart }) {
  const pc      = appearance?.primaryColor || '#2563eb'
  const bizName = appearance?.businessName || ''
  const logo    = isValidImageSrc(appearance?.logo) ? appearance.logo : ''

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 'var(--z-topbar)',
      height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(16px, 4vw, 36px)',
      background: 'rgba(248,247,245,.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {logo ? (
          <img src={logo} alt={bizName} style={{ height: 38, objectFit: 'contain' }}
            onError={e => e.currentTarget.style.display = 'none'} />
        ) : bizName ? (
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
            color: 'var(--text-primary)', letterSpacing: '-.01em',
          }}>
            {bizName}
          </span>
        ) : null}
      </div>

      {/* Cart */}
      <button
        onClick={cartCount > 0 && onOpenCart ? onOpenCart : undefined}
        style={{
          height: 36, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 14px',
          borderRadius: 'var(--r-pill)',
          background: cartCount > 0 ? pc : 'transparent',
          border: `1.5px solid ${cartCount > 0 ? pc : 'var(--border-soft)'}`,
          transition: 'all 220ms ease',
          cursor: cartCount > 0 ? 'pointer' : 'default',
          outline: 'none',
          boxShadow: cartCount > 0 ? `0 2px 10px ${pc}30` : 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={cartCount > 0 ? '#fff' : 'var(--text-muted)'}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {cartCount > 0 ? (
          <span style={{ fontWeight: 600, fontSize: 13, color: '#fff', whiteSpace: 'nowrap' }}>
            {cartCount} · €{cartTotal.toFixed(2)}
          </span>
        ) : (
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>Cart</span>
        )}
      </button>
    </header>
  )
}
