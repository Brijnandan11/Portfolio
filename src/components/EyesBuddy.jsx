import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { achieve } from './Achievements.jsx'

export default function EyesBuddy() {
  const rootRef = useRef(null)
  const [bounds, setBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0 })
  const [asleep, setAsleep] = useState(false)
  const [inFooter, setInFooter] = useState(false)

  useEffect(() => {
    let timer
    const reset = () => {
      setAsleep(false)
      clearTimeout(timer)
      timer = setTimeout(() => setAsleep(true), 25000)
    }
    reset()
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    window.addEventListener('scroll', reset)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('keydown', reset)
      window.removeEventListener('scroll', reset)
    }
  }, [])

  const pet = () => {
    achieve('petter')
    const rect = rootRef.current.getBoundingClientRect()
    for (let i = 0; i < 6; i++) {
      const bit = document.createElement('span')
      bit.className = 'confetti-bit'
      bit.textContent = Math.random() > 0.4 ? '♥' : '✦'
      bit.style.color = i % 2 ? '#ff4d00' : '#e8e4dc'
      bit.style.fontSize = '13px'
      document.body.appendChild(bit)
      gsap.fromTo(
        bit,
        {
          x: rect.left + rect.width / 2,
          y: rect.top,
          scale: 0.4,
          opacity: 1,
        },
        {
          x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 90,
          y: rect.top - 60 - Math.random() * 60,
          scale: 1.1,
          rotate: (Math.random() - 0.5) * 60,
          opacity: 0,
          duration: 1 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => bit.remove(),
        }
      )
    }
  }

  useEffect(() => {
    const set = () =>
      setBounds({
        top: -(window.innerHeight - 130),
        left: 0,
        right: window.innerWidth - 130,
        bottom: 0,
      })
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const pupils = rootRef.current.querySelectorAll('.eye i')

    const onMove = (e) => {
      pupils.forEach((pupil) => {
        const r = pupil.parentElement.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const d = Math.hypot(dx, dy) || 1
        const m = Math.min(d / 10, r.width * 0.22)
        gsap.to(pupil, {
          x: (dx / d) * m,
          y: (dy / d) * m,
          duration: 0.35,
          ease: 'power2.out',
        })
      })
    }

    const onDown = () => {
      gsap.to(rootRef.current.querySelectorAll('.eye'), {
        scaleY: 0.35,
        duration: 0.1,
        transformOrigin: 'center',
        onComplete: () =>
          gsap.to(rootRef.current.querySelectorAll('.eye'), {
            scaleY: 1,
            duration: 0.45,
            ease: 'elastic.out(1, 0.5)',
          }),
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.footer-shell')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setInFooter(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      className={`buddy${asleep ? ' is-asleep' : ''}${inFooter ? ' is-footer-hidden' : ''}`}
      ref={rootRef}
      aria-hidden
      data-cursor={asleep ? 'SHH' : 'DRAG'}
      drag
      dragConstraints={bounds}
      dragElastic={0.18}
      dragMomentum
      dragTransition={{ bounceStiffness: 260, bounceDamping: 16 }}
      whileHover={{ scale: 1.08 }}
      whileDrag={{ scale: 1.18, rotate: 4 }}
      onTap={pet}
    >
      <div className="buddy-inner">
        <span className="eye"><i /></span>
        <span className="eye"><i /></span>
      </div>
      {asleep && (
        <span className="buddy-zzz">
          <i>z</i>
          <i>z</i>
          <i>z</i>
        </span>
      )}
    </motion.div>
  )
}
