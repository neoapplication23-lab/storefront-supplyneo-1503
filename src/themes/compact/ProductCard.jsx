import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Stepper from '../../components/ui/Stepper'
import { formatPrice } from '../../utils/money'
import { isValidImageSrc } from '../../utils/image'

// Compact theme: horizontal row layout — image left, info right
export default function ProductCard({ product, qty, primaryColor, onAdd, onRemove, onOpenModal }) {
  const pc      = primaryColor || '#2563eb'
  const inCart  = qty > 0
  const [imgError, setImgError] = useState(false)
  const [pop, setPop] = useState(0)
  const hasImage = isValidImageSrc(product.image_url) && !imgError

  const tracksInventory = !!(product.trackInventory || product.track_inventory)
  const isAvailable     = !tracksInventory || product.available !== false
  const availableQty    = product.availableQty ?? null
  const outOfStock      = tracksInventory && !isAvailable
  const atMax           = tracksInventory && availableQty !== null && qty >= availableQty

  function handleAdd(e) {
    e.stopPropagation()
    if (outOfStock || atMax) return
    onAdd(); setPop(k => k + 1)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: .22 }}
      onClick={onOpenModal}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        background: inCart && !outOfStock ? `${pc}06` : '#fff',
        borderBottom: '1px solid rgba(28,28,26,.06)',
        cursor: 'pointer',
        transition: 'background 180ms ease',
        opacity: outOfStock ? .5 : 1,
        position: 'relative',
      }}
      whileHover={outOfStock ? {} : { background: inCart ? `${pc}0a` : 'rgba(28,28,26,.02)' }}
    >
      {/* Active left bar */}
      {inCart && !outOfStock && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: pc, borderRadius: '0 2px 2px 0' }} />
      )}

      {/* Image */}
      <div style={{
        width: 58, height: 58, borderRadius: 10, flexShrink: 0,
        background: hasImage ? `${pc}08` : `${pc}0d`,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {hasImage
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
              style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
          : <span style={{ fontSize: 26 }}>{product.emoji || '📦'}</span>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', letterSpacing: '-.01em', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </p>
        <p style={{ fontWeight: 700, fontSize: 14, color: inCart && !outOfStock ? pc : 'var(--text-primary)', letterSpacing: '-.01em', transition: 'color 180ms ease' }}>
          {formatPrice(product.price)}
          {product.unit && <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>/ day</span>}
        </p>
      </div>

      {/* Action */}
      <div onClick={e => e.stopPropagation()}>
        {outOfStock ? (
          <span style={{ fontSize: 10.5, color: '#b04040', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>N/A</span>
        ) : inCart ? (
          <Stepper qty={qty} onAdd={atMax ? undefined : onAdd} onRemove={onRemove} primaryColor={pc} maxReached={atMax} />
        ) : (
          <motion.button
            key={`add-${pop}`}
            whileTap={{ scale: .88 }}
            onClick={handleAdd}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: `1.5px solid ${pc}`,
              background: 'transparent', color: pc,
              fontSize: 20, fontWeight: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 150ms ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = pc; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = pc }}
          >+</motion.button>
        )}
      </div>
    </motion.div>
  )
}
