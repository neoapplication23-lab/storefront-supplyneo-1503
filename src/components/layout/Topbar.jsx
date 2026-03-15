import React, { useState } from 'react'
import { isValidImageSrc } from '../../utils/image'
import { LANGUAGES, t } from '../../i18n'

export default function Topbar({ appearance, cartCount, cartTotal, onOpenCart, lang, onLangChange }) {
  const pc      = appearance?.primaryColor || '#2563eb'
  const bizName = appearance?.businessName || ''
  const logo    = isValidImageSrc(appearance?.logo) ? appearance.logo : ''
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = LANGUAGES.find(l => l.code === (lang || 'en')) || LANGUAGES[0]

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

      {/* Right: lang switcher + cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Language switcher */}
        {onLangChange && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{
                height: 36, display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 12px', borderRadius: 'var(--r-pill)',
                background: 'transparent',
                border: '1.5px solid var(--border-soft)',
                cursor: 'pointer', outline: 'none',
                fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
              }}
            >
              <span>{currentLang.code.toUpperCase()}</span>
              <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute', top: 42, right: 0, zIndex: 200,
                background: '#fff', border: '1px solid var(--border-subtle)',
                borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                overflow: 'hidden', minWidth: 140,
              }}>
                {LANGUAGES.map(lg => (
                  <button
                    key={lg.code}
                    onClick={() => { onLangChange(lg.code); setLangOpen(false) }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 14px',
                      background: lg.code === (lang || 'en') ? `${pc}10` : 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: lg.code === (lang || 'en') ? 600 : 400,
                      color: lg.code === (lang || 'en') ? pc : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {lg.label}
                    {lg.code === (lang || 'en') && (
                      <svg style={{ marginLeft: 'auto' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={pc} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart button */}
        <button
          onClick={cartCount > 0 && onOpenCart ? onOpenCart : undefined}
          style={{
            height: 36, display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 14px', borderRadius: 'var(--r-pill)',
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
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>
              {t(lang || 'en', 'cart')}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
