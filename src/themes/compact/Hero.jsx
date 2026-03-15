import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { isValidImageSrc } from '../../utils/image'

export default function Hero({ data, departureTime }) {
  const pc           = data.appearance?.primaryColor || '#2563eb'
  const logo         = data.appearance?.logo || null
  const businessName = data.appearance?.businessName || ''
  const [logoErr, setLogoErr] = useState(false)
  const hasLogo = isValidImageSrc(logo) && !logoErr

  const chips = [
    data.boat?.boat_name && { icon: '⛵', label: data.boat.boat_name },
    data.date            && { icon: '📅', label: data.date },
    data.checkIn         && { icon: '🕐', label: `Check-in ${data.checkIn}` },
    data.marina          && { icon: '⚓', label: data.marina },
    data.berth           && { icon: '🪝', label: `Berth ${data.berth}` },
  ].filter(Boolean)

  return (
    <section style={{
      borderBottom: '1px solid rgba(0,0,0,.07)',
      background: '#fff',
      padding: '18px clamp(16px,4vw,36px) 16px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
      }}>
        {/* Left: brand + greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasLogo && (
            <img src={logo} alt={businessName} onError={() => setLogoErr(true)}
              style={{ height: 40, objectFit: 'contain' }} />
          )}
          <div>
            {businessName && (
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                {businessName}
              </p>
            )}
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.02em' }}>
              Hey {(data.clientName || '').split(' ')[0] || 'there'} —{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>your gear is ready.</span>
            </h1>
          </div>
        </div>

        {/* Right: chips + countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 'var(--r-pill)',
              background: `${pc}0d`, border: `1px solid ${pc}22`,
              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
            </span>
          ))}
          {(departureTime || (data.date && data.checkIn)) && (
            <CountdownTimer departureTime={departureTime} date={data.date} checkIn={data.checkIn} primaryColor={pc} />
          )}
        </div>
      </div>
    </section>
  )
}
