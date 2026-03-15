import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductModal from '../../components/booking/ProductModal'
import useCartStore from '../../store/useCartStore'
import useUpsell from '../../hooks/useUpsell'

const container = { hidden: {}, show: { transition: { staggerChildren: .05 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .3, ease: [.22,1,.36,1] } } }

export default function ProductSection({ category, products, sectionId, primaryColor, allProducts = [], onBack }) {
  const pc     = primaryColor || '#c9a84c'
  const items  = useCartStore(s => s.items)
  const add    = useCartStore(s => s.add)
  const remove = useCartStore(s => s.remove)
  const [modal, setModal] = useState(null)
  const [activeTag, setActiveTag] = useState(null)

  const allTags = useMemo(() => {
    const s = new Set()
    products.forEach(p => {
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
      tags.forEach(t => { if (t?.trim()) s.add(t.trim()) })
    })
    return [...s].sort()
  }, [products])

  const visible = useMemo(() => {
    if (!activeTag) return products
    return products.filter(p => {
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
      return tags.map(t => t.trim()).includes(activeTag)
    })
  }, [products, activeTag])

  const modalQty = modal ? (items[modal.id] || 0) : 0
  const upsells = useUpsell(modal ? { [modal.id]: 1 } : {}, allProducts.length ? allProducts : products, 4).filter(p => !items[p.id])

  return (
    <>
      <section id={sectionId} style={{ background: '#0d0d0d', minHeight: '50vh', padding: '0 0 80px', scrollMarginTop: 100 }}>
        {/* Section header */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,48px) 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            {onBack && (
              <button onClick={onBack} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px 5px 9px',
                border: '1px solid rgba(255,255,255,.15)', borderRadius: 'var(--r-pill)',
                background: 'transparent', fontSize: 12.5, fontWeight: 500,
                color: 'rgba(255,255,255,.6)', cursor: 'pointer', transition: 'all 160ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = pc; e.currentTarget.style.color = pc }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'; e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All
              </button>
            )}
            <div style={{ width: 24, height: 1, background: pc }} />
            <h2 style={{ fontSize: 'clamp(20px,2.8vw,28px)', fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>{category}</h2>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>{products.length}</span>
          </div>

          {/* Tag pills */}
          {allTags.length > 0 && (
            <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {[null, ...allTags].map(tag => {
                const active = activeTag === tag
                const cnt = tag ? products.filter(p => {
                  const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
                  return tags.map(t => t.trim()).includes(tag)
                }).length : products.length
                return (
                  <motion.button key={tag || 'all'} whileTap={{ scale: .93 }} onClick={() => setActiveTag(tag)}
                    style={{
                      flexShrink: 0, padding: '5px 14px', borderRadius: 'var(--r-pill)',
                      border: `1px solid ${active ? pc : 'rgba(255,255,255,.15)'}`,
                      background: active ? pc : 'transparent',
                      color: active ? '#000' : 'rgba(255,255,255,.6)',
                      fontSize: 12.5, fontWeight: active ? 700 : 400, cursor: 'pointer',
                      transition: 'all 150ms ease', whiteSpace: 'nowrap',
                    }}>
                    {tag || 'All'} <span style={{ opacity: .6, marginLeft: 3 }}>{cnt}</span>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Product grid */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTag || 'all'} variants={container} initial="hidden" animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {visible.map(p => (
                <motion.div key={p.id} variants={item}>
                  <ProductCard product={p} qty={items[p.id] || 0} primaryColor={pc}
                    onAdd={() => add(p.id)} onRemove={() => remove(p.id)} onOpenModal={() => setModal(p)} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {modal && (
          <ProductModal key={modal.id} product={modal} qty={modalQty} primaryColor={pc}
            onAdd={() => add(modal.id)} onRemove={() => remove(modal.id)}
            onClose={() => setModal(null)} upsellSuggestions={upsells}
            cartItems={items} onUpsellAdd={id => add(id)} />
        )}
      </AnimatePresence>
    </>
  )
}
