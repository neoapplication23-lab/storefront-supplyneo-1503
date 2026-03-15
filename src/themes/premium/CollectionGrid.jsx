import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { isValidImageSrc } from '../../utils/image'

export default function CollectionGrid({ collections, products, primaryColor, onSelectCollection }) {
  const pc = primaryColor || '#c9a84c'
  return (
    <div style={{
      background: '#0d0d0d', minHeight: '60vh',
      padding: 'clamp(32px,5vw,56px) clamp(20px,4vw,48px) 80px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 24, height: 1, background: pc }} />
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: pc }}>
            Gear up
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 300, color: '#fff', letterSpacing: '-.02em', marginBottom: 32 }}>
          What's going on <span style={{ fontWeight: 700, color: pc }}>the boat?</span>
        </h2>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {collections.map((col, i) => (
            <PremiumCollectionCard key={col.id} collection={col} products={products} primaryColor={pc} delay={i * .05} onClick={() => onSelectCollection(col)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PremiumCollectionCard({ collection, products, primaryColor, delay, onClick }) {
  const pc = primaryColor
  const [hover, setHover] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const colImg = isValidImageSrc(collection.image) && !imgErr ? collection.image : null
  const fallback = !colImg ? products.find(p => collection.productIds?.includes(p.id) && isValidImageSrc(p.image_url)) : null
  const img = colImg || fallback?.image_url || null
  const count = collection.productIds?.filter(pid => products.find(p => p.id === pid)).length || 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4, ease: [.22,1,.36,1], delay }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? pc + '50' : 'rgba(255,255,255,.1)'}`,
        borderRadius: 16, overflow: 'hidden',
        background: hover ? '#1e1e1e' : '#161616',
        cursor: 'pointer', padding: 0,
        display: 'flex', flexDirection: 'column', textAlign: 'left',
        transition: 'all 200ms ease',
        boxShadow: hover ? `0 8px 32px rgba(0,0,0,.5), 0 0 0 1px ${pc}20` : '0 2px 12px rgba(0,0,0,.3)',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '4/3', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1e1e, #252525)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {img
          ? <img src={img} alt={collection.name} onError={() => setImgErr(true)}
              style={{ width: '80%', height: '80%', objectFit: 'contain', transition: 'transform 500ms ease', transform: hover ? 'scale(1.06)' : 'scale(1)', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.6))' }} />
          : <span style={{ fontSize: 36 }}>🗂️</span>
        }
        {/* Gold bottom gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: `linear-gradient(to top, ${pc}12, transparent)`, pointerEvents: 'none' }} />
      </div>
      {/* Name */}
      <div style={{ padding: '12px 14px 14px', borderTop: `1px solid rgba(255,255,255,.06)` }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: hover ? pc : '#fff', transition: 'color 200ms ease', letterSpacing: '-.01em', marginBottom: 3 }}>
          {collection.name}
        </p>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.35)' }}>{count} item{count !== 1 ? 's' : ''}</p>
      </div>
    </motion.button>
  )
}
