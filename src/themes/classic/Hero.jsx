import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { isValidImageSrc } from '../../utils/image'

const ease = [.22, 1, .36, 1]
const stagger = { hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .04 } } }
const line = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: .5, ease } } }

export default function Hero({ data, departureTime }) {
  const pc           = data.appearance?.primaryColor || '#2563eb'
  const logo         = data.appearance?.logo || null
  const businessName = data.appearance?.businessName || ''
  const headerImage  = data.appearance?.headerImage || data.appearance?.heroImage || data.appearance?.coverImage || null
  const boat         = data.boat?.boat_name || ''
  const [logoErr, setLogoErr] = useState(false)

  const hasHeader = isValidImageSrc(headerImage)
  const hasLogo   = isValidImageSrc(logo) && !logoErr

  const chips = [
    boat         && { icon: '⛵', label: boat },
    data.date    && { icon: '📅', label: data.date },
    data.checkIn && { icon: '🕐', label: `Check-in ${data.checkIn}` },
    data.marina  && { icon: '⚓', label: data.marina },
    data.berth   && { icon: '🪝', label: `Berth ${data.berth}` },
  ].filter(Boolean)

  // Derive a dark/light text decision based on hasHeader
  const onDark = hasHeader

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: hasHeader ? 'clamp(340px, 50vh, 560px)' : 'clamp(200px, 26vh, 280px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>

      {/* ── Background ── */}
      {hasHeader ? (
        <>
          {/* Header image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Rich gradient overlay — brand colour tint at bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,.18) 0%,
              rgba(0,0,0,.12) 35%,
              rgba(0,0,0,.52) 68%,
              rgba(0,0,0,.78) 100%
            )`,
          }} />
          {/* Subtle brand colour tint strip at very bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
            background: `linear-gradient(to top, ${pc}28 0%, transparent 100%)`,
            pointerEvents: 'none',
          }} />
        </>
      ) : (
        /* No header image — clean light gradient with brand accent */
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#F8F7F5',
          }} />
          {/* Soft brand colour wash top-right */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '55%', height: '100%',
            background: `radial-gradient(ellipse at 80% 30%, ${pc}18 0%, transparent 65%)`,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 1, background: 'var(--border-subtle)',
          }} />
        </>
      )}

      {/* ── Brand badge top-left ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45, ease, delay: .05 }}
        style={{
          position: 'absolute', top: 20, left: 'clamp(20px,4vw,48px)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 3,
        }}
      >
        {hasLogo && (
          <div style={{
            width: 38, height: 38, borderRadius: 10, overflow: 'hidden',
            background: onDark ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${onDark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.06)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: onDark ? '0 2px 8px rgba(0,0,0,.25)' : '0 1px 6px rgba(0,0,0,.08)',
          }}>
            <img
              src={logo} alt={businessName}
              onError={() => setLogoErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}
        {businessName && (
          <span style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '.01em',
            color: onDark ? 'rgba(255,255,255,.92)' : 'var(--text-secondary)',
            textShadow: onDark ? '0 1px 4px rgba(0,0,0,.35)' : 'none',
          }}>
            {businessName}
          </span>
        )}
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 860, margin: '0 auto',
          padding: hasHeader
            ? 'clamp(32px,5vw,56px) clamp(20px,4vw,48px)'
            : 'clamp(20px,3vw,36px) clamp(20px,4vw,48px) clamp(24px,3.5vw,40px)',
        }}
      >
        {/* Eyebrow line */}
        <motion.div variants={line} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 18, height: 2, borderRadius: 1,
            background: onDark ? 'rgba(255,255,255,.6)' : pc,
          }} />
          <span style={{
            fontSize: 10.5, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase',
            color: onDark ? 'rgba(255,255,255,.65)' : pc,
          }}>
            On the water
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={line} style={{
          fontWeight: 700,
          fontSize: 'clamp(24px, 4.2vw, 46px)',
          lineHeight: 1.08,
          marginBottom: 14,
          color: onDark ? '#fff' : 'var(--text-primary)',
          letterSpacing: '-.025em',
        }}>
          Hey {(data.clientName || '').split(' ')[0] || 'there'} —
          <span style={{
            display: 'block',
            fontWeight: 300,
            fontSize: '.68em',
            color: onDark ? 'rgba(255,255,255,.72)' : 'var(--text-soft)',
            marginTop: 5,
            letterSpacing: '-.01em',
          }}>
            make it unforgettable.
          </span>
        </motion.h1>

        {/* Chips */}
        {chips.length > 0 && (
          <motion.div variants={line} style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {chips.map((c, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 11px',
                borderRadius: 'var(--r-pill)',
                background: onDark ? 'rgba(255,255,255,.14)' : `${pc}0f`,
                border: `1px solid ${onDark ? 'rgba(255,255,255,.2)' : `${pc}28`}`,
                backdropFilter: onDark ? 'blur(10px)' : 'none',
                fontSize: 12, fontWeight: 500,
                color: onDark ? 'rgba(255,255,255,.9)' : 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: 11 }}>{c.icon}</span>
                {c.label}
              </span>
            ))}
          </motion.div>
        )}

        {/* Countdown */}
        {(departureTime || (data.date && data.checkIn)) && (
          <motion.div variants={line}>
            <CountdownTimer
              departureTime={departureTime}
              date={data.date}
              checkIn={data.checkIn}
              primaryColor={onDark ? '#fff' : pc}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
