import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import SkillsShowcase from './SkillsShowcase.jsx'
import SlatReveal from './SlatReveal.jsx'
import { useContent } from '../content.jsx'

const SCENES = ['stack', 'backend', 'motion', 'devops']

const SERVICES_DEFAULT = {
  list: [
    {
      name: 'Full Stack Development',
      desc: 'Complete products from schema to pixel — typed APIs, clean data models, and interfaces that feel inevitable.',
    },
    {
      name: 'Backend Architecture',
      desc: 'Services designed for load and failure — queues, caching layers, real-time pipelines, and the boring reliability that ships.',
    },
    {
      name: 'Creative Frontend',
      desc: 'GSAP, Framer Motion, WebGL-adjacent trickery — interfaces with weight, inertia, and intent. Motion as a feature, not garnish.',
    },
    {
      name: 'DevOps & Cloud',
      desc: 'Containers, CI/CD, observability, and infrastructure as code — deploys measured in minutes, incidents measured in calm.',
    },
  ],
}

function Scene({ type }) {
  if (type === 'stack')
    return (
      <div className="scn">
        <div className="scn-chrome"><i /><i /><i /></div>
        <div className="scn-bar w1"><i /></div>
        <div className="scn-bar w2"><i style={{ animationDelay: '0.3s' }} /></div>
        <div className="scn-bar w3"><i style={{ animationDelay: '0.6s' }} /></div>
        <div className="scn-cta" />
      </div>
    )
  if (type === 'backend')
    return (
      <div className="scn">
        <p className="scn-code">POST /api/v1/orders <b className="ok">→ 200</b></p>
        <div className="scn-pipe">
          <i className="scn-pkt" />
          <i className="scn-pkt" />
          <i className="scn-pkt" />
        </div>
        <p className="scn-code">queue: draining <b className="ok">0 lag</b></p>
        <div className="scn-pipe">
          <i className="scn-pkt" style={{ animationDelay: '0.8s' }} />
          <i className="scn-pkt" style={{ animationDelay: '1.3s' }} />
        </div>
        <p className="scn-code">cache hit <b className="ok">99.7%</b><span className="scn-blink">▍</span></p>
      </div>
    )
  if (type === 'motion')
    return (
      <div className="scn">
        <div className="scn-stage">
          <span className="scn-ball" />
          <span className="scn-star">✦</span>
          <svg className="scn-wave" viewBox="0 0 120 30">
            <path d="M0 15 Q 15 0, 30 15 T 60 15 T 90 15 T 120 15" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="scn-code">ease: elastic.out(1, 0.3)</p>
      </div>
    )
  return (
    <div className="scn">
      <div className="scn-nodes">
        <span className="scn-node"><b>✓</b></span>
        <span className="scn-link"><i /></span>
        <span className="scn-node"><b style={{ animationDelay: '1s' }}>✓</b></span>
        <span className="scn-link"><i style={{ animationDelay: '1s' }} /></span>
        <span className="scn-node"><b style={{ animationDelay: '2s' }}>✓</b></span>
      </div>
      <p className="scn-code">build → test → deploy <b className="ok">1.2s</b></p>
    </div>
  )
}

export default function Services() {
  const rootRef = useRef(null)
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const quickRef = useRef(null)
  const content = useContent('services', SERVICES_DEFAULT)
  const SERVICES = (content.list?.length ? content.list : SERVICES_DEFAULT.list).map(
    (s, i) => ({ ...s, scene: SCENES[i % SCENES.length] })
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.service-row').forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: i % 2 ? 90 : -90 },
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
          }
        )
      })
      gsap.fromTo(
        '.tech-gravity',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.tech-gravity', start: 'top 85%' },
        }
      )
    }, rootRef)

    quickRef.current = {
      x: gsap.quickTo(cardRef.current, 'x', { duration: 0.45, ease: 'power3' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.45, ease: 'power3' }),
      r: gsap.quickTo(cardRef.current, 'rotation', { duration: 0.6, ease: 'power3' }),
    }

    return () => ctx.revert()
  }, [content])

  const cardPos = (e) => ({ x: e.clientX + 34, y: e.clientY - 105 })

  const onRowEnter = (e, i) => {
    if (hovered === null) {
      const { x, y } = cardPos(e)
      gsap.set(cardRef.current, { x, y, rotation: 0 })
    }
    setHovered(i)
    const chars = e.currentTarget.querySelectorAll('.service-name .ch')
    gsap.to(chars, {
      y: -9,
      duration: 0.16,
      stagger: 0.015,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      overwrite: true,
    })
  }

  const onListMove = (e) => {
    if (hovered === null || !quickRef.current) return
    const { x, y } = cardPos(e)
    quickRef.current.x(x)
    quickRef.current.y(y)
    quickRef.current.r(gsap.utils.clamp(-14, 14, e.movementX * 1.2))
  }

  return (
    <section className="section" id="services" ref={rootRef}>
      <SlatReveal horizontal />
      <span className="section-ghost" aria-hidden>03</span>
      <div className="scribble scribble--lg scribble--auto services-scribble" aria-hidden>
        <span>things i can do for you</span>
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
      <div
        className={`service-list${hovered !== null ? ' has-hover' : ''}`}
        onMouseMove={onListMove}
        onMouseLeave={() => setHovered(null)}
      >
        {SERVICES.map((s, i) => (
          <div
            className="service-row"
            key={s.name}
            data-hover
            onMouseEnter={(e) => onRowEnter(e, i)}
          >
            <div className="service-fill" />
            <span className="service-num">({String(i + 1).padStart(2, '0')})</span>
            <h3 className="service-name">
              {s.name.split('').map((c, j) => (
                <span className="ch" key={j}>
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="service-card" ref={cardRef} aria-hidden>
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              className="service-card-inner"
              key={hovered}
              initial={{ opacity: 0, scale: 0.6, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Scene type={SERVICES[hovered].scene} />
              <div className="service-card-foot">
                <span>0{hovered + 1}</span>
                <span>live preview ✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SkillsShowcase />
    </section>
  )
}
