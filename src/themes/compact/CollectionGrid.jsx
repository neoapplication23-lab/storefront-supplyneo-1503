import React from 'react'
import { motion } from 'framer-motion'
import { isValidImageSrc } from '../../utils/image'

export default function CollectionGrid({ collections, products, primaryColor, onSelectCollection }) {
  const pc = primaryColor || '#2563eb'
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px clamp(16px,4vw,28px) 80px' }}>
      {/* Section label */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
        Categories
      </p>
      {/* Horizontal scroll chips on mobile, wrapped grid on desktop */}
      <div className="no-scrollbar" style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
      }}>
        {collections.map((col, i) => {
          const count = col.productIds?.filter(pid => products.find(p => p.id === pid)).length || 0
          const imgProduct = products.find(p => col.productIds?.includes(p.id) && isValidImageSrc(p.image_url))
          const img = isValidImageSrc(col.image) ? col.image : imgProduct?.image_url || null

          return (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, scale: .94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .2, delay: i * .03 }}
              whileTap={{ scale: .95 }}
              onClick={() => onSelectCollection(col)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px 8px 8px',
                border: '1px solid rgba(28,28,26,.1)',
                borderRadius: 'var(--r-pill)',
                background: '#fff',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = pc; e.currentTarget.style.background = `${pc}06` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(28,28,26,.1)'; e.currentTarget.style.background = '#fff' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: img ? `${pc}08` : `${pc}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {img
                  ? <img src={img} alt={col.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                  : <span style={{ fontSize: 16 }}>🗂️</span>
                }
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-.01em' }}>{col.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{count} items</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
