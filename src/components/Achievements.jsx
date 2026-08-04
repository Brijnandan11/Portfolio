import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

const LIST = {
  boom: ['💥', 'Demolition expert', 'detonated the hero'],
  arena: ['🧲', 'Physics abuser', 'caused chaos in the arsenal'],
  snake: ['🐍', 'Shell gamer', 'played snake in the terminal'],
  hacker: ['⌨️', 'Terminal dweller', 'ran a shell command'],
  copy: ['📋', 'Smooth operator', 'copied the email'],
  bottom: ['🧗', 'Deep scroller', 'reached the very bottom'],
  petter: ['🫶', "Buddy's bestie", 'petted the eyes'],
  roll: ['🌀', 'Secret keeper', 'typed the magic word'],
}
const TOTAL = Object.keys(LIST).length
const STORE = 'brij_achievements'

export const achieve = (key) =>
  window.dispatchEvent(new CustomEvent('achieve', { detail: key }))

const confettiStorm = () => {
  for (let i = 0; i < 42; i++) {
    const bit = document.createElement('span')
    bit.className = 'confetti-bit'
    bit.textContent = ['✦', '●', '♥', '◆'][i % 4]
    bit.style.color = ['#ff4d00', '#e8e4dc', '#6dd400', '#7fa4f0'][i % 4]
    bit.style.fontSize = `${10 + Math.random() * 12}px`
    document.body.appendChild(bit)
    const x = Math.random() * window.innerWidth
    gsap.fromTo(
      bit,
      { x, y: -30, opacity: 1, rotate: 0 },
      {
        x: x + (Math.random() - 0.5) * 200,
        y: window.innerHeight + 40,
        rotate: (Math.random() - 0.5) * 500,
        opacity: 0.9,
        duration: 1.6 + Math.random() * 1.4,
        ease: 'power1.in',
        onComplete: () => bit.remove(),
      }
    )
  }
}

export default function Achievements() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unlocked = () => {
      try {
        return JSON.parse(localStorage.getItem(STORE) || '[]')
      } catch {
        return []
      }
    }

    const onAchieve = (e) => {
      const key = e.detail
      if (!LIST[key]) return
      const have = unlocked()
      if (have.includes(key)) return
      const next = [...have, key]
      localStorage.setItem(STORE, JSON.stringify(next))
      const toast = { key, count: next.length, id: Date.now() }
      setToasts((t) => [...t, toast])
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== toast.id)),
        4000
      )
    }
    window.addEventListener('achieve', onAchieve)

    // deep scroll detection
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 500 && window.scrollY >= max - 4) achieve('bottom')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // secret word → barrel roll
    let buffer = ''
    let rolling = false
    const doRoll = () => {
      if (rolling) return
      rolling = true
      achieve('roll')
      confettiStorm()
      gsap.to('main', {
        rotation: 360,
        duration: 1.7,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set('main', { rotation: 0 })
          rolling = false
        },
      })
    }
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (!/^[a-z]$/i.test(e.key)) return
      buffer = (buffer + e.key.toLowerCase()).slice(-6)
      if (buffer === 'brij') doRoll()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('barrel-roll', doRoll)

    return () => {
      window.removeEventListener('achieve', onAchieve)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('barrel-roll', doRoll)
    }
  }, [])

  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const [icon, title, desc] = LIST[t.key]
          return (
            <motion.div
              className="toast"
              key={t.id}
              initial={{ x: 120, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            >
              <span className="toast-icon">{icon}</span>
              <span className="toast-body">
                <b>{title}</b>
                <small>{desc}</small>
              </span>
              <span className="toast-count">
                {t.count}/{TOTAL}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
