import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../ui/Badge'
import Stepper from '../ui/Stepper'
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
      }}
      whileHover={outOfStock ? {} : {
        y: -3,
        boxShadow: inCart
          ? `0 6px 24px ${pc}22, 0 0 0 3px ${pc}12`
          : '0 4px 20px rgba(0,0,0,.1), 0 8px 32px rgba(0,0,0,.07)',
        transition: { duration: .18 },
      }}
    >
      {/* ── Image area ── */}
      <div style={{
        position: 'relative', aspectRatio: '4/3', overflow: 'hidden',
        background: hasImage ? `${pc}08` : `${pc}0d`, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {hasImage ? (
          <img
            src={product.image_url} alt={product.name}
            onError={() => setImgError(true)} className="card-img"
            style={{ width: '88%', height: '88%', objectFit: 'contain', transition: 'transform 500ms ease' }}
          />
        ) : (
          <div style={{
            fontSize: 44, userSelect: 'none',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.1))',
          }}>
            {product.emoji || '📦'}
          </div>
        )}

        {/* Active cart top accent bar */}
        <AnimatePresence>
          {inCart && !outOfStock && (
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
              transition={{ duration: .3, ease: [.22,1,.36,1] }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${pc}, ${pc}aa)`,
                transformOrigin: 'left',
              }}
            />
          )}
        </AnimatePresence>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
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
                position: 'absolute', top: 10, right: 10,
                width: 26, height: 26, borderRadius: '50%',
                background: pc,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${pc}55`, zIndex: 1,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
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
              fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: '#fff', background: 'rgba(185,30,30,.88)',
              padding: '5px 13px', borderRadius: 'var(--r-pill)',
              boxShadow: '0 2px 8px rgba(0,0,0,.18)',
            }}>Out of Stock</span>
          </div>
        )}

        {/* Hover details hint */}
        {!outOfStock && (
          <div className="card-hover-overlay" style={{
            position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 180ms ease',
            background: 'rgba(28,28,26,.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: 11.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase',
              color: 'var(--text-primary)', background: 'rgba(248,247,245,.95)',
              padding: '5px 14px', borderRadius: 'var(--r-pill)',
              boxShadow: '0 2px 10px rgba(0,0,0,.1)',
            }}>Details</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{
        padding: '14px 16px 16px',
        display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1,
      }}>
        {/* Name + description */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontWeight: 600,
            fontSize: 'clamp(13.5px, 1.3vw, 14.5px)',
            lineHeight: 1.3,
            marginBottom: 4,
            color: 'var(--text-primary)',
            letterSpacing: '-.01em',
          }}>
            {product.name}
          </h3>
        </div>

        {/* Price + action */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          paddingTop: 10, borderTop: `1px solid ${inCart && !outOfStock ? `${pc}14` : 'rgba(28,28,26,.06)'}`,
          transition: 'border-color 220ms ease',
        }}>
          <div>
            {product.comparePrice > 0 && product.comparePrice > product.price && (
              <span style={{
                display: 'block', fontSize: 11, color: 'var(--text-muted)',
                textDecoration: 'line-through', fontWeight: 400, marginBottom: 1,
              }}>
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span style={{
              fontWeight: 700,
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              color: inCart && !outOfStock ? pc : 'var(--text-primary)',
              transition: 'color 220ms ease',
              letterSpacing: '-.02em',
              lineHeight: 1.1,
            }}>
              {formatPrice(product.price)}
            </span>
            {product.unit && (
              <span style={{ display: 'block', fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 400, marginTop: 1 }}>
                per day
              </span>
            )}
          </div>

          {outOfStock ? (
            <span style={{
              fontSize: 10.5, fontWeight: 600, color: '#b04040',
              letterSpacing: '.05em', textTransform: 'uppercase',
            }}>Unavailable</span>
          ) : (
            <AnimatePresence mode="wait">
              {inCart ? (
                <motion.div key="stepper"
                  initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .88 }} transition={{ duration: .15 }}
                  onClick={e => e.stopPropagation()}
                >
                  <Stepper qty={qty} onAdd={atMax ? undefined : onAdd} onRemove={onRemove} primaryColor={pc} maxReached={atMax} />
                </motion.div>
              ) : (
                <motion.button key={`add-${popKey}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: .15 }} whileTap={{ scale: .88 }}
                  onClick={handleAdd}
                  style={{
                    height: 34, padding: '0 15px', borderRadius: 'var(--r-pill)',
                    border: `1.5px solid ${pc}`,
                    background: 'transparent',
                    color: pc,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                    transition: 'background 160ms ease, color 160ms ease, box-shadow 160ms ease',
                    whiteSpace: 'nowrap', minHeight: 44,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = pc
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.boxShadow = `0 4px 14px ${pc}40`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = pc
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontSize: 15, lineHeight: 1, marginTop: -1 }}>+</span> Add
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
