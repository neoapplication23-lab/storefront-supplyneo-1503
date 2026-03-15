import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { isValidImageSrc } from '../../utils/image'

const ease = [.22, 1, .36, 1]

export default function CollectionGrid({ collections, products, primaryColor, onSelectCollection }) {
  const pc = primaryColor || '#2563eb'

  return (
    <div style={{
      maxWidth: 900, margin: '0 auto',
      padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,28px) 80px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4, ease }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 18, height: 2, borderRadius: 1, background: pc }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: pc }}>
            Gear up
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-.02em',
        }}>
          What's going on the boat?
        </h2>
      </motion.div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 14,
      }}>
        {collections.map((col, i) => (
          <CollectionCard
            key={col.id}
            collection={col}
            products={products}
            primaryColor={pc}
            delay={i * .04}
            onClick={() => onSelectCollection(col)}
          />
        ))}
      </div>
    </div>
  )
}

function CollectionCard({ collection, products, primaryColor, delay, onClick }) {
  const pc = primaryColor
  const [imgErr, setImgErr] = useState(false)

  // Collection image or fallback to first product image in the collection
  const colImg = isValidImageSrc(collection.image) && !imgErr ? collection.image : null
  const fallbackProduct = !colImg
    ? products.find(p => collection.productIds?.includes(p.id) && isValidImageSrc(p.image_url))
    : null
  const displayImg = colImg || fallbackProduct?.image_url || null
  const hasImg = !!displayImg

  const count = collection.productIds?.filter(pid => products.find(p => p.id === pid)).length || 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [.22,1,.36,1], delay }}
      onClick={onClick}
      style={{
        border: '1px solid rgba(28,28,26,.08)',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        cursor: 'pointer',
        padding: 0,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 1px 4px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.06)',
        transition: 'box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease',
        textAlign: 'left',
      }}
      whileHover={{
        y: -3,
        boxShadow: `0 4px 20px rgba(0,0,0,.1), 0 8px 32px rgba(0,0,0,.07)`,
        transition: { duration: .18 },
      }}
      whileTap={{ scale: .97 }}
    >
      {/* Image area */}
      <div style={{
        position: 'relative',
        aspectRatio: '4/3',
        overflow: 'hidden',
        background: hasImg ? `${pc}08` : `${pc}0a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {hasImg ? (
          <img
            src={displayImg}
            alt={collection.name}
            onError={() => setImgErr(true)}
            style={{
              width: '85%', height: '85%',
              objectFit: 'contain',
              transition: 'transform 500ms ease',
            }}
            className="card-img"
          />
        ) : (
          <span style={{ fontSize: 36, userSelect: 'none' }}>🗂️</span>
        )}
        {/* Subtle bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to top, rgba(255,255,255,.5) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Name + count */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{
          fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)',
          letterSpacing: '-.01em', lineHeight: 1.3, marginBottom: 3,
        }}>
          {collection.name}
        </p>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 400 }}>
          {count} item{count !== 1 ? 's' : ''}
        </p>
      </div>
    </motion.button>
  )
}
