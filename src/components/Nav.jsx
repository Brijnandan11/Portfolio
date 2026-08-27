import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../content.jsx'
import useLocalTime from '../hooks/useLocalTime.js'

const SITE_DEFAULT = {
  email: 'brij19069@gmail.com',
  github: 'Brijnandan11',
  linkedin: 'https://linkedin.com',
  x: 'https://x.com',
}

const LINKS = [
  ['Home', '#top'],
  ['Work', '#work'],
  ['About', '#about'],
  ['Services', '#services'],
  ['Terminal', '#terminal'],
  ['Contact', '#contact'],
]

const EASE = [0.76, 0, 0.24, 1]
const SLATS = 5

const slatVariants = {
  closed: (i) => ({
    y: '-101%',
    transition: { duration: 0.6, ease: EASE, delay: 0.3 + i * 0.05 },
  }),
  open: (i) => ({
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.06 },
  }),
}

const linkVariants = {
  closed: (i) => ({
    y: '120%',
    rotate: 5,
    transition: { duration: 0.45, ease: EASE, delay: 0.02 * i },
  }),
  open: (i) => ({
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.45 + 0.07 * i },
  }),
}

const fadeVariants = {
  closed: { opacity: 0, y: 16, transition: { duration: 0.25 } },
  open: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
}

export default function Nav({ loaded }) {
  const [open, setOpen] = useState(false)
  const site = useContent('site', SITE_DEFAULT)
  const [hovered, setHovered] = useState(null)
  const { time } = useLocalTime()

  useEffect(() => {
    const lenis = window.lenis
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => {
      window.lenis?.scrollTo(href, { duration: 1.6 })
    }, 900)
  }

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ y: -60, opacity: 0 }}
        animate={loaded ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      >
        <a className="nav-logo" href="#top" data-hover onClick={(e) => go(e, 0)}>
          BRIJ<em>®</em>
        </a>
      </motion.nav>

      <motion.button
        className={`burger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-cursor={open ? 'CLOSE' : 'MENU'}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          loaded ? { scale: 1, opacity: 1, rotate: open ? 90 : 0 } : {}
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          className="burger-line"
          animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.span
          className="burger-line"
          animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="menu-slats" aria-hidden>
              {Array.from({ length: SLATS }).map((_, i) => (
                <motion.div
                  className="menu-slat"
                  key={i}
                  custom={i}
                  variants={slatVariants}
                />
              ))}
            </div>

            <div className="menu-preview" aria-hidden>
              <AnimatePresence mode="wait">
                {hovered && (
                  <motion.span
                    key={hovered}
                    initial={{ opacity: 0, y: 50, rotate: 2 }}
                    animate={{ opacity: 1, y: 0, rotate: -4 }}
                    exit={{ opacity: 0, y: -40, rotate: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {hovered}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <motion.div className="menu-top" variants={fadeVariants} custom={0.5}>
              <span className="menu-tag">Navigation</span>
              <span className="menu-tag">Local — {time}</span>
            </motion.div>

            <div className="menu-links">
              {LINKS.map(([label, href], i) => (
                <div className="menu-link-mask" key={label}>
                  <motion.div custom={i} variants={linkVariants}>
                    <a
                      className="menu-link"
                      href={href}
                      data-hover
                      onClick={(e) => go(e, href)}
                      onMouseEnter={() => setHovered(label)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <sup>0{i + 1}</sup>
                      <span className="roll">
                        <span className="roll-a">{label}</span>
                        <span className="roll-b">{label}</span>
                      </span>
                    </a>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div className="menu-foot" variants={fadeVariants} custom={0.85}>
              <a href={`mailto:${site.email}`} data-hover>
                {site.email}
              </a>
              <div className="menu-socials">
                <a href={`https://github.com/${site.github}`} target="_blank" rel="noreferrer">GitHub</a>
                <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={site.x} target="_blank" rel="noreferrer">X</a>
              </div>
              <span className="menu-status">
                <span className="dot" /> Open for work
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
