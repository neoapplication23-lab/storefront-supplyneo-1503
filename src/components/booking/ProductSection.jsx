import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import useCartStore from '../../store/useCartStore'
import useUpsell from '../../hooks/useUpsell'

const container = { hidden: {}, show: { transition: { staggerChildren: .045 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: .28, ease: [.22,1,.36,1] } } }

export default function ProductSection({ category, products, sectionId, primaryColor, allProducts = [], onBack }) {
  const pc     = primaryColor || '#2563eb'
  const items  = useCartStore(s => s.items)
  const add    = useCartStore(s => s.add)
  const remove = useCartStore(s => s.remove)

  const [modalProduct, setModalProduct] = useState(null)
  const [activeTag, setActiveTag]       = useState(null)

  // Collect all unique tags across products in this section
  const allTags = useMemo(() => {
    const tagSet = new Set()
    products.forEach(p => {
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
      tags.forEach(t => { if (t && t.trim()) tagSet.add(t.trim()) })
    })
    return [...tagSet].sort()
  }, [products])

  // Filter products by active tag
  const visibleProducts = useMemo(() => {
    if (!activeTag) return products
    return products.filter(p => {
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
      return tags.map(t => t.trim()).includes(activeTag)
    })
  }, [products, activeTag])

  const modalQty = modalProduct ? (items[modalProduct.id] || 0) : 0
  const modalFakeCart = modalProduct ? { [String(modalProduct.id)]: 1 } : {}
  const upsellPool = allProducts.length ? allProducts : products
  const modalUpsells = useUpsell(modalFakeCart, upsellPool, 4)
    .filter(p => !items[String(p.id)])

  return (
    <>
      <section id={sectionId} style={{ marginBottom: 56, scrollMarginTop: 128 }}>

        {/* ── Section header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: allTags.length > 0 ? 14 : 20,
          paddingTop: 8,
        }}>
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px 5px 8px',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--r-pill)',
                background: 'transparent',
                fontSize: 12.5, fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-soft)' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8 2.5L4.5 6.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All
            </button>
          )}
          <div style={{ width: 3, height: 18, borderRadius: 2, background: pc, flexShrink: 0 }} />
          <h2 style={{
            fontWeight: 700, fontSize: 18,
            color: 'var(--text-primary)', letterSpacing: '-.01em',
          }}>
            {category}
          </h2>
          <span style={{
            fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)',
            letterSpacing: '.06em', textTransform: 'uppercase', paddingTop: 1,
          }}>
            {products.length} item{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Tag sub-tabs ── */}
        {allTags.length > 0 && (
          <div className="no-scrollbar" style={{
            display: 'flex', gap: 7, overflowX: 'auto',
            marginBottom: 20, paddingBottom: 2,
          }}>
            {/* "All" tag pill */}
            <TagPill
              label="All"
              count={products.length}
              active={activeTag === null}
              primaryColor={pc}
              onClick={() => setActiveTag(null)}
            />
            {allTags.map(tag => {
              const tagCount = products.filter(p => {
                const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : [])
                return tags.map(t => t.trim()).includes(tag)
              }).length
              return (
                <TagPill
                  key={tag}
                  label={tag}
                  count={tagCount}
                  active={activeTag === tag}
                  primaryColor={pc}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                />
              )
            })}
          </div>
        )}

        {/* ── Product grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag || 'all'}
            variants={container}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {visibleProducts.map(p => (
              <motion.div key={p.id} variants={item}>
                <ProductCard
                  product={p}
                  qty={items[p.id] || 0}
                  primaryColor={pc}
                  onAdd={() => add(p.id, p.availableQty ?? Infinity)}
                  onRemove={() => remove(p.id)}
                  onOpenModal={() => setModalProduct(p)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state when tag filter has no results */}
        {visibleProducts.length === 0 && (
          <div style={{
            padding: '48px 0', textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 14,
          }}>
            No products found for "{activeTag}"
          </div>
        )}
      </section>

      <AnimatePresence>
        {modalProduct && (
          <ProductModal
            key={modalProduct.id}
            product={modalProduct}
            qty={modalQty}
            primaryColor={pc}
            onAdd={() => add(modalProduct.id)}
            onRemove={() => remove(modalProduct.id)}
            onClose={() => setModalProduct(null)}
            upsellSuggestions={modalUpsells}
            cartItems={items}
            onUpsellAdd={id => { const p = allProducts.find(x => String(x.id) === String(id)); add(id, p?.availableQty ?? Infinity) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function TagPill({ label, count, active, primaryColor, onClick }) {
  const pc = primaryColor
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: .93 }}
      style={{
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 13px',
        borderRadius: 'var(--r-pill)',
        border: `1.5px solid ${active ? pc : 'rgba(28,28,26,.1)'}`,
        background: active ? pc : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: 13, fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 160ms ease',
        whiteSpace: 'nowrap',
        boxShadow: active ? `0 2px 10px ${pc}35` : 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = pc; e.currentTarget.style.color = pc } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(28,28,26,.1)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
    >
      {label}
      <span style={{
        fontSize: 10.5, fontWeight: active ? 600 : 400,
        background: active ? 'rgba(255,255,255,.25)' : 'var(--bg-raised)',
        borderRadius: 99, padding: '1px 6px', lineHeight: 1.6,
        color: active ? '#fff' : 'var(--text-muted)',
        transition: 'all 160ms ease',
      }}>
        {count}
      </span>
    </motion.button>
  )
}
