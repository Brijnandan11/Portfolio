import { useEffect, useMemo, useRef, useState } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { achieve } from './Achievements.jsx'
import { buildSkillsFromRows, FALLBACK_SKILLS } from './skillsShowcase.data.js'

export default function SkillsShowcase({
  skills: skillsProp,
  heroTitle = 'ARSENAL',
  navTitle = 'TOOLBOX',
  className = '',
  onSkillSelect,
  showDetailPanel = false,
}) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const chipRefs = useRef([])
  const [selectedId, setSelectedId] = useState(FALLBACK_SKILLS[0]?.id || '')
  const [finePointer, setFinePointer] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(pointer: fine)').matches
  )
  const reduceMotion = useReducedMotion()
  const [skills, setSkills] = useState(() =>
    Array.isArray(skillsProp) && skillsProp.length ? skillsProp : FALLBACK_SKILLS
  )

  /* refs that the physics useEffect and button handlers share */
  const engineRef = useRef(null)
  const bodiesRef = useRef([])
  const chipElsRef = useRef([])
  const sizesRef = useRef([])
  const updateRef = useRef(null)

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
    return () => { cancelled = true }
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

  /* ---- Physics engine ---- */
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
      engineRef.current = engine

      const wallOpts = { isStatic: true, restitution: 0.3 }
      World.add(engine.world, [
        Bodies.rectangle(W / 2, H + 40, W + 400, 80, wallOpts),
        Bodies.rectangle(-40, H / 2 - H, 80, H * 4, wallOpts),
        Bodies.rectangle(W + 40, H / 2 - H, 80, H * 4, wallOpts),
        Bodies.rectangle(W / 2, -H * 3, W + 400, 80, wallOpts),
      ])

      const chips = chipRefs.current.slice(0, skills.length).filter(Boolean)
      chipElsRef.current = chips
      const sizes = chips.map((el) => [el.offsetWidth, el.offsetHeight])
      sizesRef.current = sizes

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
      bodiesRef.current = bodies

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

      updateRef.current = update
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
      onEnter: () => { cleanup = init() },
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

  /* ---- Physics button handlers ---- */
  const explode = () => {
    const engine = engineRef.current
    const bodies = bodiesRef.current
    const box = stageRef.current
    if (!engine || !bodies.length || !box) return
    achieve('arena')
    const { Body } = Matter
    const cx = box.clientWidth / 2
    const cy = box.clientHeight / 2
    bodies.forEach((b) => {
      const dx = b.position.x - cx
      const dy = b.position.y - cy
      const d = Math.hypot(dx, dy) || 1
      const power = 0.18
      const f = power * b.mass
      Body.applyForce(b, b.position, { x: (dx / d) * f, y: (dy / d) * f - f * 0.6 })
    })
  }

  const zeroG = () => {
    const engine = engineRef.current
    if (!engine) return
    engine.gravity.y = engine.gravity.y === 0 ? 1.15 : 0
  }

  const reRain = () => {
    const engine = engineRef.current
    const bodies = bodiesRef.current
    const box = stageRef.current
    if (!engine || !bodies.length || !box) return
    const { Body } = Matter
    const W = box.clientWidth
    engine.gravity.y = 1.15
    bodies.forEach((b, i) => {
      const [w] = sizesRef.current[i] || [80, 36]
      Body.setPosition(b, {
        x: 40 + Math.random() * Math.max(W - 80, 80),
        y: -80 - i * 42,
      })
      Body.setVelocity(b, { x: 0, y: 0 })
      Body.setAngle(b, (Math.random() - 0.5) * 0.8)
    })
  }

  return (
    <section className={`skills-showcase${className ? ` ${className}` : ''}`} ref={rootRef}>
      {/* Title + buttons row */}
      <div className="skills-showcase-header">
        <div className="skills-showcase-title-wrap">
          <h2 className="skills-showcase-title">my weapons of choice</h2>
          <span className="skills-showcase-title-line" aria-hidden />
        </div>
        <div className="skills-showcase-controls">
          <button type="button" className="arsenal-btn" onClick={explode} data-hover>
            [ EXPLODE ]
          </button>
          <button type="button" className="arsenal-btn" onClick={zeroG} data-hover>
            [ ZERO-G ]
          </button>
          <button type="button" className="arsenal-btn" onClick={reRain} data-hover>
            [ RE-RAIN ]
          </button>
        </div>
      </div>

      {/* Physics canvas */}
      <div className="skills-showcase-canvas-wrap">
        <div
          className={`tech-gravity skills-stage${interactive ? ' is-interactive' : ' is-static'}`}
          ref={stageRef}
          data-cursor={interactive ? 'DRAG' : undefined}
        >
          <span className="tech-gravity-word" aria-hidden>{heroTitle}</span>
          <span className="tech-gravity-hint">
            ({skills.length}) — drag · click · double-click
          </span>

          {interactive ? (
            skills.map((item, i) => (
              <button
                type="button"
                className={`g-chip ${item.variant || ''}${item.id === selected?.id ? ' is-selected' : ''}`}
                key={item.id}
                ref={(el) => (chipRefs.current[i] = el)}
                style={{ transform: 'translate(-400px, -400px)' }}
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
      </div>
    </section>
  )
}
