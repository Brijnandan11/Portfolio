import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import SlatReveal from './SlatReveal.jsx'
import { achieve } from './Achievements.jsx'
import { useContent } from '../content.jsx'

const SITE_DEFAULT = {
  email: 'brij19069@gmail.com',
  github: 'Brijnandan11',
  linkedin: 'https://linkedin.com',
  x: 'https://x.com/BRIJhqu',
  note: '— usually replies within a day',
}

function Magnetic({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export default function Contact() {
  const rootRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const site = useContent('site', SITE_DEFAULT)
  const EMAIL = site.email

  const copyEmail = async (e) => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true)
    achieve('copy')
    setTimeout(() => setCopied(false), 1600)
    const { clientX: x, clientY: y } = e
    for (let i = 0; i < 14; i++) {
      const bit = document.createElement('span')
      bit.className = 'confetti-bit'
      bit.textContent = Math.random() > 0.5 ? '✦' : '●'
      bit.style.color = ['#ff4d00', '#e8e4dc', '#6dd400'][i % 3]
      document.body.appendChild(bit)
      const angle = Math.random() * Math.PI * 2
      const dist = 70 + Math.random() * 110
      gsap.fromTo(
        bit,
        { x, y, scale: 0.4, opacity: 1, rotate: 0 },
        {
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist - 40,
          scale: 1 + Math.random(),
          rotate: (Math.random() - 0.5) * 220,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.5,
          ease: 'power2.out',
          onComplete: () => bit.remove(),
        }
      )
    }
  }
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-title .line > span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.contact-scribble',
        { opacity: 0, y: 14, rotate: -9 },
        {
          opacity: 1,
          y: 0,
          rotate: -2,
          duration: 0.6,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.contact-cta', start: 'top 88%' },
        }
      )
      gsap.fromTo(
        '.contact-scribble path',
        { strokeDasharray: 150, strokeDashoffset: 150 },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: { trigger: '.contact-cta', start: 'top 88%' },
        }
      )
      gsap.to('.contact-star', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={rootRef}>
      <SlatReveal horizontal reverse from="center" />
      <a className="cta-band" href={`mailto:${EMAIL}`} aria-label="Email me">
        <div className="cta-band-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>Open for work ✦ Let&apos;s talk ✦ </span>
          ))}
        </div>
      </a>
      <span className="contact-star" aria-hidden>✦</span>
      <div>
        <div className="scribble scribble--lg scribble--auto contact-kicker-scribble" aria-hidden>
          <span>got a project in mind?</span>
          <svg viewBox="0 0 130 12">
            <path
              d="M3 7 C 40 12, 75 2, 127 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="contact-title">
          <span className="line">
            <span>
              Let&apos;s build <em>something</em>
            </span>
          </span>
          <span className="line">
            <span>
              <em>worth</em> scrolling.
            </span>
          </span>
        </h2>
        <div className="scribble contact-scribble" aria-hidden>
          <span>don&apos;t be shy — say hi</span>
          <svg viewBox="0 0 130 12">
            <path
              d="M3 7 C 40 12, 75 2, 127 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="contact-cta">
          <Magnetic>
            <a className="magnetic-btn" href={`mailto:${EMAIL}`} data-cursor="TALK">
              <span className="roll">
                <span className="roll-a">{EMAIL}</span>
                <span className="roll-b">{EMAIL}</span>
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <button
              className="copy-btn"
              onClick={copyEmail}
              data-cursor={copied ? 'COPIED ✓' : 'COPY'}
              aria-label="Copy email address"
            >
              {copied ? '✓' : '⧉'}
            </button>
          </Magnetic>
          <p className="contact-note">{site.note}</p>
        </div>
      </div>
    </section>
  )
}
