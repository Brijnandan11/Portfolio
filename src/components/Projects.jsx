import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlatReveal from './SlatReveal.jsx'

const shots = import.meta.glob('../assets/projects/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const findShot = (key) =>
  Object.entries(shots).find(([path]) => path.toLowerCase().includes(key))?.[1]

const PROJECTS = [
  {
    key: 'ferrox',
    title: 'Ferrox Gateway',
    url: 'ferrox.dev',
    desc: 'A high-throughput API gateway written in Rust — rate limiting, auth, and observability at the edge, benchmarked in the tens of thousands of requests per second.',
    tags: ['Rust', 'Actix', 'Redis', 'Docker'],
    bg: 'linear-gradient(135deg, #ff4d00 0%, #7a1f00 55%, #1a0a04 100%)',
    fg: '#ffe9df',
    accent: '#0a0a0a',
    mark: 'fx',
  },
  {
    key: 'curateme',
    title: 'CurateMe Studio',
    url: 'curateme.studio',
    desc: 'A full-stack creator platform with curated collections, real-time collaboration, and a custom CMS — built for speed and editorial polish.',
    tags: ['Next.js', 'Node', 'PostgreSQL', 'WebSockets'],
    bg: 'linear-gradient(135deg, #d8d4cc 0%, #8a867d 55%, #24221f 100%)',
    fg: '#171614',
    accent: '#ff4d00',
    mark: 'cm',
  },
  {
    key: 'textile',
    title: 'Textile Flow',
    url: 'textileflow.app',
    desc: 'An end-to-end manufacturing ERP handling orders, inventory, and dispatch for textile units — offline-tolerant, multi-tenant, battle-tested on the factory floor.',
    tags: ['React', 'Express', 'MongoDB', 'Docker'],
    bg: 'linear-gradient(135deg, #3a5f48 0%, #16241b 60%, #070b08 100%)',
    fg: '#d9e8de',
    accent: '#8fd6a5',
    mark: 'tf',
  },
  {
    key: 'blogify',
    title: 'Blogify',
    url: 'blogify.ink',
    desc: 'A minimal publishing engine with markdown pipelines, edge caching, and sub-second page loads — writing-first, everything else second.',
    tags: ['React', 'Go', 'SQLite', 'Fly.io'],
    bg: 'linear-gradient(135deg, #33456b 0%, #131b2b 60%, #06080d 100%)',
    fg: '#dbe4f5',
    accent: '#7fa4f0',
    mark: 'bl',
  },
]

function Skeleton({ p }) {
  return (
    <div className="sk" style={{ '--sk': p.fg, '--ska': p.accent }}>
      <div className="sk-nav">
        <span className="sk-logo">{p.mark}®</span>
        <span className="sk-links">
          <i />
          <i />
          <i />
        </span>
        <span className="sk-cta" />
      </div>
      <div className="sk-hero">
        <h4>{p.title}</h4>
        <div className="sk-line w60" />
        <div className="sk-line w40" />
      </div>
      <div className="sk-cards">
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

export default function Projects() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const [projects, setProjects] = useState(PROJECTS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (cancelled || !Array.isArray(rows) || !rows.length) return
        setProjects(
          rows.map((r) => ({
            key: r.key,
            title: r.title,
            url: r.url,
            desc: r.description,
            tags: r.tags || [],
            bg: r.bg,
            fg: r.fg,
            accent: r.accent,
            mark: r.mark || r.title.slice(0, 2).toLowerCase(),
          }))
        )
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const mm = gsap.matchMedia(rootRef)

    mm.add('(min-width: 881px)', () => {
      const carousel = trackRef.current
      const cards = gsap.utils.toArray('.project-card', carousel)
      const n = cards.length
      if (!n) return
      const step = Math.min(360 / n, 32)
      const cardW = cards[0].offsetWidth
      const spread = 1.45
      const radius = Math.round(
        (cardW * spread) / 2 / Math.tan(((step / 2) * Math.PI) / 180)
      )

      const drop = Math.min(130, window.innerHeight * 0.14)
      const hudNum = rootRef.current.querySelector('.hud-num')
      const hudTitle = rootRef.current.querySelector('.hud-title')
      const hudDots = rootRef.current.querySelectorAll('.hud-dots i')
      let lastIdx = -1

      const proxy = { rot: 0 }
      const apply = () => {
        cards.forEach((card, i) => {
          const deg = i * step + proxy.rot
          const facing = Math.pow(Math.max(Math.cos((deg * Math.PI) / 180), 0), 1.6)
          gsap.set(card, {
            rotationY: deg,
            y: (deg / step) * drop,
            transformOrigin: `50% 50% ${-radius}px`,
          })
          card.style.setProperty('--facing', facing.toFixed(3))
          gsap.set(card.querySelector('.card-inner'), {
            opacity: 0.12 + 0.88 * facing,
            scale: 0.8 + 0.2 * facing,
            filter: `blur(${(1 - facing) * 6}px) brightness(${0.55 + 0.45 * facing})`,
          })
        })
        const idx = gsap.utils.clamp(0, n - 1, Math.round(-proxy.rot / step))
        if (idx !== lastIdx) {
          lastIdx = idx
          if (hudNum) hudNum.textContent = String(idx + 1).padStart(2, '0')
          if (hudTitle) {
            hudTitle.textContent = projects[idx]?.title || ''
            gsap.fromTo(hudTitle, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 })
          }
          hudDots.forEach((d, di) => d.classList.toggle('is-on', di === idx))
        }
      }
      apply()

      gsap.fromTo(
        carousel,
        { y: 280, opacity: 0, rotationX: -20 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
        }
      )

      const getEnd = () => Math.round(window.innerHeight * n * 0.75)

      gsap.to(proxy, {
        rot: -(n - 1) * step,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => '+=' + getEnd(),
          pin: true,
          scrub: 1,
          snap: n > 1 ? 1 / (n - 1) : undefined,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.projects-progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => '+=' + getEnd(),
          scrub: true,
        },
      })
    })

    mm.add('(max-width: 880px)', () => {
      gsap.utils.toArray('.project-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        )
      })
    })

    ScrollTrigger.refresh()
    return () => mm.revert()
  }, [ready])

  return (
    <section className="projects-wrap" id="work" ref={rootRef}>
      <div className="projects-pin">
        <SlatReveal reverse from="center" />
        <div className="projects-top">
          <div className="scribble scribble--lg scribble--auto" aria-hidden>
            <span>stuff i&apos;ve actually shipped</span>
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
          <span className="projects-progress"><i /></span>
        </div>
        <div className="projects-stage">
        <div className="projects-carousel" ref={trackRef}>
          {projects.map((p, i) => {
            const shot = findShot(p.key)
            return (
              <article className="project-card" key={p.title} data-cursor="VIEW">
                <div className="card-inner">
                <div className="project-visual">
                  <div className="browser-bar">
                    <i className="b-dot b-dot--accent" />
                    <i className="b-dot" />
                    <i className="b-dot" />
                    <span className="browser-url">https://{p.url}</span>
                  </div>
                  <div className="browser-body">
                    <div className="project-art" style={{ background: p.bg }}>
                      {shot ? (
                        <img className="project-shot" src={shot} alt={p.title} />
                      ) : (
                        <Skeleton p={p} />
                      )}
                    </div>
                  </div>
                  <span className="project-num">/{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="project-row">
                  <h2 className="project-title">{p.title}</h2>
                  <div className="project-side">
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </article>
            )
          })}
        </div>
        </div>
        <div className="carousel-hud" aria-hidden>
          <span className="hud-count">
            <b className="hud-num">01</b> / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="hud-title">{projects[0]?.title}</span>
          <span className="hud-dots">
            {projects.map((p, i) => (
              <i key={p.key} className={i === 0 ? 'is-on' : ''} />
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
