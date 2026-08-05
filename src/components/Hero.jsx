import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { achieve } from './Achievements.jsx'
import { useContent, richParts, lines } from '../content.jsx'

const NAME = 'BRIJ'

const HERO_DEFAULT = {
  intro:
    'Full stack developer building *fast,* expressive products — from database schema to the last easing curve.',
  roles: ['full stack developer', 'creative engineer', 'systems tinkerer'],
  location: 'Based on planet Earth\nWorking worldwide',
  folio: 'Folio / Vol. 2\n©2026',
}

export default function Hero({ loaded }) {
  const hero = useContent('hero', HERO_DEFAULT)
  const ROLES = hero.roles?.length ? hero.roles : HERO_DEFAULT.roles
  const rootRef = useRef(null)
  const glowRef = useRef(null)
  const charsRef = useRef([])
  const [roleIndex, setRoleIndex] = useState(0)
  const [requests, setRequests] = useState(1204933)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [ROLES.length])

  useEffect(() => {
    const id = setInterval(
      () => setRequests((n) => n + Math.floor(20 + Math.random() * 140)),
      1800
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title .char',
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.4,
          stagger: 0.07,
          ease: 'power4.out',
          delay: 0.15,
          onComplete: () =>
            rootRef.current.querySelector('.hero-title').classList.add('is-live'),
        }
      )
      gsap.fromTo(
        '.hero-title .char',
        { fontWeight: 300 },
        {
          fontWeight: 640,
          duration: 0.45,
          stagger: 0.09,
          yoyo: true,
          repeat: 1,
          repeatDelay: 0.05,
          ease: 'power2.inOut',
          delay: 1.3,
          onComplete: () => gsap.set('.hero-title .char', { fontWeight: 420 }),
        }
      )
      gsap.fromTo(
        ['.hero-meta', '.hero-sub'],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.7 }
      )
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      })
      gsap.to('.hero-inner', {
        yPercent: 14,
        scale: 0.94,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const hero = rootRef.current
    let detonating = false
    let trailCount = 0
    let lastTrail = { x: -999, y: -999 }

    gsap.set(glowRef.current, {
      x: window.innerWidth * 0.72,
      y: window.innerHeight * 0.35,
    })
    const glowX = gsap.quickTo(glowRef.current, 'x', { duration: 0.7, ease: 'power3' })
    const glowY = gsap.quickTo(glowRef.current, 'y', { duration: 0.7, ease: 'power3' })
    const titleX = gsap.quickTo('.hero-title', 'x', { duration: 0.9, ease: 'power3' })
    const titleY = gsap.quickTo('.hero-title', 'y', { duration: 0.9, ease: 'power3' })
    const metaX = gsap.quickTo('.hero-meta', 'x', { duration: 1.1, ease: 'power3' })

    const TRAIL_BITS = [
      ['✦', 't-accent'], ['</>', 't-ink'], ['{ }', 't-line'], ['⚡', 't-grad'],
      ['ship it', 't-ink'], ['fast', 't-accent'], ['✦', 't-line'], ['hi', 't-grad'],
      ['wow', 't-line'], ['=>', 't-accent'],
    ]

    const spawnTrail = (x, y) => {
      if (trailCount >= 26) return
      trailCount++
      const [text, cls] = TRAIL_BITS[(Math.random() * TRAIL_BITS.length) | 0]
      const el = document.createElement('span')
      el.className = `trail-bit ${cls}`
      el.textContent = text
      const size = 36 + Math.random() * 30
      el.style.width = `${size * 1.4}px`
      el.style.height = `${size}px`
      hero.appendChild(el)
      gsap.fromTo(
        el,
        { x: x - size * 0.7, y: y - size / 2, scale: 0, rotate: (Math.random() - 0.5) * 50 },
        { scale: 1, rotate: (Math.random() - 0.5) * 24, duration: 0.35, ease: 'back.out(2.4)' }
      )
      gsap.to(el, {
        y: `+=${110 + Math.random() * 90}`,
        rotate: `+=${(Math.random() - 0.5) * 60}`,
        opacity: 0,
        duration: 1.1,
        delay: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          el.remove()
          trailCount--
        },
      })
    }

    const onMove = (e) => {
      if (window.scrollY > window.innerHeight) return
      glowX(e.clientX)
      glowY(e.clientY)

      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      titleX(nx * -26)
      titleY(ny * -14)
      metaX(nx * -10)

      const rect = hero.getBoundingClientRect()
      const hx = e.clientX - rect.left
      const hy = e.clientY - rect.top
      if (Math.hypot(hx - lastTrail.x, hy - lastTrail.y) > 90) {
        lastTrail = { x: hx, y: hy }
        spawnTrail(hx, hy)
      }

      if (!detonating) {
        charsRef.current.forEach((el) => {
          if (!el) return
          const r = el.getBoundingClientRect()
          const dist = Math.hypot(
            e.clientX - (r.left + r.width / 2),
            e.clientY - (r.top + r.height / 2)
          )
          const t = Math.max(0, 1 - dist / (window.innerWidth * 0.28))
          gsap.to(el, {
            fontWeight: 420 + t * 280,
            y: -t * 26,
            scaleY: 1 + t * 0.06,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        })
      }
    }

    const onClick = (e) => {
      if (window.scrollY > window.innerHeight * 0.5) return
      achieve('boom')
      detonating = true
      charsRef.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = r.left + r.width / 2 - e.clientX
        const dy = r.top + r.height / 2 - e.clientY
        const d = Math.hypot(dx, dy) || 1
        const power = Math.max(0.15, 1 - d / 1100)
        gsap.to(el, {
          x: (dx / d) * power * 190,
          y: (dy / d) * power * 190 - 50 * power,
          rotate: (Math.random() - 0.5) * 50 * power,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () =>
            gsap.to(el, {
              x: 0,
              y: 0,
              rotate: 0,
              duration: 1.5,
              ease: 'elastic.out(1, 0.3)',
            }),
        })
      })
      setTimeout(() => {
        detonating = false
      }, 1900)
    }

    window.addEventListener('mousemove', onMove)
    hero.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      hero.removeEventListener('click', onClick)
      hero.querySelectorAll('.trail-bit').forEach((el) => el.remove())
    }
  }, [loaded])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-glow" ref={glowRef} />
      <svg
        className="hero-nodegraph"
        aria-hidden="true"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path id="e1" d="M120,140 L340,80" />
          <path id="e2" d="M340,80 L560,180" />
          <path id="e3" d="M560,180 L820,110" />
          <path id="e4" d="M820,110 L1040,220" />
          <path id="e5" d="M120,140 L200,380" />
          <path id="e6" d="M200,380 L480,420" />
          <path id="e7" d="M480,420 L560,180" />
          <path id="e8" d="M480,420 L760,380" />
          <path id="e9" d="M760,380 L1040,220" />
          <path id="e10" d="M200,380 L140,560" />
        </defs>
        <g className="ng-edges">
          <use href="#e1" /><use href="#e2" /><use href="#e3" /><use href="#e4" />
          <use href="#e5" /><use href="#e6" /><use href="#e7" /><use href="#e8" />
          <use href="#e9" /><use href="#e10" />
        </g>
        <g className="ng-nodes">
          <circle cx="120" cy="140" r="5" />
          <circle cx="340" cy="80" r="5" />
          <circle cx="560" cy="180" r="6" />
          <circle cx="820" cy="110" r="5" />
          <circle cx="1040" cy="220" r="5" />
          <circle cx="200" cy="380" r="6" />
          <circle cx="480" cy="420" r="5" />
          <circle cx="760" cy="380" r="5" />
          <circle cx="140" cy="560" r="5" />
        </g>
        <g className="ng-packets">
          <circle r="3.2" className="ng-packet ng-packet--accent">
            <animateMotion dur="3.2s" repeatCount="indefinite">
              <mpath href="#e1" />
            </animateMotion>
          </circle>
          <circle r="3.2" className="ng-packet">
            <animateMotion dur="4.1s" repeatCount="indefinite" begin="-1s">
              <mpath href="#e3" />
            </animateMotion>
          </circle>
          <circle r="3.2" className="ng-packet ng-packet--accent">
            <animateMotion dur="3.6s" repeatCount="indefinite" begin="-2s">
              <mpath href="#e6" />
            </animateMotion>
          </circle>
          <circle r="3.2" className="ng-packet">
            <animateMotion dur="4.4s" repeatCount="indefinite" begin="-0.5s">
              <mpath href="#e8" />
            </animateMotion>
          </circle>
          <circle r="3.2" className="ng-packet ng-packet--accent">
            <animateMotion dur="3.9s" repeatCount="indefinite" begin="-1.6s">
              <mpath href="#e9" />
            </animateMotion>
          </circle>
        </g>
      </svg>
      <div className="hero-inner">
        <div className="hero-status">
          <p className="hero-status-title">
            <span className="hero-status-dot" /> system status
          </p>
          <div className="hero-status-row"><span>uptime</span><b>99.98%</b></div>
          <div className="hero-status-row"><span>requests</span><b>{requests.toLocaleString()}</b></div>
          <div className="hero-status-row"><span>latency</span><b>42ms</b></div>
          <div className="hero-status-row"><span>last deploy</span><b>3h ago</b></div>
        </div>
        <div className="hero-meta">
          <p className="hero-intro">
            {richParts(hero.intro).map((p, i) =>
              p.em ? <em key={i}>{p.em}</em> : <span key={i}>{p.t}</span>
            )}
          </p>
          <p>
            {lines(hero.location).map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
          <p>
            {lines(hero.folio).map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
        </div>
        <div className="hero-title-glow" aria-hidden="true" />
        <h1 className="hero-title" aria-label={NAME} data-cursor="BOOM">
          {NAME.split('').map((char, i) => (
            <span className="char-mask" key={i} aria-hidden>
              <span className="char" ref={(el) => (charsRef.current[i] = el)}>
                {char}
              </span>
            </span>
          ))}
        </h1>
        <div className="hero-sub">
          <p className="hero-role">
            — a{' '}
            <span className="role-mask">
              <AnimatePresence mode="wait">
                <motion.b
                  key={roleIndex}
                  initial={{ y: '115%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-115%' }}
                  transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                >
                  {ROLES[roleIndex]}
                </motion.b>
              </AnimatePresence>
            </span>{' '}
            with a taste for motion
          </p>
          <p className="hero-scroll">
            Scroll
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v11m0 0L1 8m4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </p>
        </div>
      </div>
    </section>
  )
}
