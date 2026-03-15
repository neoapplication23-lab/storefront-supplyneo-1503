import React from 'react'

export default function Stepper({ qty, onAdd, onRemove, primaryColor, maxReached, compact }) {
  const pc = primaryColor || '#0ea5e9'
  const btnSize = compact ? 28 : 34
  const fontSize = compact ? 13 : 14
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 0,
      background: 'rgba(255,255,255,.05)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--r-pill)',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <StepBtn onClick={onRemove} label="−" size={btnSize} />
      <span style={{
        minWidth: compact ? 22 : 32, textAlign: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize,
        color: 'var(--text-primary)', userSelect: 'none', letterSpacing: '.02em',
      }}>
        {qty}
      </span>
      <StepBtn onClick={maxReached ? undefined : onAdd} label="+" disabled={maxReached} size={btnSize} />
    </div>
  )
}

function StepBtn({ onClick, label, disabled, size = 34 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size, height: size, border: 'none',
        background: 'transparent',
        color: disabled ? 'var(--border-subtle)' : 'var(--text-secondary)',
        fontSize: 16, fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 150ms ease, color 150ms ease',
        flexShrink: 0, lineHeight: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => {
        if (!disabled) { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'var(--text-primary)' }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = disabled ? 'var(--border-subtle)' : 'var(--text-secondary)'
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(.88)' }}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {label}
    </button>
  )
}
