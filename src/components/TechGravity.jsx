import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { achieve } from './Achievements.jsx'

const SKILLS_FALLBACK = [
  { text: 'TypeScript', cls: 'v-accent' },
  { text: 'React' },
  { text: 'Next.js', cls: 'v-ink' },
  { text: 'Node.js' },
  { text: 'Rust', cls: 'v-ink' },
  { text: 'Go' },
  { text: 'PostgreSQL' },
  { text: 'MongoDB', cls: 'v-ink' },
  { text: 'Redis', cls: 'v-accent' },
  { text: 'Docker' },
  { text: 'AWS', cls: 'v-ink' },
  { text: 'GraphQL' },
  { text: 'GSAP', cls: 'v-accent' },
  { text: 'Framer Motion' },
  { text: 'Tailwind', cls: 'v-ink' },
  { text: 'Linux' },
  { text: 'Python' },
  { text: 'Kubernetes', cls: 'v-ink' },
  { text: 'Nginx' },
  { text: 'Prisma', cls: 'v-ink' },
  { text: 'Vite', cls: 'v-accent' },
  { text: 'Three.js' },
  { text: 'WebSockets', cls: 'v-ink' },
  { text: 'CI/CD' },
  { text: 'Figma', cls: 'v-accent' },
  { text: 'Git' },
  { text: 'Bun', cls: 'v-ink' },
  { text: 'Express' },
]

const EXTRAS = [
  { text: 'BRIJ®', cls: 'v-accent v-big' },
  { text: '</>', cls: 'v-ink' },
  { text: '{ }' },
  { text: '=>' },
  { text: '&&', cls: 'v-accent' },
  { text: 'npm i' },
  { text: 'git push', cls: 'v-ink' },
  { text: '200 OK', cls: 'v-ok' },
  { text: 'sudo', cls: 'v-accent' },
  { text: '⌘K' },
  { text: '✦', ball: 46, cls: 'v-accent' },
  { text: '✦', ball: 38, cls: 'v-ink' },
  { text: '', ball: 26, cls: 'v-accent' },
  { text: '', ball: 20, cls: 'v-ink' },
  { text: '', ball: 32 },
]

export default function TechGravity() {
  const boxRef = useRef(null)
  const chipRefs = useRef([])
  const apiRef = useRef(null)
  const [zeroG, setZeroG] = useState(false)
  const [items, setItems] = useState([...SKILLS_FALLBACK, ...EXTRAS])

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (!Array.isArray(rows) || !rows.length) return
        setItems([
          ...rows.map((r) => ({ text: r.name, cls: r.variant || '' })),
          ...EXTRAS,
        ])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cleanup = null

    const init = () => {
      const box = boxRef.current
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

      const chips = chipRefs.current.slice(0, items.length).filter(Boolean)
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
        return items[i].ball
          ? Bodies.circle(x, y, w / 2, opts)
          : Bodies.rectangle(x, y, w, h, { ...opts, chamfer: { radius: h / 2 } })
      })
      World.add(engine.world, bodies)

      // invisible cursor pusher — plows through the pile on mouse move
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

      let mc = null
      let magnet = false

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

      on(box, 'dblclick', (e) => {
        const rect = box.getBoundingClientRect()
        blastAt(e.clientX - rect.left, e.clientY - rect.top)
      })

      apiRef.current = {
        explode: () => blastAt(W / 2, H, Math.max(W, H), 0.09),
        reset: () => {
          engine.gravity.y = 1.15
          bodies.forEach((b, i) => {
            b.restitution = 0.45
            b.frictionAir = 0.02
            Body.setPosition(b, {
              x: 40 + Math.random() * Math.max(W - 80, 80),
              y: -60 - i * 42,
            })
            Body.setVelocity(b, { x: 0, y: 0 })
            Body.setAngularVelocity(b, 0)
            Body.setAngle(b, (Math.random() - 0.5) * 0.8)
          })
          setZeroG(false)
        },
        zeroG: (on) => {
          engine.gravity.y = on ? 0 : 1.15
          bodies.forEach((b) => {
            b.restitution = on ? 0.98 : 0.45
            b.frictionAir = on ? 0 : 0.02
            if (on) {
              Body.setVelocity(b, {
                x: (Math.random() - 0.5) * 7,
                y: (Math.random() - 0.5) * 7,
              })
              Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.12)
            }
          })
        },
      }

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
          el.style.transform = `translate(${b.position.x - w / 2}px, ${
            b.position.y - h / 2
          }px) rotate(${b.angle}rad)`
        })
      }
      gsap.ticker.add(update)

      return () => {
        gsap.ticker.remove(update)
        listeners.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn))
        World.clear(engine.world, false)
        Engine.clear(engine)
        apiRef.current = null
      }
    }

    const st = ScrollTrigger.create({
      trigger: boxRef.current,
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
  }, [items])

  return (
    <>
    <div className="scribble scribble--lg scribble--auto arena-scribble" aria-hidden>
      <span>my weapons of choice</span>
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
    <div className="tech-gravity" ref={boxRef} data-cursor="DRAG">
      <span className="tech-gravity-word" aria-hidden>ARSENAL</span>
      <div className="tech-gravity-actions">
        <button
          onClick={() => apiRef.current?.explode()}
          onMouseDown={(e) => e.stopPropagation()}
          data-hover
        >
          [ explode ]
        </button>
        <button
          className={zeroG ? 'is-on' : ''}
          onClick={() => {
            apiRef.current?.zeroG(!zeroG)
            setZeroG(!zeroG)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          data-hover
        >
          [ zero-g{zeroG ? ': on' : '' } ]
        </button>
        <button
          onClick={() => apiRef.current?.reset()}
          onMouseDown={(e) => e.stopPropagation()}
          data-hover
        >
          [ re-rain ]
        </button>
      </div>
      <span className="tech-gravity-hint">
        ({items.length}) pieces — drag · hold to attract · double-click to detonate
      </span>
      {items.map((item, i) => (
        <span
          className={`g-chip ${item.cls || ''}${item.ball ? ' g-ball' : ''}`}
          key={i}
          ref={(el) => (chipRefs.current[i] = el)}
          style={{
            transform: 'translate(-400px, -400px)',
            ...(item.ball ? { width: item.ball, height: item.ball } : {}),
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
    </>
  )
}
