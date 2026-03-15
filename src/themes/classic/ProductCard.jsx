import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../../components/ui/Badge'
import Stepper from '../../components/ui/Stepper'
import { formatPrice } from '../../utils/money'
import { isValidImageSrc } from '../../utils/image'

export default function ProductCard({ product, qty, primaryColor, onAdd, onRemove, onOpenModal }) {
  const pc      = primaryColor || '#2563eb'
  const inCart  = qty > 0
  const [imgError, setImgError] = useState(false)
  const [popKey, setPopKey]     = useState(0)
  const hasImage = isValidImageSrc(product.image_url) && !imgError

  const tracksInventory = !!(product.trackInventory || product.track_inventory)
  const isAvailable     = !tracksInventory || product.available !== false
  const availableQty    = product.availableQty ?? null
  const outOfStock      = tracksInventory && !isAvailable
  const atMax           = tracksInventory && availableQty !== null && qty >= availableQty

  function handleAdd(e) {
    e.stopPropagation()
    if (outOfStock || atMax) return
    onAdd()
    setPopKey(k => k + 1)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .3, ease: [.22,1,.36,1] }}
      onClick={onOpenModal}
      style={{
        background: '#fff',
        border: `1px solid ${inCart && !outOfStock ? `${pc}30` : 'rgba(28,28,26,.08)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 220ms ease, box-shadow 220ms ease',
        boxShadow: inCart && !outOfStock
          ? `0 2px 12px ${pc}18, 0 0 0 3px ${pc}10`
          : '0 1px 4px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.06)',
        cursor: 'pointer',
        position: 'relative',
        opacity: outOfStock ? 0.5 : 1,
        /* Ensure good tap area on mobile */
        WebkitTapHighlightColor: 'transparent',
      }}
      whileHover={outOfStock ? {} : {
        y: -3,
        boxShadow: inCart
          ? `0 6px 24px ${pc}22, 0 0 0 3px ${pc}12`
          : '0 4px 20px rgba(0,0,0,.1), 0 8px 32px rgba(0,0,0,.07)',
        transition: { duration: .18 },
      }}
    >
      {/* Active cart top accent bar */}
      <AnimatePresence>
        {inCart && !outOfStock && (
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
            transition={{ duration: .3, ease: [.22,1,.36,1] }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${pc}, ${pc}aa)`,
              transformOrigin: 'left', zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Image area ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '1/1',
        overflow: 'hidden',
        background: hasImage ? `${pc}08` : `${pc}0d`,
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {hasImage ? (
          <img
            src={product.image_url} alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: '82%', height: '82%', objectFit: 'contain', transition: 'transform 500ms ease' }}
          />
        ) : (
          <div style={{
            fontSize: 40, userSelect: 'none',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.1))',
          }}>
            {product.emoji || '📦'}
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
          {product.popular     && <Badge type="popular"     primaryColor={pc} />}
          {product.limited     && <Badge type="limited" />}
          {product.recommended && <Badge type="recommended" primaryColor={pc} />}
        </div>

        {/* In-cart check dot */}
        <AnimatePresence>
          {inCart && !outOfStock && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 22 }}
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 24, height: 24, borderRadius: '50%',
                background: pc,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${pc}55`, zIndex: 1,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(248,247,245,.72)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: '#fff', background: 'rgba(185,30,30,.88)',
              padding: '4px 12px', borderRadius: 'var(--r-pill)',
              boxShadow: '0 2px 8px rgba(0,0,0,.18)',
            }}>Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{
        padding: 'clamp(10px, 2vw, 14px)',
        display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1,
      }}>
        {/* Name */}
        <h3 style={{
          fontWeight: 600,
          fontSize: 'clamp(12px, 3.2vw, 14px)',
          lineHeight: 1.3,
          marginBottom: 0,
          color: 'var(--text-primary)',
          letterSpacing: '-.01em',
          /* Clamp to 2 lines */
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6em',
        }}>
          {product.name}
        </h3>

        {/* Price + action */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
          paddingTop: 8, borderTop: `1px solid ${inCart && !outOfStock ? `${pc}14` : 'rgba(28,28,26,.06)'}`,
          transition: 'border-color 220ms ease',
          marginTop: 'auto',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          <div style={{ minWidth: 0, flex: '0 1 auto', overflow: 'hidden' }}>
            {product.comparePrice > 0 && product.comparePrice > product.price && (
              <span style={{
                display: 'block', fontSize: 10, color: 'var(--text-muted)',
                textDecoration: 'line-through', fontWeight: 400, marginBottom: 1,
              }}>
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span style={{
              fontWeight: 700,
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: inCart && !outOfStock ? pc : 'var(--text-primary)',
              transition: 'color 220ms ease',
              letterSpacing: '-.02em',
              lineHeight: 1.1,
            }}>
              {formatPrice(product.price)}
            </span>
            {product.unit && (
              <span style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, marginTop: 1 }}>
                /day
              </span>
            )}
          </div>

          {outOfStock ? (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#b04040',
              letterSpacing: '.05em', textTransform: 'uppercase',
              flexShrink: 0,
            }}>N/A</span>
          ) : (
            <AnimatePresence mode="wait">
              {inCart ? (
                <motion.div key="stepper"
                  initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .88 }} transition={{ duration: .15 }}
                  onClick={e => e.stopPropagation()}
                  style={{ flexShrink: 0 }}
                >
                  <Stepper qty={qty} onAdd={atMax ? undefined : onAdd} onRemove={onRemove} primaryColor={pc} maxReached={atMax} compact />
                </motion.div>
              ) : (
                <motion.button key={`add-${popKey}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: .15 }} whileTap={{ scale: .88 }}
                  onClick={handleAdd}
                  style={{
                    height: 36, width: 36, borderRadius: '50%',
                    border: `1.5px solid ${pc}`,
                    background: 'transparent',
                    color: pc,
                    fontSize: 20, fontWeight: 400, cursor: 'pointer', flexShrink: 0,
                    transition: 'background 160ms ease, color 160ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    /* Bigger tap area on mobile */
                    minWidth: 44, minHeight: 44,
                    padding: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = pc
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = pc
                  }}
                >
                  +
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Pop ring on add */}
      <AnimatePresence>
        {popKey > 0 && (
          <motion.div key={popKey}
            initial={{ opacity: .5, scale: .97 }} animate={{ opacity: 0, scale: 1.04 }} exit={{ opacity: 0 }}
            transition={{ duration: .38, ease: [.22,1,.36,1] }}
            style={{
              position: 'absolute', inset: 0, borderRadius: 16,
              border: `2px solid ${pc}`, pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.article>
  )
}
