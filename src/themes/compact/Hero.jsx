import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '../../components/booking/CountdownTimer'
import { isValidImageSrc } from '../../utils/image'
import { t } from '../../i18n'

export default function Hero({ data, departureTime }) {
  const appearance     = data?.appearance || {}
  const pc             = appearance.primaryColor    || '#2563eb'
  const logo           = appearance.logo            || null
  const businessName   = appearance.businessName    || ''
  const masterLogo     = appearance.masterLogo      || null
  const lang           = appearance.language        || 'en'

  const rawImg         = appearance.headerImage || appearance.heroImage || null
  const headerImage    = rawImg ? rawImg.replace(/\s+/g, '') : null

  const overlayColor   = appearance.heroOverlayColor   || '#000000'
  const overlayOpacity = parseFloat(appearance.heroOverlayOpacity ?? 0.45)

  const eyebrowText    = appearance.heroEyebrow?.trim() || t(lang, 'onTheWater')
  const subText        = appearance.heroSubline?.trim()  || t(lang, 'yourGearReady')
  const countdownColor = appearance.heroCountdownColor || null

  const [logoErr, setLogoErr]             = useState(false)
  const [masterLogoErr, setMasterLogoErr] = useState(false)

  const hasLogo       = isValidImageSrc(logo) && !logoErr
  const hasMasterLogo = isValidImageSrc(masterLogo) && !masterLogoErr
  const hasImage      = isValidImageSrc(headerImage)
  const firstName     = (data?.clientName || '').split(' ')[0] || 'there'

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

  // Logos block — reused in both variants
  const LogoBadge = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {hasLogo && (
        <img src={logo} alt={businessName} onError={() => setLogoErr(true)}
          style={{ height: hasImage ? 28 : 36, objectFit: 'contain',
            filter: hasImage ? 'brightness(0) invert(1)' : 'none' }} />
      )}
      {hasLogo && hasMasterLogo && (
        <div style={{ width: 1, height: hasImage ? 20 : 26, background: hasImage ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.15)' }} />
      )}
      {hasMasterLogo && (
        <img src={masterLogo} alt="" onError={() => setMasterLogoErr(true)}
          style={{ height: hasImage ? 24 : 30, objectFit: 'contain',
            filter: hasImage ? 'brightness(0) invert(1)' : 'none', opacity: .8 }} />
      )}
    </div>
  )

  // ── WITH header image: compact band ──
  if (hasImage) {
    return (
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 'clamp(180px, 28vh, 300px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${headerImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          WebkitBackgroundAttachment: 'scroll',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `rgba(${rgb}, ${overlayOpacity})` }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, rgba(${rgb},.7) 100%)` }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '16px clamp(16px,4vw,36px) 18px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 14, height: 1.5, borderRadius: 1, background: 'rgba(255,255,255,.5)' }} />
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
              {eyebrowText}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LogoBadge />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', margin: 0 }}>
                {t(lang,'heyGreeting')} {firstName} —{' '}
                <span style={{ fontWeight: 300, opacity: .8 }}>{subText}</span>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {chips.map((c, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px',
                  borderRadius: 100, background: 'rgba(255,255,255,.12)',
                  border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
                  fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,.9)',
                }}>
                  <span style={{ fontSize: 10 }}>{c.icon}</span>{c.label}
                </span>
              ))}
              {(departureTime || (data?.date && data?.checkIn)) && (
                <CountdownTimer
                  departureTime={departureTime}
                  date={data?.date}
                  checkIn={data?.checkIn}
                  primaryColor={countdownColor || '#fff'}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── WITHOUT image: inline bar ──
  return (
    <section style={{ borderBottom: '1px solid rgba(0,0,0,.07)', background: '#fff', padding: '18px clamp(16px,4vw,36px) 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoBadge />
          <div>
            {businessName && !hasLogo && !hasMasterLogo && (
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                {businessName}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 12, height: 1.5, background: pc }} />
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: pc }}>
                {eyebrowText}
              </span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.02em' }}>
              {t(lang,'heyGreeting')} {firstName} —{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>{subText}</span>
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
              borderRadius: 100, background: `${pc}0d`, border: `1px solid ${pc}22`,
              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
            </span>
          ))}
          {(departureTime || (data?.date && data?.checkIn)) && (
            <CountdownTimer
              departureTime={departureTime}
              date={data?.date}
              checkIn={data?.checkIn}
              primaryColor={countdownColor || pc}
              lang={lang}
            />
          )}
        </div>
      </div>
    </section>
  )
}
