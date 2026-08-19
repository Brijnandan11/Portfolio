import { useEffect, useMemo, useState } from 'react'

function StatusCard() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="orbit-status">
      <span className="orbit-status-kicker">SYSTEM STATUS</span>
      <div className="orbit-status-main">
        <span className="orbit-status-time">{time}</span>
        <span className="orbit-status-state">
          <i />
          OPEN FOR WORK
        </span>
      </div>
      <p className="orbit-status-note">UPTIME 99.98% - BULLMQ / EXPRESS</p>
    </div>
  )
}

export default function FloatingCard({
  card,
  staticLayout = false,
  onHover,
  active,
}) {
  const [hovered, setHovered] = useState(false)
  const interactive = Boolean(card.href)
  const positionStyle = useMemo(
    () => ({
      '--orbit-x': `${card.position[0]}px`,
      '--orbit-y': `${card.position[1]}px`,
      '--orbit-z': `${card.position[2]}px`,
    }),
    [card.position]
  )
  const Tag = interactive ? 'a' : 'div'
  const isStatus = card.type === 'status'

  const className = [
    'orbit-card',
    `orbit-card--${card.type}`,
    `orbit-card--${card.variant}`,
    hovered ? 'is-hovered' : '',
    active ? 'is-active' : '',
    staticLayout ? 'is-static' : 'is-floating',
  ]
    .filter(Boolean)
    .join(' ')

  const handleEnter = () => {
    setHovered(true)
    onHover?.(card.id)
  }

  const handleLeave = () => {
    setHovered(false)
    onHover?.(null)
  }

  if (isStatus) {
    return (
      <div
        className={className}
        style={positionStyle}
        aria-label={card.ariaLabel || card.label}
        tabIndex={0}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        <StatusCard />
      </div>
    )
  }

  return (
    <Tag
      href={card.href}
      target={interactive && !card.href.startsWith('#') ? '_blank' : undefined}
      rel={interactive && !card.href.startsWith('#') ? 'noreferrer' : undefined}
      className={className}
      style={positionStyle}
      aria-label={card.ariaLabel || card.label}
      tabIndex={0}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onClick={(e) => {
        if (!card.href || card.href.startsWith('#')) return
        e.stopPropagation()
      }}
    >
      <span className="orbit-card-kicker">
        {card.type === 'project' ? 'PROJECT' : card.type === 'social' ? 'SOCIAL' : card.type === 'easter-egg' ? 'EASTER' : 'STACK'}
      </span>
      <span className="orbit-card-label">{card.label}</span>
    </Tag>
  )
}
