import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['hello', 'bonjour', 'こんにちは', 'namaste', 'welcome']

const LOG = [
  { at: 12, text: 'mounting gsap engine' },
  { at: 32, text: 'calibrating smooth scroll' },
  { at: 52, text: 'warming up physics arena' },
  { at: 72, text: 'hiding easter eggs' },
  { at: 90, text: 'polishing pixels' },
]

const EASE = [0.76, 0, 0.24, 1]

const slatVariants = {
  in: { y: 0 },
  out: (i) => ({
    y: '-101%',
    transition: { duration: 0.65, ease: EASE, delay: 0.25 + i * 0.06 },
  }),
}

const contentVariants = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -50, transition: { duration: 0.35, ease: EASE } },
}

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2400
    let frame
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) frame = requestAnimationFrame(tick)
      else setTimeout(onComplete, 350)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onComplete])

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => Math.min(i + 1, WORDS.length - 1)),
      480
    )
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div className="preloader" initial="in" animate="in" exit="out">
      <div className="preloader-slats" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div className="preloader-slat" key={i} custom={i} variants={slatVariants} />
        ))}
      </div>

      <motion.div className="preloader-content" variants={contentVariants}>
        <span className="preloader-tag">Brij® — Portfolio Vol. 2</span>

        <div className="preloader-center">
          <span className="preloader-greeting">
            <AnimatePresence mode="wait">
              <motion.i
                key={wordIndex}
                initial={{ opacity: 0, y: 12, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                exit={{ opacity: 0, y: -12, rotate: 2 }}
                transition={{ duration: 0.25 }}
              >
                {WORDS[wordIndex]}
              </motion.i>
            </AnimatePresence>
          </span>
          <div className="preloader-word" aria-hidden>
              <span className="pl-outline">BRIJ</span>
            <span
              className="pl-fill"
              style={{ clipPath: `inset(-10% ${100 - count}% -10% 0)` }}
            >
              BRIJ
            </span>
          </div>
        </div>

        <div className="preloader-log" aria-hidden>
          {LOG.map((line) => (
            <p key={line.at} className={count >= line.at ? 'is-done' : ''}>
              <b>{count >= line.at ? '✓' : '·'}</b> {line.text}
            </p>
          ))}
        </div>

        <span className="preloader-count">{count}</span>
        <span className="preloader-bar">
          <i style={{ width: `${count}%` }} />
        </span>
      </motion.div>
    </motion.div>
  )
}
