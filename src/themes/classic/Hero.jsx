import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { sanitizeImageSrc, isValidImageSrc } from '../../utils/image'
import { t } from '../../i18n'

const ease = [.22, 1, .36, 1]
const stagger = { hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .04 } } }
const line = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: .5, ease } } }

export default function Hero({ data, departureTime }) {
  const appearance     = data?.appearance || {}
  const pc             = appearance.primaryColor || '#2563eb'
  const lang           = appearance.language || 'en'

  // Sanitize images — strips whitespace/newlines from base64 that cause ERR_INVALID_URL
  const logo           = sanitizeImageSrc(appearance.logo)
  const masterLogo     = sanitizeImageSrc(appearance.masterLogo)
  const headerImage    = sanitizeImageSrc(appearance.headerImage) || sanitizeImageSrc(appearance.heroImage) || null

  // Overlay settings
  const overlayColor   = appearance.heroOverlayColor || '#000000'
  const overlayOpacity = parseFloat(appearance.heroOverlayOpacity ?? 0.55)

  // Text colors — fall back to pc (brand accent) or white on dark
  const titleColor     = appearance.heroTitleColor   || null
  const countdownColor = appearance.heroCountdownColor || null

  const [logoErr, setLogoErr]               = useState(false)
  const [masterLogoErr, setMasterLogoErr]   = useState(false)

  const hasHeader     = !!headerImage
  const hasLogo       = !!logo && !logoErr
  const hasMasterLogo = !!masterLogo && !masterLogoErr
  const onDark        = hasHeader
  const firstName     = (data?.clientName || '').split(' ')[0] || 'there'

  // Always from i18n — eyebrow and subline use brand accent color
  const eyebrowText   = t(lang, 'onTheWater')
  const subText       = t(lang, 'subHeadline')

  // Title "Hey Name —": custom color or white/dark depending on background
  const headlineColor  = titleColor || (onDark ? '#fff' : 'var(--text-primary, #1e293b)')
  // Subline: same custom color (slightly muted) or brand accent
  const sublineColor   = titleColor
    ? `${titleColor}cc`
    : (onDark ? 'rgba(255,255,255,.72)' : pc)

  const hexToRgb = hex => {
    try {
      const h = (hex && hex.length === 7) ? hex : '#000000'
      return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`
    } catch { return '0,0,0' }
  }
  const rgb = hexToRgb(overlayColor)

  const chips = [
    data?.boat?.boat_name && { icon: '⛵', label: data.boat.boat_name },
    data?.date            && { icon: '📅', label: data.date },
    data?.checkIn         && { icon: '🕐', label: `${t(lang,'checkIn')} ${data.checkIn}` },
    data?.marina          && { icon: '⚓', label: data.marina },
    data?.berth           && { icon: '🪝', label: `${t(lang,'berth')} ${data.berth}` },
  ].filter(Boolean)

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      minHeight: hasHeader ? 'clamp(340px, 50vh, 560px)' : 'clamp(200px, 26vh, 280px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>

      {/* ── Background ── */}
      {hasHeader ? (
        <>
          {/* backgroundAttachment:fixed = parallax. Falls back gracefully on mobile */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            // iOS Safari fix: use transform instead of fixed attachment
            WebkitBackgroundAttachment: 'scroll',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: `rgba(${rgb}, ${overlayOpacity})` }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 0%, rgba(${rgb},.35) 55%, rgba(${rgb},.75) 100%)` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: `linear-gradient(to top, ${pc}28 0%, transparent 100%)`, pointerEvents: 'none' }} />
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#F8F7F5' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', background: `radial-gradient(ellipse at 80% 30%, ${pc}18 0%, transparent 65%)` }} />
        </>
      )}

      {/* ── Brand badge: charter logo + optional master logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45, ease, delay: .05 }}
        style={{ position: 'absolute', top: 20, left: 'clamp(20px,4vw,48px)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 3 }}
      >
        {hasLogo && (
          <div style={{
            height: 38, maxWidth: 120, borderRadius: 10, overflow: 'hidden',
            background: onDark ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${onDark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.06)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px',
            boxShadow: onDark ? '0 2px 8px rgba(0,0,0,.25)' : '0 1px 6px rgba(0,0,0,.08)',
          }}>
            <img src={logo} alt="" onError={() => setLogoErr(true)}
              style={{ height: '100%', maxHeight: 30, objectFit: 'contain' }} />
          </div>
        )}

        {hasLogo && hasMasterLogo && (
          <div style={{ width: 1, height: 24, background: onDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.15)' }} />
        )}

        {hasMasterLogo && (
          <div style={{
            height: 38, maxWidth: 120, borderRadius: 10, overflow: 'hidden',
            background: onDark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${onDark ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.04)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px',
          }}>
            <img src={masterLogo} alt="" onError={() => setMasterLogoErr(true)}
              style={{ height: '100%', maxHeight: 28, objectFit: 'contain', opacity: .8 }} />
          </div>
        )}

        {!hasLogo && !hasMasterLogo && appearance.businessName && (
          <span style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '.01em',
            color: onDark ? 'rgba(255,255,255,.92)' : 'var(--text-secondary, #64748b)',
            textShadow: onDark ? '0 1px 4px rgba(0,0,0,.35)' : 'none',
          }}>{appearance.businessName}</span>
        )}
      </motion.div>

      {/* ── Main content ── */}
      <motion.div variants={stagger} initial="hidden" animate="show" style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: 860, margin: '0 auto',
        padding: hasHeader
          ? 'clamp(32px,5vw,56px) clamp(20px,4vw,48px)'
          : 'clamp(20px,3vw,36px) clamp(20px,4vw,48px) clamp(24px,3.5vw,40px)',
      }}>

        {/* Eyebrow — brand accent color */}
        <motion.div variants={line} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 18, height: 2, borderRadius: 1, background: pc }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: onDark ? pc : pc }}>
            {eyebrowText}
          </span>
        </motion.div>

        {/* Headline: title color or white/dark */}
        <motion.h1 variants={line} style={{
          fontWeight: 700, fontSize: 'clamp(24px, 4.2vw, 46px)',
          lineHeight: 1.08, marginBottom: 14,
          color: headlineColor, letterSpacing: '-.025em',
        }}>
          {t(lang, 'heyGreeting')} {firstName} —
          <span style={{
            display: 'block', fontWeight: 300, fontSize: '.68em',
            color: sublineColor, marginTop: 5, letterSpacing: '-.01em',
          }}>{subText}</span>
        </motion.h1>

        {/* Chips */}
        {chips.length > 0 && (
          <motion.div variants={line} style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {chips.map((c, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px',
                borderRadius: 100,
                background: onDark ? 'rgba(255,255,255,.14)' : `${pc}0f`,
                border: `1px solid ${onDark ? 'rgba(255,255,255,.2)' : `${pc}28`}`,
                backdropFilter: onDark ? 'blur(10px)' : 'none',
                fontSize: 12, fontWeight: 500,
                color: onDark ? 'rgba(255,255,255,.9)' : 'var(--text-secondary, #64748b)',
              }}>
                <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
              </span>
            ))}
          </motion.div>
        )}

        {/* Countdown: custom color or brand accent */}
        {(departureTime || (data?.date && data?.checkIn)) && (
          <motion.div variants={line}>
            <CountdownTimer
              departureTime={departureTime}
              date={data?.date}
              checkIn={data?.checkIn}
              primaryColor={countdownColor || (onDark ? '#fff' : pc)}
              lang={lang}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
