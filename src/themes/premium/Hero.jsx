import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { isValidImageSrc } from '../../utils/image'
import { t } from '../../i18n'

const ease = [.22, 1, .36, 1]

export default function Hero({ data, departureTime }) {
  const appearance     = data?.appearance || {}
  const pc             = appearance.primaryColor    || '#c9a84c'
  const logo           = appearance.logo            || null
  const businessName   = appearance.businessName    || ''
  const masterLogo     = appearance.masterLogo      || null
  const lang           = appearance.language        || 'en'

  const rawImg         = appearance.headerImage || appearance.heroImage || null
  const headerImage    = rawImg ? rawImg.replace(/\s+/g, '') : null

  const overlayColor   = appearance.heroOverlayColor   || '#000000'
  const overlayOpacity = parseFloat(appearance.heroOverlayOpacity ?? 0.55)

  const eyebrowText    = appearance.heroEyebrow?.trim() || t(lang, 'onTheWater')
  const subText        = appearance.heroSubline?.trim()  || t(lang, 'subHeadline')
  const titleColor     = appearance.heroTitleColor     || null
  const countdownColor = appearance.heroCountdownColor || null

  const [logoErr, setLogoErr]             = useState(false)
  const [masterLogoErr, setMasterLogoErr] = useState(false)

  const hasLogo       = isValidImageSrc(logo) && !logoErr
  const hasMasterLogo = isValidImageSrc(masterLogo) && !masterLogoErr
  const hasImage      = isValidImageSrc(headerImage)
  const firstName     = (data?.clientName || '').split(' ')[0] || 'there'

  const headlineColor = titleColor || '#fff'
  const sublineColor  = titleColor || pc
  const timerColor    = countdownColor || pc

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
      minHeight: 'clamp(380px, 55vh, 620px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: '#0a0a0a',
    }}>

      {/* Background */}
      {hasImage ? (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            WebkitBackgroundAttachment: 'scroll',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: `rgba(${rgb}, ${overlayOpacity})` }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 0%, rgba(${rgb},.6) 70%, rgba(${rgb},.9) 100%)` }} />
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)' }} />
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '80%', background: `radial-gradient(ellipse, ${pc}18 0%, transparent 65%)`, pointerEvents: 'none' }} />
        </>
      )}

      {/* Gold top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${pc}, transparent)` }} />

      {/* Logos top-left: charter + master */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: .6, delay: .1 }}
        style={{ position: 'absolute', top: 24, left: 'clamp(24px,5vw,56px)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 3 }}
      >
        {hasLogo && (
          <div style={{
            height: 44, maxWidth: 130, borderRadius: 10, overflow: 'hidden', padding: '4px 8px',
            border: `1px solid ${pc}40`, background: 'rgba(255,255,255,.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={logo} alt={businessName} onError={() => setLogoErr(true)}
              style={{ height: '100%', maxHeight: 32, objectFit: 'contain' }} />
          </div>
        )}
        {hasLogo && hasMasterLogo && (
          <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,.2)' }} />
        )}
        {hasMasterLogo && (
          <div style={{
            height: 44, maxWidth: 130, borderRadius: 10, overflow: 'hidden', padding: '4px 8px',
            border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={masterLogo} alt="" onError={() => setMasterLogoErr(true)}
              style={{ height: '100%', maxHeight: 30, objectFit: 'contain', opacity: .75 }} />
          </div>
        )}
        {!hasLogo && !hasMasterLogo && businessName && (
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.7)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {businessName}
          </span>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7, ease, delay: .15 }}
        style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto', width: '100%', padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,56px)' }}
      >
        {/* Eyebrow — brand accent color, admin-editable text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 1, background: pc }} />
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: pc }}>
            {eyebrowText}
          </span>
        </div>

        {/* Headline — admin-editable colors */}
        <h1 style={{ fontSize: 'clamp(28px,5vw,58px)', fontWeight: 300, color: headlineColor, letterSpacing: '-.02em', lineHeight: 1.08, marginBottom: 8 }}>
          {t(lang, 'heyGreeting')} {firstName} —
          <br />
          <span style={{ fontWeight: 700, color: sublineColor }}>{subText}</span>
        </h1>

        {/* Chips */}
        {chips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, marginBottom: 4 }}>
            {chips.map((c, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px',
                borderRadius: 100, background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)', backdropFilter: 'blur(8px)',
                fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.85)',
              }}>
                <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
              </span>
            ))}
          </div>
        )}

        {/* Countdown — admin-editable color */}
        {(departureTime || (data?.date && data?.checkIn)) && (
          <div style={{ marginTop: 16 }}>
            <CountdownTimer
              departureTime={departureTime}
              date={data?.date}
              checkIn={data?.checkIn}
              primaryColor={timerColor}
              lang={lang}
            />
          </div>
        )}
      </motion.div>
    </section>
  )
}
