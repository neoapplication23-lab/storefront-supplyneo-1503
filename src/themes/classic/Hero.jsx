import React from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { isValidImageSrc } from '../../utils/image'
import { t } from '../../i18n'

const ease = [.22, 1, .36, 1]
const stagger = { hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .04 } } }
const line = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: .5, ease } } }

export default function Hero({ data, departureTime }) {
  const appearance     = data?.appearance || {}
  const pc             = appearance.primaryColor    || '#2563eb'
  const lang           = appearance.language        || 'en'

  // Header image — strip whitespace from base64 to avoid ERR_INVALID_URL
  const rawImg         = appearance.headerImage || appearance.heroImage || null
  const headerImage    = rawImg ? rawImg.replace(/\s+/g, '') : null

  const overlayColor   = appearance.heroOverlayColor   || '#000000'
  const overlayOpacity = parseFloat(appearance.heroOverlayOpacity ?? 0.55)

  // Admin-editable copy — falls back to i18n translation
  const eyebrowText    = appearance.heroEyebrow?.trim() || t(lang, 'onTheWater')
  const subText        = appearance.heroSubline?.trim()  || t(lang, 'subHeadline')

  // Admin-editable colors — fall back to sensible defaults
  const titleColor     = appearance.heroTitleColor     || null
  const countdownColor = appearance.heroCountdownColor || null

  const hasHeader     = isValidImageSrc(headerImage)
  const onDark        = hasHeader
  const firstName     = (data?.clientName || '').split(' ')[0] || 'there'

  const headlineColor = titleColor || (onDark ? '#fff'                      : 'var(--text-primary, #1e293b)')
  const sublineColor  = titleColor || (onDark ? 'rgba(255,255,255,.72)'     : 'var(--text-soft, #94a3b8)')
  const timerColor    = countdownColor || (onDark ? '#fff' : pc)

  const hexToRgb = hex => {
    try {
      const h = hex?.length === 7 ? hex : '#000000'
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
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
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

      {/* ── Main content ── */}
      <motion.div variants={stagger} initial="hidden" animate="show" style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: 860, margin: '0 auto',
        padding: hasHeader
          ? 'clamp(32px,5vw,56px) clamp(20px,4vw,48px)'
          : 'clamp(20px,3vw,36px) clamp(20px,4vw,48px) clamp(24px,3.5vw,40px)',
      }}>

        {/* Eyebrow — brand accent color, admin-editable text */}
        <motion.div variants={line} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 18, height: 2, borderRadius: 1, background: pc }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: onDark ? pc : pc }}>
            {eyebrowText}
          </span>
        </motion.div>

        {/* Headline — admin-editable title color */}
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
                color: onDark ? 'rgba(255,255,255,.9)' : 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
              </span>
            ))}
          </motion.div>
        )}

        {/* Countdown — admin-editable color */}
        {(departureTime || (data?.date && data?.checkIn)) && (
          <motion.div variants={line}>
            <CountdownTimer
              departureTime={departureTime}
              date={data?.date}
              checkIn={data?.checkIn}
              primaryColor={timerColor}
              lang={lang}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
