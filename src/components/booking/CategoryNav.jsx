import React, { useRef } from 'react'

export default function CategoryNav({ collections = [], sectionIds, primaryColor, onFilterChange, activeFilter, products = [] }) {
  const pc     = primaryColor || '#2563eb'
  const navRef = useRef(null)

  function handleClick(col, idx) {
    if (col === null) {
      onFilterChange(null)
    } else {
      onFilterChange(col.name)
      const sectionIdx = collections.indexOf(col)
      const el = document.getElementById(sectionIds[sectionIdx])
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 108, behavior: 'smooth' })
    }
    navRef.current?.children[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <nav style={{
      position: 'sticky', top: 58, zIndex: 'var(--z-catnav)',
      background: 'rgba(248,247,245,.96)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div ref={navRef} className="no-scrollbar" style={{
        display: 'flex', overflowX: 'auto',
        padding: '0 clamp(16px, 4vw, 36px)',
        gap: 0,
      }}>
        {[null, ...collections].map((col, i) => {
          const isAll    = col === null
          const isActive = isAll ? activeFilter === null : activeFilter === col.name
          const count    = isAll ? products.length : (col.productIds?.filter(pid => products.find(p => p.id === pid)).length || 0)
          const label    = isAll ? 'All' : col.name

          return (
            <button
              key={isAll ? 'all' : col.id}
              onClick={() => handleClick(col, i)}
              style={{
                flexShrink: 0, padding: '14px 18px',
                border: 'none',
                borderBottom: `2px solid ${isActive ? pc : 'transparent'}`,
                background: 'transparent',
                fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? pc : 'var(--text-soft)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 180ms ease', outline: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-soft)' }}
            >
              {label}
              <span style={{
                fontSize: 11, fontWeight: 400,
                color: isActive ? pc : 'var(--text-muted)',
                background: isActive ? pc + '14' : 'var(--bg-raised)',
                borderRadius: 99, padding: '1px 7px', lineHeight: 1.6,
                transition: 'all 180ms ease',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
