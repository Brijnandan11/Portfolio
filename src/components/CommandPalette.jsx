import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { achieve } from './Achievements.jsx'

const SECTIONS = [
  ['⌂', 'Go home', '#top'],
  ['◧', 'View work', '#work'],
  ['◉', 'About me', '#about'],
  ['✦', 'Services', '#services'],
  ['▮', 'Open terminal', '#terminal'],
  ['✉', 'Contact', '#contact'],
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const [hasResume, setHasResume] = useState(false)
  const [unlocked, setUnlocked] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((r) =>
        setHasResume(r.ok && (r.headers.get('content-type') || '').includes('pdf'))
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      window.lenis?.stop()
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 80)
      try {
        setUnlocked(
          JSON.parse(
            localStorage.getItem('brij_achievements') ||
              localStorage.getItem('draken_achievements') ||
              '[]'
          ).length
        )
      } catch {
        setUnlocked(0)
      }
    } else {
      window.lenis?.start()
    }
  }, [open])

  const actions = useMemo(() => {
    const list = [
      ...SECTIONS.map(([icon, label, href]) => ({
        icon,
        label,
        group: 'navigate',
        run: () => {
          window.lenis?.start()
          window.lenis?.scrollTo(href === '#top' ? 0 : href, { duration: 1.5 })
        },
      })),
      {
        icon: '⧉',
        label: 'Copy email address',
        group: 'actions',
        run: () => {
          navigator.clipboard?.writeText(
            window.__siteContent?.site?.email || 'brij19069@gmail.com'
          )
          achieve('copy')
        },
      },
      {
        icon: '⌥',
        label: 'Open GitHub',
        group: 'actions',
        run: () =>
          window.open(
            `https://github.com/${window.__siteContent?.site?.github || 'Brijnandan11'}`,
            '_blank'
          ),
      },
      {
        icon: '↺',
        label: 'Do a barrel roll',
        group: 'actions',
        run: () => window.dispatchEvent(new CustomEvent('barrel-roll')),
      },
    ]
    if (hasResume) {
      list.push({
        icon: '▤',
        label: 'Download resume',
        group: 'actions',
        run: () => window.open('/resume.pdf', '_blank'),
      })
    }
    return list
  }, [hasResume])

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(q.toLowerCase())
  )

  const exec = (action) => {
    setOpen(false)
    setTimeout(() => action.run(), 120)
  }

  useEffect(() => {
    document
      .querySelector('.cmdk-item.is-active')
      ?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[idx]) {
      exec(filtered[idx])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="cmdk"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input-row">
              <span className="cmdk-prompt">➜</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIdx(0)
                }}
                onKeyDown={onInputKey}
                placeholder="type a command…"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <div className="cmdk-list">
              {filtered.length === 0 && (
                <p className="cmdk-empty">nothing found — try `work` or `email`</p>
              )}
              {filtered.map((a, i) => (
                <button
                  key={a.label}
                  className={`cmdk-item${i === idx ? ' is-active' : ''}`}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => exec(a)}
                >
                  <span className="cmdk-icon">{a.icon}</span>
                  <span className="cmdk-label">{a.label}</span>
                  <span className="cmdk-group">{a.group}</span>
                </button>
              ))}
            </div>
            <div className="cmdk-foot">
              <span>🏆 {unlocked}/8 achievements unlocked</span>
              <span>
                <kbd>↑↓</kbd> navigate · <kbd>↵</kbd> run
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
