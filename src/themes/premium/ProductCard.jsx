import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../../components/ui/Badge'
import Stepper from '../../components/ui/Stepper'
import { formatPrice } from '../../utils/money'
import { isValidImageSrc } from '../../utils/image'

export default function ProductCard({ product, qty, primaryColor, onAdd, onRemove, onOpenModal }) {
  const pc      = primaryColor || '#c9a84c'
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
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [.22,1,.36,1] }}
      onClick={onOpenModal}
      style={{
        background: inCart && !outOfStock ? '#1c1c1c' : '#161616',
        border: `1px solid ${inCart && !outOfStock ? pc + '45' : 'rgba(255,255,255,.08)'}`,
        borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', position: 'relative',
        opacity: outOfStock ? .45 : 1,
        boxShadow: inCart ? `0 0 0 1px ${pc}20, 0 8px 32px rgba(0,0,0,.4)` : '0 2px 12px rgba(0,0,0,.3)',
        transition: 'all 220ms ease',
      }}
      whileHover={outOfStock ? {} : {
        y: -4,
        boxShadow: inCart ? `0 0 0 1px ${pc}40, 0 12px 40px rgba(0,0,0,.5)` : `0 0 0 1px ${pc}20, 0 12px 40px rgba(0,0,0,.5)`,
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative', aspectRatio: '16/10', overflow: 'hidden',
        background: `linear-gradient(135deg, #1e1e1e, #252525)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {hasImage
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} className="card-img"
              style={{ width: '82%', height: '82%', objectFit: 'contain', transition: 'transform 600ms ease', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.5))' }} />
          : <span style={{ fontSize: 44, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.4))' }}>{product.emoji || '📦'}</span>
        }

        {/* Gold top border when in cart */}
        <AnimatePresence>
          {inCart && !outOfStock && (
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${pc}, transparent)`, transformOrigin: 'center' }} />
          )}
        </AnimatePresence>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
          {product.popular     && <Badge type="popular"     primaryColor={pc} />}
          {product.limited     && <Badge type="limited" />}
          {product.recommended && <Badge type="recommended" primaryColor={pc} />}
        </div>

        {/* In-cart indicator */}
        <AnimatePresence>
          {inCart && !outOfStock && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 460, damping: 22 }}
              style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: pc, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 10px ${pc}60` }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5l2.5 2.5 4.5-5" stroke="#000" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {outOfStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: 'rgba(180,30,30,.85)', padding: '5px 14px', borderRadius: 'var(--r-pill)' }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1 }}>
        <h3 style={{ fontWeight: 600, fontSize: 14, color: '#fff', letterSpacing: '-.01em', lineHeight: 1.3 }}>
          {product.name}
        </h3>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          paddingTop: 10, borderTop: `1px solid ${inCart ? pc + '25' : 'rgba(255,255,255,.08)'}`,
          marginTop: 'auto', transition: 'border-color 220ms ease',
        }}>
          <div>
            {product.comparePrice > 0 && product.comparePrice > product.price && (
              <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,.3)', textDecoration: 'line-through', marginBottom: 1 }}>
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span style={{ fontWeight: 700, fontSize: 18, color: inCart ? pc : '#fff', transition: 'color 220ms ease', letterSpacing: '-.02em' }}>
              {formatPrice(product.price)}
            </span>
            {product.unit && (
              <span style={{ display: 'block', fontSize: 10.5, color: 'rgba(255,255,255,.35)', marginTop: 1 }}>per day</span>
            )}
          </div>

          {outOfStock ? (
            <span style={{ fontSize: 10.5, color: 'rgba(255,100,100,.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>N/A</span>
          ) : (
            <AnimatePresence mode="wait">
              {inCart ? (
                <motion.div key="stepper" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }} transition={{ duration: .15 }} onClick={e => e.stopPropagation()}>
                  <Stepper qty={qty} onAdd={atMax ? undefined : onAdd} onRemove={onRemove} primaryColor={pc} maxReached={atMax} />
                </motion.div>
              ) : (
                <motion.button key={`add-${pop}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: .15 }} whileTap={{ scale: .88 }}
                  onClick={handleAdd}
                  style={{
                    height: 34, padding: '0 16px', borderRadius: 'var(--r-pill)',
                    border: `1.5px solid ${pc}`,
                    background: 'transparent', color: pc,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 160ms ease', whiteSpace: 'nowrap', minHeight: 44,
                    display: 'flex', alignItems: 'center', gap: 4,
                    letterSpacing: '.02em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = pc; e.currentTarget.style.color = '#000' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = pc }}
                >
                  <span style={{ fontSize: 15, lineHeight: 1, marginTop: -1 }}>+</span> Add
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {pop > 0 && (
          <motion.div key={pop} initial={{ opacity: .6, scale: .97 }} animate={{ opacity: 0, scale: 1.04 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}
            style={{ position: 'absolute', inset: 0, borderRadius: 16, border: `2px solid ${pc}`, pointerEvents: 'none' }} />
        )}
      </AnimatePresence>
    </motion.article>
  )
}
