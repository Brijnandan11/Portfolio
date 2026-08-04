import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useContent } from '../content.jsx'

const SITE_DEFAULT = { github: 'gudhalarya' }

const DAYS = 26 * 7 // last ~6 months

const demoData = () => {
  const days = []
  const now = new Date()
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const wave = Math.sin(i * 0.4) + Math.sin(i * 0.13) * 1.4
    const count = Math.max(0, Math.round(wave * 3 + (Math.random() * 6 - 2)))
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
      level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4,
    })
  }
  return days
}

export default function GithubHeat() {
  const rootRef = useRef(null)
  const gridRef = useRef(null)
  const [days, setDays] = useState(null)
  const [total, setTotal] = useState(0)
  const [demo, setDemo] = useState(false)
  const site = useContent('site', SITE_DEFAULT)
  const GITHUB_USER = site.github || 'gudhalarya'

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const slice = data.contributions.slice(-DAYS)
        setDays(slice)
        setTotal(Object.values(data.total)[0] || slice.reduce((s, d) => s + d.count, 0))
      })
      .catch(() => {
        setDays(demoData())
        setTotal(847)
        setDemo(true)
      })
  }, [GITHUB_USER])

  useEffect(() => {
    if (!days || !gridRef.current) return
    gridRef.current.scrollLeft = gridRef.current.scrollWidth
  }, [days])

  useEffect(() => {
    if (!days) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gh-cell',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(2)',
          stagger: { each: 0.004, from: 'random' },
          scrollTrigger: { trigger: rootRef.current, start: 'top 88%' },
        }
      )
      const totalEl = rootRef.current.querySelector('.gh-total b')
      if (totalEl) {
        gsap.fromTo(
          totalEl,
          { innerText: 0 },
          {
            innerText: total,
            snap: { innerText: 1 },
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: rootRef.current, start: 'top 88%' },
          }
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [days, total])

  if (!days) return null

  return (
    <div className="gh-wrap" ref={rootRef}>
      <div className="gh-head">
        <div className="scribble scribble--lg gh-scribble" aria-hidden>
          <span>proof of work</span>
          <svg viewBox="0 0 130 12">
            <path
              d="M3 8 C 34 2, 68 11, 127 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="gh-total">
          <b>0</b> contributions / last year{demo ? ' · demo data' : ''}
        </span>
        <a
          className="gh-link"
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noreferrer"
        >
          @{GITHUB_USER} ↗
        </a>
      </div>
      <div className="gh-grid" data-hover ref={gridRef}>
        {days.map((d) => (
          <span
            key={d.date}
            className={`gh-cell l${d.level}`}
            title={`${d.count} contributions — ${d.date}`}
          />
        ))}
      </div>
    </div>
  )
}
