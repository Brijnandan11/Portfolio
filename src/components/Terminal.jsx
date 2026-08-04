import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SlatReveal from './SlatReveal.jsx'
import { achieve } from './Achievements.jsx'
import GithubHeat from './GithubHeat.jsx'
import { useContent } from '../content.jsx'

const TERMINAL_DEFAULT = {
  bars: [
    { label: 'TypeScript / React', pct: 92 },
    { label: 'Node & APIs', pct: 90 },
    { label: 'Rust & Systems', pct: 78 },
    { label: 'DevOps / Cloud', pct: 84 },
  ],
}
const SITE_DEFAULT = { email: 'brij19069@gmail.com' }

const ART = `██████╗
██╔══██╗
██║  ██║
██████╔╝
██║  ██║
██║  ██║
██████╔╝`

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function Prompt() {
  return (
    <span className="t-prompt">
      <span className="t-arrow">➜</span> <span className="t-path">~</span>{' '}
    </span>
  )
}

function Bars({ bars }) {
  const rootRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.t-bar-fill').forEach((el, i) => {
        gsap.fromTo(
          el,
          { width: '0%' },
          { width: el.dataset.pct + '%', duration: 1.1, delay: i * 0.15, ease: 'power3.out' }
        )
      })
      gsap.utils.toArray('.t-bar-pct').forEach((el, i) => {
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: +el.dataset.pct,
            snap: { innerText: 1 },
            duration: 1.1,
            delay: i * 0.15,
            ease: 'power3.out',
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])
  return (
    <div className="t-bars" ref={rootRef}>
      {bars.map(([label, pct]) => (
        <div className="t-bar-row" key={label}>
          <span className="t-bar-label">{label}</span>
          <span className="t-bar-track">
            <span className="t-bar-fill" data-pct={pct} />
          </span>
          <span className="t-bar-pct" data-pct={pct}>0</span>
        </div>
      ))}
    </div>
  )
}

function Neofetch() {
  return (
    <div className="nf">
      <pre className="nf-art">{ART}</pre>
      <div className="nf-info">
      <p className="nf-user">brij@portfolio</p>
        <p className="nf-sep">————————————</p>
        <p><b>Role</b> full stack developer</p>
        <p><b>OS</b> Arch Linux (btw)</p>
        <p><b>Shell</b> zsh + tmux</p>
        <p><b>Editor</b> neovim</p>
        <p><b>Stack</b> ts · react · node · typescript</p>
        <p><b>Uptime</b> 2+ years shipping</p>
        <p><b>Status</b> <span className="ok">● open for work</span></p>
      </div>
    </div>
  )
}

function MatrixRain({ active }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    const cols = Math.floor(canvas.width / 14)
    const drops = Array(cols).fill(1)
    const glyphs = 'アイウエオカキクケコサシスセソ0123456789<>/{}=✦'
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(12, 12, 12, 0.16)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '13px monospace'
      drops.forEach((y, i) => {
        const char = glyphs[(Math.random() * glyphs.length) | 0]
        ctx.fillStyle = Math.random() > 0.85 ? '#ff4d00' : '#6dd400'
        ctx.fillText(char, i * 14, y * 15)
        drops[i] = y * 15 > canvas.height && Math.random() > 0.975 ? 0 : y + 1
      })
    }, 45)
    return () => clearInterval(id)
  }, [active])
  return <canvas className={`t-matrix${active ? ' is-on' : ''}`} ref={canvasRef} />
}

