import React, { useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'

export default function CartBar({ count, total, primaryColor, onCheckout, thresholds, urgencyActive, locked = false }) {
  const pc = primaryColor || '#2563eb'
  const spring       = useSpring(total, { stiffness: 120, damping: 20 })
  const displayTotal = useTransform(spring, v => `€${v.toFixed(2)}`)
  useEffect(() => { spring.set(total) }, [total, spring])

  const label = locked
    ? '⚓ Closed'
    : urgencyActive
      ? '⚡ Finalise now'
      : 'Checkout'

  return (
    <AnimatePresence>
      {count > 0 && (
        <>
          {/* ── Desktop: floating pill fixed bottom-right ── */}
          <motion.div
            key="cartbar-desktop"
            className="cartbar-desktop"
            initial={{ opacity: 0, scale: .85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .85, y: 16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 'var(--z-cartbar)',
            }}
          >
            <motion.button
              whileTap={{ scale: locked ? 1 : .95 }}
              whileHover={locked ? {} : { scale: 1.03 }}
              onClick={locked ? undefined : onCheckout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 20px 0 14px',
                height: 52,
                border: 'none',
                borderRadius: 'var(--r-pill)',
                cursor: locked ? 'not-allowed' : 'pointer',
                background: locked ? '#c8c6c2' : pc,
                boxShadow: locked ? 'none' : `0 6px 28px ${pc}45, 0 2px 8px rgba(0,0,0,.12)`,
                position: 'relative', overflow: 'hidden',
                transition: 'box-shadow 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {/* Shimmer */}
              {!locked && (
                <motion.span
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
                  style={{ position: 'absolute', top: 0, bottom: 0, width: '28%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)', pointerEvents: 'none' }}
                />
              )}

              {/* Count badge */}
              <motion.div
                key={count}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: .22 }}
                style={{
                  background: 'rgba(255,255,255,.22)',
                  borderRadius: 8,
                  padding: '3px 10px',
                  fontWeight: 700, fontSize: 13,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {count}
              </motion.div>

              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: .14 }}
                  style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>

              {/* Divider */}
              <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.3)', marginLeft: 2 }} />

              {/* Total */}
              <motion.span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-.01em' }}>
                {displayTotal}
              </motion.span>
            </motion.button>
          </motion.div>

          {/* ── Mobile: full-width bar pinned bottom ── */}
          <motion.div
            key="cartbar-mobile"
            className="cartbar-mobile"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              zIndex: 'var(--z-cartbar)',
              padding: '10px 16px 24px',
              background: 'linear-gradient(to top, rgba(248,247,245,1) 65%, rgba(248,247,245,0))',
              pointerEvents: 'none',
            }}
          >
            <motion.button
              whileTap={{ scale: locked ? 1 : .98 }}
              onClick={locked ? undefined : onCheckout}
              style={{
                width: '100%', height: 54, border: 'none',
                borderRadius: 'var(--r-2xl)',
                cursor: locked ? 'not-allowed' : 'pointer',
                background: locked ? '#c8c6c2' : pc,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px',
                boxShadow: locked ? 'none' : `0 4px 20px ${pc}40`,
                position: 'relative', overflow: 'hidden',
                pointerEvents: 'all',
              }}
            >
              {!locked && (
                <motion.span
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                  style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)', pointerEvents: 'none' }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <motion.div key={count} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: .22 }}
                  style={{ background: 'rgba(255,255,255,.2)', borderRadius: 8, padding: '3px 11px', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                  {count}
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .16 }}
                    style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
                    {label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <motion.span style={{ fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-.01em' }}>
                {displayTotal}
              </motion.span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
