import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlatReveal from './SlatReveal.jsx'
import { useContent } from '../content.jsx'

const MARQUEE_DEFAULT = {
  items: ['Full Stack Developer', 'Creative Engineer', 'Motion Enthusiast'],
}

function Row({ items, outline }) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} aria-hidden={copy === 1} style={{ display: 'flex', gap: '3rem' }}>
          {items.map((item) => (
            <span key={item} className={`marquee-item${outline ? ' outline' : ''}`}>
              {item} <span className="star">✦</span>
            </span>
          ))}
        </div>
      ))}
    </>
  )
}

export default function Marquee() {
  const rootRef = useRef(null)
  const { items } = useContent('marquee', MARQUEE_DEFAULT)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray('.marquee-track')
      const tweens = tracks.map((track, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        return gsap
          .to(track, {
            xPercent: -50,
            repeat: -1,
            duration: 30,
            ease: 'none',
          })
          .timeScale(dir)
      })
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3)
          tweens.forEach((tween, i) => {
            const dir = (i % 2 === 0 ? 1 : -1) * (self.direction || 1)
            gsap.to(tween, { timeScale: dir * boost, duration: 0.5, overwrite: true })
          })
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [items])

  return (
    <section className="marquee" ref={rootRef}>
      <SlatReveal horizontal reverse count={4} />
      <div className="marquee-track">
        <Row items={items} />
      </div>
      <div className="marquee-track" style={{ marginTop: '1.5rem' }}>
        <Row items={items} outline />
      </div>
    </section>
  )
}
