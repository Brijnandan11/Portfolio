import { useEffect, useMemo, useRef, useState } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { achieve } from './Achievements.jsx'
import { buildSkillsFromRows, FALLBACK_SKILLS } from './skillsShowcase.data.js'

function ProficiencyMeter({ value }) {
  return (
    <div className="skills-meter" aria-label={`Proficiency ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`skills-meter-bit${i < value ? ' is-on' : ''}`} />
      ))}
    </div>
  )
}

function SkillActionButton({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`skills-action-btn ${className}`.trim()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      data-hover
    >
      {children}
    </button>
  )
}

export default function SkillsShowcase({
  skills: skillsProp,
  heroTitle = 'SKILLS',
  navTitle = 'TOOLBOX',
  className = '',
  onSkillSelect,
  onViewProjects,
  showDetailPanel = true,
}) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const chipRefs = useRef([])
  const [selectedId, setSelectedId] = useState(FALLBACK_SKILLS[0]?.id || '')
  const [copied, setCopied] = useState(false)
  const [finePointer, setFinePointer] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(pointer: fine)').matches
  )
  const reduceMotion = useReducedMotion()
  const [skills, setSkills] = useState(() =>
    Array.isArray(skillsProp) && skillsProp.length ? skillsProp : FALLBACK_SKILLS
  )

  useEffect(() => {
    if (Array.isArray(skillsProp) && skillsProp.length) {
      setSkills(skillsProp)
      return
    }
    let cancelled = false
    fetch('/api/skills')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return
        const next = buildSkillsFromRows(rows)
        if (next.length) setSkills(next)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [skillsProp])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const interactive = finePointer && !reduceMotion
  const selected = useMemo(
    () => skills.find((skill) => skill.id === selectedId) || skills[0] || FALLBACK_SKILLS[0],
    [skills, selectedId]
  )

  useEffect(() => {
    if (!selected) return
    if (selected.id !== selectedId) setSelectedId(selected.id)
  }, [selected, selectedId])

  useEffect(() => {
    onSkillSelect?.(selected || null)
  }, [onSkillSelect, selected])

  useEffect(() => {
    if (!showDetailPanel) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-showcase .skills-panel',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
        }
      )
      gsap.fromTo(
        '.skills-showcase .tech-gravity',
        { opacity: 0, y: 46 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 84%' },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [showDetailPanel])

  useEffect(() => {
    if (!interactive) return undefined
    let cleanup = null

    const init = () => {
      const box = stageRef.current
      if (!box) return null

      const W = box.clientWidth
      const H = box.clientHeight
      const { Engine, Bodies, Body, World, Mouse, MouseConstraint } = Matter

      const engine = Engine.create()
      engine.gravity.y = 1.15

      const wallOpts = { isStatic: true, restitution: 0.3 }
      World.add(engine.world, [
        Bodies.rectangle(W / 2, H + 40, W + 400, 80, wallOpts),
        Bodies.rectangle(-40, H / 2 - H, 80, H * 4, wallOpts),
        Bodies.rectangle(W + 40, H / 2 - H, 80, H * 4, wallOpts),
        Bodies.rectangle(W / 2, -H * 3, W + 400, 80, wallOpts),
      ])

      const chips = chipRefs.current.slice(0, skills.length).filter(Boolean)
      const sizes = chips.map((el) => [el.offsetWidth, el.offsetHeight])
      const bodies = chips.map((_el, i) => {
        const [w, h] = sizes[i]
        const x = 40 + Math.random() * Math.max(W - 80, 80)
        const y = -60 - i * 42
        const opts = {
          restitution: 0.45,
          friction: 0.4,
          frictionAir: 0.02,
          angle: (Math.random() - 0.5) * 0.8,
        }
        return Bodies.rectangle(x, y, w, h, { ...opts, chamfer: { radius: h / 2 } })
      })
      World.add(engine.world, bodies)

      const pusher = Bodies.circle(-400, -400, 40, {
        isStatic: true,
        restitution: 0.6,
        collisionFilter: { category: 0x0002 },
      })
      World.add(engine.world, pusher)

      const listeners = []
      const on = (el, ev, fn) => {
        el.addEventListener(ev, fn)
        listeners.push([el, ev, fn])
      }

      let magnet = false
      let mc = null

      const blastAt = (x, y, radius = 280, power = 0.12) => {
        achieve('arena')
        bodies.forEach((b) => {
          const dx = b.position.x - x
          const dy = b.position.y - y
          const d = Math.hypot(dx, dy) || 1
          if (d > radius) return
          const f = ((1 - d / radius) * power * b.mass) || 0
          Body.applyForce(b, b.position, { x: (dx / d) * f, y: (dy / d) * f - f * 0.4 })
        })
      }

      if (window.matchMedia('(pointer: fine)').matches) {
        const mouse = Mouse.create(box)
        mc = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.18, damping: 0.12 },
          collisionFilter: { mask: 0x0001 },
        })
        World.add(engine.world, mc)
        mouse.element.removeEventListener('wheel', mouse.mousewheel)
        mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

        on(box, 'mousemove', (e) => {
          const rect = box.getBoundingClientRect()
          Body.setPosition(pusher, {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        })
        on(box, 'mouseleave', () => {
          Body.setPosition(pusher, { x: -400, y: -400 })
          magnet = false
          box.classList.remove('is-magnet')
        })
        on(box, 'mousedown', () => {
          magnet = true
          box.classList.add('is-magnet')
        })
        on(window, 'mouseup', () => {
          if (magnet && !mc.body && pusher.position.x > -100) {
            blastAt(pusher.position.x, pusher.position.y, 240, 0.07)
          }
          magnet = false
          box.classList.remove('is-magnet')
        })
      }

      on(box, 'dblclick', (e) => {
        const rect = box.getBoundingClientRect()
        blastAt(e.clientX - rect.left, e.clientY - rect.top)
      })

      const update = () => {
        if (magnet && mc && !mc.body) {
          bodies.forEach((b) => {
            const dx = pusher.position.x - b.position.x
            const dy = pusher.position.y - b.position.y
            const d = Math.hypot(dx, dy) || 1
            const f = 0.0011 * b.mass * Math.min(d / 120, 1)
            Body.applyForce(b, b.position, { x: (dx / d) * f, y: (dy / d) * f })
          })
        }
        Engine.update(engine, 1000 / 60)
        bodies.forEach((b, i) => {
          const el = chips[i]
          const [w, h] = sizes[i]
          el.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
        })
      }

      gsap.ticker.add(update)

      return () => {
        gsap.ticker.remove(update)
        listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn))
        World.clear(engine.world, false)
        Engine.clear(engine)
      }
    }

    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        cleanup = init()
      },
    })

    let resizeTimer
    const onResize = () => {
      if (!cleanup) return
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cleanup()
        cleanup = init()
      }, 350)
    }
    window.addEventListener('resize', onResize)

    return () => {
      st.kill()
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      cleanup?.()
    }
  }, [interactive, skills])

  const selectedIndex = skills.findIndex((skill) => skill.id === selected?.id)
  const displaySkill = selected || FALLBACK_SKILLS[0]

  const viewProjects = () => {
    if (typeof onViewProjects === 'function') {
      onViewProjects(selected)
      return
    }
    const el = document.getElementById('work')
    if (window.lenis?.scrollTo) {
      window.lenis.scrollTo('#work', { duration: 1.4 })
      return
    }
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyStackName = async () => {
    try {
      await navigator.clipboard.writeText(displaySkill?.name || '')
      achieve('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={`skills-showcase${className ? ` ${className}` : ''}`} ref={rootRef}>
      <div className="scribble scribble--lg scribble--auto skills-showcase-scribble" aria-hidden>
        <span>my tools, not a library</span>
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

      <div className="skills-showcase-top">
        <span className="skills-showcase-kicker">{navTitle}</span>
        <span className="skills-showcase-hint">({skills.length}) drag · click to inspect</span>
      </div>

      <div className="skills-showcase-grid">
        <div className={`tech-gravity skills-stage${interactive ? ' is-interactive' : ' is-static'}`} ref={stageRef} data-cursor={interactive ? 'DRAG' : undefined}>
          <span className="tech-gravity-word" aria-hidden>{heroTitle}</span>
          <span className="tech-gravity-hint">
            ({skills.length}) skills — drag · click · double-click to scatter
          </span>

          {interactive ? (
            skills.map((item, i) => (
              <button
                type="button"
                className={`g-chip ${item.variant || ''}${item.id === selected?.id ? ' is-selected' : ''}`}
                key={item.id}
                ref={(el) => (chipRefs.current[i] = el)}
                style={{
                  transform: 'translate(-400px, -400px)',
                }}
                aria-label={`${item.name}, ${item.category}, ${item.yearsUsed}`}
                onClick={() => setSelectedId(item.id)}
              >
                {item.name}
              </button>
            ))
          ) : (
            <div className="skills-grid">
              {skills.map((item) => (
                <button
                  type="button"
                  className={`g-chip ${item.variant || ''}${item.id === selected?.id ? ' is-selected' : ''}`}
                  key={item.id}
                  aria-label={`${item.name}, ${item.category}, ${item.yearsUsed}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

      {showDetailPanel && displaySkill && (
        <aside className="skills-panel">
            <div className="skills-panel-top">
              <span className="skills-panel-kicker">SELECTED SKILL</span>
              <span className="skills-panel-index">
              {String((selectedIndex < 0 ? 0 : selectedIndex) + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="skills-panel-name">{displaySkill.name}</h3>

          <div className="skills-panel-meta">
              <span>{displaySkill.category || 'Systems'}</span>
              <span>{String(displaySkill.yearsUsed || '').toUpperCase() || 'N/A'}</span>
          </div>

            <p className="skills-panel-desc">{displaySkill.description || 'Useful for shipping the boring part quickly.'}</p>

            <div className="skills-panel-meter-row">
              <span className="skills-panel-label">PROFICIENCY</span>
              <span className="skills-panel-years">{String(displaySkill.yearsUsed || '').toUpperCase() || 'N/A'}</span>
            </div>
            <ProficiencyMeter value={displaySkill.proficiency || 3} />

            <div className="skills-panel-usecases">
              <span>USE CASES</span>
              <ul>
                {(displaySkill.useCases?.length ? displaySkill.useCases : ['Production use', 'Side projects', 'Learning']).map((useCase) => (
                  <li key={useCase}>{useCase}</li>
                ))}
              </ul>
            </div>

            <div className="skills-panel-actions">
              <SkillActionButton className="is-primary" onClick={viewProjects}>
                VIEW PROJECTS
              </SkillActionButton>
              <SkillActionButton onClick={copyStackName}>
                {copied ? 'COPIED' : 'COPY STACK NAME'}
              </SkillActionButton>
              {displaySkill.docsUrl ? (
                <a
                  className="skills-docs-btn"
                  href={displaySkill.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${displaySkill.name} docs in a new tab`}
                >
                  ↗
                </a>
              ) : null}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