export default function Terminal() {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const historyRef = useRef({ list: [], idx: -1 })
  const [started, setStarted] = useState(false)
  const [booted, setBooted] = useState(false)
  const [entries, setEntries] = useState([])
  const [value, setValue] = useState('')
  const [matrix, setMatrix] = useState(false)
  const [game, setGame] = useState(null)
  const gameRef = useRef(null)
  const terminalContent = useContent('terminal', TERMINAL_DEFAULT)
  const site = useContent('site', SITE_DEFAULT)
  const SKILLS = (terminalContent.bars || TERMINAL_DEFAULT.bars).map((b) => [
    b.label,
    b.pct,
  ])

  const push = (...items) => setEntries((e) => [...e, ...items])

  const GW = 26
  const GH = 12

  const renderGame = (st) => {
    const grid = Array.from({ length: GH }, () => Array(GW).fill('·'))
    grid[st.food[1]][st.food[0]] = '✦'
    st.snake.forEach(([x, y], i) => {
      grid[y][x] = i === 0 ? '█' : '▪'
    })
    return ` score ${st.score}\n` + grid.map((r) => ' ' + r.join(' ')).join('\n')
  }

  const endSnake = (msg) => {
    const st = gameRef.current
    if (!st) return
    clearInterval(st.interval)
    gameRef.current = null
    setGame(null)
    push({ kind: 'out', text: msg, cls: 'accent' })
  }

  const startSnake = () => {
    if (gameRef.current) return
    achieve('snake')
    push({ kind: 'out', text: 'snake — arrows / wasd to steer · q to quit', cls: 'ok' })
    const st = {
      snake: [[8, 6], [7, 6], [6, 6]],
      dir: [1, 0],
      nextDir: [1, 0],
      food: [18, 6],
      score: 0,
    }
    st.interval = setInterval(() => {
      st.dir = st.nextDir
      const head = [
        (st.snake[0][0] + st.dir[0] + GW) % GW,
        (st.snake[0][1] + st.dir[1] + GH) % GH,
      ]
      if (st.snake.some(([x, y]) => x === head[0] && y === head[1])) {
        endSnake(`game over — score ${st.score} · type snake to retry`)
        return
      }
      st.snake.unshift(head)
      if (head[0] === st.food[0] && head[1] === st.food[1]) {
        st.score++
        do {
          st.food = [(Math.random() * GW) | 0, (Math.random() * GH) | 0]
        } while (st.snake.some(([x, y]) => x === st.food[0] && y === st.food[1]))
      } else {
        st.snake.pop()
      }
      setGame(renderGame(st))
    }, 130)
    gameRef.current = st
    setGame(renderGame(st))
  }

  useEffect(() => {
    return () => {
      if (gameRef.current) clearInterval(gameRef.current.interval)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.terminal-window',
        { opacity: 0, y: 90, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        }
      )
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 55%',
        once: true,
        onEnter: () => setStarted(true),
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!started) return
    let cancelled = false
    const boot = async () => {
      const lines = [
        ['brij-os v2.6.0 — initializing...', 'dim'],
        ['✓ gsap engine mounted', 'ok'],
        ['✓ lenis smooth-scroll calibrated', 'ok'],
        ['✓ espresso levels: optimal', 'ok'],
      ]
      for (const [text, cls] of lines) {
        await delay(280)
        if (cancelled) return
        push({ kind: 'out', text, cls })
      }
      await delay(400)
      if (cancelled) return
      push({ kind: 'neofetch' })
      await delay(500)
      if (cancelled) return
      push({ kind: 'out', text: 'this shell is real — type `help` or tap a command below.', cls: 'accent' })
      setBooted(true)
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [started])

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [entries, value, matrix])

  const run = (raw) => {
    const cmd = raw.trim()
    push({ kind: 'cmd', text: raw })
    if (!cmd) return
    achieve('hacker')
    historyRef.current.list.push(raw)
    historyRef.current.idx = -1
    const low = cmd.toLowerCase()

    if (low === 'clear') {
      setEntries([])
      return
    }
    if (low === 'help') {
      push(
        { kind: 'out', text: 'available commands:', cls: 'hl' },
        { kind: 'out', text: '  whoami · skills · projects · contact · neofetch' },
        { kind: 'out', text: '  ls · uptime · matrix · clear · sudo hire brij' },
        { kind: 'out', text: 'pro tip: some commands are not on this list.', cls: 'dim' }
      )
      return
    }
    if (low === 'whoami') {
      push({ kind: 'out', text: 'brij — full stack developer with a taste for motion', cls: 'hl' })
      return
    }
    if (low === 'skills') {
      push({ kind: 'bars', bars: SKILLS })
      return
    }
    if (low === 'projects' || low === 'ls projects') {
      push(
        { kind: 'out', text: 'drwxr-xr-x  sentinel-auth/    javascript · node · jwt' },
        { kind: 'out', text: 'drwxr-xr-x  forge/            go · postgres · npm' },
        { kind: 'out', text: 'drwxr-xr-x  seatlock-engine/  typescript · redis · docker' },
        { kind: 'out', text: 'scroll up to §02 for the full tour ↑', cls: 'dim' }
      )
      return
    }
    if (low === 'contact') {
      push(
        { kind: 'out', text: `email    ${site.email}`, cls: 'hl' },
        { kind: 'out', text: 'status   ● open for work', cls: 'ok' },
        { kind: 'out', text: 'response usually < 24h' }
      )
      return
    }
    if (low === 'neofetch') {
      push({ kind: 'neofetch' })
      return
    }
    if (low === 'ls') {
      push({ kind: 'out', text: 'home/  work/  about/  services/  terminal/  contact/' })
      return
    }
    if (low === 'uptime') {
      push({ kind: 'out', text: 'up 2+ years, 20+ projects shipped, 0 burnouts (rounded down)', cls: 'hl' })
      return
    }
    if (low === 'snake') {
      startSnake()
      return
    }
    if (low === 'matrix') {
      push({ kind: 'out', text: 'wake up, neo...', cls: 'ok' })
      setMatrix(true)
      setTimeout(() => setMatrix(false), 7000)
      return
    }
    if (low === 'sudo hire brij' || low === 'hire' || low === 'hire brij') {
      push(
        { kind: 'out', text: '[sudo] password for recruiter: ********', cls: 'dim' },
        { kind: 'out', text: 'ACCESS GRANTED — opening channel...', cls: 'ok' }
      )
      setTimeout(() => {
        window.location.href = `mailto:${site.email}?subject=Let%27s%20work%20together`
      }, 900)
      return
    }
    if (low.startsWith('rm')) {
      push(
        { kind: 'out', text: 'deleting portfolio...', cls: 'dim' },
        { kind: 'out', text: 'just kidding. this portfolio is immutable. ✦', cls: 'accent' }
      )
      return
    }
    if (low === 'exit' || low === 'quit' || low === ':q' || low === ':q!') {
      push({ kind: 'out', text: 'you can check out any time you like, but you can never leave ✦', cls: 'accent' })
      return
    }
    if (low === 'vim' || low === 'nvim') {
      push({ kind: 'out', text: 'entering vim... good luck exiting. (hint: you already know :q!)', cls: 'dim' })
      return
    }
    if (low === 'cd' || low.startsWith('cd ')) {
      push({ kind: 'out', text: "there's no place like ~", cls: 'dim' })
      return
    }
    if (low === 'pwd') {
      push({ kind: 'out', text: '/home/brij/portfolio/you-are-here' })
      return
    }
    push({ kind: 'out', text: `command not found: ${cmd} — try \`help\``, cls: 'dim' })
  }

  const onKeyDown = (e) => {
    if (gameRef.current) {
      const st = gameRef.current
      const dirs = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
      }
      e.preventDefault()
      if (e.key === 'q') {
        endSnake(`quit — score ${st.score}`)
      } else {
        const d = dirs[e.key]
        if (d && !(d[0] === -st.dir[0] && d[1] === -st.dir[1])) st.nextDir = d
      }
      return
    }
    const h = historyRef.current
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!h.list.length) return
      h.idx = h.idx === -1 ? h.list.length - 1 : Math.max(0, h.idx - 1)
      setValue(h.list[h.idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (h.idx === -1) return
      h.idx = h.idx + 1 >= h.list.length ? -1 : h.idx + 1
      setValue(h.idx === -1 ? '' : h.list[h.idx])
    }
  }

  const focusInput = () => inputRef.current?.focus({ preventScroll: true })

  return (
    <section className="section terminal-section" id="terminal" ref={rootRef}>
      <SlatReveal from="edges" />
      <span className="section-ghost" aria-hidden>04</span>
      <div className="terminal-scribble-wrap">
        <div className="scribble scribble--lg scribble--auto" aria-hidden>
          <span>a real shell, try it</span>
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
      </div>
      <div className="terminal-glow" aria-hidden />
      <div className="terminal-window" onClick={focusInput}>
        <div className="terminal-bar">
          <i className="b-dot b-dot--accent" />
          <i className="b-dot" />
          <i className="b-dot" />
          <span className="terminal-title">brij@portfolio — zsh</span>
        </div>
        <MatrixRain active={matrix} />
        <div className="terminal-body" ref={bodyRef} data-lenis-prevent>
          {entries.map((entry, i) => {
            if (entry.kind === 'cmd')
              return (
                <div className="t-line" key={i}>
                  <Prompt />
                  <span className="t-cmd">{entry.text}</span>
                </div>
              )
            if (entry.kind === 'out')
              return (
                <motion.div
                  className={`t-line t-out ${entry.cls || ''}`}
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {entry.text}
                </motion.div>
              )
            if (entry.kind === 'bars') return <Bars bars={entry.bars} key={i} />
            if (entry.kind === 'neofetch') return <Neofetch key={i} />
            return null
          })}
          {game && <pre className="t-snake">{game}</pre>}
          {booted && (
            <div className="t-line t-input-line">
              <Prompt />
              <span className="t-cmd">{value}</span>
              <span className="t-cursor" />
              <input
                ref={inputRef}
                className="t-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal input"
              />
            </div>
          )}
          {!started && (
            <div className="t-line">
              <Prompt />
              <span className="t-cursor" />
            </div>
          )}
        </div>
        <div className="t-chips" onClick={(e) => e.stopPropagation()}>
          {['help', 'skills', 'projects', 'neofetch', 'matrix', 'snake', 'sudo hire brij'].map((c) => (
            <button
              key={c}
              onClick={() => {
                run(c)
                focusInput()
              }}
              data-hover
              disabled={!booted}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <GithubHeat />
    </section>
  )
}
