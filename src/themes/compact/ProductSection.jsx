import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductModal from '../../components/booking/ProductModal'
import useCartStore from '../../store/useCartStore'
import useUpsell from '../../hooks/useUpsell'

export default function ProductSection({ category, products, sectionId, primaryColor, allProducts = [], onBack }) {
  const pc     = primaryColor || '#2563eb'
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
  const upsells = useUpsell(modal ? { [modal.id]: 1 } : {}, allProducts.length ? allProducts : products, 4)
    .filter(p => !items[p.id])

  return (
    <>
      <section id={sectionId} style={{ marginBottom: 32, scrollMarginTop: 100 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px clamp(16px,4vw,28px) 10px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid rgba(28,28,26,.06)',
          borderTop: '1px solid rgba(28,28,26,.06)',
          position: 'sticky', top: 108, zIndex: 10,
        }}>
          {onBack && (
            <button onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px 4px 7px', border: '1px solid var(--border-soft)',
              borderRadius: 'var(--r-pill)', background: 'transparent',
              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All
            </button>
          )}
          <div style={{ width: 3, height: 14, borderRadius: 2, background: pc }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-.01em' }}>{category}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{products.length}</span>

          {/* Tag pills inline */}
          {allTags.length > 0 && (
            <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginLeft: 8 }}>
              {[null, ...allTags].map(tag => {
                const active = activeTag === tag
                const cnt = tag ? products.filter(p => {
                  const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
                  return tags.map(t => t.trim()).includes(tag)
                }).length : products.length
                return (
                  <button key={tag || 'all'} onClick={() => setActiveTag(tag)}
                    style={{
                      flexShrink: 0, padding: '3px 10px', borderRadius: 'var(--r-pill)',
                      border: `1px solid ${active ? pc : 'rgba(28,28,26,.1)'}`,
                      background: active ? pc : 'transparent',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer',
                      transition: 'all 140ms ease', whiteSpace: 'nowrap',
                    }}>
                    {tag || 'All'} <span style={{ opacity: .7 }}>{cnt}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* List */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: '#fff',
          border: '1px solid rgba(28,28,26,.07)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          marginTop: 12,
          marginLeft: 'clamp(16px,4vw,28px)',
          marginRight: 'clamp(16px,4vw,28px)',
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTag || 'all'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
              {visible.map(p => (
                <ProductCard key={p.id} product={p} qty={items[p.id] || 0}
                  primaryColor={pc} onAdd={() => add(p.id)} onRemove={() => remove(p.id)}
                  onOpenModal={() => setModal(p)} />
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
